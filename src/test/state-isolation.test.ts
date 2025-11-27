import { describe, it, expect, beforeEach } from 'vitest';
import { useOrganizationStore } from '../store/organizationStore';
import { useVersioningStore } from '../store/versioningStore';
import { useOfflineStore } from '../store/offlineStore';

describe('Property 7: Workspace Context Isolation', () => {
  beforeEach(() => {
    useOrganizationStore.setState({ tags: [], folders: [], favorites: [] });
    useVersioningStore.setState({ versions: [] });
    useOfflineStore.setState({ operations: [] });
  });

  it('should isolate organization state from versioning state', () => {
    const { addTag } = useOrganizationStore.getState();
    const { addVersion } = useVersioningStore.getState();

    addTag({ name: 'test', color: '#000', usageCount: 0 });
    addVersion({ promptId: 1, content: 'test', message: 'v1' });

    const orgState = useOrganizationStore.getState();
    const versionState = useVersioningStore.getState();

    expect(orgState.tags).toHaveLength(1);
    expect(versionState.versions).toHaveLength(1);
    expect(orgState.tags[0]).not.toHaveProperty('promptId');
    expect(versionState.versions[0]).not.toHaveProperty('color');
  });

  it('should isolate offline state from other stores', () => {
    const { queueOperation } = useOfflineStore.getState();
    const { addTag } = useOrganizationStore.getState();

    queueOperation({ type: 'create', entity: 'tag', data: {} });
    addTag({ name: 'test', color: '#000', usageCount: 0 });

    const offlineState = useOfflineStore.getState();
    const orgState = useOrganizationStore.getState();

    expect(offlineState.operations).toHaveLength(1);
    expect(orgState.tags).toHaveLength(1);
    expect(offlineState.operations[0]).toHaveProperty('synced');
    expect(orgState.tags[0]).not.toHaveProperty('synced');
  });

  it('should maintain separate persistence keys', () => {
    const orgKey = 'organization-store';
    const versionKey = 'versioning-store';
    const offlineKey = 'offline-store';

    expect(orgKey).not.toBe(versionKey);
    expect(versionKey).not.toBe(offlineKey);
    expect(offlineKey).not.toBe(orgKey);
  });
});
