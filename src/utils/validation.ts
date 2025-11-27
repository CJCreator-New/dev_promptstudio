import { z } from 'zod';

// --- Custom Errors ---
export class APIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

export class RateLimitError extends APIError {
  retryAfter: number;
  constructor(message: string, retryAfter: number = 60) {
    super(message, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

// --- Validation Schemas ---

export const promptInputSchema = z.object({
  input: z
    .string()
    .min(10, "Prompt is too short. Please describe your idea in at least 10 characters.")
    .max(5000, "Prompt is too long. Please keep it under 5000 characters."),
});

export const templateSchema = z.object({
  name: z.string().min(3, "Template name must be at least 3 characters."),
  text: z.string().min(10, "Template content must be at least 10 characters."),
  domain: z.string(),
});

export type PromptInputData = z.infer<typeof promptInputSchema>;
export type TemplateData = z.infer<typeof templateSchema>;