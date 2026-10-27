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
  supersetPairId?: string;
  orderIndex: number;
}

/**
 * EXACT SUPERSET RULES (Enforced on both Frontend & Backend):
 * - Week 1: exactly 0 superset pairs per training day (supersetPairs.length === 0).
 * - Weeks 2-4: exactly 2 superset pairs per training day (supersetPairs.length === 2).
 * - Total across Weeks 2-4: 30 superset pairs across 15 training days.
 */
export interface TrainingDayPlan {
  dayNumber: 1 | 2 | 3 | 4 | 5;
  splitName: SplitDayName;
  exercises: PlannedExercise[];
  supersetPairs: SupersetPair[];
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

/**
 * Utility validation function shared by frontend and backend
 */
export function validateTrainingProgramSupersets(program: TrainingProgramPlan): { valid: boolean; error?: string } {
  for (const week of program.weeks) {
    for (const day of week.days) {
      if (week.weekNumber === 1 && day.supersetPairs.length !== 0) {
        return {
          valid: false,
          error: `Week 1 Day ${day.dayNumber} (${day.splitName}) must have exactly 0 superset pairs, but has ${day.supersetPairs.length}`,
        };
      }
      if (week.weekNumber >= 2 && week.weekNumber <= 4 && day.supersetPairs.length !== 2) {
        return {
          valid: false,
          error: `Week ${week.weekNumber} Day ${day.dayNumber} (${day.splitName}) must have exactly 2 superset pairs, but has ${day.supersetPairs.length}`,
        };
      }
    }
  }
  return { valid: true };
}
