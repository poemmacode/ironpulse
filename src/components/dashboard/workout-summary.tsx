import Card, { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Badge from "@/components/ui/badge";

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

interface WorkoutSummaryProps {
  workout: Workout | null;
}

export default function WorkoutSummary({ workout }: WorkoutSummaryProps) {
  if (!workout) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Latest Workout
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 dark:text-zinc-400">
            No workouts logged yet. Get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  const exercises = Array.from(
    new Map(
      workout.sets.map((s) => [s.exercise.name, s.exercise.name])
    ).values()
  );
  const date = new Date(workout.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Latest Workout
          </h2>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {date}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {exercises.map((name) => (
            <Badge key={name} variant="default">
              {name}
            </Badge>
          ))}
        </div>
        {workout.notes && (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {workout.notes}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">
            Volume: {workout.total_volume.toLocaleString()} kg
          </span>
          <Badge variant="success">+{workout.xp_earned} XP</Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
