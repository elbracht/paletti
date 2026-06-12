"use client";

import { useRef, useState, useEffect } from "react";
import { ColorStop } from "@/types/palette";
import { hslToCss, clamp } from "@/lib/color";

interface HslChartProps {
  colors: ColorStop[];
  field: "h" | "s" | "l";
  min: number;
  max: number;
  onChange: (shade: number, value: number) => void;
}

const CHART_H = 160;
const PAD = { top: 20, bottom: 20, left: 44, right: 16 };
const SVG_H = CHART_H + PAD.top + PAD.bottom;
const DOT_RADIUS = 12;
const DOT_OFFSET_X = DOT_RADIUS + 2; // extra inset so dots don't clip label/edge

const GRID_LINES = 5;

export function HslChart({ colors, field, min, max, onChange }: HslChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(600);
  const [dragging, setDragging] = useState<{ shade: number; value: number } | null>(null);
  const [hovering, setHovering] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const chartW = width - PAD.left - PAD.right;
  const dotAreaW = chartW - DOT_OFFSET_X * 2;

  function valueToY(value: number): number {
    return PAD.top + (1 - (value - min) / (max - min)) * CHART_H;
  }

  function dotX(index: number): number {
    return PAD.left + DOT_OFFSET_X + (index / (colors.length - 1)) * dotAreaW;
  }

  function pointerToValue(e: React.PointerEvent<SVGSVGElement>): number {
    const rect = svgRef.current!.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const ratio = 1 - (y - PAD.top) / CHART_H;
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
    <div ref={containerRef}>
      <svg
        ref={svgRef}
        width="100%"
        height={SVG_H}
        style={{ display: "block", touchAction: "none", overflow: "visible" }}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}
      >
        {/* Grid lines */}
        {Array.from({ length: GRID_LINES + 1 }, (_, i) => {
          const value = min + ((max - min) * i) / GRID_LINES;
          const y = valueToY(value);
          return (
            <g key={i}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y} y2={y} stroke="#e4e4e7" strokeDasharray="4 4" />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="12" fill="#a1a1aa">
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
          const isHovering = hovering === c.shade;
          const showLabel = isDragging || isHovering;
          return (
            <g key={c.shade}>
              <circle
                cx={x} cy={y} r={DOT_RADIUS}
                fill={hslToCss(c.h, c.s, c.l)}
                stroke={isDragging ? "#3f3f46" : "white"}
                strokeWidth={isDragging ? 2 : 1.5}
                style={{ cursor: "ns-resize" }}
                onPointerDown={(e) => onPointerDown(e, c.shade, c[field])}
                onPointerEnter={() => setHovering(c.shade)}
                onPointerLeave={() => setHovering(null)}
              />
              {showLabel && (
                <text
                  x={x}
                  y={y - DOT_RADIUS - 5}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill="#3f3f46"
                  style={{ pointerEvents: "none" }}
                >
                  {isDragging ? dragging.value : c[field]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
