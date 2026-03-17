import type { PetStats } from "../../../domain/value-objects/PetStats.js";

interface StatLine {
  label: string;
  value: number;
  color: string;
}

const statLines = (stats: PetStats): StatLine[] => [
  { label: "Health", value: stats.health, color: "#2C8E5A" },
  { label: "Mood", value: stats.mood, color: "#246CA8" },
  { label: "Growth", value: stats.growth, color: "#A05B16" },
  { label: "Chaos", value: stats.chaos, color: "#B44058" }
];

export const renderStats = (stats: PetStats): string => {
  const rows = statLines(stats)
    .map((stat, index) => {
      const y = 74 + index * 32;
      const width = Math.max(0, Math.min(100, stat.value)) * 1.7;
      return `
        <text x="332" y="${y}" font-family="Verdana, sans-serif" font-size="12" fill="#1B1B1B">${stat.label}</text>
        <rect x="390" y="${y - 10}" width="170" height="12" rx="6" fill="#FFFFFF" opacity="0.55" />
        <rect x="390" y="${y - 10}" width="${width}" height="12" rx="6" fill="${stat.color}" />
        <text x="566" y="${y}" text-anchor="end" font-family="Verdana, sans-serif" font-size="12" fill="#1B1B1B">${stat.value}</text>
      `;
    })
    .join("");

  return `
    <rect x="316" y="48" width="258" height="150" rx="14" fill="#FFFFFF" opacity="0.35" />
    ${rows}
  `;
};
