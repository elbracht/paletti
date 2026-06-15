import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportPanel } from './ExportPanel';
import { createDefaultColors } from '@/lib/palette';
import type { Palette } from '@/types/palette';

const mockPalette: Palette = {
  id: 'test-1',
  name: 'Primary',
  colors: createDefaultColors(),
};

beforeEach(() => {
  vi.clearAllMocks();
  // Mock clipboard API
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

describe('ExportPanel', () => {
  it('renders the export button', () => {
    render(<ExportPanel palettes={[mockPalette]} />);
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('opens the export modal on click', () => {
    render(<ExportPanel palettes={[mockPalette]} />);
    fireEvent.click(screen.getByText('Export'));
    expect(screen.getByText('Export — Tailwind v4')).toBeInTheDocument();
  });

  it('displays the generated CSS in the modal', () => {
    render(<ExportPanel palettes={[mockPalette]} />);
    fireEvent.click(screen.getByText('Export'));
    expect(screen.getByText(/@theme/)).toBeInTheDocument();
    expect(screen.getByText(/--color-primary-\d+/)).toBeInTheDocument();
  });

  it('copies CSS to clipboard and shows confirmation', async () => {
    render(<ExportPanel palettes={[mockPalette]} />);
    fireEvent.click(screen.getByText('Export'));
    fireEvent.click(screen.getByText('Copy CSS'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('@theme'));

    // Wait for the copied state to appear
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
  });

  it('closes the modal via close button', () => {
    render(<ExportPanel palettes={[mockPalette]} />);
    fireEvent.click(screen.getByText('Export'));
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByText('Export — Tailwind v4')).not.toBeInTheDocument();
  });

  it('closes the modal when clicking the backdrop', () => {
    render(<ExportPanel palettes={[mockPalette]} />);
    fireEvent.click(screen.getByText('Export'));

    // Click the backdrop (the outermost div)
    const backdrop = screen.getByText('Export — Tailwind v4').closest('.fixed')!;
    fireEvent.mouseDown(backdrop);
    fireEvent.mouseUp(backdrop);

    expect(screen.queryByText('Export — Tailwind v4')).not.toBeInTheDocument();
  });

  it('generates correct CSS for multiple palettes', () => {
    const palette2: Palette = { ...mockPalette, id: 'test-2', name: 'Secondary' };
    render(<ExportPanel palettes={[mockPalette, palette2]} />);
    fireEvent.click(screen.getByText('Export'));

    const pre = screen.getByText(/@theme/).closest('pre')!;
    expect(pre.textContent).toContain('--color-primary-');
    expect(pre.textContent).toContain('--color-secondary-');
  });
});
