import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, Dumbbell } from 'lucide-react';

export const HistoryView: React.FC = () => {
  // Sample historical immutable sessions
  const historicalWorkouts = [
    {
      id: 'session-101',
      date: 'Yesterday, 6:30 PM',
      splitName: 'Legs + Abs',
      durationMinutes: 52,
      totalVolumeKg: 7850,
      exercisesCompleted: 6,
      supersets: 2,
    },
    {
      id: 'session-100',
      date: 'Oct 24, 2026',
      splitName: 'Back + Biceps',
      durationMinutes: 48,
      totalVolumeKg: 8200,
      exercisesCompleted: 6,
      supersets: 2,
    },
    {
      id: 'session-99',
      date: 'Oct 22, 2026',
      splitName: 'Chest + Triceps',
      durationMinutes: 45,
      totalVolumeKg: 6900,
      exercisesCompleted: 6,
      supersets: 2,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ marginBottom: '4px' }}>Workout History</h1>
        <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.95rem' }}>
          Immutable historical log of your completed training sessions
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {historicalWorkouts.map((session) => (
          <Card
            key={session.id}
            variant="base"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="var(--forge-accent-primary)" />
                <span style={{ fontSize: '0.82rem', color: 'var(--forge-text-secondary)', fontWeight: 600 }}>
                  {session.date}
                </span>
              </div>
              <Badge variant="accent">Completed</Badge>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{session.splitName}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--forge-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {session.totalVolumeKg.toLocaleString()} kg volume
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
                <Clock size={13} /> {session.durationMinutes} mins
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Dumbbell size={13} /> {session.exercisesCompleted} exercises
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
