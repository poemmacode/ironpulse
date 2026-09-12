export interface VolumeXPResult {
  volumeLoad: number;
  xpEarned: number;
}

/**
 * Calculate volume load and XP earned for a workout.
 *
 * Volume Load = SUM(weight * reps) across all sets
 * XP Earned = (Volume Load / 10) + (PR Bonus * 100)
 */
export function calcVolumeXP(
  sets: Array<{ weightKg: number; reps: number }>,
  prBonus: number = 0
): VolumeXPResult {
  const volumeLoad = sets.reduce(
    (total, set) => total + set.weightKg * set.reps,
    0
  );

  const xpEarned = Math.round(volumeLoad / 10 + prBonus * 100);

  return { volumeLoad, xpEarned };
}

export interface StreakProtectionResult {
  streakContinues: boolean;
  newStreakDays: number;
  reason: string;
}

/**
 * Determine if streak should continue or reset.
 * Scheduled rest days and deload weeks do NOT reset streaks.
 */
export function evaluateStreak(
  currentStreak: number,
  lastWorkoutDate: string | Date,
  today: string | Date,
  isRestDay: boolean = false,
  isDeloadWeek: boolean = false
): StreakProtectionResult {
  const last = new Date(lastWorkoutDate);
  const current = new Date(today);
  const diffMs = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Rest days and deload weeks preserve streak
  if (isRestDay || isDeloadWeek) {
    return {
      streakContinues: true,
      newStreakDays: currentStreak,
      reason: isRestDay
        ? "Rest day — streak preserved."
        : "Deload week — streak preserved.",
    };
  }

  // Allow 1-day gap (yesterday was last workout)
  if (diffDays <= 1) {
    return {
      streakContinues: true,
      newStreakDays: currentStreak + 1,
      reason: "Workout logged — streak continues.",
    };
  }

  // 2-day gap: streak continues but no increment
  if (diffDays === 2) {
    return {
      streakContinues: true,
      newStreakDays: currentStreak,
      reason: "2-day gap — streak preserved (no increment).",
    };
  }

  // 3+ days gap: streak resets
  return {
    streakContinues: false,
    newStreakDays: 0,
    reason: `${diffDays}-day gap — streak reset.`,
  };
}

export interface LevelUpCheck {
  leveledUp: boolean;
  newLevel: number;
  newTargetXp: number;
  remainingXp: number;
}

/**
 * Check if user levels up after earning XP.
 * Each level requires targetXp XP. Level up resets XP progress.
 */
export function checkLevelUp(
  currentLevel: number,
  currentXp: number,
  targetXp: number,
  xpEarned: number
): LevelUpCheck {
  let totalXp = currentXp + xpEarned;
  let level = currentLevel;
  let target = targetXp;
  let leveledUp = false;

  while (totalXp >= target) {
    totalXp -= target;
    level += 1;
    target = Math.round(target * 1.2); // 20% more XP per level
    leveledUp = true;
  }

  return {
    leveledUp,
    newLevel: level,
    newTargetXp: target,
    remainingXp: totalXp,
  };
}
