import React from 'react';
import { SyncState } from '@forge/types';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface SyncStatusBadgeProps {
  status: SyncState;
  pendingCount?: number;
  onClick?: () => void;
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  status,
  pendingCount = 0,
  onClick,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saved_locally':
        return {
          label: pendingCount > 0 ? `Saved locally (${pendingCount})` : 'Saved locally',
          color: 'var(--forge-text-secondary)',
          bg: 'var(--forge-surface-elevated)',
          border: 'var(--forge-border-subtle)',
          icon: <CloudOff size={13} />,
        };
      case 'waiting_to_sync':
        return {
          label: pendingCount > 0 ? `Waiting to sync (${pendingCount})` : 'Waiting to sync',
          color: 'var(--forge-warning)',
          bg: 'rgba(255, 179, 0, 0.12)',
          border: 'rgba(255, 179, 0, 0.35)',
          icon: <Cloud size={13} />,
        };
      case 'synchronizing':
        return {
          label: 'Synchronizing...',
          color: 'var(--forge-info)',
          bg: 'rgba(56, 189, 248, 0.12)',
          border: 'rgba(56, 189, 248, 0.35)',
          icon: <RefreshCw size={13} className="spin-animation" />,
        };
      case 'synced':
        return {
          label: 'Synced',
          color: 'var(--forge-accent-primary)',
          bg: 'var(--forge-accent-dim)',
          border: 'var(--forge-accent-primary)',
          icon: <CheckCircle2 size={13} />,
        };
      case 'sync_failed':
        return {
          label: 'Sync failed (tap to retry)',
          color: 'var(--forge-danger)',
          bg: 'rgba(255, 90, 95, 0.12)',
          border: 'var(--forge-danger)',
          icon: <AlertTriangle size={13} />,
        };
      case 'conflict_requires_attention':
        return {
          label: 'Conflict requires attention',
          color: 'var(--forge-warning)',
          bg: 'rgba(255, 179, 0, 0.2)',
          border: 'var(--forge-warning)',
          icon: <AlertTriangle size={13} />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
      title={`Sync State: ${config.label}`}
      aria-label={`Sync State: ${config.label}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </button>
  );
};
