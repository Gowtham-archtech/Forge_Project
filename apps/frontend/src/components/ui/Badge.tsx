import React from 'react';

export type BadgeVariant = 'accent' | 'neutral' | 'superset' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  supersetPair?: 'A1' | 'A2' | 'B1' | 'B2';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  supersetPair,
  children,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    if (supersetPair) {
      const isGroupA = supersetPair.startsWith('A');
      return {
        backgroundColor: isGroupA ? 'rgba(199, 255, 74, 0.15)' : 'rgba(56, 189, 248, 0.15)',
        color: isGroupA ? 'var(--forge-accent-primary)' : 'var(--forge-info)',
        border: `1px solid ${isGroupA ? 'var(--forge-accent-primary)' : 'var(--forge-info)'}`,
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
      };
    }

    switch (variant) {
      case 'accent':
        return {
          backgroundColor: 'var(--forge-accent-dim)',
          color: 'var(--forge-accent-primary)',
          border: '1px solid var(--forge-accent-primary)',
        };
      case 'success':
        return {
          backgroundColor: 'rgba(199, 255, 74, 0.15)',
          color: 'var(--forge-accent-primary)',
          border: '1px solid var(--forge-accent-primary)',
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(255, 179, 0, 0.15)',
          color: 'var(--forge-warning)',
          border: '1px solid var(--forge-warning)',
        };
      case 'danger':
        return {
          backgroundColor: 'rgba(255, 90, 95, 0.15)',
          color: 'var(--forge-danger)',
          border: '1px solid var(--forge-danger)',
        };
      case 'neutral':
      default:
        return {
          backgroundColor: 'var(--forge-surface-elevated)',
          color: 'var(--forge-text-secondary)',
          border: '1px solid var(--forge-border-subtle)',
        };
    }
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    ...getVariantStyles(),
    ...style,
  };

  return (
    <span style={badgeStyle} {...props}>
      {supersetPair ? `SUPERSET ${supersetPair}` : children}
    </span>
  );
};
