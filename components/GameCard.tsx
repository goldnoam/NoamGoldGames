
import React, { useState, useMemo } from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

const TAG_STYLES = [
  "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20 hover:bg-red-500/20",
  "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20",
  "bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20 hover:bg-lime-500/20",
  "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
  "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 hover:bg-teal-500/20",
  "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
  "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 hover:bg-sky-500/20",
  "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
  "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 hover:bg-violet-500/20",
  "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
  "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20 hover:bg-fuchsia-500/20",
  "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 hover:bg-pink-500/20",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
];

const getTagStyle = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_STYLES[Math.abs(hash) % TAG_STYLES.length];
};

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searching, setSearching] = useState(false);
  const [insights, setInsights] = useState<{ text: string; sources: any[] } | null>(null);
  
  const viewers = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < game.id.length; i++) {
      hash = ((hash << 5) - hash) + game.id.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    return 100 + (seed % 4901);
  }, [game.id]);

  const [shareCount, setShareCount] = useState(() => {
    let hash = 0;
    for (let i = 0; i < game.id.length; i++) {
      hash = ((hash << 5) - hash) + game.id.charCodeAt(i);
      hash |= 0;
    }
    return 10 + (Math.abs(hash) % 191); 
  });

  const isNew = useMemo(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    return (Date.now() - game.createdAt) < oneDay;
  }, [game.createdAt]);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    onPlay(game);
  };

  const handleDeepSearch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // AI features removed
  };

  const handleShareTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareCount(prev => prev + 1);
    const text = `Check out ${game.title} on Noam Gold AI Games!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(game.url)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareCount(prev => prev + 1);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(game.url)}`;
    window.open(url, '_blank');
  };
  
  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareCount(prev => prev + 1);
    try {
      await navigator.clipboard.writeText(game.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const liveThumbnail = game.thumbnailUrl || `https://image.thum.io/get/width/1200/crop/800/noanimate/${game.url}`;

  return (
    <div 
      className="group relative bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-[0_20px_40px_rgba(99,102,241,0.2)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-primary transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={handlePlay}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {/* Insight Overlay */}
      {insights && (
        <div className="absolute inset-0 z-50 bg-slate-900/98 backdrop-blur-xl p-6 rounded-xl overflow-y-auto animate-fade-in border-2 border-primary/50" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-black text-lg">Google Insights</h4>
            <button onClick={() => setInsights(null)} className="text-slate-400 hover:text-white">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p className="text-sm text-slate-300 mb-4">{insights.text}</p>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Sources:</span>
            {insights.sources.map((chunk, i) => chunk.web && (
              <a key={i} href={chunk.web.uri} target="_blank" rel="noopener" className="block text-xs text-slate-400 hover:text-primary underline truncate">
                {chunk.web.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Preview Tooltip (Original code preserved but simplified for space) */}
      {showPreview && !isLoading && !insights && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-[320px] pointer-events-none z-[100] animate-fade-in hidden sm:block">
           <div className="bg-slate-900 border-2 border-primary/40 p-4 rounded-xl shadow-2xl">
              <h4 className="text-white font-bold mb-2">{game.title} - Preview</h4>
              <p className="text-xs text-slate-400">{game.description}</p>
           </div>
        </div>
      )}

      <div className="relative h-48 overflow-hidden rounded-t-xl bg-slate-200 dark:bg-slate-900">
        {isNew && (
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg ring-2 ring-white/20">NEW</span>
          </div>
        )}
        <img 
          src={liveThumbnail} 
          alt={game.title} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
           <span className="bg-primary text-white px-6 py-2.5 rounded-full font-black shadow-2xl">LAUNCH GAME</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate flex-grow">{game.title}</h3>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">{game.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {game.tags.slice(0, 3).map(tag => (
            <span key={tag} className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider ${getTagStyle(tag)}`}>{tag}</span>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
           <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{viewers.toLocaleString()} Play</div>
           <div className="flex items-center gap-1">
             <button onClick={handleShareTwitter} className="p-2 text-slate-400 hover:text-[#1DA1F2] transition-transform hover:scale-125"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></button>
             <button onClick={handleShareFacebook} className="p-2 text-slate-400 hover:text-[#1877F2] transition-transform hover:scale-125"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button>
             <button onClick={handleCopyLink} className={`p-2 transition-all ${copied ? 'text-emerald-500 scale-125' : 'text-slate-400 hover:text-primary'}`} title="Copy Link">{copied ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>}</button>
           </div>
        </div>
      </div>
    </div>
  );
};
