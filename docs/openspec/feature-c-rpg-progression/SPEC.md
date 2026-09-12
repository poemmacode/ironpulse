# Feature C: Athlete RPG Progression & Stats System

## Goal

Gamify strength training with RPG-style progression: levels, XP, streaks, and category-based stats.

## Categories

| Category | Example Exercises |
|---|---|
| Posterior Chain | Deadlift, Hip Thrust, RDL |
| Quad Dominant | Squat, Leg Press, Bulgarian Split Squat |
| Horizontal Push/Pull | Bench Press, Barbell Row |
| Vertical Push/Pull | Overhead Press, Pull-up, Lat Pulldown |
| Core | Plank, Hanging Leg Raise, Ab Wheel |

## Volume & XP Formulas

```
Volume Load = SUM(weight * reps) across all sets
XP Earned = (Volume Load / 10) + (PR Bonus * 100)
```

## Level System

- Starting target XP: 1000
- Each level increases target by 20%
- Level up resets XP progress, carries over excess

## Streak Protection

| Scenario | Effect |
|---|---|
| Consecutive day workout | Streak +1 |
| 2-day gap | Streak preserved (no increment) |
| 3+ day gap | Streak resets to 0 |
| Rest day | Streak preserved |
| Deload week | Streak preserved |

## Technical Details

- Engine: `src/lib/engine/gamification.ts`
- Functions: `calcVolumeXP()`, `evaluateStreak()`, `checkLevelUp()`
- All functions are pure (no side effects), easy to test

## Acceptance Criteria

- [x] Volume load calculated correctly across multiple sets
- [x] XP earned includes PR bonus
- [x] Level up triggers at correct threshold
- [x] Target XP increases by 20% per level
- [x] Streak increments on consecutive days
- [x] Streak preserved for 2-day gap
- [x] Streak resets on 3+ day gap
- [x] Rest days and deload weeks preserve streak
