'use client';

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faCircleCheck,
  faUpRightFromSquare,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { Palette } from '@/types/palette';
import { hslToOklch } from '@/lib/color';

interface ExportPanelProps {
  palettes: Palette[];
}

export function ExportPanel({ palettes }: ExportPanelProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  const css = palettes
    .map((palette) => {
      const name = palette.name.toLowerCase().replace(/\s+/g, '-');
      return palette.colors
        .map((c) => `  --color-${name}-${c.shade}: ${hslToOklch(c.h, c.s, c.l)};`)
        .join('\n');
    })
    .join('\n\n');

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
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <FontAwesomeIcon icon={faUpRightFromSquare} className="text-xs" />
        Export
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onMouseDown={(e) => {
            mouseDownTarget.current = e.target;
          }}
          onMouseUp={(e) => {
            if (e.target === e.currentTarget && mouseDownTarget.current === e.currentTarget)
              setOpen(false);
          }}
        >
          <div className="mx-4 flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Export — Tailwind v4
              </p>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 overflow-y-auto flex-1">
              <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs leading-5 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                {fullCss}
              </pre>
            </div>

            {/* Modal footer */}
            <div className="flex shrink-0 items-center justify-end border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <button
                onClick={copy}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                <FontAwesomeIcon icon={copied ? faCircleCheck : faCopy} />
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
