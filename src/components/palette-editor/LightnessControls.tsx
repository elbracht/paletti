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
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
          aria-label="Decrease lightness"
        >
          −
        </button>
        <button
          onClick={() => onShift(STEP)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
          aria-label="Increase lightness"
        >
          +
        </button>
      </div>
    </div>
  );
}
