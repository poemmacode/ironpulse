/**
 * Brzycki formula for estimating 1RM from submaximal lifts.
 *
 * 1RM = weight * (36 / (37 - reps))
 *
 * Valid range: 1-36 reps
 */
export function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (weightKg <= 0) {
    throw new Error("Weight must be greater than 0");
  }
  if (reps < 1 || reps > 36) {
    throw new Error("Reps must be between 1 and 36");
  }
  if (reps === 1) {
    return weightKg;
  }
  return Math.round(weightKg * (36 / (37 - reps)) * 100) / 100;
}
