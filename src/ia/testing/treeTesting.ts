export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface Task {
  id: string;
  description: string;
  correctPath: string[];
}

export interface TreeTestSession {
  id: string;
  participantId: string;
  tasks: TaskResult[];
  timestamp: number;
}

export interface TaskResult {
  taskId: string;
  path: string[];
  success: boolean;
  timeSpent: number;
  directness: number;
}

export interface TreeTestResults {
  totalParticipants: number;
  taskSuccessRates: Record<string, number>;
  averageDirectness: Record<string, number>;
  averageTime: Record<string, number>;
  problemPaths: Array<{ path: string[]; frequency: number }>;
}

export const analyzeTreeTest = (sessions: TreeTestSession[]): TreeTestResults => {
  const taskSuccessRates: Record<string, number> = {};
  const averageDirectness: Record<string, number> = {};
  const averageTime: Record<string, number> = {};
  const pathFrequency: Record<string, number> = {};

  sessions.forEach(session => {
    session.tasks.forEach(task => {
      if (!taskSuccessRates[task.taskId]) {
        taskSuccessRates[task.taskId] = 0;
        averageDirectness[task.taskId] = 0;
        averageTime[task.taskId] = 0;
      }

      if (task.success) taskSuccessRates[task.taskId]++;
      averageDirectness[task.taskId] += task.directness;
      averageTime[task.taskId] += task.timeSpent;

      const pathKey = task.path.join(' > ');
      pathFrequency[pathKey] = (pathFrequency[pathKey] || 0) + 1;
    });
  });

  Object.keys(taskSuccessRates).forEach(taskId => {
    taskSuccessRates[taskId] = (taskSuccessRates[taskId] / sessions.length) * 100;
    averageDirectness[taskId] /= sessions.length;
    averageTime[taskId] /= sessions.length;
  });

  const problemPaths = Object.entries(pathFrequency)
    .map(([path, frequency]) => ({ path: path.split(' > '), frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  return {
    totalParticipants: sessions.length,
    taskSuccessRates,
    averageDirectness,
    averageTime,
    problemPaths
  };
};

export const calculateDirectness = (actualPath: string[], correctPath: string[]): number => {
  const correctSteps = correctPath.length;
  const actualSteps = actualPath.length;
  return correctSteps / actualSteps;
};
