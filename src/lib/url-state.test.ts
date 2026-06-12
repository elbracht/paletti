import { describe, it, expect } from "vitest";
import { encodePalettes, decodePalettes } from "@/lib/url-state";
import { Palette } from "@/types/palette";
import { createDefaultColors } from "@/lib/palette";

const mockPalette: Palette = {
  id: "test-1",
  name: "Green",
  colors: createDefaultColors(),
};

describe("encodePalettes / decodePalettes", () => {
  it("round-trips a single palette", () => {
    const encoded = encodePalettes([mockPalette]);
    const decoded = decodePalettes(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded![0].id).toBe("test-1");
    expect(decoded![0].name).toBe("Green");
    expect(decoded![0].colors).toHaveLength(11);
  });

  it("round-trips multiple palettes", () => {
    const palettes = [
      mockPalette,
      { ...mockPalette, id: "test-2", name: "Blue" },
    ];
    const decoded = decodePalettes(encodePalettes(palettes));
    expect(decoded).toHaveLength(2);
    expect(decoded![1].name).toBe("Blue");
  });

  it("returns null for invalid input", () => {
    expect(decodePalettes("not-valid-base64!!!")).toBeNull();
  });

  it("produces a URL-safe string", () => {
    const encoded = encodePalettes([mockPalette]);
    expect(encoded).not.toContain(" ");
    expect(encoded).toMatch(/^[A-Za-z0-9+/=]+$/);
  });
});
