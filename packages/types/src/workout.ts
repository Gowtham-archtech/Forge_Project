/**
 * FORGE Shared Contract: Active Workout & Historical Sessions
 */

import { SplitDayName } from './plan';

export type WorkoutSessionStatus = 'in_progress' | 'completed' | 'abandoned';

export interface RecordedSet {
  id: string; // client UUID v4
  setNumber: number;
  targetReps?: number;
  actualReps: number;
  targetWeightKg?: number;
  actualWeightKg: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
  completedAt?: string; // ISO 8601
  restDurationSeconds?: number;
}

export interface RecordedExercise {
  exerciseId: string;
  exerciseName: string;
  targetMuscleGroup: string;
  orderIndex: number;
  supersetPairLabel?: 'A1' | 'A2' | 'B1' | 'B2';
  sets: RecordedSet[];
  notes?: string;
}

/**
 * Historical workout session: Must be an immutable snapshot.
 * Modifying future plans MUST NEVER mutate this record.
 */
export interface WorkoutSession {
  id: string; // client UUID v4
  userId: string;
  planId?: string;
  weekNumber?: number;
  dayNumber?: number;
  splitName: SplitDayName;
  status: WorkoutSessionStatus;
  startedAt: string; // ISO 8601
  completedAt?: string; // ISO 8601
  durationSeconds: number;
  exercises: RecordedExercise[];
  notes?: string;
  version: number; // For sync conflict resolution
  updatedAt: string;
}
