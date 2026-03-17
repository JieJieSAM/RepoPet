import { describe, expect, it } from "vitest";
import { classifyRepositoryStyle } from "../../../src/domain/zoo/services/classifyRepositoryStyle.js";
import { zooRepositoryPetsFixture } from "../../fixtures/zoo/repositoryPets.js";

describe("classifyRepositoryStyle", () => {
  it("classifies active high-growth repos as 卷王型", () => {
    expect(classifyRepositoryStyle(zooRepositoryPetsFixture[0])).toBe("卷王型");
  });

  it("classifies chaotic/bugfix-heavy repos as 修补型", () => {
    expect(classifyRepositoryStyle(zooRepositoryPetsFixture[1])).toBe("修补型");
    expect(classifyRepositoryStyle(zooRepositoryPetsFixture[3])).toBe("修补型");
  });

  it("classifies dormant repos as 冬眠型", () => {
    expect(classifyRepositoryStyle(zooRepositoryPetsFixture[4])).toBe("冬眠型");
  });

  it("falls back to 养老型 when none of stronger rules match", () => {
    expect(classifyRepositoryStyle(zooRepositoryPetsFixture[2])).toBe("养老型");
  });
});
