import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppContent from './AppContent';
import { encodePalettes } from '@/lib/url-state';
import { createDefaultColors } from '@/lib/palette';
import type { Palette } from '@/types/palette';

const mockPalette: Palette = {
  id: 'test-1',
  name: 'Primary',
  colors: createDefaultColors(),
};
const encoded = encodePalettes([mockPalette]);

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => new URLSearchParams(`p=${encoded}`)),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
}));

const origPushState = window.history.pushState;
beforeEach(() => {
  vi.clearAllMocks();
  window.history.pushState = vi.fn();
});

afterEach(() => {
  window.history.pushState = origPushState;
});

describe('AppContent', () => {
  it('renders the app layout', () => {
    render(<AppContent />);
    expect(screen.getByText('Paletti')).toBeInTheDocument();
  });

  it('shows palette editor with charts when a palette is loaded', () => {
    render(<AppContent />);
    // Primary appears in both sidebar and editor header
    expect(screen.getAllByText('Primary').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Hue')).toBeInTheDocument();
    expect(screen.getByText('Saturation')).toBeInTheDocument();
    expect(screen.getByText('Lightness')).toBeInTheDocument();
  });

  it('can click the add palette button', () => {
    render(<AppContent />);
    fireEvent.click(screen.getByTitle('New palette'));
    // After adding, we should see at least the original "Primary" and a new palette
    expect(screen.getByText('Primary')).toBeInTheDocument();
    // The editor should still be visible (new palette auto-selected)
    expect(screen.getByText('Hue')).toBeInTheDocument();
  });

  it('renders the export panel', () => {
    render(<AppContent />);
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('opens export modal and shows CSS', () => {
    render(<AppContent />);
    fireEvent.click(screen.getByText('Export'));
    expect(screen.getByText('Export — Tailwind v4')).toBeInTheDocument();
    expect(screen.getByText(/@theme/)).toBeInTheDocument();
  });
});
