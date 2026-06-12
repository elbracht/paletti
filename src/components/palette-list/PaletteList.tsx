"use client";

import { useRef, useState } from "react";
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
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function PaletteList({
  palettes,
  selectedId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  onReorder,
}: PaletteListProps) {
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function handleDragStart(e: React.DragEvent, index: number) {
    dragIndex.current = index;
    // Create a custom drag image that respects border-radius
    const el = e.currentTarget as HTMLElement;
    const ghost = el.cloneNode(true) as HTMLElement;
    ghost.style.position = "fixed";
    ghost.style.top = "-1000px";
    ghost.style.width = `${el.offsetWidth}px`;
    ghost.style.borderRadius = "12px";
    ghost.style.overflow = "hidden";
    ghost.style.pointerEvents = "none";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, el.offsetWidth / 2, el.offsetHeight / 2);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    // Use Y position within the element to decide before/after
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setDragOverIndex(e.clientY < midY ? index : index + 1);
  }

  function handleDrop(index: number) {
    if (dragIndex.current !== null) {
      const to = dragOverIndex ?? index;
      const adjusted = to > dragIndex.current ? to - 1 : to;
      if (adjusted !== dragIndex.current) {
        onReorder(dragIndex.current, adjusted);
      }
    }
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  return (
    <aside
      className="flex flex-col h-full bg-zinc-50 border-r border-zinc-200 w-72 shrink-0"
      onDragOver={(e) => {
        e.preventDefault();
        if (palettes.length === 0) return;
        const firstCard = e.currentTarget.querySelector("[draggable]") as HTMLElement;
        const lastCard = e.currentTarget.querySelectorAll("[draggable]");
        const last = lastCard[lastCard.length - 1] as HTMLElement;
        if (firstCard && e.clientY < firstCard.getBoundingClientRect().top) {
          setDragOverIndex(0);
        } else if (last && e.clientY > last.getBoundingClientRect().bottom) {
          setDragOverIndex(palettes.length);
        }
      }}
    >
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

      <div
        className="flex-1 overflow-y-auto p-3"
        onDragOver={(e) => {
          e.preventDefault();
          if (palettes.length === 0) return;
          const firstCard = e.currentTarget.querySelector("[draggable]") as HTMLElement;
          const lastCard = e.currentTarget.querySelectorAll("[draggable]");
          const last = lastCard[lastCard.length - 1] as HTMLElement;
          if (firstCard && e.clientY < firstCard.getBoundingClientRect().top) {
            setDragOverIndex(0);
          } else if (last && e.clientY > last.getBoundingClientRect().bottom) {
            setDragOverIndex(palettes.length);
          }
        }}
        onDrop={() => handleDrop(palettes.length - 1)}
      >
        {palettes.length === 0 && (
          <p className="text-sm text-zinc-400 text-center mt-8">
            No palettes yet.
            <br />
            Click "+ New" to get started.
          </p>
        )}
        <div className="flex flex-col gap-2">
          {palettes.map((palette, index) => (
            <div
              key={palette.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`relative transition-opacity ${
                dragIndex.current === index ? "opacity-40" : "opacity-100"
              }`}
            >
              {/* Line centered in the gap above (gap=8px → -5px centers a 2px line) */}
              {dragOverIndex === index && (
                <div
                  className="absolute left-0 right-0 h-0.5 rounded-full bg-zinc-700 pointer-events-none z-10"
                  style={{ top: index === 0 ? "-3px" : "-5px" }}
                />
              )}
              <PaletteCard
                palette={palette}
                isSelected={palette.id === selectedId}
                onSelect={() => onSelect(palette.id)}
                onRename={(name) => onRename(palette.id, name)}
                onDelete={() => onDelete(palette.id)}
              />
              {/* Line below last card */}
              {dragOverIndex === palettes.length && index === palettes.length - 1 && (
                <div className="absolute left-0 right-0 h-0.5 rounded-full bg-zinc-700 pointer-events-none z-10" style={{ bottom: "-5px" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
