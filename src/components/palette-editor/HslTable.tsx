"use client";

import { ColorStop } from "@/types/palette";
import { hslToCss } from "@/lib/color";

interface HslTableProps {
  colors: ColorStop[];
  onChange: (shade: number, field: "h" | "s" | "l", value: number) => void;
}

export function HslTable({ colors, onChange }: HslTableProps) {
  function handleInput(shade: number, field: "h" | "s" | "l", raw: string) {
    const val = parseInt(raw, 10);
    if (!isNaN(val)) onChange(shade, field, val);
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-zinc-400 text-xs">
          <th className="pb-2 text-left w-20" />
          <th className="pb-2 text-right font-medium">H</th>
          <th className="pb-2 text-right font-medium">S</th>
          <th className="pb-2 text-right font-medium">L</th>
        </tr>
      </thead>
      <tbody>
        {colors.map((c) => (
          <tr key={c.shade} className="border-t border-zinc-100">
            <td className="py-1 pr-3">
              <div
                className="rounded px-2 py-1 text-xs font-semibold text-center"
                style={{
                  backgroundColor: hslToCss(c.h, c.s, c.l),
                  color: c.l > 55 ? "#1a1a1a" : "#ffffff",
                  minWidth: "3rem",
                }}
              >
                {c.shade}
              </div>
            </td>
            {(["h", "s", "l"] as const).map((field) => (
              <td key={field} className="py-1 pl-2">
                <input
                  type="number"
                  value={Math.round(c[field])}
                  min={field === "h" ? 0 : 0}
                  max={field === "h" ? 360 : 100}
                  onChange={(e) => handleInput(c.shade, field, e.target.value)}
                  className="w-14 text-right text-zinc-700 bg-transparent hover:bg-zinc-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-300 rounded px-1 py-0.5 tabular-nums"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
