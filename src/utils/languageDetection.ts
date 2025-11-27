export const detectLanguage = (content: string): string => {
  const trimmed = content.trim();
  
  // HTML detection
  if (/<\/?[a-z][\s\S]*>/i.test(trimmed)) {
    return 'html';
  }
  
  // JSON detection
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {}
  }
  
  // YAML detection
  if (/^[\s]*[\w-]+:\s*[\w\s-]*$/m.test(trimmed)) {
    return 'yaml';
  }
  
  // SQL detection
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(trimmed)) {
    return 'sql';
  }
  
  // JavaScript/TypeScript detection
  if (/\b(function|const|let|var|class|interface|type)\b/.test(trimmed)) {
    if (/:\s*(string|number|boolean|any)\b/.test(trimmed)) {
      return 'typescript';
    }
    return 'javascript';
  }
  
  // Python detection
  if (/\b(def|import|from|class|if __name__)\b/.test(trimmed)) {
    return 'python';
  }
  
  // Shell detection
  if (/^#!/.test(trimmed) || /\b(echo|ls|cd|mkdir|rm)\b/.test(trimmed)) {
    return 'shell';
  }
  
  // CSS detection
  if (/[.#][\w-]+\s*\{[\s\S]*\}/.test(trimmed)) {
    return 'css';
  }
  
  // Markdown detection
  if (/^#{1,6}\s/.test(trimmed) || /\*\*.*\*\*/.test(trimmed) || /\[.*\]\(.*\)/.test(trimmed)) {
    return 'markdown';
  }
  
  return 'plaintext';
};

export const LANGUAGE_EXTENSIONS: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  csharp: 'cs',
  cpp: 'cpp',
  c: 'c',
  go: 'go',
  rust: 'rs',
  php: 'php',
  ruby: 'rb',
  swift: 'swift',
  kotlin: 'kt',
  scala: 'scala',
  sql: 'sql',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yml',
  xml: 'xml',
  markdown: 'md',
  shell: 'sh',
  plaintext: 'txt'
};