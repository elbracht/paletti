"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Palette } from "@/types/palette";
import { PaletteCard } from "./PaletteCard";

interface PaletteListProps {
  palettes: Palette[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function PaletteList({
  palettes,
  selectedId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}: PaletteListProps) {
  return (
    <aside className="flex flex-col h-full bg-zinc-50 border-r border-zinc-200 w-72 shrink-0">
      <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-200 shrink-0">
        <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
          Paletti
        </h1>
        <button
          onClick={onAdd}
          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {palettes.length === 0 && (
          <p className="text-sm text-zinc-400 text-center mt-8">
            No palettes yet.
            <br />
            Click "+ New" to get started.
          </p>
        )}
        {palettes.map((palette) => (
          <PaletteCard
            key={palette.id}
            palette={palette}
            isSelected={palette.id === selectedId}
            onSelect={() => onSelect(palette.id)}
            onRename={(name) => onRename(palette.id, name)}
            onDelete={() => onDelete(palette.id)}
          />
        ))}
      </div>
    </aside>
  );
}
