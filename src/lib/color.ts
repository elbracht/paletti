/**
 * HSL → oklch conversion and color utility functions.
 *
 * Conversion path: HSL → sRGB → Linear sRGB → XYZ D65 → Oklab → oklch
 */

// ─── HSL → sRGB ─────────────────────────────────────────────────────────────

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return [r + m, g + m, b + m];
}

// ─── sRGB → Linear sRGB ──────────────────────────────────────────────────────

function toLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// ─── Linear sRGB → XYZ D65 ───────────────────────────────────────────────────

function linearRgbToXyz(r: number, g: number, b: number): [number, number, number] {
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;
  return [x, y, z];
}

// ─── XYZ D65 → Oklab ─────────────────────────────────────────────────────────

function xyzToOklab(x: number, y: number, z: number): [number, number, number] {
  const l = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const m = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
  const s = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

// ─── Oklab → oklch ───────────────────────────────────────────────────────────

function oklabToOklch(L: number, a: number, b: number): [number, number, number] {
  const C = Math.sqrt(a * a + b * b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, C, H];
}

// ─── oklch → Oklab ───────────────────────────────────────────────────────────

function oklchToOklab(L: number, C: number, H: number): [number, number, number] {
  const h = (H * Math.PI) / 180;
  return [L, C * Math.cos(h), C * Math.sin(h)];
}

// ─── Oklab → XYZ D65 ─────────────────────────────────────────────────────────

function oklabToXyz(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  // Correct M1-inverse: LMS [1,1,1] → XYZ D65 white [0.9505, 1.0, 1.089]
  return [
    1.2270138511035211 * l - 0.5577999806518222 * m + 0.2812561489664678 * s,
    -0.0405801784232806 * l + 1.1122568696168302 * m - 0.0716766786656012 * s,
    -0.0763812845057069 * l - 0.4214819784180127 * m + 1.5861632204407947 * s,
  ];
}

// ─── XYZ D65 → Linear sRGB ───────────────────────────────────────────────────

function xyzToLinearRgb(x: number, y: number, z: number): [number, number, number] {
  return [
    3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
    -0.969266 * x + 1.8760108 * y + 0.041556 * z,
    0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
  ];
}

// ─── Linear sRGB → sRGB ──────────────────────────────────────────────────────

function fromLinear(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

// ─── sRGB → HSL ──────────────────────────────────────────────────────────────

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Convert oklch (L, C, H) to in-gamut sRGB [r, g, b] using binary-search
 * chroma reduction. This prevents hard-clamping from corrupting the hue of
 * colors that are slightly outside the sRGB gamut.
 */
function oklchToInGamutRgb(L: number, C: number, H: number): [number, number, number] {
  const toRgb = (l: number, c: number, h: number) => {
    const [okL, okA, okB] = oklchToOklab(l, c, h);
    const [x, y, z] = oklabToXyz(okL, okA, okB);
    return xyzToLinearRgb(x, y, z);
  };

  const inGamut = ([r, g, b]: [number, number, number]) =>
    r >= -1e-4 && r <= 1 + 1e-4 && g >= -1e-4 && g <= 1 + 1e-4 && b >= -1e-4 && b <= 1 + 1e-4;

  let [rl, gl, bl] = toRgb(L, C, H);

  if (!inGamut([rl, gl, bl])) {
    // Binary-search for the largest in-gamut chroma
    let lo = 0,
      hi = C;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(toRgb(L, mid, H))) lo = mid;
      else hi = mid;
    }
    [rl, gl, bl] = toRgb(L, lo, H);
  }

  return [
    fromLinear(Math.max(0, Math.min(1, rl))),
    fromLinear(Math.max(0, Math.min(1, gl))),
    fromLinear(Math.max(0, Math.min(1, bl))),
  ];
}

/** Convert an oklch CSS string like `oklch(56.3% 0.172 142.5)` or `oklch(0.563 0.172 142.5)` to HSL */
export function oklchToHsl(oklchStr: string): [number, number, number] | null {
  const m = oklchStr.match(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) return null;
  const raw = parseFloat(m[1]);
  // L is either a percentage (62.3%) or a 0–1 value (0.623)
  const L = m[2] === '%' ? raw / 100 : raw;
  const C = parseFloat(m[3]);
  const H = parseFloat(m[4]);
  const [r, g, b] = oklchToInGamutRgb(L, C, H);
  return rgbToHsl(r, g, b);
}

/** Convert a hex color string like `#edf4fd` to HSL */
export function hexToHsl(hex: string): [number, number, number] | null {
  const m = hex.match(/^#([0-9a-f]{3,8})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return rgbToHsl(r, g, b);
}

/** Convert HSL values to an oklch CSS string, e.g. `oklch(56.3% 0.172 142.5)` */
export function hslToOklch(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  const [rl, gl, bl] = [toLinear(r), toLinear(g), toLinear(b)];
  const [x, y, z] = linearRgbToXyz(rl, gl, bl);
  const [okL, okA, okB] = xyzToOklab(x, y, z);
  const [oklchL, oklchC, oklchH] = oklabToOklch(okL, okA, okB);

  const Lp = round(oklchL * 100, 1);
  const Cp = round(oklchC, 4);
  const Hp = round(oklchH, 1);

  return `oklch(${Lp}% ${Cp} ${Hp})`;
}

/** Convert HSL to a hex color string like `#3b82f6` */
export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  const toHex = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c * 255)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Convert HSL to a CSS hsl() string */
export function hslToCss(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

/** Determine an auto-name for a palette based on hue of the 500 shade */
export function hueToName(h: number): string {
  const hue = ((h % 360) + 360) % 360;
  if (hue <= 15 || hue > 345) return 'Red';
  if (hue <= 44) return 'Orange';
  if (hue <= 65) return 'Yellow';
  if (hue <= 150) return 'Green';
  if (hue <= 200) return 'Cyan';
  if (hue <= 260) return 'Blue';
  if (hue <= 290) return 'Violet';
  return 'Pink';
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Clamp a number to [min, max] */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
