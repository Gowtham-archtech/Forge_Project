import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  children,
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? '#3A443E' : 'var(--forge-accent-primary)',
          color: disabled ? '#78827C' : '#111416',
          border: 'none',
          fontWeight: 700,
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--forge-surface-elevated)',
          color: 'var(--forge-text-primary)',
          border: '1px solid var(--forge-border-subtle)',
          fontWeight: 600,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--forge-accent-primary)',
          border: '1px solid var(--forge-accent-primary)',
          fontWeight: 600,
        };
      case 'danger':
        return {
          backgroundColor: 'rgba(255, 90, 95, 0.12)',
          color: 'var(--forge-danger)',
          border: '1px solid var(--forge-danger)',
          fontWeight: 600,
        };
      case 'ghost':
      default:
        return {
          backgroundColor: 'transparent',
          color: 'var(--forge-text-secondary)',
          border: 'none',
          fontWeight: 500,
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { minHeight: '36px', padding: '6px 12px', fontSize: '0.85rem' };
      case 'lg':
        return { minHeight: '52px', padding: '14px 24px', fontSize: '1.05rem' };
      case 'md':
      default:
        return { minHeight: '44px', padding: '10px 18px', fontSize: '0.95rem' };
    }
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button disabled={disabled} style={baseStyle} {...props}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
};
