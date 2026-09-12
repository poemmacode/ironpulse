import { NextRequest, NextResponse } from "next/server";
import { WorkoutParseInputSchema } from "@/lib/validations/workout";
import { calculateEstimated1RM } from "@/lib/engine/brzycki";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = WorkoutParseInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const exercises = parsed.data.exercises.map((exercise) => {
      const sets = exercise.sets.map((set) => {
        const estimated1RM =
          set.reps >= 1 ? calculateEstimated1RM(set.weight_kg, set.reps) : null;
        return {
          set_number: set.set_number,
          weight_kg: set.weight_kg,
          reps: set.reps,
          rir: set.rir ?? null,
          estimated_1rm: estimated1RM,
          notes: set.notes,
        };
      });

      const volumeLoad = sets.reduce(
        (total, set) => total + set.weight_kg * set.reps,
        0
      );
      const totalReps = sets.reduce((total, set) => total + set.reps, 0);

      return {
        name: exercise.name,
        muscle_group: exercise.muscle_group,
        sets,
        volume_load: volumeLoad,
        total_reps: totalReps,
      };
    });

    const totalVolume = exercises.reduce(
      (total, ex) => total + ex.volume_load,
      0
    );
    const totalReps = exercises.reduce(
      (total, ex) => total + ex.total_reps,
      0
    );

    return NextResponse.json({
      exercises,
      total_volume: totalVolume,
      total_reps: totalReps,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
