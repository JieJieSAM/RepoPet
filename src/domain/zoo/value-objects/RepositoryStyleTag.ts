export const REPOSITORY_STYLE_TAGS = ["卷王型", "养老型", "修补型", "冬眠型", "稳定型"] as const;

export type RepositoryStyleTag = (typeof REPOSITORY_STYLE_TAGS)[number];
