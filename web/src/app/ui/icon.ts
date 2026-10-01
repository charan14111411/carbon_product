import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input } from '@angular/core';
import {
  Activity, AlertTriangle, Archive, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Banknote, BarChart3, Bell,
  BookOpen, Boxes, Briefcase, Building2, Calculator, Calendar, Camera, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, ChevronsUpDown, CircleDot, ClipboardCheck, ClipboardList, Clock, CloudRain, Coins, Copy, Cpu,
  Database, Download, Eye, FileCheck2, FileText, Filter, FlaskConical, Fingerprint, Gauge, GitBranch, Globe,
  HandCoins, HelpCircle, History, Inbox, Info, KeyRound, Landmark, Layers, LayoutDashboard, Leaf, Link2, List,
  Lock, LogOut, Map, MapPin, Menu, MessageSquare, Minus, MoreHorizontal, Navigation, Package, Pencil, Plus,
  QrCode, Radar, RefreshCw, Satellite, ScanLine, Scale, Search, Send, Settings, Shield, ShieldCheck, Sprout,
  Sun, Tractor, Trash2, TrendingUp, Upload, User, UserPlus, Users, Wallet, Webhook, Wifi, WifiOff, X,
  XCircle, Zap, Sparkles, Mountain, Droplets, Thermometer, Receipt, Handshake, Ban, Undo2, Play, Target,
  type IconNode,
} from 'lucide';

const ICONS: Record<string, IconNode> = {
  activity: Activity, alert: AlertTriangle, archive: Archive, 'arrow-left': ArrowLeft, 'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight, verified: BadgeCheck, banknote: Banknote, chart: BarChart3, bell: Bell,
  book: BookOpen, boxes: Boxes, briefcase: Briefcase, building: Building2, calculator: Calculator, calendar: Calendar,
  camera: Camera, check: Check, 'check-circle': CheckCircle2, 'chevron-down': ChevronDown, 'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight, 'chevrons-up-down': ChevronsUpDown, dot: CircleDot, 'clipboard-check': ClipboardCheck,
  clipboard: ClipboardList, clock: Clock, rain: CloudRain, coins: Coins, copy: Copy, cpu: Cpu, database: Database,
  download: Download, eye: Eye, 'file-check': FileCheck2, file: FileText, filter: Filter, flask: FlaskConical,
  fingerprint: Fingerprint, gauge: Gauge, branch: GitBranch, globe: Globe, 'hand-coins': HandCoins, help: HelpCircle,
  history: History, inbox: Inbox, info: Info, key: KeyRound, landmark: Landmark, layers: Layers,
  dashboard: LayoutDashboard, leaf: Leaf, link: Link2, list: List, lock: Lock, logout: LogOut, map: Map, pin: MapPin,
  menu: Menu, message: MessageSquare, minus: Minus, more: MoreHorizontal, navigation: Navigation, package: Package,
  pencil: Pencil, plus: Plus, qr: QrCode, radar: Radar, refresh: RefreshCw, satellite: Satellite, scan: ScanLine,
  scale: Scale, search: Search, send: Send, settings: Settings, shield: Shield, 'shield-check': ShieldCheck,
  sprout: Sprout, sun: Sun, tractor: Tractor, trash: Trash2, trend: TrendingUp, upload: Upload, user: User,
  'user-plus': UserPlus, users: Users, wallet: Wallet, webhook: Webhook, wifi: Wifi, 'wifi-off': WifiOff, x: X,
  'x-circle': XCircle, zap: Zap, sparkles: Sparkles, mountain: Mountain, droplets: Droplets, thermometer: Thermometer,
  receipt: Receipt, handshake: Handshake, ban: Ban, undo: Undo2, play: Play, target: Target,
};

const NS = 'http://www.w3.org/2000/svg';

