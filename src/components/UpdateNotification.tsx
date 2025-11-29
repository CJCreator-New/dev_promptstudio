import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

export const UpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdate(true);
      });
    }
  }, []);

  if (!showUpdate) return null;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-bottom">
      <div className="flex items-start gap-3">
        <RefreshCw className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold mb-1">Update Available</p>
          <p className="text-sm text-blue-100 mb-3">A new version is ready. Reload to update.</p>
          <div className="flex gap-2">
            <button onClick={handleReload} className="px-3 py-1.5 bg-white text-blue-600 rounded font-medium text-sm">
              Reload Now
            </button>
            <button onClick={() => setShowUpdate(false)} className="px-3 py-1.5 bg-blue-700 rounded text-sm">
              Later
            </button>
          </div>
        </div>
        <button onClick={() => setShowUpdate(false)} className="text-blue-200 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
