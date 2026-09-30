/**
 * Prepare a camera photo for evidence: scale it down, stamp time and position on it,
 * and re-encode as JPEG (the server accepts JPEG, PNG and WebP; phones may produce HEIC).
 */
export async function stampPhoto(file: File, stamp: { title: string; at: Date; lat: number | null; lon: number | null; acc?: number | null }): Promise<Blob> {
  const img = await loadImage(file);
  const max = 1600;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  const lines = [
    stamp.title,
    stamp.at.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    stamp.lat !== null && stamp.lon !== null
      ? `${stamp.lat.toFixed(6)}, ${stamp.lon.toFixed(6)}${stamp.acc ? `  ±${Math.round(stamp.acc)} m` : ''}`
      : 'No GPS fix',
  ];
  const fs = Math.max(14, Math.round(w / 48));
  const pad = Math.round(fs * 0.7);
  const bandH = lines.length * fs * 1.35 + pad * 2;
  ctx.fillStyle = 'rgba(11,31,21,0.72)';
  ctx.fillRect(0, h - bandH, w, bandH);
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'top';
  lines.forEach((l, i) => {
    ctx.font = `${i === 0 ? 600 : 400} ${fs}px "IBM Plex Sans", system-ui, sans-serif`;
    ctx.fillText(l, pad, h - bandH + pad + i * fs * 1.35);
  });

  const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.85));
  return blob ?? file;
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('This file could not be read as a photo.')); };
    img.src = url;
  });
}

interface DetectedBarcode { rawValue: string }
interface BarcodeDetectorLike { detect(src: ImageBitmapSource): Promise<DetectedBarcode[]> }

export function barcodeSupported(): boolean {
  return typeof window !== 'undefined' && 'BarcodeDetector' in window;
}

/** Read a QR / barcode from a photo of a bag label. Returns null when nothing is found. */
export async function readCode(file: File): Promise<string | null> {
  if (!barcodeSupported()) return null;
  const Ctor = (window as unknown as { BarcodeDetector: new (o?: unknown) => BarcodeDetectorLike }).BarcodeDetector;
  const det = new Ctor({ formats: ['qr_code', 'code_128', 'code_39', 'data_matrix', 'ean_13'] });
  const bmp = await createImageBitmap(file);
  const found = await det.detect(bmp);
  return found[0]?.rawValue?.trim() || null;
}
