'use client';

import { Palette } from '@/types/palette';
import { hslToCss } from '@/lib/color';

interface PalettePreviewProps {
  palette: Palette;
}

export function PalettePreview({ palette }: PalettePreviewProps) {
  return (
    <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {palette.colors.map((c) => (
        <div key={c.shade} className="flex flex-1 flex-col items-stretch">
          <div className="h-20 md:h-24" style={{ backgroundColor: hslToCss(c.h, c.s, c.l) }} />
          <span className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-1.5 border-t border-zinc-200 dark:border-zinc-800">
            {c.shade}
          </span>
        </div>
      ))}
    </div>
  );
}
