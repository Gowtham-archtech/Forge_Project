/**
 * FORGE Shared Contract: Synchronization Protocol & Queue
 */

import { WorkoutSession } from './workout';
import { BodyMeasurement, GripperRecord } from './analytics';

export type SyncState =
  | 'saved_locally'
  | 'waiting_to_sync'
  | 'synchronizing'
  | 'synced'
  | 'sync_failed'
  | 'conflict_requires_attention';

export type SyncEntityType = 'workout_session' | 'body_measurement' | 'gripper_record';

export type SyncOperationType = 'upsert' | 'delete';

export interface SyncMutation<T = unknown> {
  mutationId: string; // client UUID v4 - used by backend for idempotency deduplication
  entityType: SyncEntityType;
  entityId: string; // target entity UUID v4
  operation: SyncOperationType;
  clientTimestamp: string; // ISO 8601
  expectedVersion: number; // For optimistic locking (0 for new entities, N for updates)
  payload: T; // Full entity snapshot or tombstone metadata
}

export interface SyncPushRequest {
  mutations: SyncMutation[];
  lastSyncedTimestamp?: string;
}

export interface SyncPushResult {
  mutationId: string;
  entityId: string;
  status: 'applied' | 'conflict' | 'rejected';
  serverVersion: number;
  serverTimestamp: string;
  conflictDetails?: {
    serverPayload: unknown;
    serverVersion: number;
    reason: 'VERSION_MISMATCH' | 'ENTITY_DELETED' | 'VALIDATION_FAILED';
  };
}

export interface SyncPushResponse {
  results: SyncPushResult[];
  serverTimestamp: string;
}

export interface SyncPullRequest {
  sinceTimestamp?: string; // If omitted, full sync for current user session
}

export interface SyncTombstone {
  entityId: string;
  entityType: SyncEntityType;
  deletedAt: string; // ISO 8601
  serverVersion: number;
}

export interface SyncPullResponse {
  workoutSessions: WorkoutSession[];
  bodyMeasurements: BodyMeasurement[];
  gripperRecords: GripperRecord[];
  tombstones: SyncTombstone[]; // Enables offline client to delete pruned records
  serverTimestamp: string;
}
