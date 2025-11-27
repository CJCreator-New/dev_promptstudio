import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useOrganizationStore } from '../store/organizationStore';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 40: Folder Nesting
 * Validates: Requirements 11.1
 * 
 * Tests that folders can be nested correctly
 */
describe('Property 40: Folder Nesting', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should support nested folder structures', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 2, maxLength: 5 }),
        (folderNames) => {
          resetAllStores();
          const store = useOrganizationStore.getState();

          // Create nested folders
          let parentId: number | null = null;
          const folderIds: number[] = [];

          folderNames.forEach(name => {
            store.addFolder({ name, parentId, path: parentId ? `/parent/${name}` : `/${name}` });
            const folders = useOrganizationStore.getState().folders;
            const newFolder = folders[folders.length - 1];
            folderIds.push(newFolder.id);
            parentId = newFolder.id;
          });

          // Verify nesting
          const allFolders = useOrganizationStore.getState().folders;
          expect(allFolders.length).toBe(folderNames.length);

          // First folder should have no parent
          const firstFolder = allFolders.find(f => f.id === folderIds[0]);
          expect(firstFolder?.parentId).toBeNull();

          // Other folders should have correct parent
          for (let i = 1; i < folderIds.length; i++) {
            const folder = allFolders.find(f => f.id === folderIds[i]);
            expect(folder?.parentId).toBe(folderIds[i - 1]);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should maintain folder hierarchy integrity', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (count) => {
          resetAllStores();
          const store = useOrganizationStore.getState();

          // Create flat structure
          for (let i = 0; i < count; i++) {
            store.addFolder({ name: `Folder${i}`, parentId: null, path: `/Folder${i}` });
          }

          const folders = useOrganizationStore.getState().folders;
          expect(folders.length).toBe(count);

          // All should be root folders
          folders.forEach(folder => {
            expect(folder.parentId).toBeNull();
          });

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
