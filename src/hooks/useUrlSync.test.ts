import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUrlSync } from '@/hooks/useUrlSync';
import { createDefaultColors } from '@/lib/palette';
import { encodePalettes } from '@/lib/url-state';
import type { Palette } from '@/types/palette';

const mockPalette: Palette = {
  id: 'test-1',
  name: 'Test',
  colors: createDefaultColors(),
};

const mockUseSearchParams = vi.fn(() => ({
  get: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

let replaceState: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockUseSearchParams.mockReturnValue({ get: vi.fn() });
  replaceState = vi.fn();
  vi.spyOn(window.history, 'replaceState').mockImplementation(replaceState);
});

describe('useUrlSync', () => {
  it('initializes palettes from URL on mount', () => {
    const encoded = encodePalettes([mockPalette]);
    mockUseSearchParams.mockReturnValue({ get: () => encoded });

    const onLoad = vi.fn();
    renderHook(() => useUrlSync({ palettes: [], onLoad }));

    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onLoad).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'test-1' })]),
    );
  });

  it('does not call onLoad when there is no p param', () => {
    mockUseSearchParams.mockReturnValue({ get: () => null });

    const onLoad = vi.fn();
    renderHook(() => useUrlSync({ palettes: [], onLoad }));

    expect(onLoad).not.toHaveBeenCalled();
  });

  it('does not call onLoad when p param is invalid base64', () => {
    mockUseSearchParams.mockReturnValue({ get: () => '!!!invalid!!!' });

    const onLoad = vi.fn();
    renderHook(() => useUrlSync({ palettes: [], onLoad }));

    expect(onLoad).not.toHaveBeenCalled();
  });

  it('calls replaceState when palettes change', () => {
    mockUseSearchParams.mockReturnValue({ get: () => null });

    const onLoad = vi.fn();
    const { rerender } = renderHook(({ palettes }) => useUrlSync({ palettes, onLoad }), {
      initialProps: { palettes: [mockPalette] },
    });

    expect(replaceState).toHaveBeenCalledTimes(1);

    const another = { ...mockPalette, id: 'test-2' };
    rerender({ palettes: [another] });
    expect(replaceState).toHaveBeenCalledTimes(2);
  });

  it('does not call replaceState when palettes are empty', () => {
    mockUseSearchParams.mockReturnValue({ get: () => null });

    const onLoad = vi.fn();
    renderHook(() => useUrlSync({ palettes: [], onLoad }));
    expect(replaceState).not.toHaveBeenCalled();
  });

  it('does not call replaceState when encoded value is unchanged', () => {
    mockUseSearchParams.mockReturnValue({ get: () => null });

    const onLoad = vi.fn();
    const { rerender } = renderHook(({ palettes }) => useUrlSync({ palettes, onLoad }), {
      initialProps: { palettes: [mockPalette] },
    });

    expect(replaceState).toHaveBeenCalledTimes(1);

    rerender({ palettes: [mockPalette] });
    expect(replaceState).toHaveBeenCalledTimes(1);
  });

  it('does not replaceState on mount when palettes come from URL', () => {
    const encoded = encodePalettes([mockPalette]);
    mockUseSearchParams.mockReturnValue({ get: () => encoded });

    const onLoad = vi.fn();
    renderHook(() => useUrlSync({ palettes: [mockPalette], onLoad }));

    expect(replaceState).not.toHaveBeenCalled();
  });
});
