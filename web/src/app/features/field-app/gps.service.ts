import { Injectable, NgZone, computed, inject, signal } from '@angular/core';

export interface Fix {
  lat: number;
  lon: number;
  accuracy: number;
  at: string;
}

/**
 * One shared GPS watch for the field app. Screens call `start()` / `stop()`;
 * the watch runs while at least one screen needs it.
 */
@Injectable({ providedIn: 'root' })
export class FieldGps {
  private zone = inject(NgZone);
  private watchId: number | null = null;
  private users = 0;

  readonly fix = signal<Fix | null>(null);
  readonly error = signal<string | null>(null);
  /** Compass heading of the phone (degrees from north) when the device reports it. */
  readonly heading = signal<number | null>(null);
  readonly supported = typeof navigator !== 'undefined' && 'geolocation' in navigator;
  readonly state = computed(() => (!this.supported ? 'unsupported' : this.error() && !this.fix() ? 'error' : this.fix() ? 'ok' : 'waiting'));

  private onOrient = (e: DeviceOrientationEvent) => {
    const ev = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
    const h = typeof ev.webkitCompassHeading === 'number' ? ev.webkitCompassHeading
      : e.absolute && typeof e.alpha === 'number' ? (360 - e.alpha) % 360 : null;
    if (h !== null) this.zone.run(() => this.heading.set(h));
  };

  start(): void {
    this.users++;
    if (this.watchId !== null || !this.supported) return;
    this.watchId = navigator.geolocation.watchPosition(
      p => this.zone.run(() => {
        this.error.set(null);
        this.fix.set({ lat: p.coords.latitude, lon: p.coords.longitude, accuracy: p.coords.accuracy, at: new Date(p.timestamp).toISOString() });
      }),
      e => this.zone.run(() => this.error.set(
        e.code === e.PERMISSION_DENIED ? 'Location permission is off. Allow location for this site in your browser settings.'
          : e.code === e.TIMEOUT ? 'Still searching for a GPS signal. Move into the open, away from trees and buildings.'
            : 'The phone could not work out its position.',
      )),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 30000 },
    );
    window.addEventListener('deviceorientationabsolute', this.onOrient as EventListener);
    window.addEventListener('deviceorientation', this.onOrient as EventListener);
  }

  stop(): void {
    this.users = Math.max(0, this.users - 1);
    if (this.users > 0 || this.watchId === null) return;
    navigator.geolocation.clearWatch(this.watchId);
    this.watchId = null;
    window.removeEventListener('deviceorientationabsolute', this.onOrient as EventListener);
    window.removeEventListener('deviceorientation', this.onOrient as EventListener);
  }
}
