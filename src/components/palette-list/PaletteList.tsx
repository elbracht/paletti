'use client';

import { useRef, useState } from 'react';
import { Palette } from '@/types/palette';
import { PaletteCard } from './PaletteCard';
import { AddPaletteButton } from './AddPaletteButton';

interface PaletteListProps {
  palettes: Palette[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onImport: (palettes: Palette[]) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function PaletteList({
  palettes,
  selectedId,
  onSelect,
  onAdd,
  onImport,
  onRename,
  onDelete,
  onReorder,
}: PaletteListProps) {
  const dragIndex = useRef<number | null>(null);
  const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function handleDragStart(e: React.DragEvent, index: number) {
    dragIndex.current = index;
    setActiveDragIndex(index);
    // Create a custom drag image that respects border-radius
    const el = e.currentTarget as HTMLElement;
    const ghost = el.cloneNode(true) as HTMLElement;
    ghost.style.position = 'fixed';
    ghost.style.top = '-1000px';
    ghost.style.width = `${el.offsetWidth}px`;
    ghost.style.borderRadius = '12px';
    ghost.style.overflow = 'hidden';
    ghost.style.pointerEvents = 'none';
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
    setActiveDragIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    dragIndex.current = null;
    setActiveDragIndex(null);
    setDragOverIndex(null);
  }

  return (
    <aside
      className="flex h-full w-72 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
      onDragOver={(e) => {
        e.preventDefault();
        if (palettes.length === 0) return;
        const firstCard = e.currentTarget.querySelector('[draggable]') as HTMLElement;
        const lastCard = e.currentTarget.querySelectorAll('[draggable]');
        const last = lastCard[lastCard.length - 1] as HTMLElement;
        if (firstCard && e.clientY < firstCard.getBoundingClientRect().top) {
          setDragOverIndex(0);
        } else if (last && e.clientY > last.getBoundingClientRect().bottom) {
          setDragOverIndex(palettes.length);
        }
      }}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
        <h1 className="flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          <svg viewBox="0 0 32 32" className="h-5 w-5 shrink-0">
            <rect width="32" height="32" rx="6" fill="#18181b" />
            <rect x="5" y="5" width="22" height="4" rx="1.5" fill="#E1EEFF" />
            <rect x="5" y="11" width="22" height="4" rx="1.5" fill="#B7D7FF" />
            <rect x="5" y="17" width="22" height="4" rx="1.5" fill="#74A9FF" />
            <rect x="5" y="23" width="22" height="4" rx="1.5" fill="#5078EB" />
          </svg>
          Paletti
        </h1>
        <AddPaletteButton onAdd={onAdd} onImport={onImport} />
      </div>

      <div
        className="flex-1 overflow-y-auto p-3"
        onDragOver={(e) => {
          e.preventDefault();
          if (palettes.length === 0) return;
          const firstCard = e.currentTarget.querySelector('[draggable]') as HTMLElement;
          const lastCard = e.currentTarget.querySelectorAll('[draggable]');
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
          <p className="mt-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
            No palettes yet.
            <br />
            Click &quot;+&quot; to get started.
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
                activeDragIndex === index ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {/* Line centered in the gap above (gap=8px → -5px centers a 2px line) */}
              {dragOverIndex === index && (
                <div
                  className="pointer-events-none absolute right-0 left-0 z-10 h-0.5 rounded-full bg-zinc-700 dark:bg-zinc-300"
                  style={{ top: index === 0 ? '-3px' : '-5px' }}
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
                <div
                  className="pointer-events-none absolute right-0 left-0 z-10 h-0.5 rounded-full bg-zinc-700 dark:bg-zinc-300"
                  style={{ bottom: '-5px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
