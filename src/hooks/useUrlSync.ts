"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Palette } from "@/types/palette";
import { encodePalettes, decodePalettes } from "@/lib/url-state";

interface UseUrlSyncOptions {
  palettes: Palette[];
  onLoad: (palettes: Palette[]) => void;
}

export function useUrlSync({ palettes, onLoad }: UseUrlSyncOptions) {
  const searchParams = useSearchParams();
  const initialized = useRef(false);
  const lastEncoded = useRef<string | null>(null);

  // On mount: decode URL state and load palettes
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const p = searchParams.get("p");
    if (p) {
      lastEncoded.current = p;
      const decoded = decodePalettes(p);
      if (decoded) onLoad(decoded);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On palette change: encode and update URL via replaceState (no re-render)
  useEffect(() => {
    if (!initialized.current || palettes.length === 0) return;
    const encoded = encodePalettes(palettes);
    if (encoded === lastEncoded.current) return;
    lastEncoded.current = encoded;
    window.history.replaceState(null, "", `?p=${encoded}`);
  }, [palettes]);
}
