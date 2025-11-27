import { useState, useMemo } from 'react';
import { diffService, DiffResult } from '../services/diffService';

interface DiffViewerProps {
  oldText: string;
  newText: string;
  oldLabel?: string;
  newLabel?: string;
}

type ViewMode = 'side-by-side' | 'unified';

export const DiffViewer = ({ oldText, newText, oldLabel = 'Original', newLabel = 'Modified' }: DiffViewerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');

  const diffResult: DiffResult = useMemo(() => {
    return diffService.computeDiff(oldText, newText);
  }, [oldText, newText]);

  const renderSideBySide = () => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const maxLines = Math.max(oldLines.length, newLines.length);

    return (
      <div className="diff-side-by-side">
        <div className="diff-pane">
          <h4>{oldLabel}</h4>
          <div className="diff-content">
            {oldLines.map((line, i) => (
              <div key={i} className="diff-line">
                <span className="line-number">{i + 1}</span>
                <span className="line-content">{line}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="diff-pane">
          <h4>{newLabel}</h4>
          <div className="diff-content">
            {newLines.map((line, i) => (
              <div key={i} className="diff-line">
                <span className="line-number">{i + 1}</span>
                <span className="line-content">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderUnified = () => {
    return (
      <div className="diff-unified">
        {diffResult.diffs.map(([type, text], index) => {
          const className = type === 1 ? 'addition' : type === -1 ? 'deletion' : 'unchanged';
          return (
            <span key={index} className={`diff-${className}`}>
              {text}
            </span>
          );
        })}
      </div>
    );
  };

  const handleExport = () => {
    const exported = diffService.exportDiff(oldText, newText, 'unified');
    const blob = new Blob([exported], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diff.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="diff-viewer">
      <div className="diff-header">
        <div className="diff-stats">
          <span className="stat additions">+{diffResult.additions}</span>
          <span className="stat deletions">-{diffResult.deletions}</span>
          <span className="stat changes">{diffResult.changes} changes</span>
        </div>
        <div className="diff-controls">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={viewMode === 'side-by-side' ? 'active' : ''}
            aria-label="Side by side view"
          >
            Side by Side
          </button>
          <button
            onClick={() => setViewMode('unified')}
            className={viewMode === 'unified' ? 'active' : ''}
            aria-label="Unified view"
          >
            Unified
          </button>
          <button onClick={handleExport} aria-label="Export diff">
            Export
          </button>
        </div>
      </div>
      
      <div className="diff-body">
        {viewMode === 'side-by-side' ? renderSideBySide() : renderUnified()}
      </div>
    </div>
  );
};
