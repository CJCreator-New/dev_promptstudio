import React, { useState } from 'react';
import { X, Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt: string;
}

export const ImageGenModal: React.FC<ImageGenModalProps> = ({ isOpen, onClose, initialPrompt }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    // Simulate API call delay
    setTimeout(() => {
      // Use placeholder service for demo purposes
      const encoded = encodeURIComponent(prompt.substring(0, 50));
      setGeneratedImage(`https://placehold.co/800x600/1e293b/8b5cf6?text=${encoded}`);
      setIsGenerating(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-400" />
              Generate Assets
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Image Description</label>
                <div className="flex gap-2">
                    <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Describe the UI or asset you need..."
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
                    </button>
                </div>
              </div>

              <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden group">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <p className="text-sm text-slate-500">Creating visual asset...</p>
                  </div>
                ) : generatedImage ? (
                  <>
                    <img src={generatedImage} alt="Generated Asset" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <a href={generatedImage} download="generated-asset.png" target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-100">
                         <Download className="w-4 h-4" /> Download
                       </a>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-600">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Enter a prompt to generate a placeholder asset</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};