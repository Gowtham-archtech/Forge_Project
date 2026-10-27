import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Play, Flame, Calendar } from 'lucide-react';
import { SplitDayName } from '@forge/types';

export interface DashboardViewProps {
  onStartWorkout: (split: SplitDayName) => void;
  hasActiveWorkout: boolean;
  onResumeWorkout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartWorkout,
  hasActiveWorkout,
  onResumeWorkout,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome & Focus Banner */}
      <div>
        <h1 style={{ marginBottom: '4px' }}>Welcome back, Gowtham</h1>
        <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.95rem' }}>
          Week 2 • Day 1 of 5-Day Hypertrophy Cycle
        </p>
      </div>

      {/* Active Workout Resumption Card (if in progress) */}
      {hasActiveWorkout ? (
        <Card variant="elevated" active style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Badge variant="accent">In Progress</Badge>
            <span style={{ fontSize: '0.8rem', color: 'var(--forge-accent-primary)', fontWeight: 600 }}>
              Session Paused
            </span>
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Chest + Triceps</h2>
            <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.85rem' }}>
              3 of 6 exercises completed
            </p>
          </div>
          <Button variant="primary" fullWidth size="lg" icon={<Play size={18} />} onClick={onResumeWorkout}>
            Resume Workout
          </Button>
        </Card>
      ) : (
        /* Today's Planned Session Card */
        <Card variant="elevated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--forge-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 700,
              }}
            >
              Today's Mission
            </span>
            <Badge variant="neutral">Day 1 of 5</Badge>
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Chest + Triceps</h2>
            <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.88rem' }}>
              6 exercises • 2 superset pairs • ~50 mins
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: 'var(--forge-surface-base)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--forge-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--forge-text-primary)', fontWeight: 600 }}>1. Barbell Bench Press</span>
              <span style={{ color: 'var(--forge-text-secondary)' }}>4 sets × 6-8 reps</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Badge supersetPair="A1" />
                <span style={{ color: 'var(--forge-text-primary)', fontWeight: 600 }}>Incline DB Press</span>
              </div>
              <span style={{ color: 'var(--forge-text-secondary)' }}>3 sets × 8-10 reps</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Badge supersetPair="A2" />
                <span style={{ color: 'var(--forge-text-primary)', fontWeight: 600 }}>Cable Overhead Triceps</span>
              </div>
              <span style={{ color: 'var(--forge-text-secondary)' }}>3 sets × 12-15 reps</span>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            icon={<Play size={18} />}
            onClick={() => onStartWorkout('Chest + Triceps')}
          >
            Start Workout
          </Button>
        </Card>
      )}

      {/* Quick Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        <Card padding="sm" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forge-text-secondary)' }}>
            <Flame size={15} color="var(--forge-accent-primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Weekly Adherence</span>
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>3 / 5</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--forge-text-muted)' }}>Days completed</span>
        </Card>

        <Card padding="sm" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forge-text-secondary)' }}>
            <Calendar size={15} color="var(--forge-info)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Training Split</span>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>5-Day</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--forge-text-muted)' }}>Exact supersets</span>
        </Card>
      </div>
    </div>
  );
};
