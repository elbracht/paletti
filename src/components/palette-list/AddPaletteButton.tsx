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
      <div className="flex items-center bg-zinc-100 rounded-lg">
        <button
          onClick={onAdd}
          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-l-lg transition-colors cursor-pointer"
          title="New palette"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <div className="w-px h-4 bg-zinc-300" />
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-6 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded-r-lg transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 min-w-36">
                <button
                  onClick={openImport}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer"
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
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 shrink-0">
              <p className="text-sm font-semibold text-zinc-900">Import — Tailwind v4 CSS</p>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-3">
              <p className="text-xs text-zinc-500">
                Paste your Tailwind v4 <code className="bg-zinc-100 px-1 rounded">@theme</code> block containing <code className="bg-zinc-100 px-1 rounded">--color-*</code> variables in <code className="bg-zinc-100 px-1 rounded">oklch()</code> format.
              </p>
              <textarea
                className="w-full flex-1 min-h-48 text-xs font-mono text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-300"
                placeholder={"@theme {\n  --color-primary-50: oklch(97.8% 0.013 236.6);\n  --color-primary-100: oklch(95.2% 0.026 236.8);\n  ...\n}"}
                value={css}
                onChange={(e) => { setCss(e.target.value); setError(null); }}
                spellCheck={false}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="flex items-center justify-end px-5 py-4 border-t border-zinc-200 shrink-0">
              <button
                onClick={handleImport}
                disabled={!css.trim()}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
