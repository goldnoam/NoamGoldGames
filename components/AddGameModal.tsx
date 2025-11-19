import React, { useState } from 'react';
import { GameFormData } from '../types';
import { Button } from './Button';
import { generateGameMetadata } from '../services/geminiService';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (game: GameFormData) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    url: '',
    thumbnailUrl: '',
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    // Reset form
    setFormData({ title: '', url: '', thumbnailUrl: '', description: '' });
    setTagsInput('');
    onClose();
  };

  const handleAiGenerate = async () => {
    if (!formData.title || !formData.url) {
      alert("Please enter a Title and URL first.");
      return;
    }

    setIsGenerating(true);
    const metadata = await generateGameMetadata(formData.title, formData.url);
    setIsGenerating(false);

    if (metadata) {
      setFormData(prev => ({
        ...prev,
        description: metadata.description
      }));
      setTagsInput(metadata.tags.join(', '));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 transform transition-all scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Add New Game
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Game Title</label>
            <input
              type="text"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g. Super Space Blaster"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Game URL</label>
            <input
              type="url"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end">
             <Button 
               type="button" 
               variant="outline" 
               size="sm" 
               onClick={handleAiGenerate}
               isLoading={isGenerating}
               className="text-xs"
               icon={<svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>} // Simple placeholder icon, in real app use proper sparkles
             >
               Auto-Generate Details (AI)
             </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              placeholder="A short description of the game..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Custom Thumbnail URL (Optional)</label>
            <p className="text-xs text-slate-500 mb-1">Leave blank to auto-generate a live preview.</p>
            <input
              type="url"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="https://..."
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Game
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};