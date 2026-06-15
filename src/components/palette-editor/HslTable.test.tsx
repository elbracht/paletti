import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HslTable } from './HslTable';
import { createDefaultColors } from '@/lib/palette';

const colors = createDefaultColors();

describe('HslTable', () => {
  it('renders a row for each color stop', () => {
    render(<HslTable colors={colors} onChange={vi.fn()} />);
    const rows = screen.getAllByRole('row');
    // header row + 11 color rows
    expect(rows).toHaveLength(12);
  });

  it('displays the shade value in each row', () => {
    render(<HslTable colors={colors} onChange={vi.fn()} />);
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('950')).toBeInTheDocument();
  });

  it('calls onChange when an HSL input changes', () => {
    const onChange = vi.fn();
    render(<HslTable colors={colors} onChange={onChange} />);

    // Find the H input for shade 500
    const rows = screen.getAllByRole('row');
    const shade500Row = rows.find((r) => r.querySelector('td')?.textContent === '500')!;
    const inputs = shade500Row.querySelectorAll('input[type="number"]');
    const hInput = inputs[0];

    fireEvent.change(hInput, { target: { value: '200' } });
    expect(onChange).toHaveBeenCalledWith(500, 'h', 200);
  });

  it('does not call onChange for non-numeric input (NaN)', () => {
    const onChange = vi.fn();
    render(<HslTable colors={colors} onChange={onChange} />);

    const rows = screen.getAllByRole('row');
    const shade500Row = rows.find((r) => r.querySelector('td')?.textContent === '500')!;
    const hInput = shade500Row.querySelectorAll('input[type="number"]')[0];

    fireEvent.change(hInput, { target: { value: '' } });
    expect(onChange).not.toHaveBeenCalled();
  });
});
