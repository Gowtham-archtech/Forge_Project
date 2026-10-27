import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, BellRing } from 'lucide-react';
import { Button } from './Button';

export interface RestTimerProps {
  initialSeconds?: number;
  onTimerComplete?: () => void;
  autoStart?: boolean;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 90,
  onTimerComplete,
  autoStart = false,
}) => {
  const [targetSeconds, setTargetSeconds] = useState<number>(initialSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsAlerting(true);
            if (onTimerComplete) onTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimerComplete]);

  const toggleRunning = () => {
    if (isAlerting) setIsAlerting(false);
    if (secondsRemaining === 0) {
      setSecondsRemaining(targetSeconds);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsAlerting(false);
    setSecondsRemaining(targetSeconds);
  };

  const adjustSeconds = (delta: number) => {
    setSecondsRemaining((prev) => Math.max(0, prev + delta));
    setTargetSeconds((prev) => Math.max(15, prev + delta));
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.max(0, ((targetSeconds - secondsRemaining) / (targetSeconds || 1)) * 100));

  return (
    <div
      style={{
        backgroundColor: 'var(--forge-surface-elevated)',
        border: isAlerting
          ? '1px solid var(--forge-accent-primary)'
          : '1px solid var(--forge-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: isAlerting ? '0 0 16px rgba(199, 255, 74, 0.25)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '0.82rem',
            color: 'var(--forge-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600,
          }}
        >
          Rest Stopwatch
        </span>
        {isAlerting && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--forge-accent-primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <BellRing size={14} className="spin-animation" /> REST COMPLETED
          </span>
        )}
      </div>

      {/* Timer Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 0',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: isAlerting ? 'var(--forge-accent-primary)' : 'var(--forge-text-primary)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          {formatTime(secondsRemaining)}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'var(--forge-surface-base)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: isAlerting ? 'var(--forge-danger)' : 'var(--forge-accent-primary)',
            transition: 'width 1s linear',
          }}
        />
      </div>

      {/* Quick Controls */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => adjustSeconds(-15)}
          title="Minus 15s"
          icon={<Minus size={14} />}
        >
          15s
        </Button>
        <Button
          size="md"
          variant={isRunning ? 'secondary' : 'primary'}
          onClick={toggleRunning}
          icon={isRunning ? <Pause size={18} /> : <Play size={18} />}
          style={{ minWidth: '100px' }}
        >
          {isRunning ? 'Pause' : secondsRemaining === 0 ? 'Restart' : 'Start'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => adjustSeconds(30)}
          title="Plus 30s"
          icon={<Plus size={14} />}
        >
          30s
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={resetTimer}
          title="Reset timer"
          icon={<RotateCcw size={16} />}
        />
      </div>
    </div>
  );
};
