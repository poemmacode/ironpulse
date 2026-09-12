"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import CategoryStats from "@/components/stats/category-stats";
import ProgressionCard from "@/components/stats/progression-card";
import Card, { CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";

interface WorkoutSet {
  exerciseId: string;
  exercise: { name: string; category: string };
  weightKg: number;
  reps: number;
}

interface Workout {
  totalVolume: number;
  xpEarned: number;
  sets: WorkoutSet[];
}

interface PersonalBest {
  id: string;
  weightKg: number;
  reps: number;
  achievedAt: string;
  exercise: { name: string; category: string };
}

export default function StatsPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutsRes, pbRes] = await Promise.all([
          fetch("/api/workouts"),
          fetch("/api/personal-bests"),
        ]);

        if (!workoutsRes.ok || !pbRes.ok) {
          router.push("/login");
          return;
        }

        const workoutsData = await workoutsRes.json();
        const pbData = await pbRes.json();

        setWorkouts(workoutsData.workouts ?? []);
        setPersonalBests(pbData.personalBests ?? []);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const categoryData = (() => {
    const map = new Map<string, { totalVolume: number; workoutCount: number }>();
    for (const w of workouts) {
      for (const s of w.sets) {
        const cat = s.exercise.category;
        const existing = map.get(cat) ?? { totalVolume: 0, workoutCount: 0 };
        existing.totalVolume += s.weightKg * s.reps;
        existing.workoutCount += 1;
        map.set(cat, existing);
      }
    }
    return Array.from(map.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));
  })();

  const latestExercises = (() => {
    const map = new Map<string, WorkoutSet>();
    for (const w of workouts) {
      for (const s of w.sets) {
        map.set(s.exerciseId, s);
      }
    }
    return Array.from(map.values());
  })();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 pt-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-lg space-y-6 px-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Stats
        </h1>

        <CategoryStats data={categoryData} />

        {latestExercises.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Recent Exercises
            </h2>
            {latestExercises.map((s) => (
              <ProgressionCard
                key={s.exerciseId}
                exerciseName={s.exercise.name}
                currentWeight={s.weightKg}
                previousWeight={null}
                estimated1RM={null}
                lastDate={new Date().toISOString()}
              />
            ))}
          </div>
        )}

        {personalBests.length > 0 && (
          <Card>
            <CardContent>
              <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Personal Bests
              </h2>
              <div className="space-y-2">
                {personalBests.map((pb) => (
                  <div
                    key={pb.id}
                    className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {pb.exercise.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {pb.reps} reps
                      </p>
                    </div>
                    <Badge variant="success">{pb.weightKg} kg</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Navbar />
    </div>
  );
}
