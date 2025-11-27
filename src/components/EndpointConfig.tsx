import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TestTube, Save, X } from 'lucide-react';
import { useCustomEndpointStore, CustomEndpoint, CustomHeader } from '../store/customEndpointStore';
import { Button, Input, Select, Modal } from './atomic';

interface EndpointConfigProps {
  endpoint?: CustomEndpoint;
  isOpen: boolean;
  onClose: () => void;
}

const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' }
];

export const EndpointConfig: React.FC<EndpointConfigProps> = ({
  endpoint,
  isOpen,
  onClose
}) => {
  const { addEndpoint, updateEndpoint, validateUrl, testEndpoint } = useCustomEndpointStore();
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'POST' as const,
    timeout: 30000,
    retryCount: 3,
    enabled: true
  });
  
  const [headers, setHeaders] = useState<CustomHeader[]>([]);
  const [newHeader, setNewHeader] = useState({ key: '', value: '' });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  useEffect(() => {
    if (endpoint) {
      setFormData({
        name: endpoint.name,
        url: endpoint.url,
        method: endpoint.method,
        timeout: endpoint.timeout,
        retryCount: endpoint.retryCount,
        enabled: endpoint.enabled
      });
      setHeaders(endpoint.headers);
    } else {
      setFormData({
        name: '',
        url: '',
        method: 'POST',
        timeout: 30000,
        retryCount: 3,
        enabled: true
      });
      setHeaders([]);
    }
    setTestResult(null);
  }, [endpoint]);

  const handleAddHeader = () => {
    if (newHeader.key && newHeader.value) {
      setHeaders(prev => [...prev, { ...newHeader, enabled: true }]);
      setNewHeader({ key: '', value: '' });
    }
  };

  const handleRemoveHeader = (key: string) => {
    setHeaders(prev => prev.filter(h => h.key !== key));
  };

  const handleToggleHeader = (key: string) => {
    setHeaders(prev => prev.map(h => 
      h.key === key ? { ...h, enabled: !h.enabled } : h
    ));
  };

  const handleTestEndpoint = async () => {
    if (!validateUrl(formData.url)) {
      setTestResult(false);
      return;
    }

    setIsTesting(true);
    try {
      const tempEndpoint: CustomEndpoint = {
        id: 'temp',
        ...formData,
        headers,
        requestTransformers: [],
        responseTransformers: [],
        createdAt: Date.now()
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), formData.timeout);

      const requestHeaders: Record<string, string> = {};
      headers
        .filter(h => h.enabled)
        .forEach(h => requestHeaders[h.key] = h.value);

      const response = await fetch(formData.url, {
        method: formData.method,
        headers: requestHeaders,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setTestResult(response.ok);
    } catch {
      setTestResult(false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const endpointData = {
      ...formData,
      headers,
      requestTransformers: endpoint?.requestTransformers || [],
      responseTransformers: endpoint?.responseTransformers || []
    };

    try {
      if (endpoint) {
        updateEndpoint(endpoint.id, endpointData);
      } else {
        addEndpoint(endpointData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save endpoint:', error);
    }
  };

  const isFormValid = formData.name && formData.url && validateUrl(formData.url);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={endpoint ? 'Edit Endpoint' : 'Add Endpoint'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Endpoint Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="My Custom Endpoint"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            URL
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://api.example.com/v1/chat"
                required
                className={!validateUrl(formData.url) && formData.url ? 'border-red-300' : ''}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleTestEndpoint}
              disabled={!validateUrl(formData.url) || isTesting}
            >
              <TestTube className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          {testResult !== null && (
            <p className={`text-sm ${testResult ? 'text-green-600' : 'text-red-600'}`}>
              {testResult ? 'Endpoint is reachable' : 'Endpoint test failed'}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Method"
            value={formData.method}
            onChange={(value) => setFormData(prev => ({ ...prev, method: value as any }))}
            options={HTTP_METHODS}
            required
          />
          
          <Input
            label="Timeout (ms)"
            type="number"
            value={formData.timeout}
            onChange={(e) => setFormData(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
            min={1000}
            max={300000}
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Custom Headers
          </label>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Header name"
              value={newHeader.key}
              onChange={(e) => setNewHeader(prev => ({ ...prev, key: e.target.value }))}
              className="flex-1"
            />
            <Input
              placeholder="Header value"
              value={newHeader.value}
              onChange={(e) => setNewHeader(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddHeader}
              disabled={!newHeader.key || !newHeader.value}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {headers.length > 0 && (
            <div className="space-y-2">
              {headers.map((header) => (
                <div key={header.key} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={() => handleToggleHeader(header.key)}
                    className="rounded border-gray-300"
                  />
                  <span className="font-mono text-sm flex-1">
                    {header.key}: {header.value}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveHeader(header.key)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.enabled}
            onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Enabled</span>
        </label>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            <Save className="w-4 h-4 mr-2" />
            {endpoint ? 'Update' : 'Add'} Endpoint
          </Button>
        </div>
      </form>
    </Modal>
  );
};