import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { WorkoutSession, SyncMutation } from '@forge/types';

export interface ForgeDB extends DBSchema {
  active_workout: {
    key: string; // 'current'
    value: WorkoutSession;
  };
  completed_workouts: {
    key: string; // workout id (UUID v4)
    value: WorkoutSession;
    indexes: { 'by-startedAt': string };
  };
  sync_queue: {
    key: string; // mutationId (UUID v4)
    value: SyncMutation;
    indexes: { 'by-timestamp': string };
  };
}

const DB_VERSION = 1;

export class LocalStorageManager {
  private dbPromise: Promise<IDBPDatabase<ForgeDB>>;
  private dbName: string;

  constructor(userId: string = 'demo_user') {
    this.dbName = `forge_db_${userId}`;
    this.dbPromise = openDB<ForgeDB>(this.dbName, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('active_workout')) {
          db.createObjectStore('active_workout');
        }
        if (!db.objectStoreNames.contains('completed_workouts')) {
          const completedStore = db.createObjectStore('completed_workouts', { keyPath: 'id' });
          completedStore.createIndex('by-startedAt', 'startedAt');
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'mutationId' });
          syncStore.createIndex('by-timestamp', 'clientTimestamp');
        }
      },
    });
  }

  // Active workout persistence (restart resilience)
  async saveActiveWorkout(workout: WorkoutSession): Promise<void> {
    const db = await this.dbPromise;
    await db.put('active_workout', workout, 'current');
  }

  async getActiveWorkout(): Promise<WorkoutSession | null> {
    const db = await this.dbPromise;
    const workout = await db.get('active_workout', 'current');
    return workout || null;
  }

  async clearActiveWorkout(): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('active_workout', 'current');
  }

  // Completed workouts (immutable local history)
  async saveCompletedWorkout(workout: WorkoutSession): Promise<void> {
    const db = await this.dbPromise;
    await db.put('completed_workouts', workout);
    await this.clearActiveWorkout();
  }

  async getCompletedWorkouts(): Promise<WorkoutSession[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('completed_workouts', 'by-startedAt');
  }

  // Sync mutation queue
  async enqueueMutation(mutation: SyncMutation): Promise<void> {
    const db = await this.dbPromise;
    await db.put('sync_queue', mutation);
  }

  async getQueuedMutations(): Promise<SyncMutation[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('sync_queue', 'by-timestamp');
  }

  async removeMutation(mutationId: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('sync_queue', mutationId);
  }

  async getPendingCount(): Promise<number> {
    const db = await this.dbPromise;
    return db.count('sync_queue');
  }
}

// Default instance for prototype / demo scope
export const localDb = new LocalStorageManager('demo_user');
