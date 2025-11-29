import { db } from '../utils/db';

export const exportAllData = async () => {
  const data = {
    history: await db.drafts.toArray(),
    timestamp: Date.now(),
    version: '1.0'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `devprompt-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importFromBackup = async (file: File): Promise<boolean> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (data.history) {
      await db.drafts.clear();
      await db.drafts.bulkAdd(data.history);
    }

    return true;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
};
