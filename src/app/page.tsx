"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/dashboard/profile-card";
import WorkoutSummary from "@/components/dashboard/workout-summary";
import Navbar from "@/components/layout/navbar";
import Button from "@/components/ui/button";
import { Dumbbell, BarChart3 } from "lucide-react";

interface Profile {
  name: string | null;
  level: number;
  currentXp: number;
  targetXp: number;
  streakDays: number;
}

interface WorkoutSet {
  set_number: number;
  weight_kg: number;
  reps: number;
  rir: number | null;
  exercise: { name: string; category: string };
}

interface Workout {
  id: string;
  total_volume: number;
  xp_earned: number;
  created_at: string;
  notes: string | null;
  sets: WorkoutSet[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestWorkout, setLatestWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, workoutsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/workouts"),
        ]);

        if (!profileRes.ok || !workoutsRes.ok) {
          router.push("/login");
          return;
        }

        const profileData = await profileRes.json();
        const workoutsData = await workoutsRes.json();

        setProfile(profileData.profile);
        setLatestWorkout(workoutsData.workouts?.[0] ?? null);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
        {profile && (
          <ProfileCard
            name={profile.name}
            level={profile.level}
            currentXp={profile.currentXp}
            targetXp={profile.targetXp}
            streakDays={profile.streakDays}
            compact
          />
        )}

        <WorkoutSummary workout={latestWorkout} />

        <div className="grid grid-cols-2 gap-3">
          <Link href="/workout" className="block">
            <Button size="lg" className="w-full gap-2">
              <Dumbbell className="h-5 w-5" />
              Log Workout
            </Button>
          </Link>
          <Link href="/stats" className="block">
            <Button variant="secondary" size="lg" className="w-full gap-2">
              <BarChart3 className="h-5 w-5" />
              View Stats
            </Button>
          </Link>
        </div>
      </div>
      <Navbar />
    </div>
  );
}
