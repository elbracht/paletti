import { describe, it, expect } from 'vitest';
import { parseTailwindConfig } from '@/lib/import';

const VALID_CSS = `@theme {
  --color-primary-50: oklch(97.8% 0.013 236.6);
  --color-primary-100: oklch(95.2% 0.026 236.8);
  --color-primary-200: oklch(92% 0.04 237.4);
  --color-primary-300: oklch(87.2% 0.058 238);
  --color-primary-400: oklch(80.4% 0.082 238.7);
  --color-primary-500: oklch(72.4% 0.105 239.6);
  --color-primary-600: oklch(62.4% 0.129 240.8);
  --color-primary-700: oklch(52.2% 0.139 242.5);
  --color-primary-800: oklch(42.4% 0.133 245);
  --color-primary-900: oklch(33.4% 0.112 249.2);
  --color-primary-950: oklch(26.5% 0.082 254.1);
}`;

describe('parseTailwindConfig', () => {
  it('parses a full oklch @theme block', () => {
    const result = parseTailwindConfig(VALID_CSS);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0].name).toBe('Primary');
    expect(result![0].colors).toHaveLength(11);
  });

  it('assigns sequential ids', () => {
    // Two @theme blocks should get unique ids
    const css = `${VALID_CSS}\n\n${VALID_CSS.replace(/primary/g, 'secondary')}`;
    const result = parseTailwindConfig(css);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    expect(result![0].id).not.toBe(result![1].id);
  });

  it('formats name with hyphens as spaces and title case', () => {
    const css = VALID_CSS.replace(/primary/, 'my-brand');
    const result = parseTailwindConfig(css);
    expect(result).not.toBeNull();
    expect(result![0].name).toBe('My Brand');
  });

  it('returns null for CSS without color variables', () => {
    expect(parseTailwindConfig('body { color: red; }')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseTailwindConfig('')).toBeNull();
  });

  it('skips non-shade variables', () => {
    const css = `--color-primary-500: oklch(72.4% 0.105 239.6);\n--color-custom-foo: oklch(50% 0.1 180);`;
    const result = parseTailwindConfig(css);
    expect(result).not.toBeNull();
    expect(result![0].colors).toHaveLength(1); // only 500
  });

  it('ignores variables with shade outside the standard range', () => {
    const css = `--color-primary-123: oklch(72.4% 0.105 239.6);`;
    expect(parseTailwindConfig(css)).toBeNull();
  });

  it('supports hex color values', () => {
    const css = `--color-red-500: #ef4444;`;
    const result = parseTailwindConfig(css);
    expect(result).not.toBeNull();
    expect(result![0].colors).toHaveLength(1);
    if (result) {
      expect(result[0].colors[0].h).toBe(0); // red-ish
    }
  });

  it('returns null when all values are unparseable', () => {
    const css = `--color-primary-500: transparent;\n--color-primary-600: currentColor;`;
    expect(parseTailwindConfig(css)).toBeNull();
  });

  it('parses multiple palettes in one block', () => {
    const css = `
      --color-red-500: oklch(62.3% 0.172 142.5);
      --color-red-600: oklch(52.3% 0.172 142.5);
      --color-blue-500: oklch(50% 0.2 250);
      --color-blue-600: oklch(40% 0.2 250);
    `;
    const result = parseTailwindConfig(css);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    expect(result![0].name).toBe('Red');
    expect(result![1].name).toBe('Blue');
  });
});
