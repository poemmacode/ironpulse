# IronPulse: Progressive Overload & Gamified Fitness Engine

## Overview

A mobile-first PWA that tracks strength training, parses workout logs via LLM, calculates progressive overload metrics, and provides RPG-style strength progression without logging friction.

---

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Next.js 15+ (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS, Lucide React, Shadcn/UI |
| API | Next.js Route Handlers / Server Actions |
| Validation | Zod (strict typing, no `any` types) |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma (`directUrl` for migrations) |
| AI Engine | LLM structured outputs (JSON schema) |
| State | TanStack Query + Zustand |

---

## Features

### Feature A: Zero-Friction Natural Language Log Parser

**Endpoint**: `POST /api/workouts/parse-log`

**Input**: Raw text or transcribed speech.

**Example**:
> "Did 3 sets of hip thrusts with 90kg: 12, 10, 9 reps at RIR 1; then Bulgarian split squats with 14kg dumbbells for 10 reps each leg"

**Output Schema**:
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

**Constraint**: Must match canonical exercise names stored in database or trigger a match-scoring lookup before insert.

---

### Feature B: Progressive Overload Recommendation Engine

**1RM Estimation** — Brzycki Formula:
```
1RM = weight * (36 / (37 - reps))
```

**Progression Rules**:
- Trigger: User hits upper rep limit in set 1 with `RIR >= 2`
- Upper body compound: `+1.25 kg` to `+2.5 kg`
- Lower body compound (Hip Thrust, Squat, Deadlift): `+2.5 kg` to `+5.0 kg`
- If weight stays flat: prescribe `+1 rep` per set

---

### Feature C: Athlete RPG Progression & Stats System

**Categories**:
| Category | Example Exercises |
|---|---|
| Posterior Chain | Deadlift, Hip Thrust, RDL |
| Quad Dominant | Squat, Leg Press, Bulgarian Split Squat |
| Horizontal Push/Pull | Bench Press, Barbell Row |
| Vertical Push/Pull | Overhead Press, Pull-up, Lat Pulldown |
| Core | Plank, Hanging Leg Raise, Ab Wheel |

**Volume & XP Formulas**:
```
Volume Load = SUM(weight * reps)
XP Earned = (Volume Load / 10) + (PR Bonus * 100)
```

**Streak Protection**: Scheduled rest days or deload cycles do NOT reset streaks.

---

## Database Schema (Prisma)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String?
  level         Int            @default(1)
  currentXp     Int            @default(0)
  targetXp      Int            @default(1000)
  streakDays    Int            @default(0)
  workouts      Workout[]
  personalBests PersonalBest[]
  createdAt     DateTime       @default(now())
}

model Exercise {
  id          String       @id @default(cuid())
  name        String       @unique
  category    String
  targetGroup String
  workoutSets WorkoutSet[]
}

model Workout {
  id          String       @id @default(cuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  rawInput    String?
  notes       String?
  totalVolume Float        @default(0)
  xpEarned    Int          @default(0)
  sets        WorkoutSet[]
  createdAt   DateTime     @default(now())
}

model WorkoutSet {
  id           String   @id @default(cuid())
  workoutId    String
  workout      Workout  @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  exerciseId   String
  exercise     Exercise @relation(fields: [exerciseId], references: [id])
  setNumber    Int
  weightKg     Float
  reps         Int
  rir          Int?
  estimated1RM Float?
}

model PersonalBest {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  exerciseId String
  weightKg   Float
  reps       Int
  achievedAt DateTime @default(now())

  @@unique([userId, exerciseId])
}
```

---

## Execution Directives

| Directive | Description |
|---|---|
| **Step-by-Step Delivery** | Start by generating complete DB migration and seed script with standard compound and accessory exercises |
| **Strict Typing** | No `any` types. All API payloads use Zod schemas with inferred TypeScript types |
| **Mobile-First UX** | Responsive cards for single-thumb mobile operation: large touch targets, min 48px height, high contrast dark-mode |
| **Test Fixtures** | Unit tests for Brzycki 1RM calculator and progressive overload recommendation function |
| **Security** | Never commit `.env.local` or any file containing real credentials to git |

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key |
| `DATABASE_URL` | PostgreSQL connection string (pooler or direct) |
| `DIRECT_URL` | PostgreSQL direct connection (port 5432) for migrations |

---

## OpenSpec — Feature Documentation & Tasks

Detailed specs and task tracking live in `docs/openspec/`:

| Feature | Spec | Tasks |
|---|---|---|
| A: Log Parser | [SPEC.md](docs/openspec/feature-a-log-parser/SPEC.md) | [TASKS.md](docs/openspec/feature-a-log-parser/TASKS.md) |
| B: Progressive Overload | [SPEC.md](docs/openspec/feature-b-progressive-overload/SPEC.md) | [TASKS.md](docs/openspec/feature-b-progressive-overload/TASKS.md) |
| C: RPG Progression | [SPEC.md](docs/openspec/feature-c-rpg-progression/SPEC.md) | [TASKS.md](docs/openspec/feature-c-rpg-progression/TASKS.md) |
