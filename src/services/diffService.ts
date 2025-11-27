// @ts-ignore - diff-match-patch doesn't have types
import DiffMatchPatch from 'diff-match-patch';

export interface DiffResult {
  additions: number;
  deletions: number;
  changes: number;
  diffs: Array<[number, string]>;
}

export const diffService = {
  computeDiff(text1: string, text2: string): DiffResult {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diffs);

    let additions = 0;
    let deletions = 0;
    let changes = 0;

    diffs.forEach(([type, text]: [number, string]) => {
      if (type === 1) additions += text.length;
      else if (type === -1) deletions += text.length;
      if (type !== 0) changes++;
    });

    return { additions, deletions, changes, diffs };
  },

  generatePatch(text1: string, text2: string): string {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(text1, text2);
    const patches = dmp.patch_make(text1, diffs);
    return dmp.patch_toText(patches);
  },

  applyPatch(text: string, patch: string): string {
    const dmp = new DiffMatchPatch();
    const patches = dmp.patch_fromText(patch);
    const [result] = dmp.patch_apply(patches, text);
    return result;
  },

  exportDiff(text1: string, text2: string, format: 'unified' | 'html'): string {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(text1, text2);
    
    if (format === 'html') {
      return dmp.diff_prettyHtml(diffs);
    }
    
    // Unified format
    return diffs.map(([type, text]: [number, string]) => {
      const prefix = type === 1 ? '+' : type === -1 ? '-' : ' ';
      return text.split('\n').map(line => prefix + line).join('\n');
    }).join('\n');
  },
};
