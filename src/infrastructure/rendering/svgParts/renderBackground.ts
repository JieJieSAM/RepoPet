import type { PetExpression } from "../../../domain/value-objects/PetExpression.js";

const paletteByExpression: Record<PetExpression, { start: string; end: string; accent: string }> = {
  happy: { start: "#D9F8E6", end: "#9DE7C2", accent: "#2D9B67" },
  sleepy: { start: "#F2F2F2", end: "#D9DDE8", accent: "#5B6685" },
  stressed: { start: "#FFEFD8", end: "#FFD4A8", accent: "#C46C26" },
  sick: { start: "#FBE4E8", end: "#F6BAC4", accent: "#B44058" },
  chaotic: { start: "#FFE4A7", end: "#FFC86B", accent: "#C46C26" },
  proud: { start: "#DDF1FF", end: "#A8D8FF", accent: "#246CA8" }
};

export const renderBackground = (
  width: number,
  height: number,
  expression: PetExpression
): string => {
  const palette = paletteByExpression[expression];

  return `
    <defs>
      <linearGradient id="cardGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.start}" />
        <stop offset="100%" stop-color="${palette.end}" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="20" fill="url(#cardGradient)" stroke="${palette.accent}" stroke-width="2" />
    <circle cx="${width - 70}" cy="42" r="24" fill="${palette.accent}" opacity="0.12" />
    <circle cx="${width - 120}" cy="28" r="12" fill="${palette.accent}" opacity="0.1" />
  `;
};
