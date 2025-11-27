/**
 * Runtime type guards for type safety
 */

import { DomainType, ComplexityLevel, PlatformType, GenerationMode } from '../types';

export const isDomainType = (value: unknown): value is DomainType => {
  return typeof value === 'string' && Object.values(DomainType).includes(value as DomainType);
};

export const isComplexityLevel = (value: unknown): value is ComplexityLevel => {
  return typeof value === 'string' && Object.values(ComplexityLevel).includes(value as ComplexityLevel);
};

export const isPlatformType = (value: unknown): value is PlatformType => {
  return typeof value === 'string' && Object.values(PlatformType).includes(value as PlatformType);
};

export const isGenerationMode = (value: unknown): value is GenerationMode => {
  return typeof value === 'string' && Object.values(GenerationMode).includes(value as GenerationMode);
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};