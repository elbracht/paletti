import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddPaletteButton } from './AddPaletteButton';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AddPaletteButton', () => {
  it('renders the add button', () => {
    render(<AddPaletteButton onAdd={vi.fn()} onImport={vi.fn()} />);
    expect(screen.getByTitle('New palette')).toBeInTheDocument();
  });

  it('calls onAdd when the plus button is clicked', () => {
    const onAdd = vi.fn();
    render(<AddPaletteButton onAdd={onAdd} onImport={vi.fn()} />);
    fireEvent.click(screen.getByTitle('New palette'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('opens dropdown on chevron click', () => {
    render(<AddPaletteButton onAdd={vi.fn()} onImport={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(screen.getByText('Import CSS')).toBeInTheDocument();
  });

  it('opens the import modal from dropdown', () => {
    render(<AddPaletteButton onAdd={vi.fn()} onImport={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '' }));
    fireEvent.click(screen.getByText('Import CSS'));
    expect(screen.getByText('Import — Tailwind v4 CSS')).toBeInTheDocument();
  });

  it('calls onImport with parsed palettes and closes modal', () => {
    const onImport = vi.fn();
    render(<AddPaletteButton onAdd={vi.fn()} onImport={onImport} />);

    fireEvent.click(screen.getByRole('button', { name: '' }));
    fireEvent.click(screen.getByText('Import CSS'));

    const textarea = screen.getByRole('textbox');
    const validCss =
      '--color-primary-500: oklch(72.4% 0.105 239.6);\n--color-primary-600: oklch(62.4% 0.129 240.8);';
    fireEvent.change(textarea, { target: { value: validCss } });

    fireEvent.click(screen.getByText('Import palettes'));

    expect(onImport).toHaveBeenCalledTimes(1);
    expect(onImport).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'Primary' })]),
    );
  });

  it('shows error for invalid CSS', () => {
    render(<AddPaletteButton onAdd={vi.fn()} onImport={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '' }));
    fireEvent.click(screen.getByText('Import CSS'));

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'body { color: red; }' } });

    fireEvent.click(screen.getByText('Import palettes'));
    expect(screen.getByText(/No valid color palettes found/)).toBeInTheDocument();
  });

  it('disables the import button when textarea is empty', () => {
    render(<AddPaletteButton onAdd={vi.fn()} onImport={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '' }));
    fireEvent.click(screen.getByText('Import CSS'));

    expect(screen.getByText('Import palettes')).toBeDisabled();
  });

  it('closes modal via backdrop click', () => {
    render(<AddPaletteButton onAdd={vi.fn()} onImport={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '' }));
    fireEvent.click(screen.getByText('Import CSS'));

    const backdrop = screen.getByText('Import — Tailwind v4 CSS').closest('.fixed')!;
    fireEvent.click(backdrop);

    expect(screen.queryByText('Import — Tailwind v4 CSS')).not.toBeInTheDocument();
  });

  it('closes dropdown via backdrop click', () => {
    render(<AddPaletteButton onAdd={vi.fn()} onImport={vi.fn()} />);

    // Open dropdown
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(screen.getByText('Import CSS')).toBeInTheDocument();

    // Click the dropdown backdrop
    const dropdownBackdrop = screen
      .getByText('Import CSS')
      .closest('.relative')!
      .querySelector('.fixed')!;
    fireEvent.click(dropdownBackdrop);

    expect(screen.queryByText('Import CSS')).not.toBeInTheDocument();
  });

  it('closes modal via close button (X)', () => {
    render(<AddPaletteButton onAdd={vi.fn()} onImport={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '' }));
    fireEvent.click(screen.getByText('Import CSS'));

    // Find the close button inside the modal (it's the one with faXmark icon)
    const closeBtn = screen
      .getByText('Import — Tailwind v4 CSS')
      .closest('.rounded-2xl')!
      .querySelectorAll('button');
    const xButton = Array.from(closeBtn).find((btn) =>
      btn.querySelector('.svg-inline--fa.fa-xmark'),
    )!;
    fireEvent.click(xButton);

    expect(screen.queryByText('Import — Tailwind v4 CSS')).not.toBeInTheDocument();
  });
});
