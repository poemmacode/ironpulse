# Feature B: Progressive Overload Recommendation Engine

## Goal

Automatically recommend weight/rep adjustments for the next training session based on current performance and 1RM estimates.

## 1RM Estimation — Brzycki Formula

```
1RM = weight * (36 / (37 - reps))
```

Valid range: 1-36 reps. At 1 rep, 1RM equals the weight lifted.

## Progression Rules

**Trigger**: User hits upper rep limit in set 1 with `RIR >= 2`

| Body Region | Increment |
|---|---|
| Upper body compound | +1.25 kg to +2.5 kg |
| Lower body compound (Hip Thrust, Squat, Deadlift) | +2.5 kg to +5.0 kg |

**Fallback**: If weight stays flat, prescribe `+1 rep` per set.

## Lower Body Compounds

- Barbell Hip Thrust
- Conventional Deadlift
- Sumo Deadlift
- Barbell Back Squat
- Front Squat

## Technical Details

- Engine: `src/lib/engine/progressive-overload.ts`
- Function: `getOverloadRecommendation(params)`
- Returns: `OverloadRecommendation` with current state, recommended state, and reason

## Acceptance Criteria

- [x] Brzycki formula calculates correctly for 1-36 reps
- [x] Weight increase recommended when hitting upper rep limit with RIR >= 2
- [x] Lower body compounds get larger increments than upper body
- [x] +1 rep prescribed when weight stays flat
- [x] Reason string explains the recommendation
- [x] Unit tests cover all progression paths
