import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PalettePreview } from './PalettePreview';
import type { Palette } from '@/types/palette';
import { createDefaultColors } from '@/lib/palette';

const mockPalette: Palette = {
  id: 'test-1',
  name: 'Test',
  colors: createDefaultColors(),
};

describe('PalettePreview', () => {
  it('renders all shade labels', () => {
    render(<PalettePreview palette={mockPalette} />);
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('600')).toBeInTheDocument();
    expect(screen.getByText('700')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
    expect(screen.getByText('900')).toBeInTheDocument();
    expect(screen.getByText('950')).toBeInTheDocument();
  });

  it('renders 11 color swatches', () => {
    const { container } = render(<PalettePreview palette={mockPalette} />);
    const swatches = container.querySelectorAll('.h-20');
    expect(swatches).toHaveLength(11);
  });
});
