import jsPDF from 'jspdf';
import JSZip from 'jszip';

export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
}

export interface ExportData {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export const EXPORT_FORMATS: ExportFormat[] = [
  { id: 'pdf', name: 'PDF Document', extension: 'pdf', mimeType: 'application/pdf' },
  { id: 'markdown', name: 'Markdown', extension: 'md', mimeType: 'text/markdown' },
  { id: 'json', name: 'JSON Data', extension: 'json', mimeType: 'application/json' },
  { id: 'txt', name: 'Plain Text', extension: 'txt', mimeType: 'text/plain' }
];

export class ExportEngine {
  static exportToPDF(data: ExportData): Blob {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text(data.title, 20, 20);
    
    // Metadata
    doc.setFontSize(10);
    doc.text(`Created: ${data.createdAt.toLocaleDateString()}`, 20, 35);
    doc.text(`Updated: ${data.updatedAt.toLocaleDateString()}`, 20, 42);
    
    if (data.tags?.length) {
      doc.text(`Tags: ${data.tags.join(', ')}`, 20, 49);
    }
    
    // Content
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(data.content, 170);
    doc.text(lines, 20, 60);
    
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  }

  static exportToMarkdown(data: ExportData): Blob {
    let content = `# ${data.title}\n\n`;
    
    // Frontmatter
    content += '---\n';
    content += `title: "${data.title}"\n`;
    content += `created: ${data.createdAt.toISOString()}\n`;
    content += `updated: ${data.updatedAt.toISOString()}\n`;
    if (data.tags?.length) {
      content += `tags: [${data.tags.map(tag => `"${tag}"`).join(', ')}]\n`;
    }
    content += '---\n\n';
    
    content += data.content;
    
    return new Blob([content], { type: 'text/markdown' });
  }

  static exportToJSON(data: ExportData): Blob {
    const jsonData = {
      id: data.id,
      title: data.title,
      content: data.content,
      tags: data.tags || [],
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      metadata: data.metadata || {}
    };
    
    return new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  }

  static exportToText(data: ExportData): Blob {
    let content = `${data.title}\n`;
    content += '='.repeat(data.title.length) + '\n\n';
    content += `Created: ${data.createdAt.toLocaleDateString()}\n`;
    content += `Updated: ${data.updatedAt.toLocaleDateString()}\n`;
    if (data.tags?.length) {
      content += `Tags: ${data.tags.join(', ')}\n`;
    }
    content += '\n' + data.content;
    
    return new Blob([content], { type: 'text/plain' });
  }

  static async exportBulk(items: ExportData[], format: string): Promise<Blob> {
    const zip = new JSZip();
    
    for (const item of items) {
      const blob = this.exportSingle(item, format);
      const formatConfig = EXPORT_FORMATS.find(f => f.id === format)!;
      const filename = `${item.title.replace(/[^a-z0-9]/gi, '_')}.${formatConfig.extension}`;
      
      zip.file(filename, blob);
    }
    
    return await zip.generateAsync({ type: 'blob' });
  }

  static exportSingle(data: ExportData, format: string): Blob {
    switch (format) {
      case 'pdf': return this.exportToPDF(data);
      case 'markdown': return this.exportToMarkdown(data);
      case 'json': return this.exportToJSON(data);
      case 'txt': return this.exportToText(data);
      default: throw new Error(`Unsupported format: ${format}`);
    }
  }

  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}