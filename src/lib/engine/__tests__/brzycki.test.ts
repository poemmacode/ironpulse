import { describe, it, expect } from "vitest";
import { calculateEstimated1RM } from "../brzycki";

describe("calculateEstimated1RM", () => {
  it("returns weight directly for 1 rep", () => {
    expect(calculateEstimated1RM(100, 1)).toBe(100);
  });

  it("calculates 1RM for 5 reps at 100kg", () => {
    // 100 * (36 / 32) = 112.5
    expect(calculateEstimated1RM(100, 5)).toBe(112.5);
  });

  it("calculates 1RM for 10 reps at 80kg", () => {
    // 80 * (36 / 27) = 106.67
    expect(calculateEstimated1RM(80, 10)).toBe(106.67);
  });

  it("calculates 1RM for 12 reps at 90kg", () => {
    // 90 * (36 / 25) = 129.6
    expect(calculateEstimated1RM(90, 12)).toBe(129.6);
  });

  it("calculates 1RM for 36 reps", () => {
    expect(calculateEstimated1RM(50, 36)).toBe(1800);
  });

  it("throws for weight <= 0", () => {
    expect(() => calculateEstimated1RM(0, 5)).toThrow("Weight must be greater than 0");
    expect(() => calculateEstimated1RM(-10, 5)).toThrow("Weight must be greater than 0");
  });

  it("throws for reps < 1", () => {
    expect(() => calculateEstimated1RM(100, 0)).toThrow("Reps must be between 1 and 36");
    expect(() => calculateEstimated1RM(100, -1)).toThrow("Reps must be between 1 and 36");
  });

  it("throws for reps > 36", () => {
    expect(() => calculateEstimated1RM(100, 37)).toThrow("Reps must be between 1 and 36");
  });
});
