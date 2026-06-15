import { oklchToHsl, hexToHsl } from './color';
import { Palette, ColorStop, SHADES } from '@/types/palette';

/**
 * Parse a color value string (oklch or hex) into [H, S, L].
 * Returns null for unsupported formats (rgba, transparent, etc.).
 */
function parseColorValue(value: string): [number, number, number] | null {
  const v = value.trim();
  if (v.startsWith('oklch(')) return oklchToHsl(v);
  if (v.startsWith('#')) return hexToHsl(v);
  return null;
}

/**
 * Parse a Tailwind v4 @theme block and extract palettes.
 * Supports --color-{name}-{shade}: oklch(...) and #hex values.
 */
export function parseTailwindConfig(css: string): Palette[] | null {
  // Match any value up to the semicolon (or end of line)
  const varPattern = /--color-([\w-]+)-(\d+)\s*:\s*([^;]+)/g;

  const groups = new Map<string, Map<number, [number, number, number]>>();

  let match: RegExpExecArray | null;
  while ((match = varPattern.exec(css)) !== null) {
    const [, name, shadeStr, rawValue] = match;
    const shade = parseInt(shadeStr, 10);
    if (!SHADES.includes(shade as (typeof SHADES)[number])) continue;

    const hsl = parseColorValue(rawValue);
    if (!hsl) continue;

    if (!groups.has(name)) groups.set(name, new Map());
    groups.get(name)!.set(shade, hsl);
  }

  if (groups.size === 0) return null;

  const palettes: Palette[] = [];
  let counter = Date.now();

  for (const [name, shadeMap] of groups) {
    const colors: ColorStop[] = SHADES.filter((s) => shadeMap.has(s)).map((shade) => {
      const [h, s, l] = shadeMap.get(shade)!;
      return { shade, h, s, l };
    });

    if (colors.length === 0) continue;

    palettes.push({
      id: `palette-${counter++}`,
      name: name
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      colors,
    });
  }

  return palettes.length > 0 ? palettes : null;
}
