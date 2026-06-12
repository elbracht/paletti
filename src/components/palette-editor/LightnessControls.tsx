"use client";

interface LightnessControlsProps {
  onShift: (delta: number) => void;
}

const STEP = 2;

export function LightnessControls({ onShift }: LightnessControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-500">Shift all lightness</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onShift(-STEP)}
          className="w-7 h-7 rounded-full border border-zinc-300 text-zinc-600 hover:bg-zinc-100 flex items-center justify-center text-base leading-none transition-colors cursor-pointer"
          aria-label="Decrease lightness"
        >
          −
        </button>
        <button
          onClick={() => onShift(STEP)}
          className="w-7 h-7 rounded-full border border-zinc-300 text-zinc-600 hover:bg-zinc-100 flex items-center justify-center text-base leading-none transition-colors cursor-pointer"
          aria-label="Increase lightness"
        >
          +
        </button>
      </div>
    </div>
  );
}
