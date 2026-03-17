import type { PetStats } from "../value-objects/PetStats.js";

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export const derivePetLevel = (stats: PetStats): number => {
  const weightedScore = stats.growth * 0.55 + stats.mood * 0.35 + stats.health * 0.1;
  const rawLevel = 1 + Math.floor(weightedScore / 10);
  return clamp(rawLevel, 1, 10);
};
