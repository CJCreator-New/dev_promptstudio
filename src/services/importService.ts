import { z } from 'zod';
import { Prompt, db } from '../utils/db';

const PromptSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  tags: z.array(z.number()).optional().default([]),
  folderId: z.number().nullable().optional().default(null),
  isFavorite: z.boolean().optional().default(false),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type ConflictResolution = 'skip' | 'overwrite' | 'rename';

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export const importService = {
  validateJSON(data: string): { valid: boolean; prompts?: Prompt[]; error?: string } {
    try {
      const parsed = JSON.parse(data);
      const prompts = Array.isArray(parsed) ? parsed : [parsed];
      
      const validated = prompts.map(p => PromptSchema.parse(p));
      return { valid: true, prompts: validated as Prompt[] };
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : 'Invalid JSON' };
    }
  },

  parseMarkdown(content: string): Partial<Prompt> {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (frontmatterMatch) {
      const [, frontmatter, body] = frontmatterMatch;
      const metadata: any = {};
      
      frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          metadata[key.trim()] = valueParts.join(':').trim();
        }
      });
      
      return {
        title: metadata.title || 'Untitled',
        content: body.trim(),
        isFavorite: metadata.favorite === 'true',
      };
    }
    
    return {
      title: 'Imported Prompt',
      content: content.trim(),
    };
  },

  async importPrompts(
    prompts: Partial<Prompt>[],
    resolution: ConflictResolution = 'skip'
  ): Promise<ImportResult> {
    const result: ImportResult = { imported: 0, skipped: 0, errors: [] };
    
    for (const prompt of prompts) {
      try {
        const existing = await db.prompts
          .where('title')
          .equals(prompt.title || '')
          .first();
        
        if (existing) {
          if (resolution === 'skip') {
            result.skipped++;
            continue;
          } else if (resolution === 'overwrite') {
            await db.prompts.update(existing.id!, {
              ...prompt,
              updatedAt: Date.now(),
            });
            result.imported++;
          } else if (resolution === 'rename') {
            await db.prompts.add({
              ...prompt,
              title: `${prompt.title} (imported)`,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            } as Prompt);
            result.imported++;
          }
        } else {
          await db.prompts.add({
            ...prompt,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          } as Prompt);
          result.imported++;
        }
      } catch (error) {
        result.errors.push(`Failed to import "${prompt.title}": ${error}`);
      }
    }
    
    return result;
  },
};
