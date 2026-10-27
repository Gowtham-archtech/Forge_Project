import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Play, Info } from 'lucide-react';
import { SplitDayName } from '@forge/types';

export interface TrainViewProps {
  onStartSession: (dayName: SplitDayName) => void;
}

interface SplitDayItem {
  dayNumber: 1 | 2 | 3 | 4 | 5;
  splitName: SplitDayName;
  focus: string;
  exercisesCount: number;
  supersetCountWeek1: number;
  supersetCountWeek2to4: number;
}

const FIVE_DAY_SPLIT: SplitDayItem[] = [
  { dayNumber: 1, splitName: 'Chest + Triceps', focus: 'Anterior chain & elbow extension', exercisesCount: 6, supersetCountWeek1: 0, supersetCountWeek2to4: 2 },
  { dayNumber: 2, splitName: 'Back + Biceps', focus: 'Vertical/horizontal pull & elbow flexion', exercisesCount: 6, supersetCountWeek1: 0, supersetCountWeek2to4: 2 },
  { dayNumber: 3, splitName: 'Legs + Abs', focus: 'Quad/hamstring compound & core', exercisesCount: 6, supersetCountWeek1: 0, supersetCountWeek2to4: 2 },
  { dayNumber: 4, splitName: 'Chest + Back', focus: 'Antagonist upper body hypertrophy', exercisesCount: 6, supersetCountWeek1: 0, supersetCountWeek2to4: 2 },
  { dayNumber: 5, splitName: 'Shoulders + Arms + Abs', focus: 'Deltoid caps, arm volume & core', exercisesCount: 7, supersetCountWeek1: 0, supersetCountWeek2to4: 2 },
];

export const TrainView: React.FC<TrainViewProps> = ({ onStartSession }) => {
  const [selectedWeek, setSelectedWeek] = useState<1 | 2 | 3 | 4>(2);
  const [activeDay, setActiveDay] = useState<SplitDayItem>(FIVE_DAY_SPLIT[0]);

  const supersetCountForCurrentWeek = selectedWeek === 1 ? 0 : 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ marginBottom: '4px' }}>Training Split</h1>
        <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.95rem' }}>
          5-Day Fixed Hypertrophy Split with Rule-Enforced Supersets
        </p>
      </div>

      {/* Week Selector */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--forge-surface-base)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--forge-border-subtle)',
          gap: '4px',
        }}
      >
        {[1, 2, 3, 4].map((wk) => {
          const isSelected = selectedWeek === wk;
          return (
            <button
              key={wk}
              onClick={() => setSelectedWeek(wk as 1 | 2 | 3 | 4)}
              style={{
                flex: 1,
                minHeight: '38px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isSelected ? 'var(--forge-surface-elevated)' : 'transparent',
                color: isSelected ? 'var(--forge-accent-primary)' : 'var(--forge-text-secondary)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Week {wk} {wk === 1 ? '(0 Supersets)' : '(2 Pairs/Day)'}
            </button>
          );
        })}
      </div>

      {/* Superset Acceptance Rule Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          color: 'var(--forge-text-primary)',
          fontSize: '0.85rem',
        }}
      >
        <Info size={18} color="var(--forge-info)" style={{ flexShrink: 0 }} />
        <span>
          {selectedWeek === 1
            ? 'Week 1 Adaptation Rule: Exactly 0 superset pairs per training day.'
            : `Week ${selectedWeek} Superset Rule: Exactly 2 superset pairs (A1/A2, B1/B2) per training day.`}
        </span>
      </div>

      {/* Days List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {FIVE_DAY_SPLIT.map((item) => {
          const isSelected = activeDay.dayNumber === item.dayNumber;
          return (
            <Card
              key={item.dayNumber}
              variant={isSelected ? 'elevated' : 'base'}
              active={isSelected}
              onClick={() => setActiveDay(item)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--forge-accent-primary)',
                      padding: '2px 8px',
                      backgroundColor: 'var(--forge-accent-dim)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    DAY {item.dayNumber}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{item.splitName}</h3>
                </div>

                <Badge variant={supersetCountForCurrentWeek > 0 ? 'accent' : 'neutral'}>
                  {supersetCountForCurrentWeek === 0 ? 'Straight Sets' : '2 Supersets'}
                </Badge>
              </div>

              <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.82rem' }}>
                {item.focus}
              </p>

              {isSelected && (
                <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid var(--forge-border-subtle)' }}>
                  <Button
                    variant="primary"
                    fullWidth
                    size="md"
                    icon={<Play size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartSession(item.splitName);
                    }}
                  >
                    Start {item.splitName}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
