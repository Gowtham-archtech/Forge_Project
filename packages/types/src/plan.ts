/**
 * FORGE Shared Contract: Workout Plans & Splits
 */

export type SplitDayName =
  | 'Chest + Triceps'
  | 'Back + Biceps'
  | 'Legs + Abs'
  | 'Chest + Back'
  | 'Shoulders + Arms + Abs';

export interface ExerciseDefinition {
  id: string;
  name: string;
  targetMuscleGroup: string;
  equipment?: string;
  defaultRestSeconds: number;
}

export interface SupersetPair {
  id: string; // e.g. "pair_A", "pair_B"
  label: 'A' | 'B';
  exerciseAId: string;
  exerciseBId: string;
  notes?: string;
}

export interface PlannedExercise {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  targetWeightKg?: number;
  restSeconds: number;
  supersetPairId?: string; // If part of a superset pair
  orderIndex: number;
}

export interface TrainingDayPlan {
  dayNumber: 1 | 2 | 3 | 4 | 5;
  splitName: SplitDayName;
  exercises: PlannedExercise[];
  supersetPairs: SupersetPair[]; // Week 1: 0 pairs; Weeks 2-4: exactly 2 pairs
}

export interface TrainingWeekPlan {
  weekNumber: 1 | 2 | 3 | 4;
  days: TrainingDayPlan[];
}

export interface TrainingProgramPlan {
  id: string;
  title: string;
  weeks: TrainingWeekPlan[];
  createdAt: string;
  updatedAt: string;
}
