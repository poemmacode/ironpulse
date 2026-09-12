import Card, { CardContent } from "@/components/ui/card";
import Progress from "@/components/ui/progress";

interface CategoryData {
  category: string;
  totalVolume: number;
  workoutCount: number;
}

interface CategoryStatsProps {
  data: CategoryData[];
}

const categoryColors: Record<string, "blue" | "green" | "yellow" | "red"> = {
  "Posterior Chain": "red",
  "Quad Dominant": "blue",
  "Horizontal Push/Pull": "green",
  "Vertical Push/Pull": "yellow",
  Core: "blue",
};

export default function CategoryStats({ data }: CategoryStatsProps) {
  const maxVolume = Math.max(...data.map((d) => d.totalVolume), 1);

  return (
    <Card>
      <CardContent>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Category Volume
        </h2>
        {data.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No data yet. Log workouts to see stats.
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((cat) => (
              <div key={cat.category}>
                <Progress
                  value={(cat.totalVolume / maxVolume) * 100}
                  label={`${cat.category} — ${cat.totalVolume.toLocaleString()} kg`}
                  color={categoryColors[cat.category] ?? "blue"}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
