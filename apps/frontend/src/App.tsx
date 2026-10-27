import React, { useState, useEffect } from 'react';
import { NavigationShell, NavigationTab } from './components/layout/NavigationShell';
import { DashboardView } from './features/dashboard/DashboardView';
import { TrainView } from './features/train/TrainView';
import { ActiveWorkoutView } from './features/workout/ActiveWorkoutView';
import { HistoryView } from './features/history/HistoryView';
import { AnalyticsView } from './features/analytics/AnalyticsView';
import { AccountView } from './features/account/AccountView';
import { SyncState, WorkoutSession, SyncMutation } from '@forge/types';
import { localDb } from './storage/db';
import { GeneratedDayPlan, getPlannedSession } from './features/train/planData';
import { generateUUID } from './utils/uuid';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [activePlan, setActivePlan] = useState<GeneratedDayPlan | null>(null);
  const [restoredSession, setRestoredSession] = useState<WorkoutSession | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncState>('saved_locally');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Check for in-progress active workout on startup (IndexedDB restart resilience)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedActive = await localDb.getActiveWorkout();
        if (savedActive && savedActive.status === 'in_progress') {
          setRestoredSession(savedActive);
          setIsWorkoutActive(true);
        }
        const queuedCount = await localDb.getPendingCount();
        setPendingSyncCount(queuedCount);
      } catch (err) {
        console.error('Failed to restore active workout from IndexedDB:', err);
      } finally {
        setIsInitializing(false);
      }
    };
    restoreSession();
  }, []);

  const handleStartWorkout = (plan: GeneratedDayPlan) => {
    setActivePlan(plan);
    setRestoredSession(null);
    setIsWorkoutActive(true);
  };

  const handleFinishWorkout = async (completedSession: WorkoutSession) => {
    setIsWorkoutActive(false);
    setActivePlan(null);
    setRestoredSession(null);

    // Atomically persist completed workout, clear active draft, and queue sync mutation
    try {
      const mutation: SyncMutation = {
        mutationId: generateUUID(),
        entityType: 'workout_session',
        entityId: completedSession.id,
        operation: 'upsert',
        clientTimestamp: new Date().toISOString(),
        expectedVersion: completedSession.version,
        payload: completedSession,
      };

      await localDb.completeWorkoutTransaction(completedSession, mutation);
      const count = await localDb.getPendingCount();
      setPendingSyncCount(count);
      setSyncState('saved_locally');
    } catch (err) {
      console.error('Atomic completion and queueing failed in IndexedDB:', err);
    }

    setCurrentTab('history');
  };

  const handleCancelWorkout = () => {
    setIsWorkoutActive(false);
    setActivePlan(null);
    setRestoredSession(null);
  };

  const handleLogout = () => {
    alert('Prototype Notice: In Phase P2, this will revoke the HttpOnly cookie session and lock the IndexedDB database.');
  };

  if (isInitializing) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--forge-bg-main)',
          color: 'var(--forge-text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
        }}
      >
        Initializing FORGE Offline Storage...
      </div>
    );
  }

  return (
    <NavigationShell
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      syncState={syncState}
      pendingSyncCount={pendingSyncCount}
      isWorkoutActive={isWorkoutActive}
    >
      {isWorkoutActive ? (
        <ActiveWorkoutView
          initialPlan={activePlan || undefined}
          restoredSession={restoredSession}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={handleCancelWorkout}
        />
      ) : (
        <>
          {currentTab === 'dashboard' && (
            <DashboardView
              onStartWorkout={() => handleStartWorkout(getPlannedSession(2, 1))}
              hasActiveWorkout={false}
              onResumeWorkout={() => handleStartWorkout(getPlannedSession(2, 1))}
            />
          )}

          {currentTab === 'train' && (
            <TrainView onStartSession={handleStartWorkout} />
          )}

          {currentTab === 'history' && <HistoryView />}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'account' && (
            <AccountView
              userEmail="demo.athlete@forge.local"
              displayName="Demo Athlete"
              syncState={syncState}
              pendingSyncCount={pendingSyncCount}
              onLogout={handleLogout}
            />
          )}
        </>
      )}
    </NavigationShell>
  );
};

export default App;
