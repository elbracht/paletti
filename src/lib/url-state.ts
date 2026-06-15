import { Palette } from '@/types/palette';

type SerializedColor = [number, number, number]; // [H, S, L]

interface SerializedPalette {
  id: string;
  name: string;
  colors: SerializedColor[];
}

export function encodePalettes(palettes: Palette[]): string {
  const data: SerializedPalette[] = palettes.map((p) => ({
    id: p.id,
    name: p.name,
    colors: p.colors.map((c) => [Math.round(c.h), Math.round(c.s), Math.round(c.l)]),
  }));
  const json = JSON.stringify(data);
  return btoa(encodeURIComponent(json));
}

export function decodePalettes(encoded: string): Palette[] | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const data: SerializedPalette[] = JSON.parse(json);
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      colors: p.colors.map((c, i) => ({
        shade: ([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const)[i],
        h: c[0],
        s: c[1],
        l: c[2],
      })),
    }));
  } catch {
    return null;
  }
}
