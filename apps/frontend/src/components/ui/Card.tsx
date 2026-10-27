import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'base',
  padding = 'md',
  active = false,
  children,
  style,
  ...props
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none': return '0';
      case 'sm': return '12px';
      case 'lg': return '24px';
      case 'md':
      default: return '16px';
    }
  };

  const getBackgroundColor = () => {
    if (variant === 'elevated') return 'var(--forge-surface-elevated)';
    return 'var(--forge-surface-base)';
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: getBackgroundColor(),
    borderRadius: 'var(--radius-lg)',
    border: active ? '1px solid var(--forge-accent-primary)' : '1px solid var(--forge-border-subtle)',
    padding: getPadding(),
    transition: 'border-color 0.15s ease, background-color 0.15s ease',
    ...(variant === 'interactive' ? { cursor: 'pointer' } : {}),
    ...style,
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
};
