import { TrainingProgramPlan, SplitDayName, PlannedExercise, SupersetPair } from '@forge/types';

export interface GeneratedDayPlan {
  weekNumber: 1 | 2 | 3 | 4;
  dayNumber: 1 | 2 | 3 | 4 | 5;
  splitName: SplitDayName;
  focus: string;
  exercises: PlannedExercise[];
  supersetPairs: SupersetPair[];
}

const SPLIT_CONFIGS: Array<{
  dayNumber: 1 | 2 | 3 | 4 | 5;
  splitName: SplitDayName;
  focus: string;
  baseExercises: Array<{
    id: string;
    name: string;
    targetSets: number;
    minReps: number;
    maxReps: number;
    weightKg: number;
    rest: number;
  }>;
}> = [
  {
    dayNumber: 1,
    splitName: 'Chest + Triceps',
    focus: 'Anterior chain & elbow extension',
    baseExercises: [
      { id: 'bp-flat', name: 'Barbell Flat Bench Press', targetSets: 4, minReps: 6, maxReps: 8, weightKg: 80, rest: 120 },
      { id: 'db-incline', name: 'Incline Dumbbell Press', targetSets: 3, minReps: 8, maxReps: 10, weightKg: 28, rest: 90 },
      { id: 'tri-pushdown', name: 'Cable Triceps Rope Pushdown', targetSets: 3, minReps: 12, maxReps: 15, weightKg: 25, rest: 60 },
      { id: 'dips', name: 'Chest Dips', targetSets: 3, minReps: 8, maxReps: 12, weightKg: 0, rest: 90 },
      { id: 'skull-crushers', name: 'EZ-Bar Skull Crushers', targetSets: 3, minReps: 10, maxReps: 12, weightKg: 30, rest: 60 },
      { id: 'cable-flyes', name: 'High-to-Low Cable Flyes', targetSets: 3, minReps: 12, maxReps: 15, weightKg: 15, rest: 60 },
    ],
  },
  {
    dayNumber: 2,
    splitName: 'Back + Biceps',
    focus: 'Vertical/horizontal pull & elbow flexion',
    baseExercises: [
      { id: 'bb-row', name: 'Barbell Bent-Over Row', targetSets: 4, minReps: 6, maxReps: 8, weightKg: 75, rest: 120 },
      { id: 'lat-pulldown', name: 'Neutral-Grip Lat Pulldown', targetSets: 3, minReps: 8, maxReps: 10, weightKg: 65, rest: 90 },
      { id: 'incline-curl', name: 'Incline Dumbbell Biceps Curl', targetSets: 3, minReps: 10, maxReps: 12, weightKg: 14, rest: 60 },
      { id: 'seated-row', name: 'Seated Cable Row', targetSets: 3, minReps: 10, maxReps: 12, weightKg: 60, rest: 90 },
      { id: 'hammer-curl', name: 'Standing Hammer Curls', targetSets: 3, minReps: 10, maxReps: 12, weightKg: 16, rest: 60 },
      { id: 'face-pull', name: 'Rope Face Pulls', targetSets: 3, minReps: 15, maxReps: 20, weightKg: 20, rest: 60 },
    ],
  },
  {
    dayNumber: 3,
    splitName: 'Legs + Abs',
    focus: 'Quad/hamstring compound & core',
    baseExercises: [
      { id: 'squat', name: 'Barbell Back Squat', targetSets: 4, minReps: 6, maxReps: 8, weightKg: 100, rest: 150 },
      { id: 'rdl', name: 'Romanian Deadlift', targetSets: 3, minReps: 8, maxReps: 10, weightKg: 90, rest: 120 },
      { id: 'leg-press', name: '45-Degree Leg Press', targetSets: 3, minReps: 10, maxReps: 12, weightKg: 180, rest: 90 },
      { id: 'leg-curl', name: 'Lying Hamstring Curl', targetSets: 3, minReps: 10, maxReps: 12, weightKg: 45, rest: 60 },
      { id: 'hanging-leg-raise', name: 'Hanging Leg Raises', targetSets: 3, minReps: 12, maxReps: 15, weightKg: 0, rest: 60 },
      { id: 'cable-crunch', name: 'Kneeling Cable Crunch', targetSets: 3, minReps: 15, maxReps: 20, weightKg: 35, rest: 60 },
    ],
  },
  {
    dayNumber: 4,
    splitName: 'Chest + Back',
    focus: 'Antagonist upper body hypertrophy',
    baseExercises: [
      { id: 'incline-bb', name: 'Incline Barbell Bench Press', targetSets: 4, minReps: 6, maxReps: 8, weightKg: 75, rest: 120 },
      { id: 'weighted-pullup', name: 'Weighted Pull-Ups', targetSets: 4, minReps: 6, maxReps: 8, weightKg: 10, rest: 120 },
      { id: 'flat-db-press', name: 'Flat Dumbbell Press', targetSets: 3, minReps: 8, maxReps: 10, weightKg: 32, rest: 90 },
      { id: 'tbar-row', name: 'T-Bar Supported Row', targetSets: 3, minReps: 8, maxReps: 10, weightKg: 50, rest: 90 },
      { id: 'pec-deck', name: 'Pec Deck Machine Flyes', targetSets: 3, minReps: 12, maxReps: 15, weightKg: 40, rest: 60 },
      { id: 'straight-arm-pull', name: 'Straight-Arm Cable Pulldown', targetSets: 3, minReps: 12, maxReps: 15, weightKg: 25, rest: 60 },
    ],
  },
  {
    dayNumber: 5,
    splitName: 'Shoulders + Arms + Abs',
    focus: 'Deltoid caps, arm volume & core',
    baseExercises: [
      { id: 'ohp', name: 'Standing Overhead Barbell Press', targetSets: 4, minReps: 6, maxReps: 8, weightKg: 50, rest: 120 },
      { id: 'lateral-raise', name: 'Dumbbell Lateral Raises', targetSets: 4, minReps: 12, maxReps: 15, weightKg: 12, rest: 60 },
      { id: 'preacher-curl', name: 'EZ-Bar Preacher Curl', targetSets: 3, minReps: 8, maxReps: 10, weightKg: 28, rest: 60 },
      { id: 'overhead-ext', name: 'Dumbbell Overhead Extension', targetSets: 3, minReps: 10, maxReps: 12, weightKg: 24, rest: 60 },
      { id: 'rear-delt-fly', name: 'Bent-Over Rear Delt Flyes', targetSets: 3, minReps: 12, maxReps: 15, weightKg: 10, rest: 60 },
      { id: 'cable-curl', name: 'Bayesian Cable Curl', targetSets: 3, minReps: 10, maxReps: 12, weightKg: 18, rest: 60 },
      { id: 'ab-wheel', name: 'Ab Wheel Rollouts', targetSets: 3, minReps: 10, maxReps: 12, weightKg: 0, rest: 60 },
    ],
  },
];

