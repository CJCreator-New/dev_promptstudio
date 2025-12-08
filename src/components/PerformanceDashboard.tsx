import { useState, useEffect } from 'react';
import { performanceMonitor, PERFORMANCE_BUDGETS } from '../services/performanceMonitoring';

export const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState(performanceMonitor.getSummary());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getSummary());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700"
        aria-label="Open performance dashboard"
      >
        📊 Performance
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-96 max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Performance Metrics</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close dashboard"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(metrics).map(([name, data]) => {
          const budget = PERFORMANCE_BUDGETS[name as keyof typeof PERFORMANCE_BUDGETS];
          const isOverBudget = budget && data.avg > budget;

          return (
            <div key={name} className="border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{name}</span>
                <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {data.avg.toFixed(0)}ms
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Count: {data.count} | Total: {data.total.toFixed(0)}ms
                {budget && ` | Budget: ${budget}ms`}
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(metrics).length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          No metrics collected yet
        </p>
      )}
    </div>
  );
};
