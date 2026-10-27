import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SyncStatusBadge } from '../components/ui/SyncStatusBadge';
import { NumericInput } from '../components/ui/NumericInput';
import { RestTimer } from '../components/ui/RestTimer';
import { NavigationShell } from '../components/layout/NavigationShell';
import {
  TrainingProgramPlan,
  validateTrainingProgramSupersets,
  SplitDayName,
} from '@forge/types';

describe('FORGE Foundation — P1 Acceptance Tests', () => {
  describe('Superset Exact Acceptance Rules', () => {
    it('validates that Week 1 has 0 superset pairs and Weeks 2-4 have 2 superset pairs per day', () => {
      const splitDays: SplitDayName[] = [
        'Chest + Triceps',
        'Back + Biceps',
        'Legs + Abs',
        'Chest + Back',
        'Shoulders + Arms + Abs',
      ];

      // Build a conforming 4-week program
      const conformingProgram: TrainingProgramPlan = {
        id: 'plan-hypertrophy-01',
        title: 'FORGE 4-Week Hypertrophy Cycle',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        weeks: ([1, 2, 3, 4] as const).map((weekNum) => ({
          weekNumber: weekNum,
          days: splitDays.map((name, idx) => ({
            dayNumber: (idx + 1) as 1 | 2 | 3 | 4 | 5,
            splitName: name,
            exercises: [],
            supersetPairs:
              weekNum === 1
                ? [] // Exactly 0 for Week 1
                : [
                    { id: `pA_${weekNum}_${idx}`, label: 'A', exerciseAId: 'ex1', exerciseBId: 'ex2' },
                    { id: `pB_${weekNum}_${idx}`, label: 'B', exerciseAId: 'ex3', exerciseBId: 'ex4' },
                  ], // Exactly 2 for Weeks 2-4
          })),
        })),
      };

      const result = validateTrainingProgramSupersets(conformingProgram);
      expect(result.valid).toBe(true);

      // Verify total supersets across Weeks 2-4 equals exactly 30
      const totalWeek2to4Supersets = conformingProgram.weeks
        .filter((w) => w.weekNumber >= 2 && w.weekNumber <= 4)
        .reduce((sum, w) => sum + w.days.reduce((dSum, d) => dSum + d.supersetPairs.length, 0), 0);

      expect(totalWeek2to4Supersets).toBe(30);
    });

    it('rejects a program where Week 1 improperly contains superset pairs', () => {
      const invalidProgram: TrainingProgramPlan = {
        id: 'invalid-01',
        title: 'Invalid Program',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        weeks: [
          {
            weekNumber: 1,
            days: [
              {
                dayNumber: 1,
                splitName: 'Chest + Triceps',
                exercises: [],
                supersetPairs: [
                  { id: 'p1', label: 'A', exerciseAId: 'ex1', exerciseBId: 'ex2' },
                ],
              },
            ],
          },
        ],
      };

      const result = validateTrainingProgramSupersets(invalidProgram);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Week 1 Day 1 (Chest + Triceps) must have exactly 0 superset pairs');
    });
  });

  describe('Sync Status Presentation & Truthfulness', () => {
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