export function getPlannedSession(weekNumber: 1 | 2 | 3 | 4, dayNumber: 1 | 2 | 3 | 4 | 5): GeneratedDayPlan {
  const cfg = SPLIT_CONFIGS.find((c) => c.dayNumber === dayNumber)!;

  let supersetPairs: SupersetPair[] = [];
  const exercises: PlannedExercise[] = cfg.baseExercises.map((e, idx) => ({
    exerciseId: e.id,
    exerciseName: e.name,
    targetSets: e.targetSets,
    targetRepsMin: e.minReps,
    targetRepsMax: e.maxReps,
    targetWeightKg: e.weightKg,
    restSeconds: e.rest,
    orderIndex: idx,
  }));

  // Week 1: EXACTLY 0 superset pairs per day
  // Weeks 2-4: EXACTLY 2 superset pairs per day
  if (weekNumber >= 2) {
    supersetPairs = [
      {
        id: `pair_A_w${weekNumber}_d${dayNumber}`,
        label: 'A',
        exerciseAId: exercises[1].exerciseId,
        exerciseBId: exercises[2].exerciseId,
      },
      {
        id: `pair_B_w${weekNumber}_d${dayNumber}`,
        label: 'B',
        exerciseAId: exercises[3].exerciseId,
        exerciseBId: exercises[4].exerciseId,
      },
    ];

    exercises[1].supersetPairId = supersetPairs[0].id;
    exercises[2].supersetPairId = supersetPairs[0].id;
    exercises[3].supersetPairId = supersetPairs[1].id;
    exercises[4].supersetPairId = supersetPairs[1].id;
  }

  return {
    weekNumber,
    dayNumber,
    splitName: cfg.splitName,
    focus: cfg.focus,
    exercises,
    supersetPairs,
  };
}

export function getAllProgramPlans(): TrainingProgramPlan {
  return {
    id: 'forge-hypertrophy-program-v1',
    title: 'FORGE 4-Week Structured Hypertrophy Program',
    createdAt: '2026-10-27T00:00:00.000Z',
    updatedAt: '2026-10-27T00:00:00.000Z',
    weeks: ([1, 2, 3, 4] as const).map((w) => ({
      weekNumber: w,
      days: ([1, 2, 3, 4, 5] as const).map((d) => {
        const plan = getPlannedSession(w, d);
        return {
          dayNumber: d,
          splitName: plan.splitName,
          exercises: plan.exercises,
          supersetPairs: plan.supersetPairs,
        };
      }),
    })),
  };
}
