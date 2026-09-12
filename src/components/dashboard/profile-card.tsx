import Card, { CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Progress from "@/components/ui/progress";

interface ProfileCardProps {
  name?: string | null;
  level: number;
  currentXp: number;
  targetXp: number;
  streakDays: number;
  compact?: boolean;
}

export default function ProfileCard({
  name,
  level,
  currentXp,
  targetXp,
  streakDays,
  compact = false,
}: ProfileCardProps) {
  const xpPercent = targetXp > 0 ? (currentXp / targetXp) * 100 : 0;

  if (compact) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {name ?? "Athlete"}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="level">Lvl {level}</Badge>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {streakDays}d streak
                </span>
              </div>
            </div>
          </div>
          <Progress
            value={xpPercent}
            label={`XP: ${currentXp} / ${targetXp}`}
            className="mt-3"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            {name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {name ?? "Athlete"}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="level">Level {level}</Badge>
              <Badge variant="warning">{streakDays} day streak</Badge>
            </div>
          </div>
        </div>
        <Progress
          value={xpPercent}
          label={`XP: ${currentXp} / ${targetXp}`}
          color="green"
          className="mt-4"
        />
      </CardContent>
    </Card>
  );
}
