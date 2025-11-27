import { jsPDF } from 'jspdf';
import { Prompt } from '../utils/db';

export type ExportFormat = 'pdf' | 'markdown' | 'json' | 'text';

export const exportService = {
  exportToPDF(prompt: Prompt): Blob {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(prompt.title, 20, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(prompt.content, 170);
    doc.text(lines, 20, 40);
    return doc.output('blob');
  },

  exportToMarkdown(prompt: Prompt): string {
    const frontmatter = [
      '---',
      `title: ${prompt.title}`,
      `created: ${new Date(prompt.createdAt).toISOString()}`,
      `updated: ${new Date(prompt.updatedAt).toISOString()}`,
      `favorite: ${prompt.isFavorite}`,
      '---',
      '',
    ].join('\n');
    
    return frontmatter + prompt.content;
  },

  exportToJSON(prompt: Prompt): string {
    return JSON.stringify(prompt, null, 2);
  },

  exportToText(prompt: Prompt): string {
    return `${prompt.title}\n\n${prompt.content}`;
  },

  export(prompt: Prompt, format: ExportFormat): string | Blob {
    switch (format) {
      case 'pdf':
        return this.exportToPDF(prompt);
      case 'markdown':
        return this.exportToMarkdown(prompt);
      case 'json':
        return this.exportToJSON(prompt);
      case 'text':
        return this.exportToText(prompt);
    }
  },

  download(content: string | Blob, filename: string) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};
