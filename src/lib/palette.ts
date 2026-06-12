import { Palette, ColorStop, SHADES } from "@/types/palette";

/** Default HSL values for a new palette (a pleasant blue) */
const DEFAULT_HSL: Array<[number, number, number]> = [
  [217, 91, 97],
  [214, 95, 93],
  [213, 97, 87],
  [212, 96, 78],
  [213, 94, 68],
  [217, 91, 60],
  [221, 83, 53],
  [224, 76, 48],
  [226, 71, 40],
  [224, 64, 33],
  [222, 55, 20],
];

export function createDefaultColors(): ColorStop[] {
  return SHADES.map((shade, i) => ({
    shade,
    h: DEFAULT_HSL[i][0],
    s: DEFAULT_HSL[i][1],
    l: DEFAULT_HSL[i][2],
  }));
}

export function createPalette(id: string): Palette {
  const colors = createDefaultColors();
  return {
    id,
    name: "Unknown",
    colors,
  };
}

/** Shift all hue values by `delta`, keeping them in [0, 360] */
export function applyHueShift(colors: ColorStop[], delta: number): ColorStop[] {
  return colors.map((c) => ({
    ...c,
    h: (((c.h + delta) % 360) + 360) % 360,
  }));
}

/** Shift all saturation values by `delta`, clamped to [0, 100] */
export function applySaturationShift(
  colors: ColorStop[],
  delta: number,
): ColorStop[] {
  return colors.map((c) => ({
    ...c,
    s: Math.max(0, Math.min(100, c.s + delta)),
  }));
}

/** Shift all lightness values by `delta`, clamped to [0, 100] */
export function applyLightnessShift(
  colors: ColorStop[],
  delta: number,
): ColorStop[] {
  return colors.map((c) => ({
    ...c,
    l: Math.max(0, Math.min(100, c.l + delta)),
  }));
}
