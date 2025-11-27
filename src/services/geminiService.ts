import { GoogleGenAI } from "@google/genai";
import { EnhancementOptions, GenerationMode } from "../types";
import { RateLimitError, APIError } from "../utils/validation";
import { logger } from "../utils/errorLogging";

/** Maximum number of retry attempts for failed API calls */
const MAX_RETRIES = 3;
/** Initial delay in milliseconds before first retry */
const INITIAL_RETRY_DELAY = 1000;
/** Multiplier for exponential backoff (1s → 2s → 4s) */
const RETRY_MULTIPLIER = 2;

/** Function that intercepts and transforms API requests */
type RequestInterceptor = (config: any) => any;
/** Function that intercepts and transforms API responses */
type ResponseInterceptor = (response: any) => any;
/** Function that intercepts and transforms API errors */
type ErrorInterceptor = (error: any) => any;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

/**
 * Registers a request interceptor to transform API requests before sending
 * @param interceptor - Function that receives and returns request config
 * @example
 * addRequestInterceptor((config) => ({ ...config, timestamp: Date.now() }))
 */
export const addRequestInterceptor = (interceptor: RequestInterceptor) => {
  requestInterceptors.push(interceptor);
};

/**
 * Registers a response interceptor to transform API responses after receiving
 * @param interceptor - Function that receives and returns response data
 * @example
 * addResponseInterceptor((response) => ({ ...response, processed: true }))
 */
export const addResponseInterceptor = (interceptor: ResponseInterceptor) => {
  responseInterceptors.push(interceptor);
};

/**
 * Registers an error interceptor to transform API errors
 * @param interceptor - Function that receives and returns error object
 * @example
 * addErrorInterceptor((error) => ({ ...error, logged: true }))
 */
export const addErrorInterceptor = (interceptor: ErrorInterceptor) => {
  errorInterceptors.push(interceptor);
};

const applyRequestInterceptors = (config: any) => {
  return requestInterceptors.reduce((cfg, interceptor) => interceptor(cfg), config);
};

const applyResponseInterceptors = (response: any) => {
  return responseInterceptors.reduce((res, interceptor) => interceptor(res), response);
};

const applyErrorInterceptors = (error: any) => {
  return errorInterceptors.reduce((err, interceptor) => interceptor(err), error);
};

const SYSTEM_INSTRUCTION = `
You are DevPrompt Studio, an elite Prompt Engineer specialized specifically in Software Development, Coding, and UI/UX Design.

Your goal is to take a user's rough, vague, or simple input and transform it into a high-quality, structured, and highly effective prompt optimized for Large Language Models (like yourself).

**Strict Constraints:**
1. If the user's input is NOT related to coding, software architecture, web design, or technical project management, you must politely refuse to enhance it and suggest they input a technical topic.
2. The output must be the *enhanced prompt itself*, ready to be copied and pasted by the user into another LLM. Do not output a conversation about the prompt.

**Structure of the Enhanced Prompt:**
The enhanced prompt you generate should generally follow this structure (adapted based on complexity):
- **Role**: Define who the AI should act as (e.g., "Act as a Senior React Engineer...").
- **Context/Goal**: Clear statement of the objective.
- **Requirements**: Bulleted list of specific technical or design requirements.
- **Tech Stack**: Specific tools, libraries, or design systems requested.
- **Constraints**: What to avoid or specific limits.
- **Output Format**: How the response should look (code blocks, JSON, critique, etc.).

**Tone:**
- Maintain a professional, technical, and precise tone in the enhanced prompt.
`;

/**
 * Retries an async operation with exponential backoff on transient failures
 * @param operation - Async function to retry
 * @param retries - Number of retry attempts remaining (default: 3)
 * @param delay - Current delay in ms before retry (default: 1000)
 * @param attempt - Current attempt number for logging
 * @returns Promise resolving to operation result
 * @throws Error if all retries exhausted or non-retryable error
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = INITIAL_RETRY_DELAY,
  attempt: number = 1
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Apply error interceptors
    const processedError = applyErrorInterceptors(error);
    
    const status = processedError.status || processedError.response?.status;
    const isRetryable = 
      status === 429 || 
      status === 503 || 
      status === 500 ||
      processedError.message?.toLowerCase().includes('fetch') || 
      processedError.message?.toLowerCase().includes('network') ||
      processedError.message?.toLowerCase().includes('timeout');

    if (retries > 0 && isRetryable) {
      logger.error(processedError, {
        context: 'API Retry',
        attempt,
        retriesLeft: retries,
        status,
        nextRetryDelay: delay
      });

      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay * RETRY_MULTIPLIER, attempt + 1);
    }

    throw processedError;
  }
}

/**
 * Streams enhanced prompt from Google Gemini API with retry logic
 * @param rawInput - User's original prompt text
 * @param options - Enhancement configuration (mode, domain, complexity, etc.)
 * @yields Chunks of enhanced prompt text as they arrive
 * @throws APIError for HTTP errors (400, 401, 403, 404, 500, 503)
 * @throws RateLimitError for 429 status
 * @throws Error for network/configuration issues
 * @example
 * for await (const chunk of enhancePromptStream("Build a todo app", options)) {
 *   console.log(chunk);
 * }
 */
