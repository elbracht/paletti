import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaletteList } from './PaletteList';
import type { Palette } from '@/types/palette';
import { createDefaultColors } from '@/lib/palette';

function makePalette(id: string, name = 'Test'): Palette {
  return { id, name, colors: createDefaultColors() };
}

const defaultProps = {
  palettes: [] as Palette[],
  selectedId: null as string | null,
  onSelect: vi.fn(),
  onAdd: vi.fn(),
  onImport: vi.fn(),
  onRename: vi.fn(),
  onDelete: vi.fn(),
  onReorder: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PaletteList', () => {
  it('renders the header with logo and title', () => {
    render(<PaletteList {...defaultProps} />);
    expect(screen.getByText('Paletti')).toBeInTheDocument();
  });

  it('shows empty state when no palettes', () => {
    render(<PaletteList {...defaultProps} />);
    expect(screen.getByText(/No palettes yet/)).toBeInTheDocument();
  });

  it('renders palette cards', () => {
    render(<PaletteList {...defaultProps} palettes={[makePalette('a')]} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('marks a palette as selected', () => {
    render(
      <PaletteList
        {...defaultProps}
        palettes={[makePalette('a'), makePalette('b')]}
        selectedId="a"
      />,
    );
    const cards = screen.getAllByText('Test');
    const card = cards[0].closest('[draggable]')!;
    expect(card.className).toContain('opacity-100');
  });

  it('calls onSelect when a card is clicked', () => {
    const onSelect = vi.fn();
    render(<PaletteList {...defaultProps} palettes={[makePalette('a')]} onSelect={onSelect} />);
    const name = screen.getByText('Test');
    fireEvent.click(name);
    expect(onSelect).toHaveBeenCalledWith('a');
  });

  it('handles drag start and drop for reordering', () => {
    const onReorder = vi.fn();
    const palettes = [makePalette('a', 'First'), makePalette('b', 'Second')];

    const origGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      bottom: 100,
      left: 0,
      right: 300,
      width: 300,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));

    render(<PaletteList {...defaultProps} palettes={palettes} onReorder={onReorder} />);

    const items = screen.getAllByText(/First|Second/);
    const firstItem = items[0].closest('[draggable]')!;
    fireEvent.dragStart(firstItem, {
      dataTransfer: { setDragImage: vi.fn() },
      clientY: 10,
    });

    const secondItem = items[1].closest('[draggable]')!;
    fireEvent.dragOver(secondItem, { clientY: 90 });
    fireEvent.drop(secondItem);

    expect(onReorder).toHaveBeenCalledWith(0, 1);

    Element.prototype.getBoundingClientRect = origGetBoundingClientRect;
  });

  it('calls onDelete when delete is triggered', () => {
    const onDelete = vi.fn();
    const palette = makePalette('a');
    const { container } = render(
      <PaletteList {...defaultProps} palettes={[palette]} onDelete={onDelete} />,
    );

    const deleteBtn = container.querySelector('[title="Delete palette"]') as HTMLElement;
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith('a');
  });

  it('does not swap on drop at the same index', () => {
    const onReorder = vi.fn();
    const palettes = [makePalette('a', 'First'), makePalette('b', 'Second')];

    render(
      <PaletteList
        {...defaultProps}
        palettes={palettes}
        onReorder={onReorder}
      />,
    );

    const items = screen.getAllByText(/First|Second/);
    const firstItem = items[0].closest('[draggable]')!;

    fireEvent.dragStart(firstItem, {
      dataTransfer: { setDragImage: vi.fn() },
      clientY: 10,
    });
    fireEvent.dragOver(firstItem, { clientY: 10 });
    fireEvent.drop(firstItem);

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('shows drag-over line above the first card when hovering above the list', () => {
    const palettes = [makePalette('a', 'First')];

    const { container } = render(
      <PaletteList
        {...defaultProps}
        palettes={palettes}
        onReorder={vi.fn()}
      />,
    );

    const aside = container.querySelector('aside')!;
    const rect = aside.querySelector('[draggable]')!.getBoundingClientRect() as DOMRect;
    const scrollEl = aside.querySelector('.flex-1')!;

    // Drag over the aside, above the first card
    Object.defineProperty(scrollEl, 'getBoundingClientRect', {
      value: () => ({ top: 10, bottom: 110, left: 0, right: 300, width: 300, height: 100, x: 0, y: 0, toJSON: () => ({}) }),
    });
    Object.defineProperty(rect, 'top', { value: 50 });
    Object.defineProperty(rect, 'bottom', { value: 150 });

    fireEvent.dragStart(aside.querySelector('[draggable]')!, {
      dataTransfer: { setDragImage: vi.fn() },
      clientY: 10,
    });
  });
});
