import { z } from 'zod';

export interface ImportResult {
  success: boolean;
  data?: any[];
  errors?: string[];
  summary?: {
    total: number;
    imported: number;
    skipped: number;
    conflicts: number;
  };
}

export interface ConflictResolution {
  action: 'skip' | 'overwrite' | 'rename';
  newTitle?: string;
}

const PromptSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  content: z.string(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
  metadata: z.record(z.any()).optional()
});

export class ImportEngine {
  static validateJSON(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(data)) {
      data = [data];
    }

    for (let i = 0; i < data.length; i++) {
      try {
        PromptSchema.parse(data[i]);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(`Item ${i + 1}: ${error.errors.map(e => e.message).join(', ')}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  static parseJSON(content: string): ImportResult {
    try {
      const data = JSON.parse(content);
      const validation = this.validateJSON(data);
      
      if (!validation.valid) {
        return { success: false, errors: validation.errors };
      }

      const items = Array.isArray(data) ? data : [data];
      return {
        success: true,
        data: items.map(item => ({
          ...item,
          id: item.id || crypto.randomUUID(),
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          tags: item.tags || [],
          metadata: item.metadata || {}
        }))
      };
    } catch (error) {
      return { success: false, errors: ['Invalid JSON format'] };
    }
  }

  static parseMarkdown(content: string): ImportResult {
    const items: any[] = [];
    const sections = content.split(/^# /m).filter(Boolean);

    for (const section of sections) {
      const lines = section.split('\n');
      const title = lines[0].trim();
      
      let frontmatterEnd = -1;
      let metadata: any = {};
      
      // Parse frontmatter if present
      if (lines[1]?.trim() === '---') {
        for (let i = 2; i < lines.length; i++) {
          if (lines[i].trim() === '---') {
            frontmatterEnd = i;
            break;
          }
          const match = lines[i].match(/^(\w+):\s*(.+)$/);
          if (match) {
            const [, key, value] = match;
            if (key === 'tags') {
              metadata[key] = value.replace(/[\[\]"]/g, '').split(',').map(t => t.trim());
            } else {
              metadata[key] = value.replace(/^"(.*)"$/, '$1');
            }
          }
        }
      }

      const contentStart = frontmatterEnd > -1 ? frontmatterEnd + 1 : 1;
      const content = lines.slice(contentStart).join('\n').trim();

      items.push({
        id: crypto.randomUUID(),
        title,
        content,
        tags: metadata.tags || [],
        createdAt: metadata.created ? new Date(metadata.created) : new Date(),
        updatedAt: metadata.updated ? new Date(metadata.updated) : new Date(),
        metadata: {}
      });
    }

    return { success: true, data: items };
  }

  static detectConflicts(importData: any[], existingData: any[]): string[] {
    const existingTitles = new Set(existingData.map(item => item.title));
    return importData
      .filter(item => existingTitles.has(item.title))
      .map(item => item.id);
  }

  static resolveConflicts(
    importData: any[],
    conflicts: Map<string, ConflictResolution>
  ): any[] {
    return importData.map(item => {
      const resolution = conflicts.get(item.id);
      if (!resolution) return item;

      switch (resolution.action) {
        case 'skip':
          return null;
        case 'rename':
          return { ...item, title: resolution.newTitle || `${item.title} (imported)` };
        case 'overwrite':
        default:
          return item;
      }
    }).filter(Boolean);
  }

  static generateSummary(
    original: any[],
    imported: any[],
    conflicts: string[]
  ): ImportResult['summary'] {
    return {
      total: original.length,
      imported: imported.length,
      skipped: original.length - imported.length,
      conflicts: conflicts.length
    };
  }
}