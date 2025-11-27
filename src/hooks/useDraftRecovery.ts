import { useState, useEffect } from 'react';
import { db } from '../utils/db';
import { EnhancementOptions } from '../types';

interface Draft {
  id?: number;
  input: string;
  options: EnhancementOptions;
  timestamp: number;
}

export const useDraftRecovery = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const recentDrafts = await db.drafts
          .orderBy('timestamp')
          .reverse()
          .limit(5)
          .toArray();
        
        if (recentDrafts.length > 0) {
          setDrafts(recentDrafts);
          setShowModal(true);
        }
      } catch (error) {
        console.warn('Failed to load drafts:', error);
      }
    };

    loadDrafts();
  }, []);

  const recoverDraft = (draft: Draft) => {
    setShowModal(false);
    return draft;
  };

  const dismissModal = () => {
    setShowModal(false);
  };

  return {
    drafts,
    showModal,
    recoverDraft,
    dismissModal
  };
};