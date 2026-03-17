import type { PetExpression } from "../../../domain/value-objects/PetExpression.js";
import type { PetStage } from "../../../domain/value-objects/PetStage.js";

const sizeByStage: Record<PetStage, { bodyRadius: number; earSize: number }> = {
  egg: { bodyRadius: 34, earSize: 0 },
  baby: { bodyRadius: 40, earSize: 10 },
  teen: { bodyRadius: 48, earSize: 14 },
  final: { bodyRadius: 54, earSize: 18 }
};

const colorByExpression: Record<PetExpression, { body: string; outline: string; blush: string }> = {
  happy: { body: "#69C58F", outline: "#2C8E5A", blush: "#F6A8B8" },
  sleepy: { body: "#9BA9C7", outline: "#59637A", blush: "#D7B9D4" },
  stressed: { body: "#F0B06E", outline: "#A96823", blush: "#F5BD9F" },
  sick: { body: "#D57B8D", outline: "#8E3648", blush: "#E8A8B2" },
  chaotic: { body: "#F39B4A", outline: "#A85A0F", blush: "#FFD3A6" },
  proud: { body: "#5BA7E0", outline: "#245D8A", blush: "#F4B1C7" }
};

export const renderBody = (stage: PetStage, expression: PetExpression): string => {
  const size = sizeByStage[stage];
  const color = colorByExpression[expression];
  const bodyCx = 180;
  const bodyCy = 122;

  const ears =
    size.earSize > 0
      ? `
      <circle cx="${bodyCx - 24}" cy="${bodyCy - size.bodyRadius + 10}" r="${size.earSize}" fill="${color.body}" stroke="${color.outline}" stroke-width="3" />
      <circle cx="${bodyCx + 24}" cy="${bodyCy - size.bodyRadius + 10}" r="${size.earSize}" fill="${color.body}" stroke="${color.outline}" stroke-width="3" />
    `
      : "";

  return `
    ${ears}
    <circle cx="${bodyCx}" cy="${bodyCy}" r="${size.bodyRadius}" fill="${color.body}" stroke="${color.outline}" stroke-width="4" />
    <ellipse cx="${bodyCx}" cy="${bodyCy + 18}" rx="${Math.floor(size.bodyRadius * 0.65)}" ry="${Math.floor(
      size.bodyRadius * 0.42
    )}" fill="#FFFFFF" opacity="0.22" />
    <circle cx="${bodyCx - 20}" cy="${bodyCy + 8}" r="7" fill="${color.blush}" opacity="0.7" />
    <circle cx="${bodyCx + 20}" cy="${bodyCy + 8}" r="7" fill="${color.blush}" opacity="0.7" />
  `;
};
