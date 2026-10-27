import React from 'react';
import { Plus, Minus } from 'lucide-react';

export interface NumericInputProps {
  label: string;
  unit?: string;
  value: number;
  step?: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  label,
  unit,
  value,
  step = 1,
  min = 0,
  max = 999,
  onChange,
  disabled = false,
}) => {
  const handleDecrement = () => {
    const next = Math.max(min, Number((value - step).toFixed(2)));
    onChange(next);
  };

  const handleIncrement = () => {
    const next = Math.min(max, Number((value + step).toFixed(2)));
    onChange(next);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--forge-text-secondary)',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        {label} {unit && <span style={{ textTransform: 'none' }}>({unit})</span>}
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--forge-surface-elevated)',
          border: '1px solid var(--forge-border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          height: '46px',
        }}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${label}`}
          style={{
            width: '44px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: disabled || value <= min ? 'var(--forge-text-muted)' : 'var(--forge-text-primary)',
            cursor: disabled || value <= min ? 'not-allowed' : 'pointer',
          }}
        >
          <Minus size={16} />
        </button>

        <input
          type="number"
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          aria-label={label}
          style={{
            flex: 1,
            width: '100%',
            minWidth: '40px',
            background: 'transparent',
            border: 'none',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--forge-text-primary)',
            outline: 'none',
          }}
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          aria-label={`Increase ${label}`}
          style={{
            width: '44px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: disabled || value >= max ? 'var(--forge-text-muted)' : 'var(--forge-text-primary)',
            cursor: disabled || value >= max ? 'not-allowed' : 'pointer',
          }}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
