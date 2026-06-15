'use client';

import { ColorStop } from '@/types/palette';
import { hslToCss } from '@/lib/color';

interface HslTableProps {
  colors: ColorStop[];
  onChange: (shade: number, field: 'h' | 's' | 'l', value: number) => void;
}

export function HslTable({ colors, onChange }: HslTableProps) {
  function handleInput(shade: number, field: 'h' | 's' | 'l', raw: string) {
    const val = parseInt(raw, 10);
    if (!isNaN(val)) onChange(shade, field, val);
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-zinc-400 dark:text-zinc-500">
          <th className="pb-2 text-left w-20" />
          <th className="pb-2 text-left font-medium pl-2">H</th>
          <th className="pb-2 text-left font-medium pl-2">S</th>
          <th className="pb-2 text-left font-medium pl-2">L</th>
        </tr>
      </thead>
      <tbody>
        {colors.map((c) => (
          <tr key={c.shade} className="border-t border-zinc-100 dark:border-zinc-800">
            <td className="py-1 pr-3">
              <div
                className="rounded px-2 py-1 text-xs font-semibold text-center"
                style={{
                  backgroundColor: hslToCss(c.h, c.s, c.l),
                  color: c.l > 55 ? '#1a1a1a' : '#ffffff',
                  minWidth: '3rem',
                }}
              >
                {c.shade}
              </div>
            </td>
            {(['h', 's', 'l'] as const).map((field) => (
              <td key={field} className="py-1 pl-2">
                <input
                  type="number"
                  value={Math.round(c[field])}
                  min={0}
                  max={field === 'h' ? 360 : 100}
                  onChange={(e) => handleInput(c.shade, field, e.target.value)}
                  className="w-full rounded bg-transparent px-1 py-0.5 text-left tabular-nums text-zinc-700 hover:bg-zinc-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
