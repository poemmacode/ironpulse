import { z } from "zod";

export const SetInputSchema = z.object({
  set_number: z.number().int().min(1),
  weight_kg: z.number().min(0),
  reps: z.number().int().min(0),
  rir: z.number().int().min(0).max(10).nullable().optional(),
  notes: z.string().optional(),
});

export const ExerciseInputSchema = z.object({
  name: z.string().min(1),
  muscle_group: z.string().min(1),
  sets: z.array(SetInputSchema).min(1),
});

export const WorkoutParseInputSchema = z.object({
  exercises: z.array(ExerciseInputSchema).min(1),
});

export type SetInput = z.infer<typeof SetInputSchema>;
export type ExerciseInput = z.infer<typeof ExerciseInputSchema>;
export type WorkoutParseInput = z.infer<typeof WorkoutParseInputSchema>;

// Output schemas for API responses
export const SetOutputSchema = z.object({
  set_number: z.number(),
  weight_kg: z.number(),
  reps: z.number(),
  rir: z.number().nullable().optional(),
  estimated_1rm: z.number().optional(),
  notes: z.string().optional(),
});

export const ExerciseOutputSchema = z.object({
  name: z.string(),
  muscle_group: z.string(),
  sets: z.array(SetOutputSchema),
  volume_load: z.number(),
  total_reps: z.number(),
});

export const WorkoutParseOutputSchema = z.object({
  exercises: z.array(ExerciseOutputSchema),
  total_volume: z.number(),
  total_reps: z.number(),
});

export type SetOutput = z.infer<typeof SetOutputSchema>;
export type ExerciseOutput = z.infer<typeof ExerciseOutputSchema>;
export type WorkoutParseOutput = z.infer<typeof WorkoutParseOutputSchema>;