export const enhancePromptStream = async function* (
  rawInput: string,
  options: EnhancementOptions
): AsyncGenerator<string, void, unknown> {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let toolStrategy = "";
  const tool = options.targetTool || 'general';
  
  const builders = [
    'Bolt.new', 'Lovable.dev', 'Replit', 'Google AI Studio', 'Base44', 'V0', 
    'Glide', 'Softr', 'Adalo', 'Bravo Studio', 'Thunkable', 'Bubble', 
    'FlutterFlow', 'Appgyver', 'OutSystems', 'AppMySite', 'Builder.ai', 
    'Clappia', 'GoodBarber', 'GoCodeo SaaSBuilder', 'Natively'
  ];

  const agents = [
    'Cursor', 'Cline', 'Windsurf', 'Trae', 'GitHub Copilot', 'Aider', 
    'Continue.dev', 'OpenHands', 'Kiro', 'Qoder', 'Google Antigravity',
    'Zencoder', 'Claude Code', 'UiPath'
  ];

  const designers = [
    'Uizard', 'Subframe', 'Galileo AI', 'Visily', 'Tempo', 'Onlook', 
    'UX Pilot', 'Polymet', 'Stitch', 'Autodraw', 'Figma AI', 
    'PromptLayer', 'Humanloop', 'AI Parabellum', 'Promptbuilder',
    'Microsoft Design AI', 'Adobe Firefly'
  ];

  if (builders.includes(tool)) {
    toolStrategy = `
      TARGET TOOL: ${tool} (AI Full-Stack/No-Code Builder).
      OPTIMIZATION STRATEGY:
      - These tools build entire apps, screens, or components from a single prompt.
      - You MUST be extremely prescriptive about the Tech Stack immediately (e.g., "Use React, Tailwind, Supabase" or tool-specific primitives).
      - Provide the Database Schema (tables, columns, relationships) upfront if data is involved.
      - Define the UI layout explicitly (e.g., "Header with logo left, Grid layout for cards").
      - Avoid asking for "steps" to code; ask for the "Final Implementation" or "App Structure".
      - If the tool is V0, focus on shadcn/ui and Tailwind.
      - If the tool is Bubble/FlutterFlow, focus on logic flows and data types.
    `;
  } else if (agents.includes(tool)) {
    toolStrategy = `
      TARGET TOOL: ${tool} (Agentic IDE / Coding Agent).
      OPTIMIZATION STRATEGY:
      - These agents work directly in the file system and can edit multiple files.
      - Structure the prompt to first propose a "File Structure" or "Implementation Plan".
      - Use phrases like "Review the current file context" or "Create a new file at [path]".
      - Focus on modularity and separate concerns.
      - If the tool is Windsurf/Cursor, explicitly mention "Cascade" or "Composer" context usage if relevant.
      - If the tool is Aider/Cline, focus on git-commit-friendly, atomic changes.
    `;
  } else if (designers.includes(tool)) {
    toolStrategy = `
      TARGET TOOL: ${tool} (Prompt-to-Design / UI Generator / Prompt Ops).
      OPTIMIZATION STRATEGY:
      - These tools generate visuals, Figma designs, or prompt workflows.
      - Focus entirely on Visual Descriptions: Color palettes (Hex codes), Typography, Layout (Masonry, Sidebar, etc.), and Component Styles.
      - Describe the "Vibe" (Minimalist, Brutalist, Corporate).
      - List specific screens required (e.g., "Login Screen", "Dashboard", "Settings").
      - Do NOT ask for backend logic or database schemas unless it's for data binding in a prototype.
      - If this is a Prompt Ops tool (PromptLayer, etc.), structure the output as a meta-prompt template with {{variables}}.
    `;
  } else {
    toolStrategy = "TARGET TOOL: General LLM (ChatGPT, Claude, Gemini). Focus on clarity, context, and step-by-step reasoning.";
  }

  let modeInstruction = "";
  if (options.mode === GenerationMode.OUTLINE) {
    modeInstruction = `
      **MODE: DOCUMENT OUTLINE GENERATOR**
      Instead of generating a prompt to copy/paste, you must generate a **Structured Document Outline** for the user's idea.
      
      Structure Requirement:
      - Use STRICT hierarchical Markdown numbering exactly as follows:
        I. [Main Section]
          A. [Sub Section]
             1. [Detail]
                a. [Minor Detail]
      
      - Mandatory Sections to Include:
        I. Overview / Executive Summary
        II. Key Objectives & Goals
        III. Technical Architecture & Stack
        IV. Implementation Phases (Step-by-Step)
        V. Risk Management & Edge Cases
      
      - Do not output a meta-prompt. Output the Outline itself as if writing a specification document.
      - Focus on High-Level Strategy first, then deep dive into Technical Specs.
    `;
  } else if (options.mode === GenerationMode.BASIC) {
    modeInstruction = `
      **MODE: BASIC REFINEMENT**
      Refine the user's input for clarity, grammar, and flow.
      - Do NOT add a complex structure (Role, Context, etc.) like you usually do.
      - Do NOT add new sections like Tech Stack or specific constraints unless explicitly asked.
      - Keep the output format similar to the input, just better written, more professional, and clearer.
      - Make it concise.
      - Ignore standard structural requirements in your system instructions for this specific request.
    `;
  }

  const metaPrompt = `
    User Input: "${rawInput}"
    
    Configuration:
    - Target Domain: ${options.domain}
    - Target Platform: ${options.platform}
    - Desired Complexity: ${options.complexity}
    - Include Specific Tech Stack Recommendations: ${options.includeTechStack}
    - Include Industry Best Practices: ${options.includeBestPractices}
    - Include Edge Case Handling: ${options.includeEdgeCases}
    - Include Code Snippet Example: ${options.includeCodeSnippet}
    - Include Example Usage: ${options.includeExampleUsage}
    - Include Tests: ${options.includeTests}
    - Reasoning Mode: ${options.useThinking ? 'Deep Thinking / Architectural Analysis' : 'Standard Enhancement'}
    
    ${modeInstruction}
    ${options.mode !== GenerationMode.BASIC ? toolStrategy : ''}

    Please generate the output now.
  `;

  const modelName = options.useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  
  const requestConfig: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
  };

  if (options.useThinking) {
    requestConfig.thinkingConfig = { thinkingBudget: 32768 };
  } else {
    requestConfig.temperature = 0.7;
  }

  try {
    // Apply request interceptors
    const interceptedConfig = applyRequestInterceptors({
      model: modelName,
      contents: metaPrompt,
      config: requestConfig,
      timestamp: Date.now()
    });

    const stream = await retryOperation(async () => {
      return await ai.models.generateContentStream({
        model: interceptedConfig.model,
        contents: interceptedConfig.contents,
        config: interceptedConfig.config,
      });
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        // Apply response interceptors
        const interceptedChunk = applyResponseInterceptors({ text: chunk.text, timestamp: Date.now() });
        yield interceptedChunk.text;
      }
    }

  } catch (error: any) {
    logger.error(error, {
      context: 'Gemini API',
      model: modelName,
      mode: options.mode,
      useThinking: options.useThinking
    });

    const status = error.status || (error.response && error.response.status);

    if (status) {
      switch (status) {
        case 400:
          throw new APIError("Invalid Request (400): The input or configuration is invalid.", 400);
        case 401:
          throw new APIError("Unauthorized (401): API Key is invalid or expired.", 401);
        case 403:
          throw new APIError("Forbidden (403): You do not have permission to access this resource.", 403);
        case 404:
          throw new APIError(`Model Not Found (404): The model '${modelName}' is not available.`, 404);
        case 429:
          throw new RateLimitError("Too Many Requests (429): Quota exceeded. Please wait a moment.");
        case 500:
          throw new APIError("Internal Server Error (500): Google's AI service is having trouble.", 500);
        case 503:
          throw new APIError("Service Unavailable (503): The model is currently overloaded. Try again later.", 503);
        default:
          throw new APIError(`API Error (${status}): An unexpected error occurred.`, status);
      }
    } else if (error.message) {
      if (error.message.toLowerCase().includes('api key')) {
        throw new Error("Configuration Error: API Key is missing or invalid.");
      } else if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
        throw new Error("Network Error: Please check your internet connection.");
      }
    }

    throw error;
  }
};