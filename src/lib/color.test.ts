import { describe, it, expect } from 'vitest';
import { hslToOklch, oklchToHsl, hexToHsl, hslToCss, hueToName, clamp } from '@/lib/color';

describe('hslToOklch', () => {
  it('converts pure white correctly', () => {
    const result = hslToOklch(0, 0, 100);
    expect(result).toMatch(/oklch\(100(\.\d+)?% 0(\.\d+)? \d+(\.\d+)?\)/);
  });

  it('converts pure black correctly', () => {
    const result = hslToOklch(0, 0, 0);
    expect(result).toMatch(/oklch\(0(\.\d+)?% 0(\.\d+)? \d+(\.\d+)?\)/);
  });

  it('returns an oklch() string', () => {
    const result = hslToOklch(135, 74, 45);
    expect(result).toMatch(/^oklch\(/);
    expect(result).toMatch(/\)$/);
  });

  it('produces different values for different hues', () => {
    const green = hslToOklch(135, 74, 45);
    const blue = hslToOklch(220, 74, 45);
    expect(green).not.toBe(blue);
  });
});

describe('oklchToHsl', () => {
  it('parses an oklch string with percentage L', () => {
    const result = oklchToHsl('oklch(62.3% 0.172 142.5)');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
    if (result) {
      expect(result[0]).toBeGreaterThanOrEqual(0);
      expect(result[0]).toBeLessThanOrEqual(360);
      expect(result[1]).toBeGreaterThanOrEqual(0);
      expect(result[1]).toBeLessThanOrEqual(100);
      expect(result[2]).toBeGreaterThanOrEqual(0);
      expect(result[2]).toBeLessThanOrEqual(100);
    }
  });

  it('parses an oklch string with 0-1 L', () => {
    const result = oklchToHsl('oklch(0.623 0.172 142.5)');
    expect(result).not.toBeNull();
    if (result) {
      expect(result[1]).toBeGreaterThanOrEqual(0);
    }
  });

  it('returns null for invalid format', () => {
    expect(oklchToHsl('rgb(255 0 0)')).toBeNull();
    expect(oklchToHsl('not a color')).toBeNull();
  });

  it('round-trips a known HSL value', () => {
    // hsl(135, 74%, 45%) → oklch → hsl should be close
    const oklch = hslToOklch(135, 74, 45);
    const back = oklchToHsl(oklch);
    expect(back).not.toBeNull();
    if (back) {
      expect(back[0]).toBeCloseTo(135, -1);
      expect(back[1]).toBeCloseTo(74, -1);
      expect(back[2]).toBeCloseTo(45, -1);
    }
  });
});

describe('hexToHsl', () => {
  it('parses a 6-digit hex', () => {
    const result = hexToHsl('#ff0000');
    expect(result).not.toBeNull();
    if (result) {
      expect(result[0]).toBe(0); // red hue
      expect(result[1]).toBe(100); // fully saturated
      expect(result[2]).toBe(50); // mid lightness
    }
  });

  it('parses hex values across all hue ranges', () => {
    // Each test covers a different hslToRgb branch
    const yellowGreen = hexToHsl('#80ff00'); // h ≈ 90  (60–119)
    expect(yellowGreen![0]).toBe(90);
    const green = hexToHsl('#00ff00'); // h = 120 (120–179)
    expect(green![0]).toBe(120);
    const cyan = hexToHsl('#00ffff'); // h = 180 (180–239)
    expect(cyan![0]).toBe(180);
    const blue = hexToHsl('#0000ff'); // h = 240 (240–299)
    expect(blue![0]).toBe(240);
    const magenta = hexToHsl('#ff00ff'); // h = 300 (300–359)
    expect(magenta![0]).toBe(300);
  });

  it('parses a 3-digit hex', () => {
    const result = hexToHsl('#f00');
    expect(result).not.toBeNull();
    if (result) {
      expect(result[0]).toBe(0);
    }
  });

  it('returns null for invalid hex', () => {
    expect(hexToHsl('not hex')).toBeNull();
    expect(hexToHsl('#12345')).toBeNull(); // 5 digits
    expect(hexToHsl('#12345g')).toBeNull(); // invalid char
  });

  it('is case-insensitive', () => {
    const lower = hexToHsl('#aabbcc');
    const upper = hexToHsl('#AABBCC');
    expect(lower).toEqual(upper);
  });
});

describe('hslToCss', () => {
  it('formats hsl() string', () => {
    expect(hslToCss(220, 50, 60)).toBe('hsl(220 50% 60%)');
  });

  it('rounds values', () => {
    expect(hslToCss(220.7, 50.3, 59.9)).toBe('hsl(221 50% 60%)');
  });
});

describe('hueToName', () => {
  it('names red hues', () => {
    expect(hueToName(0)).toBe('Red');
    expect(hueToName(10)).toBe('Red');
    expect(hueToName(355)).toBe('Red');
  });
  it('names green hues', () => {
    expect(hueToName(120)).toBe('Green');
    expect(hueToName(135)).toBe('Green');
  });
  it('names blue hues', () => {
    expect(hueToName(220)).toBe('Blue');
  });
  it('names orange hues', () => {
    expect(hueToName(30)).toBe('Orange');
  });
  it('wraps negative hues', () => {
    const name = hueToName(-10);
    expect(name).toBe('Red');
  });
  it('covers all named ranges', () => {
    expect(hueToName(50)).toBe('Yellow');
    expect(hueToName(160)).toBe('Cyan');
    expect(hueToName(200)).toBe('Cyan');
    expect(hueToName(280)).toBe('Violet');
    expect(hueToName(300)).toBe('Pink');
  });
});

describe('hslToRgb branch coverage via hslToOklch', () => {
  it.each([
    { desc: 'red (h < 60)', h: 10 },
    { desc: 'yellow-green (h < 120)', h: 80 },
    { desc: 'green (h < 180)', h: 150 },
    { desc: 'cyan (h < 240)', h: 210 },
    { desc: 'blue (h < 300)', h: 270 },
    { desc: 'magenta (h >= 300)', h: 330 },
  ])('handles $desc', ({ h }) => {
    const result = hslToOklch(h, 50, 50);
    expect(result).toMatch(/^oklch\(/);
  });

  it('handles gray (s=0, any hue)', () => {
    expect(hslToOklch(0, 0, 50)).toMatch(/^oklch\(/);
  });
});

describe('clamp', () => {
  it('clamps below min', () => expect(clamp(-5, 0, 100)).toBe(0));
  it('clamps above max', () => expect(clamp(150, 0, 100)).toBe(100));
  it('passes through in-range values', () => expect(clamp(50, 0, 100)).toBe(50));
});
