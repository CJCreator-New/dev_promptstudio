import Dexie, { Table } from 'dexie';
import { EnhancementOptions } from '../types';

export interface Draft {
  id?: number;
  input: string;
  options: EnhancementOptions;
  timestamp: number;
}

export class DevPromptDB extends Dexie {
  drafts!: Table<Draft>;

  constructor() {
    super('DevPromptDB');
    (this as any).version(1).stores({
      drafts: '++id, timestamp' // Primary key and index
    });
  }
}

export const db = new DevPromptDB();