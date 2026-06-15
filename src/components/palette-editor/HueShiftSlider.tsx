"use client";

interface ShiftSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (newValue: number) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLInputElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLInputElement>) => void;
}

export function ShiftSlider({ value, min, max, onChange, onPointerDown, onPointerUp }: ShiftSliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="shift-slider w-36"
    />
  );
}
