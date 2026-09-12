import Card, { CardHeader, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";

interface ExerciseSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  rir: number | null;
  estimated1RM: number | null;
}

interface ExerciseCardProps {
  name: string;
  category: string;
  sets: ExerciseSet[];
}

export default function ExerciseCard({ name, category, sets }: ExerciseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {name}
          </h3>
          <Badge variant="default">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="grid grid-cols-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Set</span>
            <span>Weight</span>
            <span>Reps</span>
            <span>1RM</span>
          </div>
          {sets.map((set) => (
            <div
              key={set.setNumber}
              className="grid grid-cols-4 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <span>{set.setNumber}</span>
              <span>{set.weightKg} kg</span>
              <span>{set.reps}</span>
              <span>{set.estimated1RM ? `${Math.round(set.estimated1RM)} kg` : "-"}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
