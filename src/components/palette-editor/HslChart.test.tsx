import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HslChart } from './HslChart';
import { createDefaultColors } from '@/lib/palette';

const colors = createDefaultColors();

beforeEach(() => {
  vi.clearAllMocks();
});

const defaultProps = {
  colors,
  field: 'h' as const,
  min: 0,
  max: 360,
  onChange: vi.fn(),
};

describe('HslChart', () => {
  it('renders an SVG chart', () => {
    const { container } = render(<HslChart {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders 11 dots (one per color stop)', () => {
    const { container } = render(<HslChart {...defaultProps} />);
    const dots = container.querySelectorAll('circle');
    expect(dots).toHaveLength(11);
  });

  it('renders 6 grid lines (5 intervals + 1)', () => {
    const { container } = render(<HslChart {...defaultProps} />);
    const lines = container.querySelectorAll('line');
    expect(lines).toHaveLength(6);
  });

  it('renders grid labels', () => {
    render(<HslChart {...defaultProps} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('360')).toBeInTheDocument();
  });

  it('connects dots with a polyline', () => {
    const { container } = render(<HslChart {...defaultProps} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
  });

  it('calls onChange when dragging a dot', () => {
    const onChange = vi.fn();
    const { container } = render(<HslChart {...defaultProps} onChange={onChange} />);

    const dot = container.querySelectorAll('circle')[5];
    // Mock setPointerCapture on the SVG target
    const target = dot;
    Object.defineProperty(target, 'setPointerCapture', {
      value: vi.fn(),
      writable: true,
    });

    fireEvent.pointerDown(dot, { pointerId: 1, clientY: 100 });

    const svg = container.querySelector('svg')!;
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
      right: 600,
      bottom: 200,
      width: 600,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(svg, { clientY: 80 });
    expect(onChange).toHaveBeenCalled();
  });

  it('shows labels when showAllLabels is true', () => {
    const { container } = render(<HslChart {...defaultProps} showAllLabels={true} />);
    const texts = container.querySelectorAll('text');
    // 6 grid labels + 11 values + 11 shade labels = 28
    expect(texts).toHaveLength(28);
    for (const c of colors) {
      expect(screen.getByText(String(c.shade))).toBeInTheDocument();
    }
  });

  it('shows a label on hover', () => {
    const { container } = render(<HslChart {...defaultProps} />);
    const dot = container.querySelectorAll('circle')[0];
    fireEvent.pointerEnter(dot);
    expect(screen.getByText(String(colors[0].shade))).toBeInTheDocument();
    expect(screen.getByText(`${colors[0].h}°`)).toBeInTheDocument();
  });

  it('hides label on pointer leave', () => {
    const { container } = render(<HslChart {...defaultProps} />);
    const dot = container.querySelectorAll('circle')[0];
    fireEvent.pointerEnter(dot);
    fireEvent.pointerLeave(dot);
    expect(screen.queryByText(String(colors[0].shade))).not.toBeInTheDocument();
    expect(screen.queryByText(`${colors[0].h}°`)).not.toBeInTheDocument();
  });

  it('clears drag state on svg pointer up', () => {
    const { container } = render(<HslChart {...defaultProps} />);
    const svg = container.querySelector('svg')!;
    const dot = container.querySelectorAll('circle')[5];

    Object.defineProperty(dot, 'setPointerCapture', { value: vi.fn(), writable: true });

    fireEvent.pointerDown(dot, { pointerId: 1, clientY: 100 });
    fireEvent.pointerUp(svg);

    // After pointerUp, dragging is null, so further pointerMove does not call onChange
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
      right: 600,
      bottom: 200,
      width: 600,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    const onChange = defaultProps.onChange;
    vi.clearAllMocks();
    fireEvent.pointerMove(svg, { clientY: 80 });
    expect(onChange).not.toHaveBeenCalled();
  });
});
