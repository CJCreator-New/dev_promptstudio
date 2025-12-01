import { DebugStep, useDebugStore } from '../store/debugStore';
import { generateResponse } from './geminiService';

export class DebugService {
  private sessionId: string;
  private isPaused = false;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async executeWithDebug(prompt: string, apiKey: string, onStep?: (step: DebugStep) => void): Promise<void> {
    const { addStep, setStatus, updateVariables } = useDebugStore.getState();
    
    setStatus(this.sessionId, 'running');

    const promptStep: DebugStep = {
      id: `step_${Date.now()}`,
      type: 'prompt',
      timestamp: Date.now(),
      content: prompt,
      variables: {},
    };
    addStep(this.sessionId, promptStep);
    onStep?.(promptStep);

    await this.checkBreakpoint('prompt');

    try {
      const startTime = Date.now();
      const response = await generateResponse(prompt, apiKey);
      const duration = Date.now() - startTime;

      const responseStep: DebugStep = {
        id: `step_${Date.now()}`,
        type: 'response',
        timestamp: Date.now(),
        content: response,
        duration,
        tokens: this.estimateTokens(response),
      };
      addStep(this.sessionId, responseStep);
      onStep?.(responseStep);

      updateVariables(this.sessionId, { lastResponse: response });

      setStatus(this.sessionId, 'completed');
    } catch (error) {
      const errorStep: DebugStep = {
        id: `step_${Date.now()}`,
        type: 'error',
        timestamp: Date.now(),
        content: 'Execution failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      addStep(this.sessionId, errorStep);
      onStep?.(errorStep);
      setStatus(this.sessionId, 'error');
    }
  }

  async executeToolCall(toolName: string, toolInput: any, onStep?: (step: DebugStep) => void): Promise<any> {
    const { addStep } = useDebugStore.getState();

    const toolStep: DebugStep = {
      id: `step_${Date.now()}`,
      type: 'tool_call',
      timestamp: Date.now(),
      content: `Calling tool: ${toolName}`,
      toolName,
      toolInput,
    };
    addStep(this.sessionId, toolStep);
    onStep?.(toolStep);

    await this.checkBreakpoint('tool_call');

    const startTime = Date.now();
    const toolOutput = await this.simulateToolExecution(toolName, toolInput);
    const duration = Date.now() - startTime;

    const updatedStep: DebugStep = {
      ...toolStep,
      toolOutput,
      duration,
    };
    
    return toolOutput;
  }

  pause(): void {
    this.isPaused = true;
    useDebugStore.getState().setStatus(this.sessionId, 'paused');
  }

  resume(): void {
    this.isPaused = false;
    useDebugStore.getState().setStatus(this.sessionId, 'running');
  }

  private async checkBreakpoint(stepType: DebugStep['type']): Promise<void> {
    const session = useDebugStore.getState().sessions.find((s) => s.id === this.sessionId);
    const breakpoint = session?.breakpoints.find((b) => b.enabled && b.stepType === stepType);
    
    if (breakpoint) {
      this.pause();
      while (this.isPaused) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  private async simulateToolExecution(toolName: string, input: any): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, result: `${toolName} executed with ${JSON.stringify(input)}` };
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
