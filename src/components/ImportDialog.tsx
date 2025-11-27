import React, { useState, useRef } from 'react';
import { ImportEngine, ImportResult, ConflictResolution } from '../services/importEngine';
import { Button } from './atomic/Button';
import { Modal } from './atomic/Modal';
import { Select } from './atomic/Select';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<void>;
  existingData: any[];
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  existingData
}) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'conflicts'>('upload');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [conflicts, setConflicts] = useState<Map<string, ConflictResolution>>(new Map());
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    let result: ImportResult;

    if (file.name.endsWith('.json')) {
      result = ImportEngine.parseJSON(content);
    } else if (file.name.endsWith('.md')) {
      result = ImportEngine.parseMarkdown(content);
    } else {
      result = { success: false, errors: ['Unsupported file format'] };
    }

    if (result.success && result.data) {
      const conflictIds = ImportEngine.detectConflicts(result.data, existingData);
      if (conflictIds.length > 0) {
        setConflicts(new Map(conflictIds.map(id => [id, { action: 'skip' }])));
        setStep('conflicts');
      } else {
        setStep('preview');
      }
    }

    setImportResult(result);
  };

  const handleConflictResolution = (id: string, resolution: ConflictResolution) => {
    setConflicts(prev => new Map(prev.set(id, resolution)));
  };

  const handleImport = async () => {
    if (!importResult?.data) return;

    setIsImporting(true);
    try {
      const resolvedData = ImportEngine.resolveConflicts(importResult.data, conflicts);
      await onImport(resolvedData);
      onClose();
      resetState();
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const resetState = () => {
    setStep('upload');
    setImportResult(null);
    setConflicts(new Map());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderUploadStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select File</label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.md"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">Supported formats: JSON, Markdown</p>
      </div>

      {importResult && !importResult.success && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-red-800 mb-2">Import Errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {importResult.errors?.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderConflictsStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Resolve Conflicts</h3>
      <p className="text-sm text-gray-600">
        The following items have conflicting titles with existing prompts:
      </p>

      <div className="max-h-60 overflow-y-auto space-y-3">
        {importResult?.data
          ?.filter(item => Array.from(conflicts.keys()).includes(item.id))
          .map(item => (
            <div key={item.id} className="border rounded-md p-3">
              <h4 className="font-medium">{item.title}</h4>
              <div className="mt-2 space-y-2">
                <Select
                  value={conflicts.get(item.id)?.action || 'skip'}
                  onChange={(action) => handleConflictResolution(item.id, { action: action as any })}
                  options={[
                    { value: 'skip', label: 'Skip this item' },
                    { value: 'overwrite', label: 'Overwrite existing' },
                    { value: 'rename', label: 'Import with new name' }
                  ]}
                />
                {conflicts.get(item.id)?.action === 'rename' && (
                  <input
                    type="text"
                    placeholder="New title"
                    className="w-full px-3 py-2 border rounded-md"
                    onChange={(e) => handleConflictResolution(item.id, {
                      action: 'rename',
                      newTitle: e.target.value
                    })}
                  />
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={() => setStep('upload')}>
          Back
        </Button>
        <Button onClick={() => setStep('preview')}>
          Continue
        </Button>
      </div>
    </div>
  );

  const renderPreviewStep = () => {
    const resolvedData = importResult?.data ? 
      ImportEngine.resolveConflicts(importResult.data, conflicts) : [];
    const summary = importResult?.data ? 
      ImportEngine.generateSummary(importResult.data, resolvedData, Array.from(conflicts.keys())) : null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Import Preview</h3>
        
        {summary && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Import Summary:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Total items: {summary.total}</li>
              <li>• Will import: {summary.imported}</li>
              <li>• Will skip: {summary.skipped}</li>
              <li>• Conflicts resolved: {summary.conflicts}</li>
            </ul>
          </div>
        )}

        <div className="max-h-40 overflow-y-auto">
          <h4 className="text-sm font-medium mb-2">Items to import:</h4>
          <ul className="text-sm space-y-1">
            {resolvedData.map((item, index) => (
              <li key={index} className="truncate">• {item.title}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={() => setStep(conflicts.size > 0 ? 'conflicts' : 'upload')}>
            Back
          </Button>
          <Button onClick={handleImport} disabled={isImporting || resolvedData.length === 0}>
            {isImporting ? 'Importing...' : `Import ${resolvedData.length} item${resolvedData.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Prompts">
      {step === 'upload' && renderUploadStep()}
      {step === 'conflicts' && renderConflictsStep()}
      {step === 'preview' && renderPreviewStep()}
    </Modal>
  );
};