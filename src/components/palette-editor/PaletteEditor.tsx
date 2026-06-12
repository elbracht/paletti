"use client";

import { Palette } from "@/types/palette";
import { PaletteName } from "@/components/palette-list/PaletteName";
import { HslChart } from "./HslChart";
import { ShiftSlider } from "./HueShiftSlider";
import { HslTable } from "./HslTable";
import { ExportPanel } from "./ExportPanel";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PaletteEditorProps {
  palette: Palette;
  allPalettes: Palette[];
  onRename: (name: string) => void;
  onUpdateColor: (shade: number, field: "h" | "s" | "l", value: number) => void;
  onHueShift: (delta: number) => void;
  onSaturationShift: (delta: number) => void;
  onLightnessShift: (delta: number) => void;
}

function avg(values: number[]) {
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

function circularAvgHue(hues: number[]) {
  const toRad = (h: number) => (h * Math.PI) / 180;
  const sinMean = hues.reduce((s, h) => s + Math.sin(toRad(h)), 0) / hues.length;
  const cosMean = hues.reduce((s, h) => s + Math.cos(toRad(h)), 0) / hues.length;
  return Math.round(((Math.atan2(sinMean, cosMean) * 180) / Math.PI + 360) % 360);
}

export function PaletteEditor({
  palette,
  allPalettes,
  onRename,
  onUpdateColor,
  onHueShift,
  onSaturationShift,
  onLightnessShift,
}: PaletteEditorProps) {
  const hues = palette.colors.map((c) => c.h);
  const sats = palette.colors.map((c) => c.s);
  const lights = palette.colors.map((c) => c.l);

  const hueAvg = circularAvgHue(hues);
  const satAvg = avg(sats);
  const lightAvg = avg(lights);

  // Slider range: how far can we shift before the first value hits a boundary
  const hueSliderMin = hueAvg - Math.min(...hues);
  const hueSliderMax = hueAvg + (359 - Math.max(...hues));
  const satSliderMin = satAvg - Math.min(...sats);
  const satSliderMax = satAvg + (100 - Math.max(...sats));
  const lightSliderMin = lightAvg - Math.min(...lights);
  const lightSliderMax = lightAvg + (100 - Math.max(...lights));

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
        <PaletteName
          name={palette.name}
          onChange={onRename}
          className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
        />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ExportPanel palettes={allPalettes} />
        </div>
      </div>

      {/* Charts + Controls */}
      <div className="flex-1 px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Hue</p>
              <ShiftSlider
                value={hueAvg}
                min={hueSliderMin}
                max={hueSliderMax}
                onChange={(newAvg) => onHueShift(newAvg - hueAvg)}
              />
            </div>
            <HslChart
              colors={palette.colors}
              field="h"
              min={0}
              max={360}
              onChange={(shade, value) => onUpdateColor(shade, "h", value)}
            />
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Saturation</p>
              <ShiftSlider
                value={satAvg}
                min={satSliderMin}
                max={satSliderMax}
                onChange={(newAvg) => onSaturationShift(newAvg - satAvg)}
              />
            </div>
            <HslChart
              colors={palette.colors}
              field="s"
              min={0}
              max={100}
              onChange={(shade, value) => onUpdateColor(shade, "s", value)}
            />
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Lightness</p>
              <ShiftSlider
                value={lightAvg}
                min={lightSliderMin}
                max={lightSliderMax}
                onChange={(newAvg) => onLightnessShift(newAvg - lightAvg)}
              />
            </div>
            <HslChart
              colors={palette.colors}
              field="l"
              min={0}
              max={100}
              onChange={(shade, value) => onUpdateColor(shade, "l", value)}
            />
          </div>

          <HslTable colors={palette.colors} onChange={onUpdateColor} />
        </div>
      </div>
    </div>
  );
}
