import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { bearingDeg, compass, distanceM, humanDistance, polygonContains } from '../../core/geo';
import { Bundle, BundlePoint, OfflineStore, QueuedPhoto, deviceId } from '../../core/offline';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { FieldData } from './field-data';
import { FIELD_CSS } from './field.styles';
import { Fix, FieldGps } from './gps.service';
import { barcodeSupported, readCode, stampPhoto } from './photo';

type Step = 'navigate' | 'core' | 'photos' | 'labels' | 'review';
const STEPS: { key: Step; label: string }[] = [
  { key: 'navigate', label: 'Navigate' }, { key: 'core', label: 'Core' }, { key: 'photos', label: 'Photos' },
  { key: 'labels', label: 'Labels' }, { key: 'review', label: 'Review' },
];
const PHOTO_KINDS: { kind: QueuedPhoto['kind']; label: string; hint: string }[] = [
  { kind: 'hole', label: 'The hole', hint: 'Looking straight down into the hole, with the depth visible.' },
  { kind: 'core', label: 'The core', hint: 'The whole core laid out next to a tape measure.' },
  { kind: 'surroundings', label: 'Surroundings', hint: 'Step back and show the spot in its field.' },
];

interface Layer { from: number; to: number; label: string }
interface Check { key: string; label: string; detail: string; tone: 'ok' | 'warn' | 'bad'; blocking: boolean }

function defaultLayers(from: number, to: number): Layer[] {
  const span = to - from;
  if (span > 0 && span % 10 === 0 && span / 10 <= 6) {
    return Array.from({ length: span / 10 }, (_, i) => ({ from: from + i * 10, to: from + (i + 1) * 10, label: '' }));
  }
  return [{ from, to, label: '' }];
}

/** Problems with the layers, in the same words the server uses (sampling/domain.py layer_problems). */
function layerProblems(layers: Layer[], start: number, reached: number | null): string[] {
  const out: string[] = [];
  if (!layers.length) return ['At least one soil layer is needed.'];
  const o = [...layers].sort((a, b) => a.from - b.from);
  for (const l of o) if (!(l.to > l.from)) out.push(`The layer ${l.from}–${l.to} cm must end deeper than it starts.`);
  if (Math.abs(o[0].from - start) > 1e-6) out.push(`The first layer must start at ${start} cm (it starts at ${o[0].from} cm).`);
  for (let i = 1; i < o.length; i++) {
    if (o[i].from > o[i - 1].to + 1e-6) out.push(`There is a gap between ${o[i - 1].to} cm and ${o[i].from} cm.`);
    else if (o[i].from < o[i - 1].to - 1e-6) out.push(`The layers ${o[i - 1].from}–${o[i - 1].to} cm and ${o[i].from} cm onwards overlap.`);
  }
  if (reached !== null && Math.max(...o.map(l => l.to)) > reached + 1e-6) out.push('A layer goes deeper than the core reached.');
  return out;
}

