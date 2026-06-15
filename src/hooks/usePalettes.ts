"use client";

import { useReducer, useCallback } from "react";
import { Palette } from "@/types/palette";
import {
  createPalette,
  applyHueShift,
  applySaturationShift,
  applyLightnessShift,
} from "@/lib/palette";
import { clamp } from "@/lib/color";

let idCounter = 0;
function newId() {
  return `palette-${Date.now()}-${++idCounter}`;
}

type Action =
  | { type: "ADD_PALETTE" }
  | { type: "DELETE_PALETTE"; id: string }
  | { type: "RENAME_PALETTE"; id: string; name: string }
  | { type: "SELECT_PALETTE"; id: string | null }
  | {
      type: "UPDATE_COLOR";
      paletteId: string;
      shade: number;
      field: "h" | "s" | "l";
      value: number;
    }
  | { type: "APPLY_HUE_SHIFT"; id: string; delta: number }
  | { type: "APPLY_SATURATION_SHIFT"; id: string; delta: number }
  | { type: "APPLY_LIGHTNESS_SHIFT"; id: string; delta: number }
  | { type: "SET_PALETTES"; palettes: Palette[] }
  | { type: "IMPORT_PALETTES"; palettes: Palette[] }
  | { type: "REORDER_PALETTES"; fromIndex: number; toIndex: number };

interface State {
  palettes: Palette[];
  selectedId: string | null;
  paletteCount: number;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_PALETTE": {
      const id = newId();
      const count = state.paletteCount + 1;
      const palette = createPalette(id);
      return {
        ...state,
        palettes: [...state.palettes, palette],
        selectedId: id,
        paletteCount: count,
      };
    }
    case "DELETE_PALETTE": {
      const palettes = state.palettes.filter((p) => p.id !== action.id);
      const selectedId =
        state.selectedId === action.id
          ? (palettes[palettes.length - 1]?.id ?? null)
          : state.selectedId;
      return { ...state, palettes, selectedId };
    }
    case "RENAME_PALETTE":
      return {
        ...state,
        palettes: state.palettes.map((p) =>
          p.id === action.id ? { ...p, name: action.name } : p,
        ),
      };
    case "SELECT_PALETTE":
      return { ...state, selectedId: action.id };
    case "UPDATE_COLOR":
      return {
        ...state,
        palettes: state.palettes.map((p) => {
          if (p.id !== action.paletteId) return p;
          return {
            ...p,
            colors: p.colors.map((c) =>
              c.shade === action.shade
                ? {
                    ...c,
                    [action.field]: clamp(
                      action.value,
                      0,
                      action.field === "h" ? 360 : 100,
                    ),
                  }
                : c,
            ),
          };
        }),
      };
    case "APPLY_HUE_SHIFT":
      return {
        ...state,
        palettes: state.palettes.map((p) =>
          p.id === action.id
            ? { ...p, colors: applyHueShift(p.colors, action.delta) }
            : p,
        ),
      };
    case "APPLY_SATURATION_SHIFT":
      return {
        ...state,
        palettes: state.palettes.map((p) =>
          p.id === action.id
            ? { ...p, colors: applySaturationShift(p.colors, action.delta) }
            : p,
        ),
      };
    case "APPLY_LIGHTNESS_SHIFT":
      return {
        ...state,
        palettes: state.palettes.map((p) =>
          p.id === action.id
            ? { ...p, colors: applyLightnessShift(p.colors, action.delta) }
            : p,
        ),
      };
    case "SET_PALETTES":
      return {
        ...state,
        palettes: action.palettes,
        selectedId: action.palettes[0]?.id ?? null,
        paletteCount: action.palettes.length,
      };
    case "IMPORT_PALETTES": {
      const merged = [...state.palettes, ...action.palettes];
      return {
        ...state,
        palettes: merged,
        selectedId: action.palettes[0]?.id ?? state.selectedId,
        paletteCount: merged.length,
      };
    }
    case "REORDER_PALETTES": {
      const palettes = [...state.palettes];
      const [moved] = palettes.splice(action.fromIndex, 1);
      palettes.splice(action.toIndex, 0, moved);
      return { ...state, palettes };
    }
    default:
      return state;
  }
}

export function usePalettes(initial?: Palette[]) {
  const [state, dispatch] = useReducer(reducer, {
    palettes: initial ?? [],
    selectedId: initial?.[0]?.id ?? null,
    paletteCount: initial?.length ?? 0,
  });

  const selectedPalette =
    state.palettes.find((p) => p.id === state.selectedId) ?? null;

  const addPalette = useCallback(() => dispatch({ type: "ADD_PALETTE" }), []);
  const deletePalette = useCallback(
    (id: string) => dispatch({ type: "DELETE_PALETTE", id }),
    [],
  );
  const renamePalette = useCallback(
    (id: string, name: string) =>
      dispatch({ type: "RENAME_PALETTE", id, name }),
    [],
  );
  const selectPalette = useCallback(
    (id: string | null) => dispatch({ type: "SELECT_PALETTE", id }),
    [],
  );
  const updateColor = useCallback(
    (paletteId: string, shade: number, field: "h" | "s" | "l", value: number) =>
      dispatch({ type: "UPDATE_COLOR", paletteId, shade, field, value }),
    [],
  );
  const applyHueShiftAction = useCallback(
    (id: string, delta: number) =>
      dispatch({ type: "APPLY_HUE_SHIFT", id, delta }),
    [],
  );
  const applySaturationShiftAction = useCallback(
    (id: string, delta: number) =>
      dispatch({ type: "APPLY_SATURATION_SHIFT", id, delta }),
    [],
  );
  const applyLightnessShiftAction = useCallback(
    (id: string, delta: number) =>
      dispatch({ type: "APPLY_LIGHTNESS_SHIFT", id, delta }),
    [],
  );
  const importPalettes = useCallback(
    (palettes: Palette[]) => dispatch({ type: "IMPORT_PALETTES", palettes }),
    [],
  );
  const reorderPalettes = useCallback(
    (fromIndex: number, toIndex: number) =>
      dispatch({ type: "REORDER_PALETTES", fromIndex, toIndex }),
    [],
  );
  const setPalettes = useCallback(
    (palettes: Palette[]) => dispatch({ type: "SET_PALETTES", palettes }),
    [],
  );

  return {
    palettes: state.palettes,
    selectedId: state.selectedId,
    selectedPalette,
    addPalette,
    deletePalette,
    renamePalette,
    selectPalette,
    updateColor,
    applyHueShift: applyHueShiftAction,
    applySaturationShift: applySaturationShiftAction,
    applyLightnessShift: applyLightnessShiftAction,
    importPalettes,
    reorderPalettes,
    setPalettes,
  };
}
