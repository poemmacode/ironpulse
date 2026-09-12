import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { calculateEstimated1RM } from "@/lib/engine/brzycki";
import { calcVolumeXP, checkLevelUp } from "@/lib/engine/gamification";

const SetInputSchema = z.object({
  set_number: z.number().int().min(1),
  weight_kg: z.number().min(0),
  reps: z.number().int().min(0),
  rir: z.number().int().min(0).max(10).nullable().optional(),
});

const ExerciseInputSchema = z.object({
  name: z.string().min(1),
  sets: z.array(SetInputSchema).min(1),
});

const WorkoutCreateSchema = z.object({
  exercises: z.array(ExerciseInputSchema).min(1),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*, sets:workout_sets(*, exercise:exercises(*))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ workouts });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = WorkoutCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { exercises, notes } = parsed.data;

    // Resolve exercises from DB
    const exerciseNames = exercises.map((e) => e.name);
    const { data: dbExercises, error: exError } = await supabase
      .from("exercises")
      .select("*")
      .in("name", exerciseNames);

    if (exError || !dbExercises) {
      return NextResponse.json(
        { error: "Failed to fetch exercises" },
        { status: 500 }
      );
    }

    const exerciseMap = new Map(dbExercises.map((e) => [e.name, e]));

    const missingExercises = exerciseNames.filter(
      (name) => !exerciseMap.has(name)
    );
    if (missingExercises.length > 0) {
      return NextResponse.json(
        { error: "Unknown exercises", details: missingExercises },
        { status: 400 }
      );
    }

    // Build sets data
    const allSets: Array<{ weightKg: number; reps: number }> = [];
    const workoutSetsData: Array<{
      exercise_id: string;
      set_number: number;
      weight_kg: number;
      reps: number;
      rir: number | null;
      estimated_1rm: number;
    }> = [];

    for (const exercise of exercises) {
      const dbExercise = exerciseMap.get(exercise.name)!;

      for (const set of exercise.sets) {
        const estimated1RM = calculateEstimated1RM(set.weight_kg, set.reps);
        allSets.push({ weightKg: set.weight_kg, reps: set.reps });
        workoutSetsData.push({
          exercise_id: dbExercise.id,
          set_number: set.set_number,
          weight_kg: set.weight_kg,
          reps: set.reps,
          rir: set.rir ?? null,
          estimated_1rm: estimated1RM,
        });
      }
    }

    const { volumeLoad, xpEarned } = calcVolumeXP(allSets);

    // Get user profile for level check
    const { data: userProfile } = await supabase
      .from("users")
      .select("level, current_xp, target_xp")
      .eq("id", user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const levelCheck = checkLevelUp(
      userProfile.level,
      userProfile.current_xp,
      userProfile.target_xp,
      xpEarned
    );

    // Create workout
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .insert({
        user_id: user.id,
        raw_input: JSON.stringify(body),
        notes: notes ?? null,
        total_volume: volumeLoad,
        xp_earned: xpEarned,
      })
      .select()
      .single();

    if (workoutError) {
      return NextResponse.json(
        { error: workoutError.message },
        { status: 500 }
      );
    }

    // Insert sets
    const setsWithWorkoutId = workoutSetsData.map((s) => ({
      ...s,
      workout_id: workout.id,
    }));

    const { error: setsError } = await supabase
      .from("workout_sets")
      .insert(setsWithWorkoutId);

    if (setsError) {
      return NextResponse.json({ error: setsError.message }, { status: 500 });
    }

    // Update user level
    await supabase
      .from("users")
      .update({
        level: levelCheck.newLevel,
        current_xp: levelCheck.remainingXp,
        target_xp: levelCheck.newTargetXp,
      })
      .eq("id", user.id);

    return NextResponse.json(
      {
        workout: { ...workout, sets: setsWithWorkoutId },
        xpEarned,
        levelUp: levelCheck.leveledUp
          ? {
              newLevel: levelCheck.newLevel,
              newTargetXp: levelCheck.newTargetXp,
            }
          : null,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
