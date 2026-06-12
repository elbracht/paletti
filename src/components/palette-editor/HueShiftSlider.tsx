"use client";

interface ShiftSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function ShiftSlider({ label, value, min, max, onChange }: ShiftSliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-zinc-700">{label}</p>
        <span className="text-sm text-zinc-500 tabular-nums">
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-zinc-700 cursor-pointer"
      />
    </div>
  );
}
