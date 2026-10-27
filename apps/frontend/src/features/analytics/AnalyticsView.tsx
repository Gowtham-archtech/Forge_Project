import React from 'react';
import { Card } from '../../components/ui/Card';
import { Trophy, Info } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const prs = [
    { exercise: 'Barbell Flat Bench Press', weight: '105 kg', reps: 5, date: 'Oct 20, 2026' },
    { exercise: 'Barbell Back Squat', weight: '140 kg', reps: 6, date: 'Oct 18, 2026' },
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

      {/* Scope Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: 'var(--forge-text-primary)',
          fontSize: '0.85rem',
        }}
      >
        <Info size={18} color="var(--forge-info)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Pilot Notice:</strong> Advanced PR trajectory calculation, gripper tracking, and multi-metric charts are deferred to Phase P3. The data below is sample preview data.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--forge-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Preview Records
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
