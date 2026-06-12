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

function linearRgbToXyz(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
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

function oklabToOklch(
  L: number,
  a: number,
  b: number,
): [number, number, number] {
  const C = Math.sqrt(a * a + b * b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, C, H];
}

// ─── Public API ──────────────────────────────────────────────────────────────

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

/** Convert HSL to a CSS hsl() string */
export function hslToCss(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

/** Determine an auto-name for a palette based on hue of the 500 shade */
export function hueToName(h: number): string {
  const hue = ((h % 360) + 360) % 360;
  if (hue <= 15 || hue > 345) return "Red";
  if (hue <= 44) return "Orange";
  if (hue <= 65) return "Yellow";
  if (hue <= 150) return "Green";
  if (hue <= 200) return "Cyan";
  if (hue <= 260) return "Blue";
  if (hue <= 290) return "Violet";
  return "Pink";
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Clamp a number to [min, max] */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
