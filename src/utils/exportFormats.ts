export interface ExportOptions {
  format: 'notion' | 'obsidian' | 'markdown' | 'text';
  includeMetadata?: boolean;
  includeTags?: boolean;
}

export function exportToNotion(prompt: any): string {
  let content = `# ${prompt.title}\n\n`;
  
  if (prompt.tags?.length > 0) {
    content += `**Tags:** ${prompt.tags.map((t: string) => `#${t}`).join(' ')}\n\n`;
  }
  
  content += `## Prompt\n\n`;
  content += `\`\`\`\n${prompt.content}\n\`\`\`\n\n`;
  
  if (prompt.response) {
    content += `## Response\n\n${prompt.response}\n\n`;
  }
  
  if (prompt.metadata) {
    content += `## Metadata\n\n`;
    content += `- Created: ${new Date(prompt.createdAt).toLocaleString()}\n`;
    content += `- Updated: ${new Date(prompt.updatedAt).toLocaleString()}\n`;
    if (prompt.metadata.tokens) content += `- Tokens: ${prompt.metadata.tokens}\n`;
    if (prompt.metadata.cost) content += `- Cost: $${prompt.metadata.cost.toFixed(4)}\n`;
  }
  
  return content;
}

export function exportToObsidian(prompt: any): string {
  let content = `---\n`;
  content += `title: ${prompt.title}\n`;
  content += `created: ${new Date(prompt.createdAt).toISOString()}\n`;
  content += `updated: ${new Date(prompt.updatedAt).toISOString()}\n`;
  if (prompt.tags?.length > 0) {
    content += `tags: [${prompt.tags.join(', ')}]\n`;
  }
  content += `---\n\n`;
  
  content += `# ${prompt.title}\n\n`;
  content += `## Prompt\n\n`;
  content += `\`\`\`prompt\n${prompt.content}\n\`\`\`\n\n`;
  
  if (prompt.response) {
    content += `## Response\n\n${prompt.response}\n\n`;
  }
  
  if (prompt.tags?.length > 0) {
    content += `## Tags\n\n${prompt.tags.map((t: string) => `- [[${t}]]`).join('\n')}\n\n`;
  }
  
  return content;
}

export function exportToMarkdown(prompt: any): string {
  let content = `# ${prompt.title}\n\n`;
  
  if (prompt.description) {
    content += `${prompt.description}\n\n`;
  }
  
  content += `## Prompt\n\n`;
  content += `\`\`\`\n${prompt.content}\n\`\`\`\n\n`;
  
  if (prompt.response) {
    content += `## Response\n\n${prompt.response}\n\n`;
  }
  
  if (prompt.tags?.length > 0) {
    content += `**Tags:** ${prompt.tags.join(', ')}\n\n`;
  }
  
  content += `---\n\n`;
  content += `*Created: ${new Date(prompt.createdAt).toLocaleString()}*\n`;
  
  return content;
}

export function exportToText(prompt: any): string {
  let content = `${prompt.title}\n`;
  content += `${'='.repeat(prompt.title.length)}\n\n`;
  
  if (prompt.description) {
    content += `${prompt.description}\n\n`;
  }
  
  content += `PROMPT:\n${'-'.repeat(50)}\n`;
  content += `${prompt.content}\n\n`;
  
  if (prompt.response) {
    content += `RESPONSE:\n${'-'.repeat(50)}\n`;
    content += `${prompt.response}\n\n`;
  }
  
  if (prompt.tags?.length > 0) {
    content += `TAGS: ${prompt.tags.join(', ')}\n\n`;
  }
  
  content += `Created: ${new Date(prompt.createdAt).toLocaleString()}\n`;
  
  return content;
}

export function exportPrompt(prompt: any, options: ExportOptions): string {
  switch (options.format) {
    case 'notion':
      return exportToNotion(prompt);
    case 'obsidian':
      return exportToObsidian(prompt);
    case 'markdown':
      return exportToMarkdown(prompt);
    case 'text':
      return exportToText(prompt);
    default:
      return exportToMarkdown(prompt);
  }
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
