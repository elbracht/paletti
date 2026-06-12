"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { Palette } from "@/types/palette";
import { PaletteName } from "./PaletteName";
import { hslToCss } from "@/lib/color";

interface PaletteCardProps {
  palette: Palette;
  isSelected: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

export function PaletteCard({
  palette,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: PaletteCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-xl border p-3 transition-all ${
        isSelected
          ? "border-zinc-700 bg-white shadow-md dark:border-zinc-400 dark:bg-zinc-800"
          : "border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500"
      }`}
    >
      {/* Color swatches */}
      <div className="flex rounded-lg overflow-hidden mb-2 h-8">
        {palette.colors.map((c) => (
          <div
            key={c.shade}
            className="flex-1"
            style={{ backgroundColor: hslToCss(c.h, c.s, c.l) }}
          />
        ))}
      </div>

      {/* Name + delete */}
      <div className="flex items-center justify-between gap-2">
        <PaletteName
          name={palette.name}
          onChange={onRename}
          className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500 text-xs px-1 cursor-pointer"
          title="Delete palette"
          aria-label="Delete palette"
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
}
