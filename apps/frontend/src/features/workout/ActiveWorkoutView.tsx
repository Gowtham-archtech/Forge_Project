import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { NumericInput } from '../../components/ui/NumericInput';
import { RestTimer } from '../../components/ui/RestTimer';
import { Check, CheckCircle2, XCircle, Timer, AlertCircle } from 'lucide-react';
import { SplitDayName } from '@forge/types';

export interface ActiveWorkoutViewProps {
  splitName: SplitDayName;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
}

interface ActiveSet {
  setNumber: number;
  targetReps: number;
  actualReps: number;
  targetWeightKg: number;
  actualWeightKg: number;
  completed: boolean;
}

interface ActiveExercise {
  id: string;
  name: string;
  supersetPair?: 'A1' | 'A2' | 'B1' | 'B2';
  sets: ActiveSet[];
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  splitName,
  onFinishWorkout,
  onCancelWorkout,
}) => {
  const [exercises, setExercises] = useState<ActiveExercise[]>([
    {
      id: 'ex-1',
      name: 'Incline Dumbbell Press',
      supersetPair: 'A1',
      sets: [
        { setNumber: 1, targetReps: 10, actualReps: 10, targetWeightKg: 28, actualWeightKg: 28, completed: true },
        { setNumber: 2, targetReps: 10, actualReps: 10, targetWeightKg: 28, actualWeightKg: 28, completed: false },
        { setNumber: 3, targetReps: 8, actualReps: 8, targetWeightKg: 30, actualWeightKg: 30, completed: false },
      ],
    },
    {
      id: 'ex-2',
      name: 'Overhead Cable Triceps Extension',
      supersetPair: 'A2',
      sets: [
        { setNumber: 1, targetReps: 12, actualReps: 12, targetWeightKg: 32, actualWeightKg: 32, completed: true },
        { setNumber: 2, targetReps: 12, actualReps: 12, targetWeightKg: 32, actualWeightKg: 32, completed: false },
        { setNumber: 3, targetReps: 12, actualReps: 12, targetWeightKg: 32, actualWeightKg: 32, completed: false },
      ],
    },
  ]);

  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);
  const [activeExIdx, setActiveExIdx] = useState<number>(0);
  const [activeSetIdx, setActiveSetIdx] = useState<number>(1);

  const toggleSetCompleted = (exIdx: number, setIdx: number) => {
    setExercises((prev) => {
      const next = [...prev];
      const targetEx = { ...next[exIdx] };
      const targetSets = [...targetEx.sets];
      const current = targetSets[setIdx];

      targetSets[setIdx] = { ...current, completed: !current.completed };
      targetEx.sets = targetSets;
      next[exIdx] = targetEx;
      return next;
    });

    if (!exercises[exIdx].sets[setIdx].completed) {
      setShowRestTimer(true);
    }
  };

  const updateSetValues = (exIdx: number, setIdx: number, reps: number, weight: number) => {
    setExercises((prev) => {
      const next = [...prev];
      const targetEx = { ...next[exIdx] };
      const targetSets = [...targetEx.sets];
      targetSets[setIdx] = {
        ...targetSets[setIdx],
        actualReps: reps,
        actualWeightKg: weight,
      };
      targetEx.sets = targetSets;
      next[exIdx] = targetEx;
      return next;
    });
  };

  const currentExercise = exercises[activeExIdx];
  const currentSet = currentExercise?.sets[activeSetIdx];

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Session Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--forge-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Live Workout
          </span>
          <h1 style={{ fontSize: '1.4rem' }}>{splitName}</h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Timer size={14} />}
          onClick={() => setShowRestTimer((prev) => !prev)}
        >
          {showRestTimer ? 'Hide Rest' : 'Rest Timer'}
        </Button>
      </div>

      {/* Progress Metric */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--forge-surface-base)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--forge-border-subtle)',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--forge-text-secondary)' }}>
          Session Sets Completed
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--forge-accent-primary)' }}>
          {completedSets} / {totalSets}
        </span>
      </div>

      {/* Embedded Rest Timer when requested */}
      {showRestTimer && (
        <RestTimer initialSeconds={90} onTimerComplete={() => setShowRestTimer(false)} />
      )}

      {/* Active Set Numeric Stepper Card */}
      {currentSet && (
        <Card variant="elevated" active style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentExercise.supersetPair && (
                <Badge supersetPair={currentExercise.supersetPair} />
              )}
              <h2 style={{ fontSize: '1.15rem', margin: 0 }}>{currentExercise.name}</h2>
            </div>
            <Badge variant="accent">Set {currentSet.setNumber} of {currentExercise.sets.length}</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <NumericInput
              label="Weight"
              unit="kg"
              value={currentSet.actualWeightKg}
              step={2.5}
              onChange={(w) => updateSetValues(activeExIdx, activeSetIdx, currentSet.actualReps, w)}
            />
            <NumericInput
              label="Reps"
              value={currentSet.actualReps}
              step={1}
              onChange={(r) => updateSetValues(activeExIdx, activeSetIdx, r, currentSet.actualWeightKg)}
            />
          </div>

          <Button
            variant={currentSet.completed ? 'secondary' : 'primary'}
            fullWidth
            size="lg"
            icon={<Check size={18} />}
            onClick={() => toggleSetCompleted(activeExIdx, activeSetIdx)}
          >
            {currentSet.completed ? 'Set Marked Complete (Tap to Undo)' : 'Complete Set'}
          </Button>
        </Card>
      )}

      {/* Set Checklist by Exercise */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {exercises.map((ex, eIdx) => (
          <Card key={ex.id} variant="base" padding="sm" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {ex.supersetPair && <Badge supersetPair={ex.supersetPair} />}
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ex.name}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--forge-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {ex.sets.filter((s) => s.completed).length}/{ex.sets.length}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ex.sets.map((set, sIdx) => {
                const isSelected = activeExIdx === eIdx && activeSetIdx === sIdx;
                return (
                  <button
                    key={set.setNumber}
                    onClick={() => {
                      setActiveExIdx(eIdx);
                      setActiveSetIdx(sIdx);
                    }}
                    style={{
                      flex: 1,
                      minWidth: '60px',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: set.completed
                        ? 'var(--forge-accent-dim)'
                        : isSelected
                        ? 'var(--forge-surface-elevated)'
                        : 'var(--forge-surface-base)',
                      border: isSelected
                        ? '2px solid var(--forge-accent-primary)'
                        : set.completed
                        ? '1px solid var(--forge-accent-primary)'
                        : '1px solid var(--forge-border-subtle)',
                      color: set.completed ? 'var(--forge-accent-primary)' : 'var(--forge-text-primary)',
                      fontWeight: 700,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem' }}>Set {set.setNumber}</span>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                      {set.actualWeightKg}k × {set.actualReps}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Completion & Cancellation Footer */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <Button
          variant="danger"
          size="md"
          icon={<XCircle size={16} />}
          onClick={() => setShowCancelConfirm(true)}
          style={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          icon={<CheckCircle2 size={16} />}
          onClick={onFinishWorkout}
          style={{ flex: 2 }}
        >
          Finish Workout
        </Button>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <Card variant="elevated" style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--forge-danger)' }}>
              <AlertCircle size={22} />
              <h2 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--forge-text-primary)' }}>
                Cancel Workout?
              </h2>
            </div>
            <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.9rem' }}>
              Are you sure you want to discard this workout? Unfinished sets will not be recorded to your history.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowCancelConfirm(false)}>
                Keep Training
              </Button>
              <Button variant="danger" onClick={onCancelWorkout}>
                Discard Session
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
