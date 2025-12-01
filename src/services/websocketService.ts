/**
 * Filename: websocketService.ts
 * Purpose: WebSocket service for real-time collaboration (optional backend)
 * 
 * Key Functions:
 * - connect: Establish WebSocket connection
 * - sendUpdate: Broadcast changes to collaborators
 * - onUpdate: Listen for remote changes
 * - disconnect: Close connection
 * 
 * Dependencies: None (can use localStorage for demo mode)
 */

type MessageHandler = (data: any) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private demoMode = true; // Use localStorage for demo without backend

  connect(url?: string, userId?: string): Promise<void> {
    if (!url || this.demoMode) {
      console.log('Running in demo mode (localStorage sync)');
      this.setupDemoMode();
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.send('join', { userId });
          resolve();
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect(url, userId);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupDemoMode() {
    // Listen for localStorage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('collab:')) {
        const type = e.key.split(':')[1];
        const data = e.newValue ? JSON.parse(e.newValue) : null;
        this.handleMessage({ type, data });
      }
    });
  }

  send(type: string, data: any) {
    if (this.demoMode) {
      // Broadcast via localStorage for demo
      localStorage.setItem(`collab:${type}`, JSON.stringify(data));
      setTimeout(() => localStorage.removeItem(`collab:${type}`), 100);
    } else if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  off(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) handlers.splice(index, 1);
    }
  }

  private handleMessage(message: { type: string; data: any }) {
    const handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message.data));
    }
  }

  private attemptReconnect(url: string, userId?: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      setTimeout(() => this.connect(url, userId), delay);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
