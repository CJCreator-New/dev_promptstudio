export interface Pattern {
  name: string;
  regex: RegExp;
  suggestion: string;
  category: 'best_practice' | 'anti_pattern' | 'optimization';
}

export const patterns: Pattern[] = [
  {
    name: 'Missing Context',
    regex: /^(?!.*context)(?!.*background)(?!.*about).{0,50}$/i,
    suggestion: 'Add context or background information for better results',
    category: 'best_practice',
  },
  {
    name: 'Vague Instructions',
    regex: /\b(something|anything|stuff|things)\b/gi,
    suggestion: 'Replace vague terms with specific instructions',
    category: 'anti_pattern',
  },
  {
    name: 'Missing Output Format',
    regex: /^(?!.*format)(?!.*output)(?!.*structure).+$/i,
    suggestion: 'Specify desired output format (JSON, markdown, list, etc.)',
    category: 'best_practice',
  },
  {
    name: 'Too Short',
    regex: /^.{1,20}$/,
    suggestion: 'Expand prompt with more details for better results',
    category: 'optimization',
  },
  {
    name: 'Missing Role',
    regex: /^(?!.*you are)(?!.*act as)(?!.*role).+$/i,
    suggestion: 'Define AI role (e.g., "You are an expert...")',
    category: 'best_practice',
  },
  {
    name: 'Multiple Questions',
    regex: /\?.*\?/,
    suggestion: 'Break into separate prompts for focused responses',
    category: 'optimization',
  },
];

export function detectPatterns(text: string): Pattern[] {
  return patterns.filter((pattern) => pattern.regex.test(text));
}

export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

export function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  return matches ? matches.map((m) => m.slice(2, -2).trim()) : [];
}

export function suggestVariables(text: string): string[] {
  const suggestions: string[] = [];
  const words = text.toLowerCase().split(/\s+/);
  
  if (words.includes('name')) suggestions.push('{{user_name}}');
  if (words.includes('date') || words.includes('time')) suggestions.push('{{current_date}}');
  if (words.includes('topic') || words.includes('subject')) suggestions.push('{{topic}}');
  if (words.includes('language')) suggestions.push('{{language}}');
  if (words.includes('format')) suggestions.push('{{output_format}}');
  
  return suggestions;
}
