import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePalettes } from '@/hooks/usePalettes';
import type { Palette } from '@/types/palette';
import { createDefaultColors } from '@/lib/palette';

function makePalette(id: string, name = 'Test'): Palette {
  return { id, name, colors: createDefaultColors() };
}

describe('usePalettes', () => {
  beforeEach(() => {
    // Reset idCounter implicitly by using fixed initial palettes
  });

  it('starts with empty state when no initial palettes given', () => {
    const { result } = renderHook(() => usePalettes());
    expect(result.current.palettes).toEqual([]);
    expect(result.current.selectedId).toBeNull();
    expect(result.current.selectedPalette).toBeNull();
  });

  it('starts with initial palettes', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    expect(result.current.palettes).toHaveLength(1);
    expect(result.current.selectedId).toBe('a');
    expect(result.current.selectedPalette?.id).toBe('a');
  });

  it('addPalette adds a new palette and selects it', () => {
    const { result } = renderHook(() => usePalettes());
    act(() => result.current.addPalette());
    expect(result.current.palettes).toHaveLength(1);
    expect(result.current.selectedId).toBe(result.current.palettes[0].id);
    expect(result.current.selectedPalette?.name).toBe('Unknown');
  });

  it('addPalette increments palette count', () => {
    const { result } = renderHook(() => usePalettes());
    act(() => result.current.addPalette());
    act(() => result.current.addPalette());
    expect(result.current.palettes).toHaveLength(2);
  });

  it('deletePalette removes a palette', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    act(() => result.current.deletePalette('a'));
    expect(result.current.palettes).toEqual([]);
    expect(result.current.selectedId).toBeNull();
  });

  it('deletePalette selects the last remaining palette when deleting selected', () => {
    const a = makePalette('a');
    const b = makePalette('b');
    const { result } = renderHook(() => usePalettes([a, b]));
    // Selected is 'a' (first)
    act(() => result.current.deletePalette('a'));
    expect(result.current.palettes).toHaveLength(1);
    expect(result.current.selectedId).toBe('b');
  });

  it('deletePalette does not affect selection when deleting non-selected', () => {
    const a = makePalette('a');
    const b = makePalette('b');
    const { result } = renderHook(() => usePalettes([a, b]));
    act(() => result.current.selectPalette('b'));
    act(() => result.current.deletePalette('a'));
    expect(result.current.selectedId).toBe('b');
  });

  it('renamePalette updates the palette name', () => {
    const p = makePalette('a', 'Old');
    const { result } = renderHook(() => usePalettes([p]));
    act(() => result.current.renamePalette('a', 'New Name'));
    expect(result.current.palettes[0].name).toBe('New Name');
  });

  it('selectPalette changes selection', () => {
    const a = makePalette('a');
    const b = makePalette('b');
    const { result } = renderHook(() => usePalettes([a, b]));
    act(() => result.current.selectPalette('b'));
    expect(result.current.selectedId).toBe('b');
    expect(result.current.selectedPalette?.id).toBe('b');
  });

  it('selectPalette(null) clears selection', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    act(() => result.current.selectPalette(null));
    expect(result.current.selectedId).toBeNull();
    expect(result.current.selectedPalette).toBeNull();
  });

  it('updateColor updates a single color field', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    act(() => result.current.updateColor('a', 500, 'h', 300));
    const color500 = result.current.palettes[0].colors.find((c) => c.shade === 500);
    expect(color500?.h).toBe(300);
  });

  it('updateColor clamps hue to 0–360', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    act(() => result.current.updateColor('a', 500, 'h', -10));
    const color500 = result.current.palettes[0].colors.find((c) => c.shade === 500);
    expect(color500?.h).toBe(0);
  });

  it('updateColor clamps saturation to 0–100', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    act(() => result.current.updateColor('a', 500, 's', 150));
    const color500 = result.current.palettes[0].colors.find((c) => c.shade === 500);
    expect(color500?.s).toBe(100);
  });

  it('updateColor clamps lightness to 0–100', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    act(() => result.current.updateColor('a', 500, 'l', -20));
    const color500 = result.current.palettes[0].colors.find((c) => c.shade === 500);
    expect(color500?.l).toBe(0);
  });

  it('applyHueShift shifts all hue values', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    const originalHues = result.current.palettes[0].colors.map((c) => c.h);
    act(() => result.current.applyHueShift('a', 10));
    result.current.palettes[0].colors.forEach((c, i) => {
      expect(c.h).toBe((((originalHues[i] + 10) % 360) + 360) % 360);
    });
  });

  it('applySaturationShift shifts all saturation values', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    const originalSats = result.current.palettes[0].colors.map((c) => c.s);
    act(() => result.current.applySaturationShift('a', 5));
    result.current.palettes[0].colors.forEach((c, i) => {
      expect(c.s).toBe(Math.min(100, Math.max(0, originalSats[i] + 5)));
    });
  });

  it('applyLightnessShift shifts all lightness values', () => {
    const p = makePalette('a');
    const { result } = renderHook(() => usePalettes([p]));
    const originalLights = result.current.palettes[0].colors.map((c) => c.l);
    act(() => result.current.applyLightnessShift('a', -3));
    result.current.palettes[0].colors.forEach((c, i) => {
      expect(c.l).toBe(Math.min(100, Math.max(0, originalLights[i] - 3)));
    });
  });

  it('importPalettes merges palettes and selects the first imported', () => {
    const a = makePalette('a');
    const b = makePalette('b');
    const c = makePalette('c');
    const { result } = renderHook(() => usePalettes([a]));
    act(() => result.current.importPalettes([b, c]));
    expect(result.current.palettes).toHaveLength(3);
    expect(result.current.selectedId).toBe('b');
  });

  it('importPalettes keeps selected when importing empty array', () => {
    const a = makePalette('a');
    const { result } = renderHook(() => usePalettes([a]));
    act(() => result.current.importPalettes([]));
    expect(result.current.palettes).toHaveLength(1);
    expect(result.current.selectedId).toBe('a');
  });

  it('setPalettes replaces all palettes', () => {
    const a = makePalette('a');
    const b = makePalette('b');
    const { result } = renderHook(() => usePalettes([a]));
    act(() => result.current.setPalettes([b]));
    expect(result.current.palettes).toHaveLength(1);
    expect(result.current.palettes[0].id).toBe('b');
    expect(result.current.selectedId).toBe('b');
  });

  it('reorderPalettes moves a palette from one index to another', () => {
    const a = makePalette('a');
    const b = makePalette('b');
    const c = makePalette('c');
    const { result } = renderHook(() => usePalettes([a, b, c]));
    act(() => result.current.reorderPalettes(0, 2)); // move 'a' to position 2
    expect(result.current.palettes[0].id).toBe('b');
    expect(result.current.palettes[1].id).toBe('c');
    expect(result.current.palettes[2].id).toBe('a');
  });

  it('reorderPalettes with fromIndex === toIndex does nothing', () => {
    const a = makePalette('a');
    const b = makePalette('b');
    const { result } = renderHook(() => usePalettes([a, b]));
    act(() => result.current.reorderPalettes(0, 0));
    expect(result.current.palettes[0].id).toBe('a');
    expect(result.current.palettes[1].id).toBe('b');
  });
});
