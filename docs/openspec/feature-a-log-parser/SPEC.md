# Feature A: Zero-Friction Natural Language Log Parser

## Goal

Allow users to log workouts by typing or speaking naturally, with the system parsing the input into structured exercise data.

## Endpoint

`POST /api/workouts/parse-log`

## Input

Raw text or transcribed speech.

**Example**:
> "Did 3 sets of hip thrusts with 90kg: 12, 10, 9 reps at RIR 1; then Bulgarian split squats with 14kg dumbbells for 10 reps each leg"

## Output Schema

```json
{
  "exercises": [
    {
      "name": "Hip Thrust",
      "muscle_group": "glutes",
      "sets": [
        { "set_number": 1, "weight_kg": 90.0, "reps": 12, "rir": 1 },
        { "set_number": 2, "weight_kg": 90.0, "reps": 10, "rir": 1 },
        { "set_number": 3, "weight_kg": 90.0, "reps": 9, "rir": 1 }
      ]
    },
    {
      "name": "Bulgarian Split Squat",
      "muscle_group": "quads_glutes",
      "sets": [
        { "set_number": 1, "weight_kg": 28.0, "reps": 10, "notes": "14kg per hand" }
      ]
    }
  ]
}
```

## Constraints

- Must match canonical exercise names stored in database or trigger a match-scoring lookup before insert.
- No `any` types. All payloads use Zod schemas with inferred TypeScript types.

## Technical Details

- Zod schemas defined in `src/lib/validations/workout.ts`
- Endpoint implemented in `src/app/api/workouts/parse-log/route.ts`
- Engine calculates `estimated1RM` via Brzycki formula for each set
- Computes `volume_load` and `total_reps` per exercise

## Dependencies

- `zod` for validation
- `brzycki.ts` engine for 1RM estimation
- Prisma `Exercise` table for canonical name matching

## Acceptance Criteria

- [x] Zod schema validates input and rejects malformed data
- [x] Endpoint returns 400 with error details on invalid input
- [x] Each set includes `estimated_1rm` calculation
- [x] Response includes `volume_load` and `total_reps` per exercise
- [x] Response includes `total_volume` and `total_reps` aggregates
