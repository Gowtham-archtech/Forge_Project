/**
 * FORGE Shared Contract: Analytics, Measurements & Gripper Tracking
 */

export interface BodyMeasurement {
  id: string; // client UUID v4
  userId: string;
  recordedAt: string; // ISO 8601
  weightKg?: number;
  bodyFatPercentage?: number;
  chestCm?: number;
  armsCm?: number;
  waistCm?: number;
  thighsCm?: number;
  calvesCm?: number;
  notes?: string;
  version: number;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  oneRepMaxKg: number;
  maxWeightKg: number;
  maxRepsAtWeight: { weightKg: number; reps: number };
  achievedAt: string; // ISO 8601
  workoutSessionId: string;
}

export interface GripperRecord {
  id: string; // client UUID v4
  userId: string;
  recordedAt: string; // ISO 8601
  hand: 'left' | 'right' | 'both';
  resistanceRating: string; // e.g. "Captains of Crush #1 (140 lbs)"
  repsCompleted: number;
  holdSeconds?: number;
  notes?: string;
  version: number;
}
