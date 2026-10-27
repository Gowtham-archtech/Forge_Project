import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Database, Wifi, LogOut, RefreshCw } from 'lucide-react';
import { SyncState } from '@forge/types';

export interface AccountViewProps {
  userEmail: string;
  displayName: string;
  syncState: SyncState;
  pendingSyncCount: number;
  onLogout: () => void;
  onTriggerSync: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  userEmail,
  displayName,
  syncState,
  pendingSyncCount,
  onLogout,
  onTriggerSync,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ marginBottom: '4px' }}>Account & Settings</h1>
        <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.95rem' }}>
          Device connection, local data isolation & session management
        </p>
      </div>

      {/* User Profile Card */}
      <Card variant="elevated" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--forge-surface-base)',
            border: '2px solid var(--forge-accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--forge-accent-primary)',
          }}
        >
          <User size={26} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.15rem', margin: 0 }}>{displayName}</h2>
            <Badge variant="accent">Verified</Badge>
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
            IndexedDB Local Isolation
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--forge-text-secondary)' }}>Database Scope:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--forge-text-primary)' }}>
              forge_db_gowtham_01
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--forge-text-secondary)' }}>Isolation Status:</span>
            <span style={{ color: 'var(--forge-accent-primary)', fontWeight: 600 }}>
              Encapsulated per account
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--forge-text-secondary)' }}>Sync Engine State:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--forge-accent-primary)', textTransform: 'capitalize' }}>
              {syncState.replace(/_/g, ' ')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--forge-text-secondary)' }}>Unsynced Changes:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: pendingSyncCount > 0 ? 'var(--forge-warning)' : 'var(--forge-accent-primary)' }}>
              {pendingSyncCount} mutations queued
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw size={14} />}
          onClick={onTriggerSync}
          style={{ marginTop: '6px' }}
        >
          Force Sync Now
        </Button>
      </Card>

      {/* Tailscale & Network Info */}
      <Card variant="base" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wifi size={16} color="var(--forge-info)" />
          <h3 style={{ fontSize: '0.95rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Network & Tailscale
          </h3>
        </div>

        <p style={{ color: 'var(--forge-text-secondary)', fontSize: '0.85rem' }}>
          Connected over Tailscale private mesh. Local offline changes persist safely even if connection drops.
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
          Log Out & Lock Local Database
        </Button>
      </div>
    </div>
  );
};
