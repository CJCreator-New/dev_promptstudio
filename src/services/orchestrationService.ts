import { Agent, Task, useAgentStore } from '../store/agentStore';
import { generateResponse } from './geminiService';

export class OrchestrationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async executeTask(task: Task, agent: Agent): Promise<string> {
    const { updateTaskStatus, sendMessage } = useAgentStore.getState();
    
    try {
      const prompt = this.buildPrompt(task, agent);
      const startTime = Date.now();
      
      const result = await generateResponse(prompt, this.apiKey);
      const duration = Date.now() - startTime;
      
      updateTaskStatus(task.id, 'completed', result);
      
      const { updatePerformance } = useAgentStore.getState();
      const avgTime = (agent.performance.avgResponseTime * agent.performance.tasksCompleted + duration) / 
                      (agent.performance.tasksCompleted + 1);
      updatePerformance(agent.id, { avgResponseTime: avgTime });
      
      return result;
    } catch (error) {
      updateTaskStatus(task.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
      sendMessage('system', agent.id, `Task ${task.id} failed: ${error}`, 'notification');
      throw error;
    }
  }

  async delegateTask(task: Task): Promise<Agent | null> {
    const { agents } = useAgentStore.getState();
    const availableAgents = agents.filter((a) => a.status === 'idle');
    
    if (availableAgents.length === 0) return null;
    
    const bestAgent = availableAgents.reduce((best, agent) => {
      const score = this.calculateAgentScore(agent, task);
      const bestScore = this.calculateAgentScore(best, task);
      return score > bestScore ? agent : best;
    });
    
    return bestAgent;
  }

  private calculateAgentScore(agent: Agent, task: Task): number {
    let score = agent.performance.successRate;
    
    if (task.priority === 'high') score += 20;
    if (task.priority === 'medium') score += 10;
    
    const hasCapability = task.description.toLowerCase().split(' ').some((word) =>
      agent.capabilities.some((cap) => cap.toLowerCase().includes(word))
    );
    if (hasCapability) score += 30;
    
    return score;
  }

  private buildPrompt(task: Task, agent: Agent): string {
    return `${agent.systemPrompt}\n\nTask: ${task.description}\n\nPlease complete this task according to your role as ${agent.role}.`;
  }

  async orchestrateWorkflow(tasks: Task[]): Promise<void> {
    const { assignTask } = useAgentStore.getState();
    
    const sortedTasks = this.topologicalSort(tasks);
    
    for (const task of sortedTasks) {
      const agent = await this.delegateTask(task);
      if (!agent) {
        console.warn(`No available agent for task ${task.id}`);
        continue;
      }
      
      assignTask(task.id, agent.id);
      await this.executeTask(task, agent);
    }
  }

  private topologicalSort(tasks: Task[]): Task[] {
    const sorted: Task[] = [];
    const visited = new Set<string>();
    
    const visit = (task: Task) => {
      if (visited.has(task.id)) return;
      visited.add(task.id);
      
      if (task.dependencies) {
        task.dependencies.forEach((depId) => {
          const depTask = tasks.find((t) => t.id === depId);
          if (depTask) visit(depTask);
        });
      }
      
      sorted.push(task);
    };
    
    tasks.forEach(visit);
    return sorted;
  }
}
