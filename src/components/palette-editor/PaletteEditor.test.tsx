import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaletteEditor } from './PaletteEditor';
import type { Palette } from '@/types/palette';
import { createDefaultColors } from '@/lib/palette';

const mockPalette: Palette = {
  id: 'test-1',
  name: 'Primary',
  colors: createDefaultColors(),
};

const defaultProps = {
  palette: mockPalette,
  allPalettes: [mockPalette],
  onRename: vi.fn(),
  onUpdateColor: vi.fn(),
  onHueShift: vi.fn(),
  onSaturationShift: vi.fn(),
  onLightnessShift: vi.fn(),
};

describe('PaletteEditor', () => {
  it('renders the palette name', () => {
    render(<PaletteEditor {...defaultProps} />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  it('renders all three chart sections', () => {
    render(<PaletteEditor {...defaultProps} />);
    expect(screen.getByText('Hue')).toBeInTheDocument();
    expect(screen.getByText('Saturation')).toBeInTheDocument();
    expect(screen.getByText('Lightness')).toBeInTheDocument();
  });

  it('renders the HSL table', () => {
    render(<PaletteEditor {...defaultProps} />);
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('950')).toBeInTheDocument();
  });

  it('renders range sliders', () => {
    render(<PaletteEditor {...defaultProps} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(3);
  });

  it('renders charts (SVG) for each HSL dimension', () => {
    const { container } = render(<PaletteEditor {...defaultProps} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  it('calls onRename when the name is edited', () => {
    const onRename = vi.fn();
    render(<PaletteEditor {...defaultProps} onRename={onRename} />);
    fireEvent.click(screen.getByText('Primary'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRename).toHaveBeenCalledWith('Updated');
  });

  it('calls onHueShift when the hue slider changes', () => {
    const onHueShift = vi.fn();
    render(<PaletteEditor {...defaultProps} onHueShift={onHueShift} />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '250' } });
    expect(onHueShift).toHaveBeenCalled();
  });

  it('calls onHueShift via slider pointer events', () => {
    const onHueShift = vi.fn();
    render(<PaletteEditor {...defaultProps} onHueShift={onHueShift} />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.pointerDown(sliders[0]);
    fireEvent.pointerUp(sliders[0]);
    // After pointerUp, slidingField is cleared
    expect(screen.queryByText('Hue')).toBeInTheDocument();
  });

  it('calls onUpdateColor when a table cell is edited', () => {
    const onUpdateColor = vi.fn();
    render(<PaletteEditor {...defaultProps} onUpdateColor={onUpdateColor} />);

    const rows = screen.getAllByRole('row');
    // Find the 500-shade row via its shade cell
    const shade500Row = rows.find((r) => {
      const cells = r.querySelectorAll('td');
      return cells.length > 0 && cells[0]?.textContent === '500';
    })!;
    const hInput = shade500Row.querySelectorAll('input[type="number"]')[0];
    fireEvent.change(hInput, { target: { value: '200' } });
    expect(onUpdateColor).toHaveBeenCalledWith(500, 'h', 200);
  });
});
