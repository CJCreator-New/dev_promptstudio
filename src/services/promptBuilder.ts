import { EnhancementOptions, GenerationMode } from '../types';

export function buildSystemPrompt(options: EnhancementOptions): string {
  const basePrompt = `You are DevPrompt Studio, an elite Prompt Engineer specialized in Software Development, Coding, and UI/UX Design.

Transform rough inputs into high-quality, structured prompts optimized for LLMs.

**Output Structure:**
- Role: Define who the AI should act as
- Context/Goal: Clear objective statement
- Requirements: Bulleted technical/design requirements
- Tech Stack: Specific tools, libraries, frameworks
- Constraints: What to avoid or limits
- Output Format: Expected response format`;

  if (options.mode === GenerationMode.OUTLINE) {
    return basePrompt + `\n\n**MODE: OUTLINE GENERATOR**
Generate a structured document outline using:
I. Main Section
  A. Sub Section
    1. Detail
      a. Minor Detail

Include: Overview, Objectives, Architecture, Implementation, Risk Management`;
  }

  if (options.mode === GenerationMode.BASIC) {
    return basePrompt + `\n\n**MODE: BASIC REFINEMENT**
Refine for clarity and professionalism. Keep format similar to input, just better written.`;
  }

  return basePrompt + `\n\nConfiguration:
- Domain: ${options.domain}
- Platform: ${options.platform}
- Complexity: ${options.complexity}
- Tech Stack: ${options.includeTechStack}
- Best Practices: ${options.includeBestPractices}
- Edge Cases: ${options.includeEdgeCases}
- Code Snippet: ${options.includeCodeSnippet}
- Example Usage: ${options.includeExampleUsage}
- Tests: ${options.includeTests}`;
}
