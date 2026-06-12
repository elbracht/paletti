"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCircleCheck, faUpRightFromSquare, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { Palette } from "@/types/palette";
import { hslToOklch } from "@/lib/color";

interface ExportPanelProps {
  palettes: Palette[];
}

export function ExportPanel({ palettes }: ExportPanelProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const css = palettes
    .map((palette) => {
      const name = palette.name.toLowerCase().replace(/\s+/g, "-");
      return palette.colors
        .map((c) => `  --color-${name}-${c.shade}: ${hslToOklch(c.h, c.s, c.l)};`)
        .join("\n");
    })
    .join("\n\n");

  const fullCss = `@theme {\n${css}\n}`;

  async function copy() {
    await navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
      >
        <FontAwesomeIcon icon={faUpRightFromSquare} className="text-xs" />
        Export
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
              <p className="text-sm font-semibold text-zinc-900">Export — Tailwind v4</p>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 overflow-y-auto flex-1">
              <pre className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-lg p-4 overflow-x-auto leading-5">
                {fullCss}
              </pre>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end px-5 py-4 border-t border-zinc-200 shrink-0">
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={copied ? faCircleCheck : faCopy} />
                {copied ? "Copied!" : "Copy CSS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
