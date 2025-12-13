import { useState, useCallback, useEffect } from 'react';
import { notifySuccess } from '../components/ToastSystem';
import { trackFeatureUsage } from '../services/firebaseAnalytics';
import { useAuth } from '../contexts';

export const useCloudSync = () => {
  const { userId } = useAuth();
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem('cloudSyncEnabled') === 'true';
    } catch {
      return false;
    }
  });

  const toggle = useCallback((value: boolean) => {
    setEnabled(value);
    try {
      localStorage.setItem('cloudSyncEnabled', String(value));
    } catch {}
    notifySuccess(value ? 'Cloud sync enabled' : 'Cloud sync disabled');
    if (userId) {
      trackFeatureUsage(userId, value ? 'cloud_sync_enabled' : 'cloud_sync_disabled');
    }
  }, [userId]);

  return { enabled, toggle };
};
