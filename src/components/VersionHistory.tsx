import { useState, useEffect } from 'react';
import { Version } from '../utils/db';
import { versionService } from '../services/versionService';

interface VersionHistoryProps {
  promptId: number;
  onRevert?: (content: string) => void;
}

export const VersionHistory = ({ promptId, onRevert }: VersionHistoryProps) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  useEffect(() => {
    loadVersions();
  }, [promptId]);

  const loadVersions = async () => {
    const allVersions = await versionService.getVersions(promptId);
    setVersions(allVersions);
  };

  const handleRevert = async (versionId: number) => {
    const reverted = await versionService.revertToVersion(versionId);
    if (reverted && onRevert) {
      onRevert(reverted.content);
      await loadVersions();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="version-history">
      <h3>Version History ({versions.length}/{50})</h3>
      
      <div className="version-list">
        {versions.map((version, index) => (
          <div 
            key={version.id} 
            className={`version-item ${selectedVersion?.id === version.id ? 'selected' : ''}`}
            onClick={() => setSelectedVersion(version)}
          >
            <div className="version-header">
              <span className="version-number">v{versions.length - index}</span>
              <span className="version-date">{formatDate(version.timestamp)}</span>
            </div>
            <p className="version-message">{version.message}</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleRevert(version.id!);
              }}
              aria-label={`Revert to version ${versions.length - index}`}
            >
              Revert
            </button>
          </div>
        ))}
      </div>

      {selectedVersion && (
        <div className="version-preview">
          <h4>Preview</h4>
          <pre>{selectedVersion.content}</pre>
        </div>
      )}
    </div>
  );
};
