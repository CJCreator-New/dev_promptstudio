import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { Button } from './ui/Button';
import { createShareLink } from '../services/cloudSync';

interface ShareButtonProps {
  userId: string;
  prompt: {
    original: string;
    enhanced: string;
    domain: string;
  };
}

export const ShareButton: React.FC<ShareButtonProps> = ({ userId, prompt }) => {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      const shareId = await createShareLink(userId, prompt);
      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (shareUrl) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300"
        />
        <Button
          variant="secondary"
          size="sm"
          icon={copied ? Check : Copy}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      icon={Share2}
      onClick={handleShare}
      loading={loading}
    >
      Share
    </Button>
  );
};