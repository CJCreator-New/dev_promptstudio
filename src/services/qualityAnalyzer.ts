/**
 * Filename: qualityAnalyzer.ts
 * Purpose: Analyze prompt quality with scoring and actionable suggestions
 * 
 * Key Functions:
 * - analyzePrompt: Main analysis function returning comprehensive quality report
 * - calculateScores: Individual metric calculations
 * - generateSuggestions: Context-aware improvement recommendations
 * 
 * Dependencies: promptMetrics
 */

import { 
  calculateClarity, 
  calculateSpecificity, 
  detectAmbiguity, 
  countTokens,
  checkBestPractices 
} from '../utils/promptMetrics';

export interface QualityScore {
  overall: number;
  clarity: number;
  specificity: number;
  structure: number;
  completeness: number;
}

export interface QualityIssue {
  type: 'error' | 'warning' | 'info';
  category: 'clarity' | 'specificity' | 'structure' | 'completeness' | 'optimization';
  message: string;
  suggestion: string;
  line?: number;
}

export interface QualityAnalysis {
  scores: QualityScore;
  issues: QualityIssue[];
  tokenCount: number;
  estimatedCost: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string[];
  improvements: string[];
}

export const analyzePrompt = (prompt: string): QualityAnalysis => {
  const clarity = calculateClarity(prompt);
  const specificity = calculateSpecificity(prompt);
  const structure = analyzeStructure(prompt);
  const completeness = analyzeCompleteness(prompt);
  const overall = (clarity + specificity + structure + completeness) / 4;

  const scores: QualityScore = { overall, clarity, specificity, structure, completeness };
  const issues = detectIssues(prompt, scores);
  const tokenCount = countTokens(prompt);
  const estimatedCost = (tokenCount / 1000) * 0.002; // $0.002 per 1K tokens

  return {
    scores,
    issues,
    tokenCount,
    estimatedCost,
    grade: getGrade(overall),
    strengths: identifyStrengths(scores),
    improvements: generateImprovements(issues)
  };
};

const analyzeStructure = (prompt: string): number => {
  let score = 50;
  
  // Has clear sections
  if (/role:|context:|requirements:|output:/i.test(prompt)) score += 20;
  
  // Uses bullet points or numbered lists
  if (/[-*•]\s|^\d+\./m.test(prompt)) score += 15;
  
  // Has proper formatting
  if (prompt.includes('\n\n')) score += 10;
  
  // Not too long or too short
  const wordCount = prompt.split(/\s+/).length;
  if (wordCount >= 20 && wordCount <= 500) score += 5;

  return Math.min(score, 100);
};

const analyzeCompleteness = (prompt: string): number => {
  let score = 40;
  const lower = prompt.toLowerCase();
  
  // Has role definition
  if (/act as|you are|role:/i.test(prompt)) score += 15;
  
  // Has clear goal/objective
  if (/goal:|objective:|task:|build|create|develop/i.test(prompt)) score += 15;
  
  // Has constraints or requirements
  if (/requirements:|constraints:|must|should|avoid/i.test(prompt)) score += 15;
  
  // Has output format specification
  if (/format:|output:|provide|include/i.test(prompt)) score += 15;

  return Math.min(score, 100);
};

const detectIssues = (prompt: string, scores: QualityScore): QualityIssue[] => {
  const issues: QualityIssue[] = [];
  
  // Clarity issues
  if (scores.clarity < 60) {
    issues.push({
      type: 'warning',
      category: 'clarity',
      message: 'Prompt lacks clarity',
      suggestion: 'Use specific technical terms and avoid vague language like "good", "nice", "better"'
    });
  }

  // Ambiguity detection
  const ambiguous = detectAmbiguity(prompt);
  if (ambiguous.length > 0) {
    issues.push({
      type: 'warning',
      category: 'clarity',
      message: `Found ${ambiguous.length} ambiguous terms`,
      suggestion: `Replace vague terms: ${ambiguous.slice(0, 3).join(', ')}`
    });
  }

  // Specificity issues
  if (scores.specificity < 60) {
    issues.push({
      type: 'warning',
      category: 'specificity',
      message: 'Prompt is too generic',
      suggestion: 'Add specific technologies, frameworks, or design patterns'
    });
  }

  // Structure issues
  if (scores.structure < 60) {
    issues.push({
      type: 'info',
      category: 'structure',
      message: 'Improve prompt structure',
      suggestion: 'Use sections like Role, Context, Requirements, Output Format'
    });
  }

  // Completeness issues
  if (scores.completeness < 60) {
    issues.push({
      type: 'warning',
      category: 'completeness',
      message: 'Missing key components',
      suggestion: 'Include role definition, clear goal, requirements, and expected output format'
    });
  }

  // Token optimization
  const tokenCount = countTokens(prompt);
  if (tokenCount > 2000) {
    issues.push({
      type: 'info',
      category: 'optimization',
      message: 'Prompt is very long',
      suggestion: 'Consider breaking into smaller, focused prompts or use prompt chaining'
    });
  }

  // Best practices
  const practiceIssues = checkBestPractices(prompt);
  issues.push(...practiceIssues);

  return issues;
};

const getGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const identifyStrengths = (scores: QualityScore): string[] => {
  const strengths: string[] = [];
  
  if (scores.clarity >= 80) strengths.push('Clear and unambiguous language');
  if (scores.specificity >= 80) strengths.push('Highly specific and detailed');
  if (scores.structure >= 80) strengths.push('Well-structured and organized');
  if (scores.completeness >= 80) strengths.push('Comprehensive with all key elements');
  
  return strengths;
};

const generateImprovements = (issues: QualityIssue[]): string[] => {
  return issues
    .filter(i => i.type === 'warning' || i.type === 'error')
    .slice(0, 5)
    .map(i => i.suggestion);
};
