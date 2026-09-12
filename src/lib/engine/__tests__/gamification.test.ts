import { describe, it, expect } from "vitest";
import { calcVolumeXP, evaluateStreak, checkLevelUp } from "../gamification";

describe("calcVolumeXP", () => {
  it("calculates volume load correctly", () => {
    const result = calcVolumeXP([
      { weightKg: 100, reps: 10 },
      { weightKg: 100, reps: 8 },
    ]);
    // 100*10 + 100*8 = 1800
    expect(result.volumeLoad).toBe(1800);
  });

  it("calculates XP earned correctly", () => {
    const result = calcVolumeXP([
      { weightKg: 100, reps: 10 },
    ]);
    // XP = 1000/10 + 0*100 = 100
    expect(result.xpEarned).toBe(100);
  });

  it("adds PR bonus XP", () => {
    const result = calcVolumeXP(
      [{ weightKg: 100, reps: 10 }],
      2 // PR bonus
    );
    // XP = 1000/10 + 2*100 = 300
    expect(result.xpEarned).toBe(300);
  });
});

describe("evaluateStreak", () => {
  it("preserves streak for rest days", () => {
    const result = evaluateStreak(
      5,
      "2026-09-10",
      "2026-09-12",
      true, // isRestDay
      false
    );
    expect(result.streakContinues).toBe(true);
    expect(result.newStreakDays).toBe(5);
  });

  it("preserves streak for deload weeks", () => {
    const result = evaluateStreak(
      5,
      "2026-09-05",
      "2026-09-12",
      false,
      true // isDeloadWeek
    );
    expect(result.streakContinues).toBe(true);
    expect(result.newStreakDays).toBe(5);
  });

  it("increments streak for consecutive days", () => {
    const result = evaluateStreak(
      5,
      "2026-09-10",
      "2026-09-11",
      false,
      false
    );
    expect(result.streakContinues).toBe(true);
    expect(result.newStreakDays).toBe(6);
  });

  it("preserves streak for 2-day gap", () => {
    const result = evaluateStreak(
      5,
      "2026-09-09",
      "2026-09-11",
      false,
      false
    );
    expect(result.streakContinues).toBe(true);
    expect(result.newStreakDays).toBe(5);
  });

  it("resets streak for 3+ day gap", () => {
    const result = evaluateStreak(
      5,
      "2026-09-08",
      "2026-09-12",
      false,
      false
    );
    expect(result.streakContinues).toBe(false);
    expect(result.newStreakDays).toBe(0);
  });
});

describe("checkLevelUp", () => {
  it("levels up when XP exceeds target", () => {
    const result = checkLevelUp(1, 950, 1000, 100);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(2);
    expect(result.remainingXp).toBe(50);
  });

  it("does not level up when XP is below target", () => {
    const result = checkLevelUp(1, 500, 1000, 100);
    expect(result.leveledUp).toBe(false);
    expect(result.newLevel).toBe(1);
    expect(result.remainingXp).toBe(600);
  });

  it("handles multiple level ups", () => {
    const result = checkLevelUp(1, 0, 100, 500);
    expect(result.leveledUp).toBe(true);
    // 500-100=400, 400-120=280, 280-144=136, 136-172.8<0
    expect(result.newLevel).toBe(4);
    expect(result.remainingXp).toBe(136);
  });

  it("increases target by 20% per level", () => {
    const result = checkLevelUp(1, 950, 1000, 100);
    expect(result.newTargetXp).toBe(1200); // 1000 * 1.2
  });
});
