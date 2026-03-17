export const PET_EXPRESSIONS = ["happy", "sleepy", "stressed", "sick", "chaotic", "proud"] as const;

export type PetExpression = (typeof PET_EXPRESSIONS)[number];
