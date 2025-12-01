/**
 * Filename: versionControl.ts
 * Purpose: Version control utilities and diff algorithms
 * 
 * Key Functions:
 * - generateDiff: Create unified diff between versions
 * - applyPatch: Apply diff to content
 * - calculateSimilarity: Measure content similarity
 * - formatCommitMessage: Validate and format commit messages
 * 
 * Dependencies: None
 */

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  lineNumber: number;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export const generateDiff = (oldContent: string, newContent: string): DiffHunk[] => {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const hunks: DiffHunk[] = [];
  
  let i = 0, j = 0;
  const contextLines = 3;
  
  while (i < oldLines.length || j < newLines.length) {
    const hunk: DiffHunk = {
      oldStart: i + 1,
      oldLines: 0,
      newStart: j + 1,
      newLines: 0,
      lines: []
    };
    
    // Find differences
    while (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      hunk.lines.push({ type: 'context', content: oldLines[i], lineNumber: i + 1 });
      i++;
      j++;
    }
    
    // Removed lines
    while (i < oldLines.length && (j >= newLines.length || oldLines[i] !== newLines[j])) {
      hunk.lines.push({ type: 'remove', content: oldLines[i], lineNumber: i + 1 });
      hunk.oldLines++;
      i++;
      if (j < newLines.length && oldLines[i] === newLines[j]) break;
    }
    
    // Added lines
    while (j < newLines.length && (i >= oldLines.length || oldLines[i] !== newLines[j])) {
      hunk.lines.push({ type: 'add', content: newLines[j], lineNumber: j + 1 });
      hunk.newLines++;
      j++;
      if (i < oldLines.length && oldLines[i] === newLines[j]) break;
    }
    
    if (hunk.lines.length > 0) {
      hunks.push(hunk);
    }
  }
  
  return hunks;
};

export const formatDiff = (hunks: DiffHunk[]): string => {
  return hunks.map(hunk => {
    const header = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@\n`;
    const lines = hunk.lines.map(line => {
      const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' ';
      return `${prefix}${line.content}`;
    }).join('\n');
    return header + lines;
  }).join('\n\n');
};

export const calculateSimilarity = (content1: string, content2: string): number => {
  if (content1 === content2) return 100;
  
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');
  
  const commonLines = lines1.filter(line => lines2.includes(line)).length;
  const totalLines = Math.max(lines1.length, lines2.length);
  
  return totalLines > 0 ? (commonLines / totalLines) * 100 : 0;
};

export const formatCommitMessage = (message: string): { valid: boolean; formatted: string; error?: string } => {
  const trimmed = message.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, formatted: '', error: 'Commit message cannot be empty' };
  }
  
  if (trimmed.length > 200) {
    return { valid: false, formatted: '', error: 'Commit message too long (max 200 characters)' };
  }
  
  // Capitalize first letter
  const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  
  return { valid: true, formatted };
};

export const getBranchColor = (branchName: string): string => {
  const colors = ['blue', 'green', 'purple', 'yellow', 'pink', 'indigo'];
  const hash = branchName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
