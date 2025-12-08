import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2 fade-in duration-300 ${
        isOnline
          ? 'bg-green-500/20 border border-green-500/30'
          : 'bg-yellow-500/20 border border-yellow-500/30'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-300">
              Back online! Syncing your work...
            </span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">
              You're offline. Changes will sync when reconnected.
            </span>
          </>
        )}
      </div>
    </div>
  );
};
