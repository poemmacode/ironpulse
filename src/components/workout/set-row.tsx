import { cn } from "@/lib/utils";
import Input from "@/components/ui/input";

interface SetData {
  weightKg: number;
  reps: number;
  rir?: number;
}

interface SetRowProps {
  setNumber: number;
  weightKg: number;
  reps: number;
  rir?: number;
  onChange: (data: SetData) => void;
  readOnly?: boolean;
  className?: string;
}

export default function SetRow({
  setNumber,
  weightKg,
  reps,
  rir,
  onChange,
  readOnly = false,
  className,
}: SetRowProps) {
  const handleChange = (field: keyof SetData, value: string) => {
    const numValue = value === "" ? 0 : Number(value);
    if (isNaN(numValue)) return;
    onChange({
      weightKg: field === "weightKg" ? numValue : weightKg,
      reps: field === "reps" ? numValue : reps,
      rir: field === "rir" ? numValue || undefined : rir,
    });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-zinc-50 p-2 dark:bg-zinc-800/50",
        className,
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-sm font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
        {setNumber}
      </span>
      <Input
        label="kg"
        type="number"
        inputMode="decimal"
        min={0}
        step={0.5}
        value={weightKg || ""}
        onChange={(e) => handleChange("weightKg", e.target.value)}
        readOnly={readOnly}
        className="h-10 min-w-0 flex-1 text-center"
      />
      <Input
        label="reps"
        type="number"
        inputMode="numeric"
        min={0}
        value={reps || ""}
        onChange={(e) => handleChange("reps", e.target.value)}
        readOnly={readOnly}
        className="h-10 min-w-0 flex-1 text-center"
      />
      <Input
        label="RIR"
        type="number"
        inputMode="numeric"
        min={0}
        max={10}
        value={rir ?? ""}
        onChange={(e) => handleChange("rir", e.target.value)}
        readOnly={readOnly}
        className="h-10 min-w-0 flex-1 text-center"
        placeholder="—"
      />
    </div>
  );
}
