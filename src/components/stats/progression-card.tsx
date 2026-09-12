import Card, { CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";

interface ProgressionCardProps {
  exerciseName: string;
  currentWeight: number;
  previousWeight: number | null;
  estimated1RM: number | null;
  lastDate: string;
}

export default function ProgressionCard({
  exerciseName,
  currentWeight,
  previousWeight,
  estimated1RM,
  lastDate,
}: ProgressionCardProps) {
  const diff = previousWeight !== null ? currentWeight - previousWeight : null;

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {exerciseName}
          </h3>
          {diff !== null && (
            <Badge variant={diff > 0 ? "success" : diff < 0 ? "warning" : "default"}>
              {diff > 0 ? "+" : ""}{diff} kg
            </Badge>
          )}
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{currentWeight} kg</span>
          {estimated1RM && <span>Est. 1RM: {Math.round(estimated1RM)} kg</span>}
        </div>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          {new Date(lastDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
