import React from 'react';
import { Dumbbell, History, TrendingUp, User, Activity } from 'lucide-react';
import { SyncStatusBadge } from '../ui/SyncStatusBadge';
import { SyncState } from '@forge/types';

export type NavigationTab = 'dashboard' | 'train' | 'history' | 'analytics' | 'account';

export interface NavigationShellProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  syncState: SyncState;
  pendingSyncCount?: number;
  onSyncBadgeClick?: () => void;
  isWorkoutActive?: boolean;
  children: React.ReactNode;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Today', icon: <Activity size={20} /> },
  { id: 'train', label: 'Train', icon: <Dumbbell size={20} /> },
  { id: 'history', label: 'History', icon: <History size={20} /> },
  { id: 'analytics', label: 'Progress', icon: <TrendingUp size={20} /> },
  { id: 'account', label: 'Account', icon: <User size={20} /> },
];

export const NavigationShell: React.FC<NavigationShellProps> = ({
  currentTab,
  onTabChange,
  syncState,
  pendingSyncCount = 0,
  onSyncBadgeClick,
  isWorkoutActive = false,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--forge-bg-main)',
        color: 'var(--forge-text-primary)',
      }}
    >
      {/* Desktop Sidebar (visible on min-width 768px via media query style injection) */}
      <aside
        className="forge-desktop-sidebar"
        style={{
          width: 'var(--sidebar-width-desktop)',
          backgroundColor: 'var(--forge-surface-base)',
          borderRight: '1px solid var(--forge-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                backgroundColor: 'var(--forge-accent-primary)',
              }}
            />
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: 'var(--forge-text-primary)',
              }}
            >
              FORGE
            </span>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--forge-text-secondary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Built One Rep at a Time
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--forge-surface-elevated)' : 'transparent',
                  color: isActive ? 'var(--forge-accent-primary)' : 'var(--forge-text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive
                    ? '3px solid var(--forge-accent-primary)'
                    : '3px solid transparent',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sync Status in Sidebar Footer */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--forge-border-subtle)' }}>
          <SyncStatusBadge
            status={syncState}
            pendingCount={pendingSyncCount}
            onClick={onSyncBadgeClick}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: '56px',
            backgroundColor: 'var(--forge-bg-main)',
            borderBottom: '1px solid var(--forge-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              className="forge-mobile-brand"
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: 'var(--forge-text-primary)',
              }}
            >
              FORGE
            </span>
            {isWorkoutActive && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--forge-accent-dim)',
                  color: 'var(--forge-accent-primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--forge-accent-primary)',
                  }}
                />
                WORKOUT IN PROGRESS
              </span>
            )}
          </div>

          <div className="forge-mobile-sync">
            <SyncStatusBadge
              status={syncState}
              pendingCount={pendingSyncCount}
              onClick={onSyncBadgeClick}
            />
          </div>
        </header>

        {/* Dynamic View Content */}
        <main
          style={{
            flex: 1,
            padding: '16px',
            maxWidth: '960px',
            width: '100%',
            margin: '0 auto',
            paddingBottom: 'calc(var(--nav-height-mobile) + 24px)', // Extra clearance for mobile bottom bar
          }}
        >
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Fixed) */}
        <nav
          className="forge-mobile-bottom-nav"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'var(--nav-height-mobile)',
            backgroundColor: 'var(--forge-surface-base)',
            borderTop: '1px solid var(--forge-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 40,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                aria-label={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: isActive ? 'var(--forge-accent-primary)' : 'var(--forge-text-secondary)',
                  cursor: 'pointer',
                  flex: 1,
                  height: '100%',
                  padding: '6px 0',
                }}
              >
                {item.icon}
                <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 700 : 500 }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Responsive Media Query Styles */}
      <style>{`
        @media (max-width: 767px) {
          .forge-desktop-sidebar {
            display: none !important;
          }
        }
        @media (min-width: 768px) {
          .forge-mobile-brand {
            display: none !important;
          }
          .forge-mobile-bottom-nav {
            display: none !important;
          }
          main {
            padding-bottom: 32px !important;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
