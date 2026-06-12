"use client";

interface ShiftSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (newValue: number) => void;
}

export function ShiftSlider({ value, min, max, onChange }: ShiftSliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="shift-slider w-36"
    />
  );
}