@Component({
  selector: 'vc-icon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'vc-icon', 'aria-hidden': 'true' },
  styles: [':host{display:inline-flex;flex:none;line-height:0}'],
})
export class Icon {
  name = input.required<string>();
  size = input<number>(16);
  stroke = input<number>(1.75);
  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      const host = this.el.nativeElement;
      host.replaceChildren();
      const node = ICONS[this.name()] ?? ICONS['dot'];
      const svg = document.createElementNS(NS, 'svg');
      const s = String(this.size());
      svg.setAttribute('width', s);
      svg.setAttribute('height', s);
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', String(this.stroke()));
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      for (const [tag, attrs] of node) {
        const child = document.createElementNS(NS, tag);
        for (const [k, v] of Object.entries(attrs)) child.setAttribute(k, String(v));
        svg.appendChild(child);
      }
      host.appendChild(svg);
    });
  }
}

/* ---- icons added for fields / practices / catalogue / methodology / quality ---- */
import {
  MousePointerClick as _MousePointerClick, ClipboardPaste as _ClipboardPaste, Eraser as _Eraser, Ruler as _Ruler,
  Hexagon as _Hexagon, ListChecks as _ListChecks, ExternalLink as _ExternalLink, SlidersHorizontal as _Sliders,
  Tag as _Tag, ArrowUp as _ArrowUp, ArrowDown as _ArrowDown, PenLine as _PenLine, Crosshair as _Crosshair,
  FileWarning as _FileWarning, Wheat as _Wheat,
} from 'lucide';
Object.assign(ICONS, {
  'mouse-click': _MousePointerClick, 'clipboard-paste': _ClipboardPaste, eraser: _Eraser, ruler: _Ruler,
  hexagon: _Hexagon, 'list-checks': _ListChecks, 'external-link': _ExternalLink, sliders: _Sliders, tag: _Tag,
  'arrow-up': _ArrowUp, 'arrow-down': _ArrowDown, 'pen-line': _PenLine, crosshair: _Crosshair,
  'file-warning': _FileWarning, wheat: _Wheat,
});

/* ---- icons added for sampling / lab / field app ---- */
import {
  Compass as _Compass, Image as _Image, CloudUpload as _CloudUpload, Shovel as _Shovel, LocateFixed as _LocateFixed,
  House as _House, LockOpen as _LockOpen, ImagePlus as _ImagePlus, Signal as _Signal, Hourglass as _Hourglass,
  Microscope as _Microscope, Truck as _Truck, RotateCcw as _RotateCcw, Shuffle as _Shuffle, Sigma as _Sigma,
  PackageCheck as _PackageCheck, ScanQrCode as _ScanQrCode, Keyboard as _Keyboard, TestTubes as _TestTubes,
  Barcode as _Barcode, Route as _Route, SquareCheck as _SquareCheck, Square as _Square, FileUp as _FileUp,
} from 'lucide';
Object.assign(ICONS, {
  compass: _Compass, image: _Image, 'cloud-upload': _CloudUpload, shovel: _Shovel, locate: _LocateFixed,
  home: _House, unlock: _LockOpen, 'image-plus': _ImagePlus, signal: _Signal, hourglass: _Hourglass,
  microscope: _Microscope, truck: _Truck, 'rotate-ccw': _RotateCcw, shuffle: _Shuffle, sigma: _Sigma,
  'package-check': _PackageCheck, 'scan-qr': _ScanQrCode, keyboard: _Keyboard, 'test-tubes': _TestTubes,
  barcode: _Barcode, route: _Route, 'square-check': _SquareCheck, square: _Square, 'file-up': _FileUp,
});

