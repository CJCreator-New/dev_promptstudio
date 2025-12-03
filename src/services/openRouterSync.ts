/**
 * OpenRouter Free Models Sync Service
 * Fetches and maintains list of daily free models
 */

interface OpenRouterModel {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
    request?: string;
  };
  context_length: number;
  architecture?: {
    modality?: string;
  };
  top_provider?: {
    context_length?: number;
  };
}

interface FreeModel {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  modalities: string[];
  isFreeVariant: boolean;
}

interface SyncResult {
  lastSyncedAt: string;
  models: FreeModel[];
}

const STORAGE_KEY = 'openrouter_free_models';
const LAST_SYNC_KEY = 'openrouter_last_sync';
const SYNC_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

function isFreeModel(model: OpenRouterModel): boolean {
  const prompt = parseFloat(model.pricing.prompt);
  const completion = parseFloat(model.pricing.completion);
  const request = model.pricing.request ? parseFloat(model.pricing.request) : 0;
  
  return (prompt === 0 && completion === 0 && request === 0) || model.id.includes(':free');
}

function parseModel(model: OpenRouterModel): FreeModel {
  const [provider] = model.id.split('/');
  const modalities = model.architecture?.modality 
    ? model.architecture.modality.split(',').map(m => m.trim())
    : ['text'];
  
  return {
    id: model.id,
    name: model.name,
    provider: provider || 'unknown',
    contextLength: model.top_provider?.context_length || model.context_length || 0,
    modalities,
    isFreeVariant: model.id.includes(':free'),
  };
}

function sortModels(models: FreeModel[]): FreeModel[] {
  return models.sort((a, b) => {
    // Priority: multimodal > text-only
    const aMulti = a.modalities.length > 1 ? 1 : 0;
    const bMulti = b.modalities.length > 1 ? 1 : 0;
    if (aMulti !== bMulti) return bMulti - aMulti;
    
    // Then by context length (higher first)
    if (a.contextLength !== b.contextLength) return b.contextLength - a.contextLength;
    
    // Then alphabetically
    return a.id.localeCompare(b.id);
  });
}

export async function syncFreeModels(apiKey: string): Promise<SyncResult> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const allModels: OpenRouterModel[] = data.data || [];
    
    const freeModels = allModels
      .filter(isFreeModel)
      .map(parseModel);
    
    const sorted = sortModels(freeModels);
    
    const result: SyncResult = {
      lastSyncedAt: new Date().toISOString(),
      models: sorted,
    };
    
    // Store in localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    } catch (e) {
      console.warn('Failed to cache free models:', e);
    }
    
    return result;
  } catch (error) {
    console.error('Failed to sync OpenRouter free models:', error);
    
    // Return cached data if available
    const cached = getCachedFreeModels();
    if (cached) return cached;
    
    throw error;
  }
}

export function getCachedFreeModels(): SyncResult | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export function shouldSync(): boolean {
  try {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    if (!lastSync) return true;
    
    const elapsed = Date.now() - parseInt(lastSync, 10);
    return elapsed >= SYNC_INTERVAL;
  } catch {
    return true;
  }
}

export async function getFreeModels(apiKey: string): Promise<SyncResult> {
  // Return cached if recent
  if (!shouldSync()) {
    const cached = getCachedFreeModels();
    if (cached) return cached;
  }
  
  // Otherwise sync
  return syncFreeModels(apiKey);
}
