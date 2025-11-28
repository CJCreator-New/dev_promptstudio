export type KeyProvider = 'openai' | 'gemini' | 'claude' | 'openrouter';

export type KeyStatus = 'unverified' | 'verified' | 'invalid' | 'loading';

export interface ApiKeyData {
  value: string;
  status: KeyStatus;
  lastVerified?: number;
}

export interface ProviderConfig {
  name: string;
  label: string;
  docsUrl: string;
  placeholder: string;
}

export const PROVIDER_CONFIGS: Record<KeyProvider, ProviderConfig> = {
  openai: {
    name: 'openai',
    label: 'OpenAI',
    docsUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-...',
  },
  gemini: {
    name: 'gemini',
    label: 'Google Gemini',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIza...',
  },
  claude: {
    name: 'claude',
    label: 'Anthropic Claude',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    placeholder: 'sk-ant-...',
  },
  openrouter: {
    name: 'openrouter',
    label: 'OpenRouter',
    docsUrl: 'https://openrouter.ai/keys',
    placeholder: 'sk-or-...',
  },
};
