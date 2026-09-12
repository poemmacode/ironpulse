import { cn } from "@/lib/utils";

type ProgressColor = "blue" | "green" | "yellow" | "red";

interface ProgressProps {
  value: number;
  label?: string;
  color?: ProgressColor;
  className?: string;
}

const colorStyles: Record<ProgressColor, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};

export default function Progress({
  value,
  label,
  color = "blue",
  className,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || label === "") && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </span>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {Math.round(clamped)}%
          </span>
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorStyles[color],
          )}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}
