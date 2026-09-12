import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
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

    const workouts = await prisma.workout.findMany({
      where: { userId: user.id },
      include: {
        sets: {
          include: { exercise: true },
          orderBy: { setNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

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

    const exerciseNames = exercises.map((e) => e.name);
    const dbExercises = await prisma.exercise.findMany({
      where: { name: { in: exerciseNames } },
    });

    const exerciseMap = new Map(dbExercises.map((e) => [e.name, e]));

    const missingExercises = exerciseNames.filter(
      (name) => !exerciseMap.has(name)
    );
    if (missingExercises.length > 0) {
      return NextResponse.json(
        {
          error: "Unknown exercises",
          details: missingExercises,
        },
        { status: 400 }
      );
    }

    const allSets: Array<{ weightKg: number; reps: number }> = [];
    const workoutSetsData: Array<{
      exerciseId: string;
      setNumber: number;
      weightKg: number;
      reps: number;
      rir: number | null;
      estimated1RM: number;
    }> = [];

    for (const exercise of exercises) {
      const dbExercise = exerciseMap.get(exercise.name)!;

      for (const set of exercise.sets) {
        const estimated1RM = calculateEstimated1RM(set.weight_kg, set.reps);
        allSets.push({ weightKg: set.weight_kg, reps: set.reps });
        workoutSetsData.push({
          exerciseId: dbExercise.id,
          setNumber: set.set_number,
          weightKg: set.weight_kg,
          reps: set.reps,
          rir: set.rir ?? null,
          estimated1RM,
        });
      }
    }

    const { volumeLoad, xpEarned } = calcVolumeXP(allSets);

    const userProfile = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });

    const levelCheck = checkLevelUp(
      userProfile.level,
      userProfile.currentXp,
      userProfile.targetXp,
      xpEarned
    );

    const [workout] = await prisma.$transaction([
      prisma.workout.create({
        data: {
          userId: user.id,
          rawInput: JSON.stringify(body),
          notes: notes ?? null,
          totalVolume: volumeLoad,
          xpEarned,
          sets: {
            create: workoutSetsData,
          },
        },
        include: {
          sets: {
            include: { exercise: true },
            orderBy: { setNumber: "asc" },
          },
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          level: levelCheck.newLevel,
          currentXp: levelCheck.remainingXp,
          targetXp: levelCheck.newTargetXp,
        },
      }),
    ]);

    return NextResponse.json(
      {
        workout,
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
