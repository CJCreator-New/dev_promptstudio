import { DomainType } from '../types';

export interface PromptRecipe {
  id: string;
  label: string;
  icon: string;
  description: string;
  template: string;
  domain: DomainType;
}

export const PROMPT_RECIPES: PromptRecipe[] = [
  {
    id: 'refactor',
    label: 'Refactor Messy Prompt',
    icon: '🔧',
    description: 'Clean up and structure an existing prompt',
    domain: DomainType.GENERAL,
    template: `Take this rough prompt and refactor it into a clear, structured format:

{{paste_your_messy_prompt_here}}

Requirements:
- Clear role definition
- Specific requirements list
- Expected output format
- Any constraints or limitations`
  },
  {
    id: 'system-prompt',
    label: 'System Prompt for Coding Agent',
    icon: '🤖',
    description: 'Create a system prompt for AI coding assistants',
    domain: DomainType.BACKEND,
    template: `Act as an expert {{language}} developer with deep knowledge of {{framework}}.

Your role:
- Write clean, maintainable code following best practices
- Provide detailed explanations for complex logic
- Suggest optimizations and improvements
- Follow {{coding_standard}} conventions

When responding:
1. Analyze the requirements carefully
2. Propose a solution with code examples
3. Explain key decisions and trade-offs
4. Highlight potential edge cases

Code style:
- Use TypeScript for type safety
- Write comprehensive JSDoc comments
- Include error handling
- Add unit tests when relevant`
  },
  {
    id: 'ux-copy',
    label: 'UX Copy Polish',
    icon: '✨',
    description: 'Refine UI text for clarity and engagement',
    domain: DomainType.UI_UX,
    template: `Polish this UI copy to be clear, concise, and user-friendly:

{{paste_your_ui_text_here}}

Guidelines:
- Use active voice
- Keep it conversational but professional
- Avoid jargon unless necessary
- Make CTAs action-oriented
- Consider accessibility and inclusivity

Target audience: {{describe_your_users}}
Tone: {{friendly/professional/technical}}`
  },
  {
    id: 'api-spec',
    label: 'API Contract Enforcer',
    icon: '📋',
    description: 'Generate strict API specifications',
    domain: DomainType.BACKEND,
    template: `Create a detailed API specification for:

Endpoint: {{endpoint_name}}
Method: {{GET/POST/PUT/DELETE}}
Purpose: {{what_it_does}}

Include:
- Request schema (headers, body, query params)
- Response schema (success and error cases)
- Status codes and their meanings
- Authentication requirements
- Rate limiting rules
- Example requests and responses
- Edge cases and validation rules`
  },
  {
    id: 'code-review',
    label: 'Code Reviewer',
    icon: '👀',
    description: 'Comprehensive code review checklist',
    domain: DomainType.GENERAL,
    template: `Review this code for:

\`\`\`{{language}}
{{paste_code_here}}
\`\`\`

Check for:
1. **Correctness**: Does it work as intended?
2. **Performance**: Any bottlenecks or inefficiencies?
3. **Security**: Vulnerabilities or unsafe practices?
4. **Maintainability**: Is it readable and well-structured?
5. **Best Practices**: Following language/framework conventions?
6. **Testing**: Are edge cases covered?

Provide:
- Specific issues with line numbers
- Suggested improvements
- Severity rating (critical/major/minor)
- Code snippets for fixes`
  },
  {
    id: 'test-gen',
    label: 'Test Case Generator',
    icon: '🧪',
    description: 'Generate comprehensive test cases',
    domain: DomainType.GENERAL,
    template: `Generate test cases for:

Function/Component: {{name}}
Purpose: {{what_it_does}}

Create tests for:
1. **Happy path**: Normal expected usage
2. **Edge cases**: Boundary conditions
3. **Error cases**: Invalid inputs, failures
4. **Integration**: How it works with other parts

For each test:
- Clear test name
- Setup/Given
- Action/When
- Expected result/Then
- Cleanup if needed

Framework: {{jest/vitest/mocha/etc}}`
  }
];
