// Trial service for limited free enhancements
const TRIAL_LIMIT = 3;
const TRIAL_KEY = 'trial_usage';

export const getTrialUsage = (): number => {
  try {
    return parseInt(localStorage.getItem(TRIAL_KEY) || '0');
  } catch {
    return 0;
  }
};

export const incrementTrialUsage = (): void => {
  try {
    const current = getTrialUsage();
    localStorage.setItem(TRIAL_KEY, (current + 1).toString());
  } catch {
    // Storage blocked, continue without saving
  }
};

export const hasTrialLeft = (): boolean => {
  return getTrialUsage() < TRIAL_LIMIT;
};

export const getTrialRemaining = (): number => {
  return Math.max(0, TRIAL_LIMIT - getTrialUsage());
};

// Mock enhancement for trial users
export async function* trialEnhancement(prompt: string): AsyncGenerator<string, void, unknown> {
  const responses = [
    "**Enhanced Prompt:**\n\n",
    "**Role:** You are a senior software engineer with expertise in modern web development.\n\n",
    "**Context:** Create a comprehensive solution for the following requirement.\n\n",
    "**Requirements:**\n",
    `- ${prompt}\n`,
    "- Follow best practices and industry standards\n",
    "- Include error handling and edge cases\n",
    "- Provide clean, maintainable code\n\n",
    "**Tech Stack:** React, TypeScript, modern CSS\n\n",
    "**Output Format:** Provide working code with explanations"
  ];

  for (const chunk of responses) {
    await new Promise(resolve => setTimeout(resolve, 100));
    yield chunk;
  }
}