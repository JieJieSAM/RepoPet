import type { PetStage } from "../value-objects/PetStage.js";

const STAGE_TITLES: Record<PetStage, string> = {
  egg: "Lint Egg",
  baby: "Commit Cub",
  teen: "Merge Sprite",
  final: "Release Beast"
};

export const derivePetTitle = (stage: PetStage, level: number): string => {
  const tier = level >= 8 ? "Prime" : level >= 5 ? "Adept" : "Rookie";
  return `${tier} ${STAGE_TITLES[stage]}`;
};
