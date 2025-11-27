import React, { useState } from 'react';
import { ExportEngine, EXPORT_FORMATS, ExportData } from '../services/exportEngine';
import { Button } from './atomic/Button';
import { Select } from './atomic/Select';
import { Modal } from './atomic/Modal';
import { Checkbox } from './atomic/Checkbox';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: ExportData[];
  selectedItems?: string[];
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  items,
  selectedItems = []
}) => {
  const [format, setFormat] = useState('json');
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedItems));
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map(item => item.id)));
    }
  };

  const handleItemToggle = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleExport = async () => {
    if (selected.size === 0) return;

    setIsExporting(true);
    try {
      const selectedItems = items.filter(item => selected.has(item.id));
      const formatConfig = EXPORT_FORMATS.find(f => f.id === format)!;

      if (selectedItems.length === 1) {
        const blob = ExportEngine.exportSingle(selectedItems[0], format);
        const filename = `${selectedItems[0].title}.${formatConfig.extension}`;
        ExportEngine.downloadBlob(blob, filename);
      } else {
        const blob = await ExportEngine.exportBulk(selectedItems, format);
        const filename = `prompts_export.zip`;
        ExportEngine.downloadBlob(blob, filename);
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Prompts">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Export Format</label>
          <Select
            value={format}
            onChange={setFormat}
            options={EXPORT_FORMATS.map(f => ({ value: f.id, label: f.name }))}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Select Items ({selected.size}/{items.length})</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              {selected.size === items.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selected.has(item.id)}
                  onChange={() => handleItemToggle(item.id)}
                />
                <span className="text-sm truncate">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selected.size === 0 || isExporting}
          >
            {isExporting ? 'Exporting...' : `Export ${selected.size} item${selected.size !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};