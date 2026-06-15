import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaletteCard } from './PaletteCard';
import type { Palette } from '@/types/palette';
import { createDefaultColors } from '@/lib/palette';

const mockPalette: Palette = {
  id: 'test-1',
  name: 'Test Palette',
  colors: createDefaultColors(),
};

describe('PaletteCard', () => {
  it('renders the palette name', () => {
    render(
      <PaletteCard
        palette={mockPalette}
        isSelected={false}
        onSelect={vi.fn()}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('Test Palette')).toBeInTheDocument();
  });

  it('calls onSelect when the card is clicked', () => {
    const onSelect = vi.fn();
    render(
      <PaletteCard
        palette={mockPalette}
        isSelected={false}
        onSelect={onSelect}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText('Test Palette').closest('div')!);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when the delete button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <PaletteCard
        palette={mockPalette}
        isSelected={false}
        onSelect={vi.fn()}
        onRename={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByLabelText('Delete palette'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('does not call onSelect when delete is clicked (stopPropagation)', () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();
    render(
      <PaletteCard
        palette={mockPalette}
        isSelected={false}
        onSelect={onSelect}
        onRename={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByLabelText('Delete palette'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renders 11 color swatches', () => {
    const { container } = render(
      <PaletteCard
        palette={mockPalette}
        isSelected={false}
        onSelect={vi.fn()}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    // The swatch container is a div with 11 flex-1 children
    const swatches = container.querySelector('.rounded-lg.overflow-hidden.mb-2')!;
    expect(swatches.children).toHaveLength(11);
  });

  it('applies selected styling when isSelected is true', () => {
    const { container } = render(
      <PaletteCard
        palette={mockPalette}
        isSelected={true}
        onSelect={vi.fn()}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('shadow-md');
  });
});
