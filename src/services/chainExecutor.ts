import { ChainNode, ExecutionResult } from '../store/chainStore';
import { Edge } from 'reactflow';
import { generateResponse } from './geminiService';

export class ChainExecutor {
  private results: Map<string, string> = new Map();
  private executionLog: ExecutionResult[] = [];

  async execute(
    nodes: ChainNode[],
    edges: Edge[],
    apiKey: string,
    onProgress?: (nodeId: string, output: string) => void
  ): Promise<ExecutionResult[]> {
    this.results.clear();
    this.executionLog = [];

    const startNode = nodes.find((n) => n.type === 'start' || edges.every((e) => e.target !== n.id));
    if (!startNode) throw new Error('No start node found');

    await this.executeNode(startNode, nodes, edges, apiKey, onProgress);
    return this.executionLog;
  }

  private async executeNode(
    node: ChainNode,
    allNodes: ChainNode[],
    edges: Edge[],
    apiKey: string,
    onProgress?: (nodeId: string, output: string) => void
  ): Promise<void> {
    if (node.type === 'end') return;

    let output = '';

    if (node.type === 'prompt') {
      const prompt = this.interpolateVariables(node.data.promptContent || '', this.results);
      output = await this.executePrompt(prompt, apiKey);
      this.results.set(node.id, output);
    } else if (node.type === 'conditional') {
      const condition = this.evaluateCondition(node.data.condition || '', this.results);
      output = condition ? 'true' : 'false';
      this.results.set(node.id, output);
    } else if (node.type === 'loop') {
      const count = node.data.loopCount || 1;
      const loopResults: string[] = [];
      for (let i = 0; i < count; i++) {
        const nextNodes = this.getNextNodes(node, edges, allNodes);
        for (const next of nextNodes) {
          await this.executeNode(next, allNodes, edges, apiKey, onProgress);
        }
        loopResults.push(`Iteration ${i + 1} completed`);
      }
      output = loopResults.join('\n');
      this.results.set(node.id, output);
    }

    this.executionLog.push({
      nodeId: node.id,
      output,
      timestamp: Date.now(),
    });

    onProgress?.(node.id, output);

    const nextNodes = this.getNextNodes(node, edges, allNodes);
    for (const next of nextNodes) {
      if (node.type === 'conditional') {
        const condition = this.results.get(node.id) === 'true';
        const edge = edges.find((e) => e.source === node.id && e.target === next.id);
        if ((edge?.label === 'true' && condition) || (edge?.label === 'false' && !condition)) {
          await this.executeNode(next, allNodes, edges, apiKey, onProgress);
        }
      } else {
        await this.executeNode(next, allNodes, edges, apiKey, onProgress);
      }
    }
  }

  private getNextNodes(node: ChainNode, edges: Edge[], allNodes: ChainNode[]): ChainNode[] {
    const nextEdges = edges.filter((e) => e.source === node.id);
    return nextEdges.map((e) => allNodes.find((n) => n.id === e.target)!).filter(Boolean);
  }

  private interpolateVariables(text: string, variables: Map<string, string>): string {
    let result = text;
    variables.forEach((value, key) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return result;
  }

  private evaluateCondition(condition: string, variables: Map<string, string>): boolean {
    try {
      const interpolated = this.interpolateVariables(condition, variables);
      return eval(interpolated);
    } catch {
      return false;
    }
  }

  private async executePrompt(prompt: string, apiKey: string): Promise<string> {
    try {
      const response = await generateResponse(prompt, apiKey);
      return response;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}
