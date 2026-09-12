import { describe, it, expect } from "vitest";
import { getOverloadRecommendation } from "../progressive-overload";

describe("getOverloadRecommendation", () => {
  const baseParams = {
    category: "Quad Dominant" as const,
    sets: [
      { setNumber: 1, weightKg: 100, reps: 12, rir: 2 },
      { setNumber: 2, weightKg: 100, reps: 10, rir: 1 },
    ],
    upperRepLimit: 12,
  };

  it("recommends weight increase when hitting upper rep limit with RIR >= 2", () => {
    const result = getOverloadRecommendation({
      ...baseParams,
      exerciseName: "Barbell Back Squat",
    });
    expect(result.recommendedWeightKg).toBeGreaterThan(100);
    expect(result.reason).toContain("Adding");
  });

  it("prescribes +1 rep when weight stays flat", () => {
    const result = getOverloadRecommendation({
      ...baseParams,
      exerciseName: "Barbell Back Squat",
      sets: [
        { setNumber: 1, weightKg: 100, reps: 10, rir: 1 }, // below upperRepLimit
        { setNumber: 2, weightKg: 100, reps: 8, rir: 0 },
      ],
    });
    expect(result.recommendedReps).toBe(11);
    expect(result.recommendedWeightKg).toBe(100);
  });

  it("recommends larger increment for lower body compounds", () => {
    const result = getOverloadRecommendation({
      ...baseParams,
      exerciseName: "Barbell Hip Thrust",
    });
    // Lower body compound gets +2.5kg min
    expect(result.recommendedWeightKg).toBe(102.5);
  });

  it("recommends smaller increment for upper body", () => {
    const result = getOverloadRecommendation({
      ...baseParams,
      exerciseName: "Flat Barbell Bench Press",
      category: "Horizontal Push/Pull",
    });
    // Upper body gets +1.25kg min
    expect(result.recommendedWeightKg).toBe(101.25);
  });

  it("maintains current load when RIR < 2 and at upper rep limit", () => {
    const result = getOverloadRecommendation({
      ...baseParams,
      exerciseName: "Barbell Back Squat",
      sets: [
        { setNumber: 1, weightKg: 100, reps: 12, rir: 1 }, // at limit but RIR < 2
      ],
    });
    expect(result.recommendedWeightKg).toBe(100);
    expect(result.recommendedReps).toBe(12);
  });

  it("throws for empty sets", () => {
    expect(() =>
      getOverloadRecommendation({
        ...baseParams,
        exerciseName: "Test",
        sets: [],
      })
    ).toThrow("At least one set is required");
  });

  it("calculates estimated 1RM correctly", () => {
    const result = getOverloadRecommendation({
      ...baseParams,
      exerciseName: "Conventional Deadlift",
      sets: [
        { setNumber: 1, weightKg: 100, reps: 5, rir: 2 },
      ],
    });
    // Brzycki: 100 * (36 / 32) = 112.5
    expect(result.estimated1RM).toBe(112.5);
  });
});
