import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useCollaborationStore } from '../store/collaborationStore';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 7: Workspace Context Isolation
 * Validates: Requirements 2.3
 * 
 * Tests that workspace contexts remain isolated from each other
 */
describe('Property 7: Workspace Context Isolation', () => {
  beforeEach(() => {
    resetAllStores();
  });
  
  afterEach(() => {
    resetAllStores();
  });

  it('should maintain isolation between workspaces', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          description: fc.string({ maxLength: 200 }),
        }), { minLength: 2, maxLength: 10 }),
        (workspaceData) => {
          // Reset for this iteration
          resetAllStores();
          const store = useCollaborationStore.getState();
          
          // Add all workspaces
          const workspaceIds = workspaceData.map(data => {
            store.addWorkspace(data);
            const currentWorkspaces = useCollaborationStore.getState().workspaces;
            return currentWorkspaces[currentWorkspaces.length - 1].id;
          });

          // Verify each workspace maintains its own data
          const workspaces = useCollaborationStore.getState().workspaces;
          
          for (let i = 0; i < workspaceIds.length; i++) {
            const workspace = workspaces.find(w => w.id === workspaceIds[i]);
            expect(workspace).toBeDefined();
            expect(workspace?.name).toBe(workspaceData[i].name);
            expect(workspace?.description).toBe(workspaceData[i].description);
          }

          // Verify updating one workspace doesn't affect others
          if (workspaceIds.length >= 2) {
            const firstId = workspaceIds[0];
            const secondId = workspaceIds[1];
            
            store.updateWorkspace(firstId, { name: 'Updated Name' });
            
            const updatedWorkspaces = useCollaborationStore.getState().workspaces;
            const firstWorkspace = updatedWorkspaces.find(w => w.id === firstId);
            const secondWorkspace = updatedWorkspaces.find(w => w.id === secondId);
            
            expect(firstWorkspace?.name).toBe('Updated Name');
            expect(secondWorkspace?.name).not.toBe('Updated Name');
            expect(secondWorkspace?.name).toBe(workspaceData[1].name);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
