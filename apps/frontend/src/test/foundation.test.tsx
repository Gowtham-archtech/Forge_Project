import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SyncStatusBadge } from '../components/ui/SyncStatusBadge';
import { NumericInput } from '../components/ui/NumericInput';
import { RestTimer } from '../components/ui/RestTimer';
import { NavigationShell } from '../components/layout/NavigationShell';
import {
  validateTrainingProgramSupersets,
  WorkoutSession,
  SyncMutation,
} from '@forge/types';
import { getPlannedSession, getAllProgramPlans } from '../features/train/planData';
import { LocalStorageManager } from '../storage/db';
import { generateUUID } from '../utils/uuid';

describe('FORGE Foundation & Persistence — P1 Acceptance Tests', () => {
  let db: LocalStorageManager;

  beforeEach(() => {
    db = new LocalStorageManager(`test_user_${Date.now()}`);
  });

  describe('Contract Compatibility: Standard RFC4122 UUID v4 IDs', () => {
    it('generates valid UUID v4 compliant with backend schema', () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const id1 = generateUUID();
      const id2 = generateUUID();

      expect(id1).toMatch(uuidRegex);
      expect(id2).toMatch(uuidRegex);
      expect(id1).not.toBe(id2);
    });
  });

  describe('IndexedDB Persistence & Atomic Completion Transaction', () => {
    it('saves and restores active workout across simulated reloads', async () => {
      const workoutId = generateUUID();
      const setId = generateUUID();

      const mockSession: WorkoutSession = {
        id: workoutId,
        userId: 'test_user',
        weekNumber: 2,
        dayNumber: 1,
        splitName: 'Chest + Triceps',
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        durationSeconds: 120,
        exercises: [
          {
            exerciseId: 'bp-flat',
            exerciseName: 'Barbell Flat Bench Press',
            targetMuscleGroup: 'Chest + Triceps',
            orderIndex: 0,
            sets: [
              {
                id: setId,
                setNumber: 1,
                actualReps: 8,
                actualWeightKg: 80,
                completed: true,
              },
            ],
          },
        ],
        version: 1,
        updatedAt: new Date().toISOString(),
      };

      // 1. Save active workout (e.g. user logs set)
      await db.saveActiveWorkout(mockSession);

      // 2. Simulate page refresh / restart and retrieve
      const restored = await db.getActiveWorkout();
      expect(restored).not.toBeNull();
      expect(restored?.id).toBe(workoutId);
      expect(restored?.exercises[0].sets[0].completed).toBe(true);
      expect(restored?.exercises[0].sets[0].actualWeightKg).toBe(80);
    });

    it('atomically saves completed workout, clears active draft, and enqueues sync mutation', async () => {
      const workoutId = generateUUID();
      const mutationId = generateUUID();

      const mockActiveSession: WorkoutSession = {
        id: workoutId,
        userId: 'test_user',
        weekNumber: 2,
        dayNumber: 1,
        splitName: 'Chest + Triceps',
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        durationSeconds: 1800,
        exercises: [],
        version: 1,
        updatedAt: new Date().toISOString(),
      };

      // Start with active workout saved
      await db.saveActiveWorkout(mockActiveSession);
      const beforeActive = await db.getActiveWorkout();
      expect(beforeActive).not.toBeNull();

      const completedSession: WorkoutSession = {
        ...mockActiveSession,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };

      const mutation: SyncMutation = {
        mutationId,
        entityType: 'workout_session',
        entityId: workoutId,
        operation: 'upsert',
        clientTimestamp: new Date().toISOString(),
        expectedVersion: 1,
        payload: completedSession,
      };

      // Execute single atomic transaction across all 3 stores
      await db.completeWorkoutTransaction(completedSession, mutation);

      // Verify active workout was cleared
      const afterActive = await db.getActiveWorkout();
      expect(afterActive).toBeNull();

      // Verify completed workout was persisted
      const completedList = await db.getCompletedWorkouts();
      expect(completedList.length).toBe(1);
      expect(completedList[0].id).toBe(workoutId);
      expect(completedList[0].status).toBe('completed');

      // Verify sync mutation was atomically queued
      const queuedMutations = await db.getQueuedMutations();
      expect(queuedMutations.length).toBe(1);
      expect(queuedMutations[0].mutationId).toBe(mutationId);
      expect(queuedMutations[0].entityId).toBe(workoutId);
    });
  });

  describe('Superset Exact Acceptance Rules & Plan Reflection', () => {
    it('guarantees Week 1 has 0 superset pairs for all 5 days', () => {
      for (let day = 1; day <= 5; day++) {
        const plan = getPlannedSession(1, day as 1 | 2 | 3 | 4 | 5);
        expect(plan.supersetPairs.length).toBe(0);
        expect(plan.exercises.every((e) => !e.supersetPairId)).toBe(true);
      }
    });

    it('guarantees Weeks 2-4 each have exactly 2 superset pairs per day with paired exercises', () => {
      for (const wk of [2, 3, 4] as const) {
        for (let day = 1; day <= 5; day++) {
          const plan = getPlannedSession(wk, day as 1 | 2 | 3 | 4 | 5);
          expect(plan.supersetPairs.length).toBe(2);
          expect(plan.supersetPairs[0].label).toBe('A');
          expect(plan.supersetPairs[1].label).toBe('B');

          // Check that exercises are linked to pairs
          const pairedExercises = plan.exercises.filter((e) => e.supersetPairId);
          expect(pairedExercises.length).toBe(4); // 2 pairs × 2 exercises = 4 paired exercises
        }
      }
    });

    it('validates the complete 4-week program structure satisfies the 30 total superset requirement', () => {
      const fullProgram = getAllProgramPlans();
      const validation = validateTrainingProgramSupersets(fullProgram);
      expect(validation.valid).toBe(true);

      const totalWeek2to4Pairs = fullProgram.weeks
        .filter((w) => w.weekNumber >= 2 && w.weekNumber <= 4)
        .reduce((sum, w) => sum + w.days.reduce((dSum, d) => dSum + d.supersetPairs.length, 0), 0);

      expect(totalWeek2to4Pairs).toBe(30);
    });
  });

  describe('Sync Status Presentation Truthfulness', () => {
    it('never displays "Synced" when the state is saved_locally', () => {
      render(<SyncStatusBadge status="saved_locally" pendingCount={2} />);
      expect(screen.queryByText(/Synced/i)).toBeNull();
      expect(screen.getByText(/Saved locally \(2\)/i)).toBeInTheDocument();
    });

    it('clearly indicates "Synchronizing..." when sync is active', () => {
      render(<SyncStatusBadge status="synchronizing" />);
      expect(screen.getByText(/Synchronizing.../i)).toBeInTheDocument();
    });

    it('only displays "Synced" when status is confirmed synced', () => {
      render(<SyncStatusBadge status="synced" />);
      expect(screen.getByText('Synced')).toBeInTheDocument();
    });
  });

  describe('UI Controls: NumericInput and RestTimer', () => {
    it('increments and decrements weight correctly', () => {
      const onChange = vi.fn();
      render(<NumericInput label="Weight" unit="kg" value={80} step={2.5} onChange={onChange} />);

      const incBtn = screen.getByLabelText('Increase Weight');
      fireEvent.click(incBtn);
      expect(onChange).toHaveBeenCalledWith(82.5);

      const decBtn = screen.getByLabelText('Decrease Weight');
      fireEvent.click(decBtn);
      expect(onChange).toHaveBeenCalledWith(77.5);
    });

    it('renders RestTimer with initial duration', () => {
      render(<RestTimer initialSeconds={90} />);
      expect(screen.getByText('1:30')).toBeInTheDocument();
      expect(screen.getByText('Start')).toBeInTheDocument();
    });
  });

  describe('Navigation Shell Layout', () => {
    it('renders the 5 primary destinations', () => {
      const onTabChange = vi.fn();
      render(
        <NavigationShell currentTab="dashboard" onTabChange={onTabChange} syncState="saved_locally">
          <div>Dashboard Content</div>
        </NavigationShell>
      );

      expect(screen.getAllByText('Today').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Train').length).toBeGreaterThan(0);
      expect(screen.getAllByText('History').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Progress').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Account').length).toBeGreaterThan(0);
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    });
  });
});
