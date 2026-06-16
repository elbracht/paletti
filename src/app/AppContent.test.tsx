import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppContent from './AppContent';
import { encodePalettes } from '@/lib/url-state';
import { createDefaultColors } from '@/lib/palette';
import type { Palette } from '@/types/palette';
import type { ReadonlyURLSearchParams } from 'next/navigation';

const mockPalette: Palette = {
  id: 'test-1',
  name: 'Primary',
  colors: createDefaultColors(),
};
const encoded = encodePalettes([mockPalette]);

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
}));

import { useSearchParams } from 'next/navigation';

const origPushState = window.history.pushState;
beforeEach(() => {
  vi.clearAllMocks();
  window.history.pushState = vi.fn();
});

afterEach(() => {
  window.history.pushState = origPushState;
});

describe('AppContent', () => {
  it('shows empty state when no palette is in URL', () => {
    render(<AppContent />);
    expect(screen.getByText('Select a palette to start editing')).toBeInTheDocument();
  });

  it('shows palette editor when a palette is loaded from URL', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(`p=${encoded}`) as unknown as ReadonlyURLSearchParams,
    );
    render(<AppContent />);
    expect(screen.getAllByText('Primary').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Hue')).toBeInTheDocument();
    expect(screen.getByText('Saturation')).toBeInTheDocument();
    expect(screen.getByText('Lightness')).toBeInTheDocument();
  });

  it('can add a palette when empty', () => {
    render(<AppContent />);
    fireEvent.click(screen.getByTitle('New palette'));
    expect(screen.getByText('Hue')).toBeInTheDocument();
  });

  it('renders the export panel', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(`p=${encoded}`) as unknown as ReadonlyURLSearchParams,
    );
    render(<AppContent />);
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('opens export modal and shows CSS', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(`p=${encoded}`) as unknown as ReadonlyURLSearchParams,
    );
    render(<AppContent />);
    fireEvent.click(screen.getByText('Export'));
    expect(screen.getByText('Export — Tailwind v4')).toBeInTheDocument();
    expect(screen.getByText(/@theme/)).toBeInTheDocument();
  });
});
