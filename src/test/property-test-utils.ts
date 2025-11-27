import * as fc from 'fast-check';
import { DomainType, ComplexityLevel, PlatformType, GenerationMode } from '../types';

// Property-based test generators
export const arbitraryDomain = () => fc.constantFrom(...Object.values(DomainType));
export const arbitraryComplexity = () => fc.constantFrom(...Object.values(ComplexityLevel));
export const arbitraryPlatform = () => fc.constantFrom(...Object.values(PlatformType));
export const arbitraryMode = () => fc.constantFrom(...Object.values(GenerationMode));

export const arbitraryPromptText = () => fc.string({ minLength: 1, maxLength: 1000 });
export const arbitraryNonEmptyString = () => fc.string({ minLength: 1, maxLength: 100 });

export const arbitraryEnhancementOptions = () => fc.record({
  domain: arbitraryDomain(),
  platform: arbitraryPlatform(),
  targetTool: fc.constantFrom('general', 'cursor', 'copilot', 'claude'),
  complexity: arbitraryComplexity(),
  mode: arbitraryMode(),
  includeTechStack: fc.boolean(),
  includeBestPractices: fc.boolean(),
  includeEdgeCases: fc.boolean(),
  includeCodeSnippet: fc.boolean(),
  includeExampleUsage: fc.boolean(),
  includeTests: fc.boolean(),
  useThinking: fc.boolean(),
});

export const arbitraryHistoryItem = () => fc.record({
  id: fc.uuid(),
  original: arbitraryPromptText(),
  enhanced: arbitraryPromptText(),
  timestamp: fc.integer({ min: 0, max: Date.now() }),
  domain: arbitraryDomain(),
  mode: arbitraryMode(),
});

// Accessibility test helpers
export const arbitraryAriaRole = () => fc.constantFrom(
  'button', 'link', 'textbox', 'combobox', 'listbox', 'option', 'dialog', 'alert'
);

export const arbitraryColorHex = () => fc.hexaString({ minLength: 6, maxLength: 6 })
  .map(hex => `#${hex}`);

// Responsive design test helpers
export const arbitraryViewportSize = () => fc.record({
  width: fc.integer({ min: 320, max: 2560 }),
  height: fc.integer({ min: 568, max: 1440 }),
});

export const arbitraryTouchTarget = () => fc.record({
  width: fc.integer({ min: 20, max: 100 }),
  height: fc.integer({ min: 20, max: 100 }),
});