import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, Dumbbell, History as HistoryIcon } from 'lucide-react';
import { WorkoutSession } from '@forge/types';
import { localDb } from '../../storage/db';

export const HistoryView: React.FC = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const list = await localDb.getCompletedWorkouts();
        setSessions(list.reverse()); // Most recent first
      } catch (err) {
        console.error('Failed to load completed workouts from IndexedDB:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ marginBottom: '4px' }}>Workout History</h1>
        <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.95rem' }}>
          Immutable historical log loaded from your local IndexedDB database
        </p>
      </div>

      {loading ? (
        <Card variant="base" style={{ padding: '24px', textAlign: 'center', color: 'var(--forge-text-secondary)' }}>
          Loading saved history...
        </Card>
      ) : sessions.length === 0 ? (
        <Card variant="base" style={{ padding: '32px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--forge-surface-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--forge-text-secondary)',
            }}
          >
            <HistoryIcon size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>No Completed Workouts Yet</h2>
            <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.85rem' }}>
              Your finished sessions will appear here as permanent, immutable snapshots.
            </p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sessions.map((session) => {
            const completedSets = session.exercises.reduce(
              (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
              0
            );
            const totalVolume = session.exercises.reduce(
              (acc, ex) =>
                acc +
                ex.sets
                  .filter((s) => s.completed)
                  .reduce((setAcc, s) => setAcc + s.actualWeightKg * s.actualReps, 0),
              0
            );
            const durationMins = Math.round((session.durationSeconds || 0) / 60);

            return (
              <Card
                key={session.id}
                variant="base"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--forge-accent-primary)" />
                    <span style={{ fontSize: '0.82rem', color: 'var(--forge-text-secondary)', fontWeight: 600 }}>
                      {formatDate(session.startedAt)}
                    </span>
                  </div>
                  <Badge variant="accent">Snapshot Immutable</Badge>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{session.splitName}</h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--forge-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {totalVolume.toLocaleString()} kg volume
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '0.82rem',
                    color: 'var(--forge-text-secondary)',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--forge-border-subtle)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {durationMins > 0 ? `${durationMins} mins` : '< 1 min'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Dumbbell size={13} /> {completedSets} sets completed
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
