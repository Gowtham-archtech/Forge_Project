import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Database, Wifi, LogOut, Info } from 'lucide-react';
import { SyncState } from '@forge/types';

export interface AccountViewProps {
  userEmail: string;
  displayName: string;
  syncState: SyncState;
  pendingSyncCount: number;
  onLogout: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  userEmail,
  displayName,
  syncState,
  pendingSyncCount,
  onLogout,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ marginBottom: '4px' }}>Account & Settings</h1>
        <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.95rem' }}>
          Device connection, local data isolation & session management
        </p>
      </div>

      {/* Prototype Disclaimer Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(255, 179, 0, 0.1)',
          border: '1px solid rgba(255, 179, 0, 0.3)',
          color: 'var(--forge-text-primary)',
          fontSize: '0.85rem',
        }}
      >
        <Info size={18} color="var(--forge-warning)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Mode:</strong> User identity below is a local preview. In Phase P2, this will be populated directly from Codex's HttpOnly session API.
        </span>
      </div>

      {/* User Profile Card */}
      <Card variant="elevated" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--forge-surface-base)',
            border: '2px solid var(--forge-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--forge-text-secondary)',
          }}
        >
          <User size={26} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.15rem', margin: 0 }}>{displayName}</h2>
            <Badge variant="warning">Local Preview</Badge>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--forge-text-secondary)' }}>
            {userEmail}
          </span>
        </div>
      </Card>

      {/* Local Storage & Device Isolation Details */}
      <Card variant="base" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} color="var(--forge-accent-primary)" />
          <h3 style={{ fontSize: '0.95rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            IndexedDB Local Storage
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--forge-text-secondary)' }}>Database Scope:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--forge-text-primary)' }}>
              forge_db_demo_user
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--forge-text-secondary)' }}>Sync Truth Status:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--forge-accent-primary)', textTransform: 'capitalize' }}>
              {syncState.replace(/_/g, ' ')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--forge-text-secondary)' }}>Local Unsynced Queue:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: pendingSyncCount > 0 ? 'var(--forge-warning)' : 'var(--forge-accent-primary)' }}>
              {pendingSyncCount} local mutations
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--forge-text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
          * Synced status is strictly reserved for confirmation responses from Codex's server. Workouts remain safely in IndexedDB while offline.
        </p>
      </Card>

      {/* Network & Tailscale Info */}
      <Card variant="base" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wifi size={16} color="var(--forge-info)" />
          <h3 style={{ fontSize: '0.95rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Tailscale Private Mesh
          </h3>
        </div>

        <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.85rem' }}>
          PWA offline-first architecture allows full workout logging when offline or traveling. Changes sync automatically when Tailscale reconnects.
        </p>
      </Card>

      {/* Session Management */}
      <div style={{ marginTop: '12px' }}>
        <Button
          variant="danger"
          fullWidth
          size="md"
          icon={<LogOut size={16} />}
          onClick={onLogout}
        >
          Simulate Sign Out
        </Button>
      </div>
    </div>
  );
};
