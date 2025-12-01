import { detectPatterns, calculateSimilarity, extractVariables, suggestVariables } from '../utils/patternMatcher';

export interface Suggestion {
  type: 'similar_prompt' | 'variable' | 'pattern' | 'completion';
  content: string;
  score: number;
  reason?: string;
}

export class SuggestionEngine {
  private promptHistory: string[] = [];

  addToHistory(prompt: string): void {
    if (prompt.trim().length > 10) {
      this.promptHistory.unshift(prompt);
      if (this.promptHistory.length > 100) this.promptHistory.pop();
    }
  }

  getSuggestions(currentText: string): Suggestion[] {
    const suggestions: Suggestion[] = [];

    suggestions.push(...this.getSimilarPrompts(currentText));
    suggestions.push(...this.getVariableSuggestions(currentText));
    suggestions.push(...this.getPatternSuggestions(currentText));
    suggestions.push(...this.getCompletionSuggestions(currentText));

    return suggestions.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  private getSimilarPrompts(text: string): Suggestion[] {
    if (text.length < 20) return [];

    return this.promptHistory
      .map((prompt) => ({
        type: 'similar_prompt' as const,
        content: prompt,
        score: calculateSimilarity(text, prompt),
        reason: 'Similar to previous prompt',
      }))
      .filter((s) => s.score > 0.6 && s.score < 0.95);
  }

  private getVariableSuggestions(text: string): Suggestion[] {
    const existingVars = extractVariables(text);
    const suggested = suggestVariables(text);

    return suggested
      .filter((v) => !existingVars.includes(v.slice(2, -2)))
      .map((v) => ({
        type: 'variable' as const,
        content: v,
        score: 0.7,
        reason: 'Suggested variable placeholder',
      }));
  }

  private getPatternSuggestions(text: string): Suggestion[] {
    const patterns = detectPatterns(text);

    return patterns.map((p) => ({
      type: 'pattern' as const,
      content: p.suggestion,
      score: p.category === 'anti_pattern' ? 0.9 : 0.6,
      reason: `${p.category.replace('_', ' ')}: ${p.name}`,
    }));
  }

  private getCompletionSuggestions(text: string): Suggestion[] {
    const completions: Suggestion[] = [];
    const lower = text.toLowerCase();

    if (lower.includes('you are') && !lower.includes('expert')) {
      completions.push({
        type: 'completion',
        content: 'You are an expert in...',
        score: 0.8,
        reason: 'Complete role definition',
      });
    }

    if (lower.includes('write') && !lower.includes('format')) {
      completions.push({
        type: 'completion',
        content: 'Output format: [specify format]',
        score: 0.75,
        reason: 'Specify output format',
      });
    }

    if (lower.includes('analyze') && !lower.includes('focus')) {
      completions.push({
        type: 'completion',
        content: 'Focus on: [key aspects]',
        score: 0.7,
        reason: 'Add analysis focus',
      });
    }

    return completions;
  }

  getAutoComplete(text: string, cursorPosition: number): string[] {
    const beforeCursor = text.slice(0, cursorPosition);
    const lastWord = beforeCursor.split(/\s+/).pop() || '';

    const templates = [
      'You are an expert',
      'Act as a',
      'Please provide',
      'Format the output as',
      'Focus on',
      'Consider the following',
      'Step by step',
      'In detail',
    ];

    return templates
      .filter((t) => t.toLowerCase().startsWith(lastWord.toLowerCase()))
      .slice(0, 5);
  }
}
