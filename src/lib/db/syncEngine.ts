import { db, SyncQueueItem } from './database';

/**
 * Offline Sync Engine
 * Handles queuing and processing of data synchronization
 */

export const addToSyncQueue = async (entity: string, operation: 'create' | 'update' | 'delete', payload: any) => {
  await db.syncQueue.add({
    entity,
    operation,
    payload,
    timestamp: Date.now(),
    synced: false
  });
  
  // Try to sync immediately if online
  if (navigator.onLine) {
    processSyncQueue();
  }
};

export const processSyncQueue = async () => {
  const pendingItems = await db.syncQueue.where('synced').equals(0).toArray();
  
  if (pendingItems.length === 0) return;

  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch: pendingItems })
    });

    if (response.ok) {
      // Mark as synced
      await Promise.all(pendingItems.map(item => 
        db.syncQueue.update(item.id!, { synced: true })
      ));
    }
  } catch (error) {
    console.warn('Sync failed, will retry later:', error);
  }
};

// Listen for connection status
if (typeof window !== 'undefined') {
  window.addEventListener('online', processSyncQueue);
}
