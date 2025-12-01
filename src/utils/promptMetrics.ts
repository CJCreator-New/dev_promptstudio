/**
 * Filename: promptMetrics.ts
 * Purpose: Calculate individual prompt quality metrics
 * 
 * Key Functions:
 * - calculateClarity: Measure prompt clarity (0-100)
 * - calculateSpecificity: Measure specificity level (0-100)
 * - detectAmbiguity: Find vague/ambiguous terms
 * - countTokens: Estimate token count
 * - checkBestPractices: Validate against best practices
 * 
 * Dependencies: None
 */

import { QualityIssue } from '../services/qualityAnalyzer';

const VAGUE_TERMS = [
  'good', 'bad', 'nice', 'better', 'best', 'some', 'many', 'few', 'several',
  'thing', 'stuff', 'etc', 'something', 'anything', 'everything'
];

const TECHNICAL_INDICATORS = [
  'react', 'vue', 'angular', 'typescript', 'javascript', 'python', 'java',
  'api', 'database', 'sql', 'nosql', 'rest', 'graphql', 'component',
  'function', 'class', 'interface', 'type', 'schema', 'endpoint'
];

export const calculateClarity = (prompt: string): number => {
  let score = 70;
  const lower = prompt.toLowerCase();
  const words = prompt.split(/\s+/);
  
  // Penalize vague terms
  const vagueCount = VAGUE_TERMS.filter(term => lower.includes(term)).length;
  score -= vagueCount * 5;
  
  // Reward specific technical terms
  const techCount = TECHNICAL_INDICATORS.filter(term => lower.includes(term)).length;
  score += Math.min(techCount * 3, 20);
  
  // Penalize excessive length without structure
  if (words.length > 200 && !prompt.includes('\n\n')) score -= 10;
  
  // Reward clear sentence structure
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length >= 3 && sentences.length <= 15) score += 10;
  
  return Math.max(0, Math.min(score, 100));
};

export const calculateSpecificity = (prompt: string): number => {
  let score = 50;
  const lower = prompt.toLowerCase();
  
  // Check for specific technologies
  const hasTechStack = /react|vue|angular|python|java|node|typescript/i.test(prompt);
  if (hasTechStack) score += 15;
  
  // Check for specific versions or tools
  const hasVersions = /\d+\.\d+|v\d+|version/i.test(prompt);
  if (hasVersions) score += 10;
  
  // Check for specific patterns or architectures
  const hasPatterns = /mvc|mvvm|microservice|rest|graphql|component|module/i.test(prompt);
  if (hasPatterns) score += 10;
  
  // Check for specific requirements
  const hasRequirements = /must|should|required|need|expect/i.test(prompt);
  if (hasRequirements) score += 10;
  
  // Check for examples or references
  const hasExamples = /example|like|similar to|such as/i.test(prompt);
  if (hasExamples) score += 5;
  
  return Math.min(score, 100);
};

export const detectAmbiguity = (prompt: string): string[] => {
  const lower = prompt.toLowerCase();
  return VAGUE_TERMS.filter(term => lower.includes(term));
};

export const countTokens = (text: string): number => {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
};

export const checkBestPractices = (prompt: string): QualityIssue[] => {
  const issues: QualityIssue[] = [];
  const lower = prompt.toLowerCase();
  
  // Check for role definition
  if (!/act as|you are|role:/i.test(prompt)) {
    issues.push({
      type: 'info',
      category: 'completeness',
      message: 'Missing role definition',
      suggestion: 'Start with "Act as a [role]" or "You are a [role]"'
    });
  }
  
  // Check for output format
  if (!/format:|output:|provide|return|generate/i.test(prompt)) {
    issues.push({
      type: 'info',
      category: 'completeness',
      message: 'No output format specified',
      suggestion: 'Specify expected output format (code, JSON, markdown, etc.)'
    });
  }
  
  // Check for constraints
  if (prompt.length > 100 && !/don\'t|avoid|not|constraint|limit/i.test(prompt)) {
    issues.push({
      type: 'info',
      category: 'completeness',
      message: 'No constraints specified',
      suggestion: 'Add constraints or things to avoid'
    });
  }
  
  // Check for excessive capitalization
  const capsRatio = (prompt.match(/[A-Z]/g) || []).length / prompt.length;
  if (capsRatio > 0.3) {
    issues.push({
      type: 'warning',
      category: 'clarity',
      message: 'Excessive capitalization',
      suggestion: 'Use normal sentence case for better readability'
    });
  }
  
  return issues;
};

export const optimizeTokenUsage = (prompt: string): string => {
  let optimized = prompt;
  
  // Remove excessive whitespace
  optimized = optimized.replace(/\s+/g, ' ').trim();
  
  // Remove redundant phrases
  const redundant = [
    /please\s+/gi,
    /kindly\s+/gi,
    /i want you to\s+/gi,
    /can you\s+/gi
  ];
  
  redundant.forEach(pattern => {
    optimized = optimized.replace(pattern, '');
  });
  
  return optimized;
};
