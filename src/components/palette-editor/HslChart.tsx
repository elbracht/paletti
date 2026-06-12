"use client";

import { useRef, useState } from "react";
import { ColorStop } from "@/types/palette";
import { hslToCss, clamp } from "@/lib/color";

interface HslChartProps {
  colors: ColorStop[];
  field: "h" | "s" | "l";
  label: string;
  min: number;
  max: number;
  onChange: (shade: number, value: number) => void;
}

const VB_W = 600;
const VB_H = 192;
const PAD = { top: 16, bottom: 16, left: 40, right: 16 };
const CHART_W = VB_W - PAD.left - PAD.right;
const CHART_H = VB_H - PAD.top - PAD.bottom;
const DOT_RADIUS = 14;
const GRID_LINES = 5;

export function HslChart({ colors, field, label, min, max, onChange }: HslChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{ shade: number; value: number } | null>(null);

  function valueToY(value: number): number {
    return PAD.top + (1 - (value - min) / (max - min)) * CHART_H;
  }

  function dotX(index: number): number {
    return PAD.left + (index / (colors.length - 1)) * CHART_W;
  }

  function pointerToValue(e: React.PointerEvent<SVGSVGElement>): number {
    const rect = svgRef.current!.getBoundingClientRect();
    // Map screen Y to viewBox Y (Y scale = VB_H / rect.height)
    const vbY = (e.clientY - rect.top) * (VB_H / rect.height);
    const ratio = 1 - (vbY - PAD.top) / CHART_H;
    return clamp(Math.round(min + ratio * (max - min)), min, max);
  }

  function onPointerDown(e: React.PointerEvent<SVGElement>, shade: number, currentValue: number) {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging({ shade, value: currentValue });
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    const newValue = pointerToValue(e);
    setDragging((d) => (d ? { ...d, value: newValue } : null));
    onChange(dragging.shade, newValue);
  }

  return (
    <div>
      <p className="text-sm font-semibold text-zinc-700 mb-1">{label}</p>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height={VB_H}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}
        style={{ touchAction: "none" }}
      >
        {/* Grid lines */}
        {Array.from({ length: GRID_LINES + 1 }, (_, i) => {
          const value = min + ((max - min) * i) / GRID_LINES;
          const y = valueToY(value);
          return (
            <g key={i}>
              <line x1={PAD.left} x2={VB_W - PAD.right} y1={y} y2={y} stroke="#e4e4e7" strokeDasharray="4 4" />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#a1a1aa">
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {/* Connection line */}
        <polyline
          points={colors.map((c, i) => `${dotX(i)},${valueToY(c[field])}`).join(" ")}
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="1.5"
        />

        {/* Dots */}
        {colors.map((c, i) => {
          const x = dotX(i);
          const y = valueToY(c[field]);
          const isDragging = dragging?.shade === c.shade;
          return (
            <g key={c.shade}>
              <circle
                cx={x} cy={y} r={DOT_RADIUS}
                fill={hslToCss(c.h, c.s, c.l)}
                stroke={isDragging ? "#3f3f46" : "white"}
                strokeWidth={isDragging ? 2.5 : 2}
                style={{ cursor: "ns-resize" }}
                onPointerDown={(e) => onPointerDown(e, c.shade, c[field])}
              />
              {isDragging && (
                <text x={x} y={y - DOT_RADIUS - 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#3f3f46" style={{ pointerEvents: "none" }}>
                  {dragging.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
