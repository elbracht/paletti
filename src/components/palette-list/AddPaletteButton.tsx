"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown, faFileImport, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { Palette } from "@/types/palette";
import { parseTailwindConfig } from "@/lib/import";

interface AddPaletteButtonProps {
  onAdd: () => void;
  onImport: (palettes: Palette[]) => void;
}

export function AddPaletteButton({ onAdd, onImport }: AddPaletteButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [css, setCss] = useState("");
  const [error, setError] = useState<string | null>(null);

  function openImport() {
    setDropdownOpen(false);
    setCss("");
    setError(null);
    setModalOpen(true);
  }

  function handleImport() {
    const result = parseTailwindConfig(css);
    if (!result) {
      setError("No valid color palettes found. Make sure your CSS contains --color-{name}-{shade}: oklch(...) variables.");
      return;
    }
    onImport(result);
    setModalOpen(false);
  }

  return (
    <>
      {/* Split button */}
      <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <button
          onClick={onAdd}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-lg text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700"
          title="New palette"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex h-8 w-6 cursor-pointer items-center justify-center rounded-r-lg text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full right-0 z-30 mt-1 min-w-36 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                <button
                  onClick={openImport}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <FontAwesomeIcon icon={faFileImport} className="text-zinc-400" />
                  Import CSS
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Import modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="mx-4 flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Import — Tailwind v4 CSS</p>
              <button
                onClick={() => setModalOpen(false)}
                className="cursor-pointer text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-3">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Paste your Tailwind v4 <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">@theme</code> block containing <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">--color-*</code> variables in <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">oklch()</code> format.
              </p>
              <textarea
                className="min-h-48 w-full flex-1 resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:focus:ring-zinc-600"
                placeholder={"@theme {\n  --color-primary-50: oklch(97.8% 0.013 236.6);\n  --color-primary-100: oklch(95.2% 0.026 236.8);\n  ...\n}"}
                value={css}
                onChange={(e) => { setCss(e.target.value); setError(null); }}
                spellCheck={false}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="flex shrink-0 items-center justify-end border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <button
                onClick={handleImport}
                disabled={!css.trim()}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Import palettes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
