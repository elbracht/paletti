"use client";

import { useState } from "react";
import { Palette } from "@/types/palette";
import { PaletteName } from "@/components/palette-list/PaletteName";
import { HslChart } from "./HslChart";
import { ShiftSlider } from "./HueShiftSlider";
import { HslTable } from "./HslTable";
import { ExportPanel } from "./ExportPanel";

interface PaletteEditorProps {
  palette: Palette;
  onRename: (name: string) => void;
  onUpdateColor: (shade: number, field: "h" | "s" | "l", value: number) => void;
  onHueShift: (delta: number) => void;
  onSaturationShift: (delta: number) => void;
  onLightnessShift: (delta: number) => void;
}

export function PaletteEditor({
  palette,
  onRename,
  onUpdateColor,
  onHueShift,
  onSaturationShift,
  onLightnessShift,
}: PaletteEditorProps) {
  const [hueShift, setHueShift] = useState(0);
  const [satShift, setSatShift] = useState(0);
  const [lightShift, setLightShift] = useState(0);

  function handleHueShift(newValue: number) {
    onHueShift(newValue - hueShift);
    setHueShift(newValue);
  }

  function handleSatShift(newValue: number) {
    onSaturationShift(newValue - satShift);
    setSatShift(newValue);
  }

  function handleLightShift(newValue: number) {
    onLightnessShift(newValue - lightShift);
    setLightShift(newValue);
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center px-6 h-14 border-b border-zinc-200 shrink-0">
        <div className="w-full max-w-3xl">
          <PaletteName
            name={palette.name}
            onChange={onRename}
            className="text-base font-semibold text-zinc-900"
          />
        </div>
      </div>

      {/* Charts + Controls */}
      <div className="flex-1 px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-6">
        <HslChart
          colors={palette.colors}
          field="h"
          label="Hue"
          min={0}
          max={360}
          onChange={(shade, value) => onUpdateColor(shade, "h", value)}
        />
        <ShiftSlider label="Hue shift" value={hueShift} min={-180} max={180} onChange={handleHueShift} />

        <HslChart
          colors={palette.colors}
          field="s"
          label="Saturation"
          min={0}
          max={100}
          onChange={(shade, value) => onUpdateColor(shade, "s", value)}
        />
        <ShiftSlider label="Saturation shift" value={satShift} min={-100} max={100} onChange={handleSatShift} />

        <HslChart
          colors={palette.colors}
          field="l"
          label="Lightness"
          min={0}
          max={100}
          onChange={(shade, value) => onUpdateColor(shade, "l", value)}
        />
        <ShiftSlider label="Lightness shift" value={lightShift} min={-100} max={100} onChange={handleLightShift} />

        <HslTable colors={palette.colors} onChange={onUpdateColor} />

        <ExportPanel palette={palette} />
        </div>
      </div>
    </div>
  );
}
