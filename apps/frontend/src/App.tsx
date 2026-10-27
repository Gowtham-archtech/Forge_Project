import React, { useState } from 'react';
import { NavigationShell, NavigationTab } from './components/layout/NavigationShell';
import { DashboardView } from './features/dashboard/DashboardView';
import { TrainView } from './features/train/TrainView';
import { ActiveWorkoutView } from './features/workout/ActiveWorkoutView';
import { HistoryView } from './features/history/HistoryView';
import { AnalyticsView } from './features/analytics/AnalyticsView';
import { AccountView } from './features/account/AccountView';
import { SyncState, SplitDayName } from '@forge/types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [activeWorkoutSplit, setActiveWorkoutSplit] = useState<SplitDayName | null>(null);
  const [syncState, setSyncState] = useState<SyncState>('saved_locally');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(1);

  const handleStartWorkout = (split: SplitDayName) => {
    setActiveWorkoutSplit(split);
  };

  const handleFinishWorkout = () => {
    setActiveWorkoutSplit(null);
    setPendingSyncCount((prev) => prev + 1);
    setSyncState('saved_locally');
    setCurrentTab('history');
  };

  const handleCancelWorkout = () => {
    setActiveWorkoutSplit(null);
  };

  const handleTriggerSync = () => {
    setSyncState('synchronizing');
    setTimeout(() => {
      setSyncState('synced');
      setPendingSyncCount(0);
    }, 1500);
  };

  const handleLogout = () => {
    alert('Logged out: Active session closed and local database locked.');
  };

  return (
    <NavigationShell
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      syncState={syncState}
      pendingSyncCount={pendingSyncCount}
      onSyncBadgeClick={handleTriggerSync}
      isWorkoutActive={!!activeWorkoutSplit}
    >
      {activeWorkoutSplit ? (
        <ActiveWorkoutView
          splitName={activeWorkoutSplit}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={handleCancelWorkout}
        />
      ) : (
        <>
          {currentTab === 'dashboard' && (
            <DashboardView
              onStartWorkout={handleStartWorkout}
              hasActiveWorkout={false}
              onResumeWorkout={() => handleStartWorkout('Chest + Triceps')}
            />
          )}

          {currentTab === 'train' && (
            <TrainView onStartSession={handleStartWorkout} />
          )}

          {currentTab === 'history' && <HistoryView />}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'account' && (
            <AccountView
              userEmail="gowtham@forge.local"
              displayName="Gowtham"
              syncState={syncState}
              pendingSyncCount={pendingSyncCount}
              onLogout={handleLogout}
              onTriggerSync={handleTriggerSync}
            />
          )}
        </>
      )}
    </NavigationShell>
  );
};

export default App;
