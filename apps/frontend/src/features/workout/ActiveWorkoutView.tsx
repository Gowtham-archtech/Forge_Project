import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { NumericInput } from '../../components/ui/NumericInput';
import { RestTimer } from '../../components/ui/RestTimer';
import { Check, CheckCircle2, XCircle, Timer, AlertCircle, Database } from 'lucide-react';
import { WorkoutSession, RecordedExercise } from '@forge/types';
import { GeneratedDayPlan } from '../train/planData';
import { localDb } from '../../storage/db';
import { generateUUID } from '../../utils/uuid';

export interface ActiveWorkoutViewProps {
  initialPlan?: GeneratedDayPlan;
  restoredSession?: WorkoutSession | null;
  onFinishWorkout: (session: WorkoutSession) => void;
  onCancelWorkout: () => void;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  initialPlan,
  restoredSession,
  onFinishWorkout,
  onCancelWorkout,
}) => {
  // Initialize workout session structure with compliant UUID v4 IDs
  const [session, setSession] = useState<WorkoutSession>(() => {
    if (restoredSession) return restoredSession;

    const plan = initialPlan!;
    const exercises: RecordedExercise[] = plan.exercises.map((pe, idx) => {
      let supersetLabel: 'A1' | 'A2' | 'B1' | 'B2' | undefined;
      if (plan.supersetPairs.length > 0) {
        if (pe.supersetPairId === plan.supersetPairs[0]?.id) {
          supersetLabel = pe.exerciseId === plan.supersetPairs[0].exerciseAId ? 'A1' : 'A2';
        } else if (pe.supersetPairId === plan.supersetPairs[1]?.id) {
          supersetLabel = pe.exerciseId === plan.supersetPairs[1].exerciseAId ? 'B1' : 'B2';
        }
      }

      return {
        exerciseId: pe.exerciseId,
        exerciseName: pe.exerciseName,
        targetMuscleGroup: plan.splitName,
        orderIndex: idx,
        supersetPairLabel: supersetLabel,
        sets: Array.from({ length: pe.targetSets }, (_, sIdx) => ({
          id: generateUUID(),
          setNumber: sIdx + 1,
          targetReps: pe.targetRepsMin,
          actualReps: pe.targetRepsMin,
          targetWeightKg: pe.targetWeightKg || 0,
          actualWeightKg: pe.targetWeightKg || 0,
          completed: false,
        })),
      };
    });

    return {
      id: generateUUID(),
      userId: 'demo_user',
      weekNumber: plan.weekNumber,
      dayNumber: plan.dayNumber,
      splitName: plan.splitName,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      exercises,
      version: 1,
      updatedAt: new Date().toISOString(),
    };
  });

  const [activeExIdx, setActiveExIdx] = useState<number>(0);
  const [activeSetIdx, setActiveSetIdx] = useState<number>(0);
  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved'>('saved');

  // Durable persistence: Every time session changes, write to IndexedDB!
  useEffect(() => {
    let isMounted = true;
    const persist = async () => {
      setSaveStatus('saving');
      try {
        await localDb.saveActiveWorkout(session);
        if (isMounted) setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to persist active workout to IndexedDB:', err);
      }
    };
    persist();
    return () => {
      isMounted = false;
    };
  }, [session]);

  const toggleSetCompleted = (eIdx: number, sIdx: number) => {
    setSession((prev) => {
      const nextExercises = [...prev.exercises];
      const targetEx = { ...nextExercises[eIdx] };
      const targetSets = [...targetEx.sets];
      const current = targetSets[sIdx];

      const willComplete = !current.completed;
      targetSets[sIdx] = {
        ...current,
        completed: willComplete,
        completedAt: willComplete ? new Date().toISOString() : undefined,
      };
      targetEx.sets = targetSets;
      nextExercises[eIdx] = targetEx;

      return {
        ...prev,
        exercises: nextExercises,
        updatedAt: new Date().toISOString(),
      };
    });

    if (!session.exercises[eIdx].sets[sIdx].completed) {
      setShowRestTimer(true);
    }
  };

  const updateSetValues = (eIdx: number, sIdx: number, reps: number, weight: number) => {
    setSession((prev) => {
      const nextExercises = [...prev.exercises];
      const targetEx = { ...nextExercises[eIdx] };
      const targetSets = [...targetEx.sets];
      targetSets[sIdx] = {
        ...targetSets[sIdx],
        actualReps: reps,
        actualWeightKg: weight,
      };
      targetEx.sets = targetSets;
      nextExercises[eIdx] = targetEx;

      return {
        ...prev,
        exercises: nextExercises,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleFinish = () => {
    const completedSession: WorkoutSession = {
      ...session,
      status: 'completed',
      completedAt: new Date().toISOString(),
      durationSeconds: Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000),
      updatedAt: new Date().toISOString(),
    };

    onFinishWorkout(completedSession);
  };

  const handleCancel = async () => {
    await localDb.clearActiveWorkout();
    onCancelWorkout();
  };

  const currentExercise = session.exercises[activeExIdx];
  const currentSet = currentExercise?.sets[activeSetIdx];

  const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = session.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Session Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--forge-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Week {session.weekNumber} • Day {session.dayNumber}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--forge-accent-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <Database size={11} /> {saveStatus === 'saved' ? 'IndexedDB Saved' : 'Writing...'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.4rem' }}>{session.splitName}</h1>
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
          Completed Sets
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--forge-accent-primary)' }}>
          {completedSets} / {totalSets}
        </span>
      </div>

      {/* Embedded Rest Timer */}
      {showRestTimer && (
        <RestTimer initialSeconds={90} onTimerComplete={() => setShowRestTimer(false)} />
      )}

      {/* Active Set Numeric Stepper Card */}
      {currentSet && (
        <Card variant="elevated" active style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentExercise.supersetPairLabel && (
                <Badge supersetPair={currentExercise.supersetPairLabel} />
              )}
              <h2 style={{ fontSize: '1.15rem', margin: 0 }}>{currentExercise.exerciseName}</h2>
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

      {/* Exercise and Sets Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {session.exercises.map((ex, eIdx) => (
          <Card key={ex.exerciseId} variant="base" padding="sm" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {ex.supersetPairLabel && <Badge supersetPair={ex.supersetPairLabel} />}
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ex.exerciseName}</span>
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
                    key={set.id}
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
          Discard
        </Button>
        <Button
          variant="primary"
          size="md"
          icon={<CheckCircle2 size={16} />}
          onClick={handleFinish}
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
                Discard Workout?
              </h2>
            </div>
            <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.9rem' }}>
              Are you sure you want to discard this workout? In-progress sets will be purged from IndexedDB.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowCancelConfirm(false)}>
                Keep Training
              </Button>
              <Button variant="danger" onClick={handleCancel}>
                Discard Session
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
