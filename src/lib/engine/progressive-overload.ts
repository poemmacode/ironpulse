import { calculateEstimated1RM } from "./brzycki";

type MuscleGroupCategory =
  | "Posterior Chain"
  | "Quad Dominant"
  | "Horizontal Push/Pull"
  | "Vertical Push/Pull"
  | "Core";

interface OverloadParams {
  exerciseName: string;
  category: MuscleGroupCategory;
  sets: Array<{
    setNumber: number;
    weightKg: number;
    reps: number;
    rir: number | null;
  }>;
  upperRepLimit: number;
}

interface OverloadRecommendation {
  exerciseName: string;
  currentWeightKg: number;
  currentReps: number;
  estimated1RM: number;
  recommendedWeightKg: number;
  recommendedReps: number;
  reason: string;
}

const LOWER_BODY_COMPOUNDS = [
  "Barbell Hip Thrust",
  "Conventional Deadlift",
  "Sumo Deadlift",
  "Barbell Back Squat",
  "Front Squat",
];

function isLowerBodyCompound(exerciseName: string): boolean {
  return LOWER_BODY_COMPOUNDS.some(
    (compound) => exerciseName.toLowerCase().includes(compound.toLowerCase())
  );
}

function getIncrementRange(exerciseName: string): {
  min: number;
  max: number;
} {
  if (isLowerBodyCompound(exerciseName)) {
    return { min: 2.5, max: 5.0 };
  }
  return { min: 1.25, max: 2.5 };
}

export function getOverloadRecommendation(
  params: OverloadParams
): OverloadRecommendation {
  const { exerciseName, category, sets, upperRepLimit } = params;

  if (sets.length === 0) {
    throw new Error("At least one set is required");
  }

  const firstSet = sets[0];
  const estimated1RM = calculateEstimated1RM(
    firstSet.weightKg,
    firstSet.reps
  );

  const increment = getIncrementRange(exerciseName);

  // Check if user hit upper rep limit with RIR >= 2
  const shouldProgress =
    firstSet.reps >= upperRepLimit &&
    firstSet.rir !== null &&
    firstSet.rir >= 2;

  if (shouldProgress) {
    // Try adding weight first
    const recommendedWeightKg = Math.round(
      (firstSet.weightKg + increment.min) * 4
    ) / 4; // Round to nearest 0.25kg

    return {
      exerciseName,
      currentWeightKg: firstSet.weightKg,
      currentReps: firstSet.reps,
      estimated1RM,
      recommendedWeightKg,
      recommendedReps: firstSet.reps,
      reason: `Hit ${firstSet.reps} reps (≥${upperRepLimit}) with RIR ${firstSet.rir} (≥2). Adding ${increment.min}kg.`,
    };
  }

  // Weight stays flat, prescribe +1 rep per set
  if (firstSet.reps < upperRepLimit) {
    return {
      exerciseName,
      currentWeightKg: firstSet.weightKg,
      currentReps: firstSet.reps,
      estimated1RM,
      recommendedWeightKg: firstSet.weightKg,
      recommendedReps: firstSet.reps + 1,
      reason: `Add 1 rep per set. Current: ${firstSet.reps} reps.`,
    };
  }

  // Default: maintain current load
  return {
    exerciseName,
    currentWeightKg: firstSet.weightKg,
    currentReps: firstSet.reps,
    estimated1RM,
    recommendedWeightKg: firstSet.weightKg,
    recommendedReps: firstSet.reps,
    reason: "Maintain current load. Focus on form and tempo.",
  };
}