@Component({
  selector: 'vc-field-capture',
  imports: [FormsModule, RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="fpage"><div class="fcard fempty"><h3>Opening point…</h3></div></div>
    } @else if (!point() || !bundle()) {
      <div class="fpage"><div class="fcard fempty">
        <div class="ic"><vc-icon name="alert" [size]="26" /></div><h3>This point isn't on this phone</h3>
        <p>Download the campaign again from Home.</p><a class="fbtn secondary" routerLink="/field">Back to Home</a>
      </div></div>
    } @else {
      @let p = point()!;
      @let b = bundle()!;
      <div class="head">
        <a [routerLink]="['/field/campaign', cid()]" class="back" aria-label="Back to the list"><vc-icon name="x" [size]="22" /></a>
        <div class="ht"><strong class="mono">{{ p.site_code }}</strong><span>Field {{ p.field_code }} · {{ b.campaign.code }}</span></div>
      </div>
      <ol class="steps">
        @for (s of steps; track s.key; let i = $index) {
          <li [class.on]="s.key === step()" [class.done]="i < stepIndex()">
            <button (click)="go(s.key)" [disabled]="i > maxReached()"><span class="n">{{ i < stepIndex() ? '✓' : i + 1 }}</span><span class="l">{{ s.label }}</span></button>
          </li>
        }
      </ol>

      <div class="fpage">
        @switch (step()) {
          <!-- ---------------------------------------------------- navigate -->
          @case ('navigate') {
            <section class="fcard nav">
              @if (fix(); as f) {
                <div class="big-arrow" [style.transform]="'rotate(' + arrow() + 'deg)'" [class.here]="closeEnough()">
                  <svg viewBox="0 0 24 24" width="120" height="120"><path d="M12 1.5 20.5 21 12 16.2 3.5 21Z" fill="currentColor" /></svg>
                </div>
                <div class="dist num">{{ human(distance()!) }}</div>
                <div class="dir">{{ closeEnough() ? 'You are at the site' : 'towards ' + dirText() }}</div>
                @if (gps.heading() === null) { <div class="fhint">Arrow points relative to north. Hold the phone with the top facing north.</div> }
                <div class="navfacts">
                  <div [class]="'nf ' + accTone()"><span>GPS accuracy</span><strong class="num">±{{ round(f.accuracy) }} m</strong><em>limit {{ accMax() ?? '—' }} m</em></div>
                  <div [class]="'nf ' + (closeEnough() ? 'ok' : 'warn')"><span>Allowed distance</span><strong class="num">{{ distMax() ?? '—' }} m</strong><em>from the planned site</em></div>
                </div>
              } @else {
                <div class="nogps">
                  <vc-icon name="locate" [size]="44" />
                  <h3>{{ gps.supported ? 'Finding your position…' : 'This phone has no GPS' }}</h3>
                  <p>{{ gps.error() || 'Stand in the open. This can take up to a minute the first time.' }}</p>
                </div>
              }
              <div class="coords mono">Site {{ p.latitude.toFixed(6) }}, {{ p.longitude.toFixed(6) }}</div>
            </section>
            <button class="fbtn primary block" [disabled]="!fix()" (click)="arrived()"><vc-icon name="pin" [size]="20" />I'm at the site — start</button>
            @if (fix() && !closeEnough()) { <p class="fhint center">You can start further away, but the sample will be flagged for the office to review.</p> }
            <button class="fbtn ghost block" (click)="skipOpen.set(true)" [disabled]="!store.online()"><vc-icon name="ban" [size]="20" />Can't sample here</button>
            @if (!store.online()) { <p class="fhint center">Skipping a point needs a connection so your supervisor sees it straight away.</p> }
            @if (skipOpen()) {
              <section class="fcard fcard-pad stackf">
                <label class="flabel" for="skip">Why can't this point be sampled?</label>
                <textarea id="skip" class="finput" [(ngModel)]="skipReason" placeholder="Standing crop — farmer asked us not to enter until harvest."></textarea>
                <div class="rowf">
                  <button class="fbtn ghost sm" (click)="skipOpen.set(false)">Cancel</button>
                  <button class="fbtn danger sm" [disabled]="skipReason.trim().length < 5 || busy()" (click)="skip()">Skip point</button>
                </div>
              </section>
            }
          }

          <!-- ---------------------------------------------------- core -->
          @case ('core') {
            <section class="fcard fcard-pad stackf">
              <div>
                <label class="flabel" for="depth">Depth the core reached (cm)</label>
                <input id="depth" class="finput num big" type="number" inputmode="decimal" min="1" max="300" [ngModel]="reached()" (ngModelChange)="reached.set($event === '' || $event === null ? null : +$event)" />
                <div class="fhint">The campaign needs {{ b.campaign.depth_from_cm }}–{{ b.campaign.depth_to_cm }} cm.</div>
              </div>
              @if (shallow()) {
                <div>
                  <label class="flabel" for="dev">Why didn't the core reach {{ b.campaign.depth_to_cm }} cm?</label>
                  <textarea id="dev" class="finput" [ngModel]="deviation()" (ngModelChange)="deviation.set($event)" placeholder="Hit laterite rock at 22 cm; tried twice within 1 m."></textarea>
                  @if (!deviation().trim()) { <div class="ferr">A reason is required for a shallow core.</div> }
                </div>
              }
            </section>

            <div class="fsec">Layers (one bag each)</div>
            <section class="fcard layers">
              @for (l of layers(); track $index; let i = $index) {
                <div class="lrow">
                  <span class="li">{{ i + 1 }}</span>
                  <input class="finput num" type="number" inputmode="decimal" [ngModel]="l.from" (ngModelChange)="setLayer(i, 'from', $event)" [attr.aria-label]="'Layer ' + (i + 1) + ' from'" />
                  <span class="to">to</span>
                  <input class="finput num" type="number" inputmode="decimal" [ngModel]="l.to" (ngModelChange)="setLayer(i, 'to', $event)" [attr.aria-label]="'Layer ' + (i + 1) + ' to'" />
                  <span class="cm">cm</span>
                  <button class="rm" (click)="removeLayer(i)" [disabled]="layers().length === 1" aria-label="Remove layer"><vc-icon name="trash" [size]="20" /></button>
                </div>
              }
              <div class="lact">
                <button class="fbtn ghost sm" (click)="addLayer()"><vc-icon name="plus" [size]="18" />Add layer</button>
                @if (shallow() && reached()) { <button class="fbtn ghost sm" (click)="fitLayers()"><vc-icon name="ruler" [size]="18" />Fit to {{ reached() }} cm</button> }
                <button class="fbtn ghost sm" (click)="resetLayers()"><vc-icon name="rotate-ccw" [size]="18" />Reset</button>
              </div>
            </section>
            @for (e of layerErrors(); track e) { <div class="bad-line"><vc-icon name="alert" [size]="18" />{{ e }}</div> }
            <button class="fbtn primary block" [disabled]="!coreOk()" (click)="next()">Next: photos<vc-icon name="arrow-right" [size]="20" /></button>
          }

          <!-- ---------------------------------------------------- photos -->
          @case ('photos') {
            <p class="fsub">Take {{ requiredPhotos() }} photos. Each is stamped with the time and your position.</p>
            @for (k of kinds; track k.kind) {
              @let ph = photoOf(k.kind);
              <section class="fcard photo" [class.have]="!!ph">
                <label class="shot">
                  <input type="file" accept="image/*" capture="environment" (change)="takePhoto(k.kind, $event)" hidden />
                  @if (ph) {
                    <img [src]="thumbs()[k.kind]" [alt]="k.label" />
                  } @else {
                    <span class="cam"><vc-icon name="camera" [size]="34" /></span>
                  }
                  <span class="pt">
                    <strong>{{ k.label }} @if (ph) { <vc-icon name="check-circle" [size]="18" [stroke]="2.4" /> }</strong>
                    <em>{{ ph ? 'Tap to retake' : k.hint }}</em>
                  </span>
                </label>
              </section>
            }
            @if (processing()) { <p class="fhint center">Preparing photo…</p> }
            <button class="fbtn primary block" [disabled]="photoCount() < requiredPhotos()" (click)="next()">Next: labels<vc-icon name="arrow-right" [size]="20" /></button>
            @if (photoCount() < requiredPhotos()) { <p class="fhint center">{{ requiredPhotos() - photoCount() }} more photo(s) needed.</p> }
          }

          <!-- ---------------------------------------------------- labels -->
          @case ('labels') {
            <p class="fsub">Put each layer in its own bag and record the label on the bag.
              @if (canScan) { Tap <b>Scan</b> to read the QR code with the camera. } @else { Type the code printed under the QR. }</p>
            @for (l of layers(); track $index; let i = $index) {
              <section class="fcard fcard-pad lab">
                <div class="lt"><strong>Layer {{ i + 1 }}</strong><span class="num">{{ l.from }}–{{ l.to }} cm</span></div>
                <div class="lin">
                  <input class="finput mono" [class.bad]="!!labelError(i)" [ngModel]="l.label" (ngModelChange)="setLabel(i, $event)" placeholder="Bag label" autocapitalize="characters" autocomplete="off" [attr.aria-label]="'Label for layer ' + (i + 1)" />
                  @if (canScan) {
                    <label class="fbtn secondary sm scan">
                      <input type="file" accept="image/*" capture="environment" (change)="scan(i, $event)" hidden />
                      <vc-icon name="scan-qr" [size]="20" />Scan
                    </label>
                  }
                </div>
                @if (labelError(i)) { <div class="ferr">{{ labelError(i) }}</div> } @else if (!l.label) { <div class="fhint">Scan or type the label on this bag.</div> }
              </section>
            }
            <button class="fbtn primary block" [disabled]="!labelsOk()" (click)="next()">Next: review<vc-icon name="arrow-right" [size]="20" /></button>
          }

          <!-- ---------------------------------------------------- review -->
          @case ('review') {
            <section class="fcard checks">
              @for (c of checks(); track c.key) {
                <div class="ck" [class]="'ck ' + c.tone">
                  <span class="ci"><vc-icon [name]="c.tone === 'ok' ? 'check-circle' : c.tone === 'warn' ? 'alert' : 'x-circle'" [size]="22" [stroke]="2.2" /></span>
                  <span class="ct"><strong>{{ c.label }}</strong><em>{{ c.detail }}</em></span>
                </div>
              }
            </section>
            @if (hasWarnings() && !blocked()) {
              <div class="warnbox"><vc-icon name="alert" [size]="18" />You can still save. The office will see these warnings as quality findings on this sample.</div>
            }
            <section class="fcard fcard-pad sum">
              <div><span>Position</span><strong class="mono">{{ locked()?.lat?.toFixed(6) }}, {{ locked()?.lon?.toFixed(6) }}</strong></div>
              <div><span>Recorded at</span><strong>{{ lockedAt() }}</strong></div>
              <button class="fbtn ghost sm" [disabled]="!fix()" (click)="relock()"><vc-icon name="locate" [size]="18" />Use current position</button>
            </section>
            <button class="fbtn primary block" [disabled]="blocked() || busy()" (click)="save()"><vc-icon name="check" [size]="20" />{{ busy() ? 'Saving…' : 'Save sample' }}</button>
            <p class="fhint center">Saved on this phone first. It uploads automatically when there is signal.</p>
          }
        }
      </div>
    }
  `,
  styles: [FIELD_CSS, `
    .head{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border-bottom:1.5px solid var(--sand-300)}
    .back{display:grid;place-items:center;width:48px;height:48px;border-radius:12px;color:var(--stone-900)}
    .ht{display:flex;flex-direction:column;line-height:1.25}
    .ht strong{font-size:17px} .ht span{font-size:13.5px;color:var(--stone-600)}
    .steps{list-style:none;margin:0;padding:8px 8px;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;background:#fff;border-bottom:1.5px solid var(--sand-300);position:sticky;top:60px;z-index:5}
    .steps button{width:100%;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 0;border:0;background:none;cursor:pointer;font:inherit;color:var(--stone-500);border-radius:10px}
    .steps button[disabled]{cursor:default}
    .steps .n{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:2px solid var(--stone-300);font-size:13px;font-weight:700;background:#fff}
    .steps .l{font-size:12px;font-weight:600}
    .steps li.done .n{background:var(--forest-600);border-color:var(--forest-600);color:#fff}
    .steps li.done button{color:var(--forest-700)}
    .steps li.on .n{border-color:var(--forest-800);color:var(--forest-800);box-shadow:0 0 0 3px var(--forest-100)}
    .steps li.on button{color:var(--forest-800);background:var(--forest-50)}
    .center{text-align:center}
    .nav{display:flex;flex-direction:column;align-items:center;padding:22px 16px 16px;gap:4px}
    .big-arrow{color:var(--forest-700);transition:transform .35s ease;margin-bottom:6px}
    .big-arrow.here{color:var(--forest-500)}
    .dist{font-size:46px;font-weight:700;letter-spacing:-.02em;line-height:1;color:var(--stone-900)}
    .dir{font-size:17px;font-weight:600;color:var(--stone-700)}
    .navfacts{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;margin-top:14px}
    .nf{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:12px;border:1.5px solid var(--sand-300)}
    .nf span{font-size:12.5px;font-weight:600;color:var(--stone-600)} .nf strong{font-size:20px} .nf em{font-style:normal;font-size:12.5px;color:var(--stone-600)}
    .nf.ok{border-color:var(--forest-300);background:var(--forest-50)} .nf.warn{border-color:#e9c77e;background:var(--amber-100)} .nf.bad{border-color:#f0aaa4;background:var(--red-100)}
    .nogps{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:12px 0;color:var(--stone-700)}
    .coords{margin-top:12px;font-size:12.5px;color:var(--stone-600)}
    .stackf{display:flex;flex-direction:column;gap:14px}
    .rowf{display:flex;gap:10px;justify-content:flex-end}
    .big{font-size:26px;min-height:60px;font-weight:600}
    .layers{padding:8px 12px}
    .lrow{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--sand-200)}
    .lrow .finput{min-width:0;flex:1;text-align:center;padding:0 6px}
    .li{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--sand-200);font-weight:700;font-size:14px;flex:none}
    .to,.cm{font-size:14px;color:var(--stone-600);font-weight:500}
    .rm{display:grid;place-items:center;width:48px;height:48px;border:0;border-radius:12px;background:none;color:var(--red-600);cursor:pointer;flex:none}
    .rm[disabled]{color:var(--stone-300)}
    .lact{display:flex;gap:8px;flex-wrap:wrap;padding:10px 0 4px}
    .bad-line{display:flex;gap:8px;align-items:flex-start;color:var(--red-600);font-weight:500;font-size:14.5px}
    .photo{overflow:hidden}
    .photo.have{border-color:var(--forest-400)}
    .shot{display:flex;align-items:center;gap:14px;padding:12px;cursor:pointer;min-height:96px}
    .shot img{width:96px;height:72px;object-fit:cover;border-radius:10px;flex:none;background:var(--sand-200)}
    .cam{display:grid;place-items:center;width:96px;height:72px;border-radius:10px;background:var(--forest-800);color:#fff;flex:none}
    .pt{display:flex;flex-direction:column;gap:4px}
    .pt strong{display:flex;align-items:center;gap:6px;font-size:17px;color:var(--stone-900)}
    .pt strong vc-icon{color:var(--forest-600)}
    .pt em{font-style:normal;font-size:14px;color:var(--stone-600)}
    .lab{display:flex;flex-direction:column;gap:10px}
    .lt{display:flex;justify-content:space-between;font-size:16px}
    .lt span{color:var(--stone-600);font-weight:600}
    .lin{display:flex;gap:8px}
    .lin .finput{flex:1;min-width:0;text-transform:uppercase}
    .scan{cursor:pointer;flex:none}
    .checks{overflow:hidden}
    .ck{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-bottom:1px solid var(--sand-200)}
    .ck:last-child{border-bottom:0}
    .ci{flex:none;margin-top:1px}
    .ck.ok .ci{color:var(--forest-600)} .ck.warn .ci{color:#b07500} .ck.bad .ci{color:var(--red-600)}
    .ck.bad{background:var(--red-100)}
    .ct{display:flex;flex-direction:column;gap:2px}
    .ct strong{font-size:16px} .ct em{font-style:normal;font-size:14px;color:var(--stone-700)}
    .warnbox{display:flex;gap:8px;align-items:flex-start;padding:12px 14px;border-radius:12px;background:var(--amber-100);color:#5c3a00;font-size:14.5px}
    .sum{display:flex;flex-direction:column;gap:10px}
    .sum div{display:flex;justify-content:space-between;gap:10px;font-size:14.5px}
    .sum span{color:var(--stone-600)}
  `],
})
export class FieldCapture implements OnDestroy {
  private router = inject(Router);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private data = inject(FieldData);
  store = inject(OfflineStore);
  gps = inject(FieldGps);

  cid = input.required<string>();
  pid = input.required<string>();
  steps = STEPS;
  kinds = PHOTO_KINDS;
  canScan = barcodeSupported();

  loading = signal(true);
  bundle = signal<Bundle | null>(null);
  point = signal<BundlePoint | null>(null);
  step = signal<Step>('navigate');
  maxReached = signal(0);
  busy = signal(false);
  processing = signal(false);
  skipOpen = signal(false);
  skipReason = '';

  locked = signal<Fix | null>(null);
  reached = signal<number | null>(null);
  deviation = signal('');
  layers = signal<Layer[]>([]);
  photos = signal<QueuedPhoto[]>([]);
  thumbs = signal<Record<string, string>>({});
  usedLabels = signal<Set<string>>(new Set());

  fix = computed(() => this.gps.fix());
  stepIndex = computed(() => STEPS.findIndex(s => s.key === this.step()));
  accMax = computed(() => this.bundle()?.thresholds.gps_accuracy_max_m ?? null);
  distMax = computed(() => this.bundle()?.thresholds.max_distance_from_site_m ?? null);
  requiredPhotos = computed(() => this.bundle()?.thresholds.required_photos ?? 3);
  distance = computed(() => {
    const f = this.fix(), p = this.point();
    return f && p ? distanceM(f.lat, f.lon, p.latitude, p.longitude) : null;
  });
  bearing = computed(() => {
    const f = this.fix(), p = this.point();
    return f && p ? bearingDeg(f.lat, f.lon, p.latitude, p.longitude) : 0;
  });
  arrow = computed(() => this.bearing() - (this.gps.heading() ?? 0));
  dirText = computed(() => `${compass(this.bearing())} (${Math.round(this.bearing())}°)`);
  closeEnough = computed(() => {
    const d = this.distance();
    return d !== null && d <= (this.distMax() ?? 10);
  });
  accTone = computed(() => {
    const f = this.fix();
    if (!f) return 'bad';
    return f.accuracy <= (this.accMax() ?? 10) ? 'ok' : 'warn';
  });
  shallow = computed(() => {
    const r = this.reached(), b = this.bundle();
    return r !== null && !!b && r < b.campaign.depth_to_cm - 1e-6;
  });
  layerErrors = computed(() => {
    const b = this.bundle();
    return b ? layerProblems(this.layers(), b.campaign.depth_from_cm, this.reached()) : [];
  });
  coreOk = computed(() => this.reached() !== null && this.reached()! > 0 && !this.layerErrors().length && (!this.shallow() || !!this.deviation().trim()));
  photoCount = computed(() => this.photos().filter(p => p.kind !== 'extra').length);
  labelsOk = computed(() => this.layers().every((l, i) => !!l.label && !this.labelError(i)));
  lockedAt = computed(() => {
    const l = this.locked();
    return l ? new Date(l.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
  });

  checks = computed<Check[]>(() => {
    const b = this.bundle(), p = this.point(), l = this.locked();
    if (!b || !p) return [];
    const out: Check[] = [];
    const field = b.fields.features.find(f => String(f.properties?.['id']) === p.field_id);
    if (!l) {
      out.push({ key: 'pos', label: 'Position recorded', detail: 'No GPS position yet.', tone: 'bad', blocking: true });
    } else {
      const inside = field ? polygonContains(field.geometry, l.lat, l.lon) : null;
      out.push(inside === null
        ? { key: 'field', label: 'Inside the field', detail: 'The field boundary is not on this phone, so this could not be checked.', tone: 'warn', blocking: false }
        : inside ? { key: 'field', label: 'Inside the field', detail: `Your position is inside field ${p.field_code}.`, tone: 'ok', blocking: false }
          : { key: 'field', label: 'Outside the field', detail: `Your position is outside field ${p.field_code}. The sample will be blocked from calculations until reviewed.`, tone: 'bad', blocking: false });
      const am = this.accMax();
      out.push(am === null
        ? { key: 'acc', label: 'GPS accuracy', detail: `±${Math.round(l.accuracy)} m. No limit set by the methodology.`, tone: 'ok', blocking: false }
        : l.accuracy <= am ? { key: 'acc', label: 'GPS accuracy', detail: `±${Math.round(l.accuracy)} m, within the ${am} m limit.`, tone: 'ok', blocking: false }
          : { key: 'acc', label: 'GPS accuracy is low', detail: `±${Math.round(l.accuracy)} m; the limit is ${am} m. Wait for a better fix if you can.`, tone: 'warn', blocking: false });
      const d = distanceM(l.lat, l.lon, p.latitude, p.longitude);
      const dm = this.distMax();
      out.push(dm === null
        ? { key: 'dist', label: 'Distance from site', detail: `${humanDistance(d)}. No limit set by the methodology.`, tone: 'ok', blocking: false }
        : d <= dm ? { key: 'dist', label: 'Distance from site', detail: `${humanDistance(d)}, within ${dm} m.`, tone: 'ok', blocking: false }
          : { key: 'dist', label: 'Too far from the site', detail: `${humanDistance(d)} away; the limit is ${dm} m.`, tone: 'warn', blocking: false });
    }
    const need = this.requiredPhotos();
    out.push(this.photoCount() >= need
      ? { key: 'photos', label: 'Photos', detail: `${this.photoCount()} of ${need} taken.`, tone: 'ok', blocking: false }
      : { key: 'photos', label: 'Photos missing', detail: `${this.photoCount()} of ${need} taken.`, tone: 'bad', blocking: false });
    const r = this.reached() ?? 0;
    out.push(!this.shallow()
      ? { key: 'depth', label: 'Depth reached', detail: `${r} cm of ${b.campaign.depth_to_cm} cm.`, tone: 'ok', blocking: false }
      : this.deviation().trim()
        ? { key: 'depth', label: 'Shallow core', detail: `${r} of ${b.campaign.depth_to_cm} cm. Reason: ${this.deviation().trim()}`, tone: 'warn', blocking: false }
        : { key: 'depth', label: 'Shallow core without a reason', detail: 'Go back to Core and say why.', tone: 'bad', blocking: true });
    const le = this.layerErrors();
    out.push(le.length
      ? { key: 'layers', label: 'Layers don\'t fit together', detail: le[0], tone: 'bad', blocking: true }
      : { key: 'layers', label: 'Layers', detail: `${this.layers().length} contiguous layer(s), ${this.layers().map(x => `${x.from}–${x.to}`).join(', ')} cm.`, tone: 'ok', blocking: false });
    out.push(this.labelsOk()
      ? { key: 'labels', label: 'Bag labels', detail: 'Every bag has its own label.', tone: 'ok', blocking: false }
      : { key: 'labels', label: 'Bag labels incomplete', detail: 'Go back to Labels.', tone: 'bad', blocking: true });
    return out;
  });
  blocked = computed(() => this.checks().some(c => c.blocking));
  hasWarnings = computed(() => this.checks().some(c => c.tone !== 'ok'));

  constructor() {
    this.gps.start();
    effect(() => {
      const cid = this.cid(), pid = this.pid();
      void this.load(cid, pid);
    });
  }

  private async load(cid: string, pid: string) {
    this.loading.set(true);
    const b = (await this.data.bundle(cid).catch(() => undefined)) ?? null;
    this.bundle.set(b);
    const p = b?.points.find(x => x.id === pid) ?? null;
    this.point.set(p);
    if (b) this.layers.set(defaultLayers(b.campaign.depth_from_cm, b.campaign.depth_to_cm));
    if (b) this.reached.set(b.campaign.depth_to_cm);
    const all = await this.store.allSamples();
    this.usedLabels.set(new Set(all.filter(s => s.state !== 'rejected').flatMap(s => s.payload.layers.map(l => l.label_qr.toUpperCase()))));
    this.loading.set(false);
  }

  go(s: Step) {
    const i = STEPS.findIndex(x => x.key === s);
    if (i <= this.maxReached()) this.step.set(s);
  }

  next() {
    const i = this.stepIndex() + 1;
    if (i >= STEPS.length) return;
    this.maxReached.update(m => Math.max(m, i));
    this.step.set(STEPS[i].key);
    window.scrollTo({ top: 0 });
  }

  arrived() {
    this.locked.set(this.fix());
    this.next();
  }

  relock() {
    const f = this.fix();
    if (f) this.locked.set(f);
  }

  round(v: number) { return Math.round(v); }
  human(m: number) { return humanDistance(m); }

  /* ------------------------------------------------------------ layers */
  setLayer(i: number, k: 'from' | 'to', v: unknown) {
    const n = v === '' || v === null ? NaN : Number(v);
    this.layers.update(ls => ls.map((l, j) => (j === i ? { ...l, [k]: n } : l)));
  }

  addLayer() {
    const ls = this.layers();
    const last = ls[ls.length - 1];
    const from = last ? last.to : this.bundle()!.campaign.depth_from_cm;
    this.layers.set([...ls, { from, to: from + 10, label: '' }]);
  }

  removeLayer(i: number) {
    this.layers.update(ls => ls.filter((_, j) => j !== i));
  }

  resetLayers() {
    const b = this.bundle()!;
    this.layers.set(defaultLayers(b.campaign.depth_from_cm, b.campaign.depth_to_cm));
  }

  fitLayers() {
    const r = this.reached();
    if (r === null) return;
    const kept = this.layers().filter(l => l.from < r).map(l => ({ ...l, to: Math.min(l.to, r) }));
    this.layers.set(kept.length ? kept : [{ from: this.bundle()!.campaign.depth_from_cm, to: r, label: '' }]);
  }

  /* ------------------------------------------------------------ photos */
  photoOf(kind: string) {
    return this.photos().find(p => p.kind === kind) ?? null;
  }

  async takePhoto(kind: QueuedPhoto['kind'], ev: Event) {
    const inp = ev.target as HTMLInputElement;
    const file = inp.files?.[0];
    inp.value = '';
    if (!file) return;
    this.processing.set(true);
    const f = this.fix();
    const at = new Date();
    try {
      const label = PHOTO_KINDS.find(k => k.kind === kind)?.label ?? kind;
      const blob = await stampPhoto(file, { title: `${this.point()!.site_code} · ${label}`, at, lat: f?.lat ?? null, lon: f?.lon ?? null, acc: f?.accuracy });
      const ph: QueuedPhoto = {
        kind, blob, name: `${this.point()!.site_code}-${kind}.jpg`, type: 'image/jpeg', takenAt: at.toISOString(),
        lat: f?.lat ?? null, lon: f?.lon ?? null,
      };
      const old = this.thumbs()[kind];
      if (old) URL.revokeObjectURL(old);
      this.thumbs.update(t => ({ ...t, [kind]: URL.createObjectURL(blob) }));
      this.photos.update(ps => [...ps.filter(p => p.kind !== kind), ph]);
    } catch (e) {
      this.toast.error("Couldn't use that photo", (e as Error).message);
    } finally {
      this.processing.set(false);
    }
  }

  /* ------------------------------------------------------------ labels */
  setLabel(i: number, v: string) {
    this.layers.update(ls => ls.map((l, j) => (j === i ? { ...l, label: (v ?? '').trim().toUpperCase() } : l)));
  }

  labelError(i: number): string | null {
    const ls = this.layers();
    const v = ls[i]?.label ?? '';
    if (!v) return null;
    if (v.length < 3) return 'A label has at least 3 characters.';
    if (ls.some((l, j) => j !== i && l.label === v)) return 'Each bag needs its own label — this one is used twice.';
    if (this.usedLabels().has(v)) return 'This label was already used for another core on this phone.';
    return null;
  }

  async scan(i: number, ev: Event) {
    const inp = ev.target as HTMLInputElement;
    const file = inp.files?.[0];
    inp.value = '';
    if (!file) return;
    try {
      const code = await readCode(file);
      if (code) {
        this.setLabel(i, code);
        this.toast.success(`Label ${code.toUpperCase()} read`);
      } else this.toast.error('No code found', 'Hold the phone closer, keep the label flat, or type the code.');
    } catch {
      this.toast.error('Scanning is not available', 'Type the code printed under the QR instead.');
    }
  }

  /* ------------------------------------------------------------ skip & save */
  async skip() {
    this.busy.set(true);
    try {
      await firstValueFrom(this.api.post(`/points/${this.pid()}/skip`, { reason: this.skipReason.trim() }));
      const b = this.bundle()!;
      await this.store.saveBundle({ ...b, points: b.points.map(p => (p.id === this.pid() ? { ...p, status: 'skipped' } : p)) });
      await this.data.refreshBundles();
      this.toast.success(`${this.point()!.site_code} skipped`, 'Your supervisor can see the reason.');
      this.router.navigate(['/field/campaign', this.cid()]);
    } catch (e) {
      this.toast.apiError(e as ApiError, "Couldn't skip the point");
    } finally {
      this.busy.set(false);
    }
  }

  async save() {
    const b = this.bundle(), p = this.point(), l = this.locked();
    if (!b || !p || !l || this.blocked()) return;
    this.busy.set(true);
    const localId = `smp-${crypto.randomUUID()}`;
    try {
      await this.store.queueSample({
        localId, campaignId: b.campaignId, pointId: p.id, siteCode: p.site_code,
        payload: {
          collected_at: l.at, latitude: l.lat, longitude: l.lon, gps_accuracy_m: Math.round(l.accuracy * 10) / 10,
          depth_reached_cm: Number(this.reached()),
          layers: [...this.layers()].sort((a, c) => a.from - c.from).map(x => ({ depth_from_cm: x.from, depth_to_cm: x.to, label_qr: x.label })),
          deviation_reason: this.shallow() ? this.deviation().trim() : null,
          device_id: deviceId(),
        },
        photos: this.photos(),
      });
      this.toast.success(`${p.site_code} saved`, this.store.online() ? 'Uploading now.' : 'It will upload when you have signal.');
      this.router.navigate(['/field/campaign', this.cid()]);
    } catch (e) {
      this.toast.error("Couldn't save on this phone", (e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }

  ngOnDestroy(): void {
    this.gps.stop();
    Object.values(this.thumbs()).forEach(u => URL.revokeObjectURL(u));
  }
}
