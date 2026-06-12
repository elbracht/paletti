"use client";

import { usePalettes } from "@/hooks/usePalettes";
import { useUrlSync } from "@/hooks/useUrlSync";
import { PaletteList } from "@/components/palette-list/PaletteList";
import { PaletteEditor } from "@/components/palette-editor/PaletteEditor";

export default function AppContent() {
  const {
    palettes,
    selectedId,
    selectedPalette,
    addPalette,
    deletePalette,
    renamePalette,
    selectPalette,
    updateColor,
    applyHueShift,
    applySaturationShift,
    applyLightnessShift,
    reorderPalettes,
    setPalettes,
  } = usePalettes();

  useUrlSync({ palettes, onLoad: setPalettes });

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left column */}
      <PaletteList
        palettes={palettes}
        selectedId={selectedId}
        onSelect={selectPalette}
        onAdd={addPalette}
        onRename={renamePalette}
        onDelete={deletePalette}
        onReorder={reorderPalettes}
      />

      {/* Right column */}
      <main className="flex-1 overflow-hidden">
        {selectedPalette ? (
          <PaletteEditor
            key={selectedPalette.id}
            palette={selectedPalette}
            allPalettes={palettes}
            onRename={(name) => renamePalette(selectedPalette.id, name)}
            onUpdateColor={(shade, field, value) =>
              updateColor(selectedPalette.id, shade, field, value)
            }
            onHueShift={(delta) => applyHueShift(selectedPalette.id, delta)}
            onSaturationShift={(delta) =>
              applySaturationShift(selectedPalette.id, delta)
            }
            onLightnessShift={(delta) =>
              applyLightnessShift(selectedPalette.id, delta)
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            <p className="text-sm">Select a palette to start editing</p>
          </div>
        )}
      </main>
    </div>
  );
}
