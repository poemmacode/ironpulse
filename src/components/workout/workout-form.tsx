"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardHeader, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface SetInput {
  set_number: number;
  weight_kg: number;
  reps: number;
  rir: number | null;
}

interface ExerciseInput {
  name: string;
  sets: SetInput[];
}

interface WorkoutFormProps {
  onSubmit: (exercises: ExerciseInput[], notes: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function WorkoutForm({ onSubmit, isSubmitting }: WorkoutFormProps) {
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { name: "", sets: [{ set_number: 1, weight_kg: 0, reps: 0, rir: null }] },
  ]);
  const [notes, setNotes] = useState("");

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      { name: "", sets: [{ set_number: 1, weight_kg: 0, reps: 0, rir: null }] },
    ]);
  };

  const removeExercise = (idx: number) => {
    if (exercises.length <= 1) return;
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateExerciseName = (idx: number, name: string) => {
    setExercises((prev) => prev.map((e, i) => (i === idx ? { ...e, name } : e)));
  };

  const addSet = (exIdx: number) => {
    setExercises((prev) =>
      prev.map((e, i) => {
        if (i !== exIdx) return e;
        return {
          ...e,
          sets: [
            ...e.sets,
            { set_number: e.sets.length + 1, weight_kg: 0, reps: 0, rir: null },
          ],
        };
      })
    );
  };

  const removeSet = (exIdx: number, setIdx: number) => {
    setExercises((prev) =>
      prev.map((e, i) => {
        if (i !== exIdx) return e;
        if (e.sets.length <= 1) return e;
        return { ...e, sets: e.sets.filter((_, j) => j !== setIdx) };
      })
    );
  };

  const updateSet = (exIdx: number, setIdx: number, field: string, value: string) => {
    setExercises((prev) =>
      prev.map((e, i) => {
        if (i !== exIdx) return e;
        return {
          ...e,
          sets: e.sets.map((s, j) => {
            if (j !== setIdx) return s;
            if (field === "rir") return { ...s, rir: value ? Number(value) : null };
            return { ...s, [field]: Number(value) || 0 };
          }),
        };
      })
    );
  };

  const handleSubmit = async () => {
    const valid = exercises.every((e) => e.name.trim() !== "" && e.sets.length > 0);
    if (!valid) return;
    await onSubmit(exercises, notes);
  };

  return (
    <div className="space-y-4">
      {exercises.map((exercise, exIdx) => (
        <Card key={exIdx}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Exercise name"
                value={exercise.name}
                onChange={(e) => updateExerciseName(exIdx, e.target.value)}
                className="flex-1"
              />
              {exercises.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExercise(exIdx)}
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <span className="w-8">Set</span>
                <span>Weight (kg)</span>
                <span>Reps</span>
                <span>RIR</span>
                <span className="w-10" />
              </div>
              {exercise.sets.map((set, setIdx) => (
                <div
                  key={setIdx}
                  className="grid grid-cols-[auto_1fr_1fr_1fr_auto] items-center gap-2"
                >
                  <span className="flex h-10 w-8 items-center justify-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {setIdx + 1}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={set.weight_kg || ""}
                    onChange={(e) => updateSet(exIdx, setIdx, "weight_kg", e.target.value)}
                    placeholder="0"
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <input
                    type="number"
                    min={0}
                    value={set.reps || ""}
                    onChange={(e) => updateSet(exIdx, setIdx, "reps", e.target.value)}
                    placeholder="0"
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={set.rir ?? ""}
                    onChange={(e) => updateSet(exIdx, setIdx, "rir", e.target.value)}
                    placeholder="-"
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  {exercise.sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSet(exIdx, setIdx)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSet(exIdx)}
                className="flex h-10 w-full items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 text-sm font-medium text-zinc-500 hover:border-blue-400 hover:text-blue-600 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <Plus className="h-4 w-4" />
                Add Set
              </button>
            </div>
          </CardContent>
        </Card>
      ))}

      <button
        type="button"
        onClick={addExercise}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 text-sm font-medium text-zinc-500 hover:border-blue-400 hover:text-blue-600 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
      >
        <Plus className="h-5 w-5" />
        Add Exercise
      </button>

      <div className="space-y-2">
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Log Workout"}
      </Button>
    </div>
  );
}
