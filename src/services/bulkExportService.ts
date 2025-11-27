// @ts-ignore
import JSZip from 'jszip';
import { Prompt } from '../utils/db';
import { exportService, ExportFormat } from './exportService';

export const bulkExportService = {
  async exportToZip(prompts: Prompt[], format: ExportFormat): Promise<Blob> {
    const zip = new JSZip();
    
    for (const prompt of prompts) {
      const content = exportService.export(prompt, format);
      const ext = format === 'pdf' ? 'pdf' : format === 'markdown' ? 'md' : format === 'json' ? 'json' : 'txt';
      const filename = `${prompt.title.replace(/[^a-z0-9]/gi, '_')}.${ext}`;
      
      if (content instanceof Blob) {
        zip.file(filename, content);
      } else {
        zip.file(filename, content);
      }
    }
    
    return zip.generateAsync({ type: 'blob' });
  },

  async downloadZip(prompts: Prompt[], format: ExportFormat, zipName: string = 'prompts.zip') {
    const blob = await this.exportToZip(prompts, format);
    exportService.download(blob, zipName);
  },
};
