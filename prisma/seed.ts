import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  // Posterior Chain
  { name: "Barbell Hip Thrust", category: "Posterior Chain", targetGroup: "Glutes" },
  { name: "Conventional Deadlift", category: "Posterior Chain", targetGroup: "Hamstrings" },
  { name: "Romanian Deadlift", category: "Posterior Chain", targetGroup: "Hamstrings" },
  { name: "Sumo Deadlift", category: "Posterior Chain", targetGroup: "Glutes" },
  { name: "Glute-Ham Raise", category: "Posterior Chain", targetGroup: "Hamstrings" },
  { name: "Good Morning", category: "Posterior Chain", targetGroup: "Hamstrings" },
  { name: "Back Extension", category: "Posterior Chain", targetGroup: "Lower Back" },

  // Quad Dominant
  { name: "Barbell Back Squat", category: "Quad Dominant", targetGroup: "Quads" },
  { name: "Front Squat", category: "Quad Dominant", targetGroup: "Quads" },
  { name: "Leg Press", category: "Quad Dominant", targetGroup: "Quads" },
  { name: "Bulgarian Split Squat", category: "Quad Dominant", targetGroup: "Quads" },
  { name: "Goblet Squat", category: "Quad Dominant", targetGroup: "Quads" },
  { name: "Hack Squat", category: "Quad Dominant", targetGroup: "Quads" },
  { name: "Walking Lunge", category: "Quad Dominant", targetGroup: "Quads" },
  { name: "Leg Extension", category: "Quad Dominant", targetGroup: "Quads" },

  // Horizontal Push/Pull
  { name: "Flat Barbell Bench Press", category: "Horizontal Push/Pull", targetGroup: "Chest" },
  { name: "Incline Dumbbell Press", category: "Horizontal Push/Pull", targetGroup: "Upper Chest" },
  { name: "Dumbbell Bench Press", category: "Horizontal Push/Pull", targetGroup: "Chest" },
  { name: "Machine Chest Press", category: "Horizontal Push/Pull", targetGroup: "Chest" },
  { name: "Cable Fly", category: "Horizontal Push/Pull", targetGroup: "Chest" },
  { name: "Bent-Over Barbell Row", category: "Horizontal Push/Pull", targetGroup: "Lats" },
  { name: "Chest-Supported Row", category: "Horizontal Push/Pull", targetGroup: "Lats" },
  { name: "Dumbbell Row", category: "Horizontal Push/Pull", targetGroup: "Lats" },
  { name: "Seated Cable Row", category: "Horizontal Push/Pull", targetGroup: "Lats" },

  // Vertical Push/Pull
  { name: "Overhead Press", category: "Vertical Push/Pull", targetGroup: "Shoulders" },
  { name: "Dumbbell Overhead Press", category: "Vertical Push/Pull", targetGroup: "Shoulders" },
  { name: "Lateral Raise", category: "Vertical Push/Pull", targetGroup: "Side Delts" },
  { name: "Pull-up", category: "Vertical Push/Pull", targetGroup: "Lats" },
  { name: "Chin-up", category: "Vertical Push/Pull", targetGroup: "Biceps" },
  { name: "Lat Pulldown", category: "Vertical Push/Pull", targetGroup: "Lats" },
  { name: "Face Pull", category: "Vertical Push/Pull", targetGroup: "Rear Delts" },

  // Core
  { name: "Hanging Leg Raise", category: "Core", targetGroup: "Abs" },
  { name: "Ab Wheel Rollout", category: "Core", targetGroup: "Abs" },
  { name: "Cable Woodchopper", category: "Core", targetGroup: "Obliques" },
  { name: "Plank", category: "Core", targetGroup: "Abs" },
  { name: "Dead Bug", category: "Core", targetGroup: "Abs" },
  { name: "Pallof Press", category: "Core", targetGroup: "Obliques" },
  { name: "Side Plank", category: "Core", targetGroup: "Obliques" },

  // Accessories
  { name: "Barbell Curl", category: "Accessories", targetGroup: "Biceps" },
  { name: "Hammer Curl", category: "Accessories", targetGroup: "Biceps" },
  { name: "Tricep Pushdown", category: "Accessories", targetGroup: "Triceps" },
  { name: "Skull Crusher", category: "Accessories", targetGroup: "Triceps" },
  { name: "Calf Raise", category: "Accessories", targetGroup: "Calves" },
];

async function main() {
  console.log("Seeding exercises...");

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }

  console.log(`Seeded ${exercises.length} exercises successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
