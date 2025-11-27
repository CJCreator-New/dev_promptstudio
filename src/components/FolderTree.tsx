import { useState, useEffect } from 'react';
import { Folder } from '../utils/db';
import { folderService } from '../services/folderService';
import { useOrganizationStore } from '../store/organizationStore';

interface FolderNodeProps {
  folder: Folder;
  onDelete: (id: number) => void;
  onMove: (id: number, newParentId: number | null) => void;
}

const FolderNode = ({ folder, onDelete, onMove }: FolderNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<Folder[]>([]);

  useEffect(() => {
    if (isExpanded) {
      loadChildren();
    }
  }, [isExpanded, folder.id]);

  const loadChildren = async () => {
    const childFolders = await folderService.getChildFolders(folder.id!);
    setChildren(childFolders);
  };

  return (
    <div className="folder-node">
      <div className="folder-header">
        <button onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          {isExpanded ? '▼' : '▶'}
        </button>
        <span>{folder.name}</span>
        <button onClick={() => onDelete(folder.id!)} aria-label={`Delete ${folder.name}`}>
          ×
        </button>
      </div>
      {isExpanded && (
        <div className="folder-children">
          {children.map(child => (
            <FolderNode key={child.id} folder={child} onDelete={onDelete} onMove={onMove} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTree = () => {
  const [rootFolders, setRootFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const { addFolder, removeFolder } = useOrganizationStore();

  useEffect(() => {
    loadRootFolders();
  }, []);

  const loadRootFolders = async () => {
    const folders = await folderService.getChildFolders(null);
    setRootFolders(folders);
  };

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    
    const folder = await folderService.createFolder(newFolderName.trim());
    addFolder({ name: folder.name, parentId: null, path: folder.path });
    setNewFolderName('');
    await loadRootFolders();
  };

  const handleDelete = async (id: number) => {
    await folderService.deleteFolder(id);
    removeFolder(id);
    await loadRootFolders();
  };

  const handleMove = async (id: number, newParentId: number | null) => {
    await folderService.moveFolder(id, newParentId);
    await loadRootFolders();
  };

  return (
    <div className="folder-tree">
      <div className="folder-input">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Folder name"
          aria-label="New folder name"
        />
        <button onClick={handleCreate} aria-label="Create folder">
          Add Folder
        </button>
      </div>
      <div className="folder-list">
        {rootFolders.map(folder => (
          <FolderNode key={folder.id} folder={folder} onDelete={handleDelete} onMove={handleMove} />
        ))}
      </div>
    </div>
  );
};
