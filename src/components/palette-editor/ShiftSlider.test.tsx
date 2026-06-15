import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShiftSlider } from './ShiftSlider';

describe('ShiftSlider', () => {
  it('renders a range input with the given value', () => {
    render(<ShiftSlider value={50} min={0} max={100} onChange={vi.fn()} />);
    const input = screen.getByRole('slider');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('50');
  });

  it('calls onChange when the value changes', () => {
    const onChange = vi.fn();
    render(<ShiftSlider value={50} min={0} max={100} onChange={onChange} />);
    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '75' } });
    expect(onChange).toHaveBeenCalledWith(75);
  });

  it('sets min and max attributes', () => {
    render(<ShiftSlider value={30} min={10} max={90} onChange={vi.fn()} />);
    const input = screen.getByRole('slider');
    expect(input).toHaveAttribute('min', '10');
    expect(input).toHaveAttribute('max', '90');
  });
});
