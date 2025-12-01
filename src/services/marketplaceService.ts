/**
 * Filename: marketplaceService.ts
 * Purpose: Marketplace API integration (mock for now, can connect to backend)
 * 
 * Key Functions:
 * - fetchPrompts: Get prompts from API
 * - submitPrompt: Submit new prompt
 * - reportPrompt: Report inappropriate content
 * 
 * Dependencies: None
 */

import { MarketplacePrompt } from '../store/marketplaceStore';

// Mock data for demo - replace with real API calls
export const SAMPLE_PROMPTS: Omit<MarketplacePrompt, 'id' | 'rating' | 'downloads' | 'reviews' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'React Component Generator',
    description: 'Generate production-ready React components with TypeScript, tests, and Storybook stories',
    content: `Act as a Senior React Engineer. Create a {component_name} component with the following requirements:

Requirements:
- TypeScript with strict typing
- Functional component with hooks
- Props interface with JSDoc comments
- Responsive design with Tailwind CSS
- Accessibility (ARIA labels, keyboard navigation)
- Unit tests with React Testing Library
- Storybook stories with all variants

Output Format:
1. Component file (.tsx)
2. Test file (.test.tsx)
3. Storybook file (.stories.tsx)
4. Usage example`,
    category: 'Web Development',
    tags: ['react', 'typescript', 'components', 'testing'],
    author: 'DevPrompt Team',
    authorId: 'team',
    isPremium: false
  },
  {
    title: 'API Documentation Generator',
    description: 'Generate comprehensive API documentation from OpenAPI specs',
    content: `Act as a Technical Writer specializing in API documentation.

Task: Generate complete API documentation for {api_name}

Include:
- Overview and authentication
- All endpoints with examples
- Request/response schemas
- Error codes and handling
- Rate limiting information
- SDK code snippets (Python, JavaScript, cURL)
- Interactive examples

Format: Markdown with code blocks`,
    category: 'Documentation',
    tags: ['api', 'documentation', 'openapi'],
    author: 'TechWriter Pro',
    authorId: 'user_123',
    isPremium: false
  },
  {
    title: 'AI Agent System Prompt',
    description: 'Comprehensive system prompt for building autonomous AI agents',
    content: `You are an autonomous AI agent with the following capabilities:

Core Functions:
- Task decomposition and planning
- Tool usage and API calls
- Memory management
- Error handling and recovery
- Progress reporting

Behavior Guidelines:
- Break complex tasks into subtasks
- Validate results at each step
- Ask for clarification when needed
- Provide detailed reasoning
- Handle failures gracefully

Available Tools:
{list_tools}

Task: {user_task}

Execute the task step by step, reporting progress and results.`,
    category: 'AI Agents',
    tags: ['ai-agents', 'automation', 'system-prompt'],
    author: 'AI Builder',
    authorId: 'user_456',
    isPremium: true,
    price: 9.99
  }
];

export const fetchMarketplacePrompts = async (): Promise<typeof SAMPLE_PROMPTS> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return SAMPLE_PROMPTS;
};

export const submitPromptToMarketplace = async (
  prompt: Omit<MarketplacePrompt, 'id' | 'rating' | 'downloads' | 'reviews' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; error?: string }> => {
  // Validate
  if (!prompt.title || prompt.title.length < 10) {
    return { success: false, error: 'Title must be at least 10 characters' };
  }
  if (!prompt.content || prompt.content.length < 50) {
    return { success: false, error: 'Content must be at least 50 characters' };
  }

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

export const reportPrompt = async (
  promptId: string,
  reason: string
): Promise<{ success: boolean }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Reported prompt ${promptId}: ${reason}`);
  return { success: true };
};
