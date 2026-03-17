export const PET_STAGES = ["egg", "baby", "teen", "final"] as const;

export type PetStage = (typeof PET_STAGES)[number];