/* ---- calculations / verification / verifier icons (appended) */
import {
  Sigma as CvSigma, FileJson as CvFileJson, ShieldAlert as CvShieldAlert, Link2Off as CvLinkOff, ListTree as CvListTree,
  ExternalLink as CvExternal, Hourglass as CvHourglass, Mail as CvMail, TrendingDown as CvTrendDown, Flag as CvFlag,
  FileSearch as CvFileSearch, UserCheck as CvUserCheck, Split as CvSplit, Network as CvNetwork, Stamp as CvStamp,
  ChevronsDownUp as CvCollapse, CircleMinus as CvCircleMinus, ScrollText as CvScroll, Microscope as CvMicroscope,
  Truck as CvTruck, Image as CvImage, Ruler as CvRuler, CornerDownRight as CvCornerDR, OctagonAlert as CvOctagon,
  MessageCircleQuestion as CvQuestion, Reply as CvReply, PackageCheck as CvPackageCheck, Circle as CvCircle,
} from 'lucide';
Object.assign(ICONS, {
  sigma: CvSigma, 'file-json': CvFileJson, 'shield-alert': CvShieldAlert, 'link-off': CvLinkOff, tree: CvListTree,
  external: CvExternal, hourglass: CvHourglass, mail: CvMail, 'trend-down': CvTrendDown, flag: CvFlag,
  'file-search': CvFileSearch, 'user-check': CvUserCheck, split: CvSplit, network: CvNetwork, stamp: CvStamp,
  collapse: CvCollapse, 'circle-minus': CvCircleMinus, scroll: CvScroll, microscope: CvMicroscope, truck: CvTruck,
  image: CvImage, ruler: CvRuler, 'corner-down-right': CvCornerDR, octagon: CvOctagon, question: CvQuestion,
  reply: CvReply, 'package-check': CvPackageCheck, circle: CvCircle,
});

/* ---- VM0042 v2.2: site characteristics / tenure / additionality / control sites / drift (appended) */
import {
  Wind as HWind, CloudSun as HCloudSun, Beaker as HBeaker, Award as HAward, FileBadge as HFileBadge, Grid3x3 as HGrid,
  Table as HTable, Workflow as HWorkflow, MapPinned as HMapPinned, CircleCheck as HCircleCheck, CircleX as HCircleX,
  CircleAlert as HCircleAlert, ArrowLeftRight as HArrowLR, GitCompare as HCompare, Percent as HPercent,
  Snowflake as HSnowflake, Refrigerator as HFridge, Quote as HQuote, Unlink as HUnlink, ShieldX as HShieldX,
  Gavel as HGavel, TreePine as HTree, Droplet as HDroplet, CalendarClock as HCalClock, CalendarCheck as HCalCheck,
  Timer as HTimer, FileSpreadsheet as HSheet, FileDown as HFileDown, Braces as HBraces, Blocks as HBlocks,
  ChartLine as HChartLine, WandSparkles as HWand, Pickaxe as HPickaxe, Earth as HEarth, LandPlot as HLandPlot,
  Fence as HFence, ChartScatter as HScatter, CircleDashed as HCircleDashed, Pause as HPause, RotateCw as HRotateCw,
  ListFilter as HListFilter, Combine as HCombine, Signature as HSignature, FileKey as HFileKey, BookCheck as HBookCheck,
} from 'lucide';
Object.assign(ICONS, {
  wind: HWind, 'cloud-sun': HCloudSun, beaker: HBeaker, award: HAward, 'file-badge': HFileBadge, grid: HGrid,
  table: HTable, workflow: HWorkflow, 'map-pinned': HMapPinned, 'circle-check': HCircleCheck, 'circle-x': HCircleX,
  'circle-alert': HCircleAlert, 'arrow-left-right': HArrowLR, compare: HCompare, percent: HPercent,
  snowflake: HSnowflake, fridge: HFridge, quote: HQuote, unlink: HUnlink, 'shield-x': HShieldX, gavel: HGavel,
  'tree-pine': HTree, droplet: HDroplet, 'calendar-clock': HCalClock, 'calendar-check': HCalCheck, timer: HTimer,
  sheet: HSheet, 'file-down': HFileDown, braces: HBraces, blocks: HBlocks, 'chart-line': HChartLine, wand: HWand,
  pickaxe: HPickaxe, earth: HEarth, 'land-plot': HLandPlot, fence: HFence, scatter: HScatter,
  'circle-dashed': HCircleDashed, pause: HPause, 'rotate-cw': HRotateCw, 'list-filter': HListFilter,
  combine: HCombine, signature: HSignature, 'file-key': HFileKey, 'book-check': HBookCheck,
});
