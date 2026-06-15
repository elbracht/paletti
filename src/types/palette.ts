export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Shade = (typeof SHADES)[number];

export interface ColorStop {
  shade: Shade;
  h: number; // 0–360
  s: number; // 0–100
  l: number; // 0–100
}

export interface Palette {
  id: string;
  name: string;
  colors: ColorStop[];
}
