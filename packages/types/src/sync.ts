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
  mutationId: string; // client UUID v4
  userId: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperationType;
  clientTimestamp: string; // ISO 8601
  version: number;
  payload: T;
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
    reason: string;
  };
}

export interface SyncPushResponse {
  results: SyncPushResult[];
  serverTimestamp: string;
}

export interface SyncPullRequest {
  sinceTimestamp: string;
}

export interface SyncPullResponse {
  workoutSessions: WorkoutSession[];
  bodyMeasurements: BodyMeasurement[];
  gripperRecords: GripperRecord[];
  serverTimestamp: string;
}
