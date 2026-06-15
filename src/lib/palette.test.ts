import { describe, it, expect } from 'vitest';
import {
  createDefaultColors,
  createPalette,
  applyHueShift,
  applySaturationShift,
  applyLightnessShift,
} from '@/lib/palette';
import { SHADES } from '@/types/palette';

describe('createDefaultColors', () => {
  it('returns 11 color stops', () => {
    expect(createDefaultColors()).toHaveLength(11);
  });

  it('uses correct shade values', () => {
    const colors = createDefaultColors();
    colors.forEach((c, i) => {
      expect(c.shade).toBe(SHADES[i]);
    });
  });

  it('contains valid HSL values', () => {
    const colors = createDefaultColors();
    colors.forEach((c) => {
      expect(c.h).toBeGreaterThanOrEqual(0);
      expect(c.h).toBeLessThanOrEqual(360);
      expect(c.s).toBeGreaterThanOrEqual(0);
      expect(c.s).toBeLessThanOrEqual(100);
      expect(c.l).toBeGreaterThanOrEqual(0);
      expect(c.l).toBeLessThanOrEqual(100);
    });
  });

  it('returns a consistent result (same shape on each call)', () => {
    const a = createDefaultColors();
    const b = createDefaultColors();
    a.forEach((_, i) => {
      expect(a[i].h).toBe(b[i].h);
      expect(a[i].s).toBe(b[i].s);
      expect(a[i].l).toBe(b[i].l);
    });
  });
});

describe('createPalette', () => {
  it('creates a palette with given id', () => {
    const p = createPalette('test-1');
    expect(p.id).toBe('test-1');
  });

  it('defaults name to Unknown', () => {
    const p = createPalette('test-1');
    expect(p.name).toBe('Unknown');
  });

  it('includes default colors', () => {
    const p = createPalette('test-1');
    expect(p.colors).toHaveLength(11);
    expect(p.colors[0].shade).toBe(50);
  });
});

describe('applyHueShift', () => {
  const base = [
    { shade: 500 as const, h: 200, s: 50, l: 50 },
    { shade: 600 as const, h: 210, s: 50, l: 50 },
  ];

  it('shifts all hue values by delta', () => {
    const shifted = applyHueShift(base, 30);
    expect(shifted[0].h).toBe(230);
    expect(shifted[1].h).toBe(240);
  });

  it('wraps around at 360', () => {
    const shifted = applyHueShift(base, 200);
    expect(shifted[0].h).toBe(40);
    expect(shifted[1].h).toBe(50);
  });

  it('handles negative delta', () => {
    const shifted = applyHueShift(base, -30);
    expect(shifted[0].h).toBe(170);
    expect(shifted[1].h).toBe(180);
  });

  it('wraps around below 0', () => {
    const shifted = applyHueShift(base, -250);
    expect(shifted[0].h).toBe(310);
    expect(shifted[1].h).toBe(320);
  });

  it('does not mutate original array', () => {
    const copy = [...base];
    applyHueShift(base, 10);
    expect(base).toEqual(copy);
  });
});

describe('applySaturationShift', () => {
  const base = [
    { shade: 500 as const, h: 200, s: 50, l: 50 },
    { shade: 600 as const, h: 210, s: 30, l: 50 },
  ];

  it('shifts saturation up', () => {
    const shifted = applySaturationShift(base, 20);
    expect(shifted[0].s).toBe(70);
    expect(shifted[1].s).toBe(50);
  });

  it('shifts saturation down', () => {
    const shifted = applySaturationShift(base, -20);
    expect(shifted[0].s).toBe(30);
    expect(shifted[1].s).toBe(10);
  });

  it('clamps at 100', () => {
    const shifted = applySaturationShift(base, 100);
    expect(shifted[0].s).toBe(100);
  });

  it('clamps at 0', () => {
    const shifted = applySaturationShift(base, -100);
    expect(shifted[0].s).toBe(0);
  });

  it('does not mutate original array', () => {
    const copy = [...base];
    applySaturationShift(base, 10);
    expect(base).toEqual(copy);
  });
});

describe('applyLightnessShift', () => {
  const base = [
    { shade: 500 as const, h: 200, s: 50, l: 60 },
    { shade: 600 as const, h: 210, s: 50, l: 40 },
  ];

  it('shifts lightness up', () => {
    const shifted = applyLightnessShift(base, 20);
    expect(shifted[0].l).toBe(80);
    expect(shifted[1].l).toBe(60);
  });

  it('shifts lightness down', () => {
    const shifted = applyLightnessShift(base, -20);
    expect(shifted[0].l).toBe(40);
    expect(shifted[1].l).toBe(20);
  });

  it('clamps at 100', () => {
    const shifted = applyLightnessShift(base, 100);
    expect(shifted[0].l).toBe(100);
  });

  it('clamps at 0', () => {
    const shifted = applyLightnessShift(base, -100);
    expect(shifted[0].l).toBe(0);
  });
});
