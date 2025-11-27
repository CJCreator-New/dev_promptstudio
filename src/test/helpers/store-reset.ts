import { useOfflineStore } from '../../store/offlineStore';
import { useCollaborationStore } from '../../store/collaborationStore';
import { useOrganizationStore } from '../../store/organizationStore';
import { useVersioningStore } from '../../store/versioningStore';
import { useAIProviderStore } from '../../store/aiProviderStore';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { useEditorStore } from '../../store/editorStore';
import { useCustomizationStore } from '../../store/customizationStore';
import { useCustomEndpointStore } from '../../store/customEndpointStore';

/**
 * Reset all stores to their initial state
 * Useful for property tests that need clean state
 */
export const resetAllStores = () => {
  // Clear localStorage to reset persist middleware
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  
  // Reset each store - use false to keep methods
  useOfflineStore.setState({ isOnline: navigator.onLine, operations: [] }, false);
  useCollaborationStore.setState({ workspaces: [], activeWorkspace: null }, false);
  useOrganizationStore.setState({ tags: [], folders: [], favorites: [] }, false);
  useVersioningStore.setState({ versions: [] }, false);
  useAIProviderStore.setState({ providers: [], activeProvider: null }, false);
  useAnalyticsStore.setState({ analytics: [] }, false);
  useEditorStore.setState({ chains: [], variables: {} }, false);
  useCustomizationStore.setState({ themes: [], language: 'en' }, false);
  useCustomEndpointStore.setState({ endpoints: [] }, false);
};

// Alias for consistency
export const resetStores = resetAllStores;
