"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Palette } from "@/types/palette";
import { hslToOklch } from "@/lib/color";

interface ExportPanelProps {
  palette: Palette;
}

export function ExportPanel({ palette }: ExportPanelProps) {
  const [copied, setCopied] = useState(false);

  const name = palette.name.toLowerCase().replace(/\s+/g, "-");

  const css = palette.colors
    .map((c) => `  --color-${name}-${c.shade}: ${hslToOklch(c.h, c.s, c.l)};`)
    .join("\n");

  const fullCss = `@theme {\n${css}\n}`;

  async function copy() {
    await navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border-t border-zinc-200 pt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-zinc-700">
          Export (Tailwind v4)
        </p>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={copied ? faCircleCheck : faCopy} />
          {copied ? "Copied!" : "Copy CSS"}
        </button>
      </div>
      <pre className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-lg p-3 overflow-x-auto leading-5">
        {fullCss}
      </pre>
    </div>
  );
}
