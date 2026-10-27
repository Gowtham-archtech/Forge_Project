import React from 'react';
import { Card } from '../../components/ui/Card';
import { Trophy } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const prs = [
    { exercise: 'Barbell Bench Press', weight: '105 kg', reps: 5, date: 'Oct 20, 2026' },
    { exercise: 'Barbell Romanian Deadlift', weight: '140 kg', reps: 6, date: 'Oct 18, 2026' },
    { exercise: 'Incline Dumbbell Press', weight: '36 kg', reps: 8, date: 'Oct 14, 2026' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ marginBottom: '4px' }}>Progress & Analytics</h1>
        <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.95rem' }}>
          Personal records and performance monitoring
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--forge-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Top Personal Records
        </h2>

        {prs.map((pr) => (
          <Card key={pr.exercise} variant="elevated" padding="sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--forge-accent-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--forge-accent-primary)',
                }}
              >
                <Trophy size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', margin: 0 }}>{pr.exercise}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--forge-text-secondary)' }}>
                  Achieved {pr.date}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--forge-accent-primary)' }}>
                {pr.weight}
              </span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--forge-text-secondary)' }}>
                {pr.reps} reps
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
