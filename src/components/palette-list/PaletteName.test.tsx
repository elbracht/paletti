import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaletteName } from './PaletteName';

describe('PaletteName', () => {
  it('displays the given name', () => {
    render(<PaletteName name="My Palette" onChange={vi.fn()} />);
    expect(screen.getByText('My Palette')).toBeInTheDocument();
  });

  it('switches to an input on click', () => {
    render(<PaletteName name="Test" onChange={vi.fn()} />);
    fireEvent.click(screen.getByText('Test'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('commits the new name on Enter', () => {
    const onChange = vi.fn();
    render(<PaletteName name="Old" onChange={onChange} />);
    fireEvent.click(screen.getByText('Old'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('New');
  });

  it('reverts to the original name on Escape', () => {
    const onChange = vi.fn();
    render(<PaletteName name="Original" onChange={onChange} />);
    fireEvent.click(screen.getByText('Original'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Changed' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Original')).toBeInTheDocument();
  });

  it('commits on blur', () => {
    const onChange = vi.fn();
    render(<PaletteName name="Old" onChange={onChange} />);
    fireEvent.click(screen.getByText('Old'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith('Updated');
  });

  it('does not commit an empty name (reverts)', () => {
    const onChange = vi.fn();
    render(<PaletteName name="Keep" onChange={onChange} />);
    fireEvent.click(screen.getByText('Keep'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<PaletteName name="Styled" onChange={vi.fn()} className="custom-class" />);
    expect(screen.getByTitle('Click to rename')).toHaveClass('custom-class');
  });
});
