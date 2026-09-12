"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WorkoutForm from "@/components/workout/workout-form";
import Navbar from "@/components/layout/navbar";

export default function NewWorkoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (exercises: { name: string; sets: { set_number: number; weight_kg: number; reps: number; rir: number | null }[] }[], notes: string) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercises, notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", message: data.error ?? "Failed to save workout" });
        return;
      }

      setFeedback({ type: "success", message: `Workout saved! +${data.xpEarned} XP` });
      setTimeout(() => router.push("/"), 1500);
    } catch {
      setFeedback({ type: "error", message: "Network error. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 pt-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-lg px-4">
        <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          New Workout
        </h1>

        {feedback && (
          <div
            className={`mb-4 rounded-xl p-4 text-sm font-medium ${
              feedback.type === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <WorkoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
      <Navbar />
    </div>
  );
}
