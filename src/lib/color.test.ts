import { describe, it, expect } from 'vitest';
import { hslToOklch, hueToName, clamp } from '@/lib/color';

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
});

describe('clamp', () => {
  it('clamps below min', () => expect(clamp(-5, 0, 100)).toBe(0));
  it('clamps above max', () => expect(clamp(150, 0, 100)).toBe(100));
  it('passes through in-range values', () => expect(clamp(50, 0, 100)).toBe(50));
});
