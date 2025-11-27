export interface LogEntry {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: number;
  userAgent: string;
  level: 'error' | 'info' | 'warn';
}

class AppLogger {
  private static instance: AppLogger;
  private logs: LogEntry[] = [];

  private constructor() {}

  public static getInstance(): AppLogger {
    if (!AppLogger.instance) {
      AppLogger.instance = new AppLogger();
    }
    return AppLogger.instance;
  }

  public error(error: Error, context?: Record<string, any>) {
    const entry: LogEntry = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      level: 'error'
    };
    this.logs.push(entry);
    
    console.groupCollapsed(`[Error] ${error.message}`);
    console.error(error);
    if (context) console.info('Context:', context);
    console.groupEnd();
  }

  public info(message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      message,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      level: 'info'
    };
    this.logs.push(entry);

    console.groupCollapsed(`[Info] ${message}`);
    if (context) console.info('Context:', context);
    console.groupEnd();
  }

  // Backward compatibility for existing calls
  public log(error: Error, context?: Record<string, any>) {
    this.error(error, context);
  }

  public getLogs() {
    return this.logs;
  }
}

export const logger = AppLogger.getInstance();