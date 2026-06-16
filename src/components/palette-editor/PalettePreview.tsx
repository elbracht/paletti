'use client';

import { useRef } from 'react';
import { Palette } from '@/types/palette';
import { hslToCss, hslToHex, hexToHsl } from '@/lib/color';

interface PalettePreviewProps {
  palette: Palette;
  onUpdateColor?: (shade: number, field: 'h' | 's' | 'l', value: number) => void;
}

export function PalettePreview({ palette, onUpdateColor }: PalettePreviewProps) {
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  function handleSwatchClick(shade: number) {
    inputRefs.current[shade]?.click();
  }

  function handleColorChange(shade: number, e: React.ChangeEvent<HTMLInputElement>) {
    if (!onUpdateColor) return;
    const hsl = hexToHsl(e.target.value);
    if (hsl) {
      onUpdateColor(shade, 'h', hsl[0]);
      onUpdateColor(shade, 's', hsl[1]);
      onUpdateColor(shade, 'l', hsl[2]);
    }
  }

  return (
    <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {palette.colors.map((c) => (
        <div key={c.shade} className="flex flex-1 flex-col items-stretch">
          <button
            onClick={() => handleSwatchClick(c.shade)}
            className="h-20 md:h-24 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500"
            style={{ backgroundColor: hslToCss(c.h, c.s, c.l) }}
            aria-label={`Edit color ${c.shade}`}
            type="button"
          />
          <span className="border-t border-zinc-200 py-1.5 text-center text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            {c.shade}
          </span>
          <input
            ref={(el) => {
              inputRefs.current[c.shade] = el;
            }}
            type="color"
            value={hslToHex(c.h, c.s, c.l)}
            onChange={(e) => handleColorChange(c.shade, e)}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}
