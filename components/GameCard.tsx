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
  
  // Generate a random stable number of viewers between 100 and 5000
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
  
  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareCount(prev => prev + 1);
    try {
      await navigator.share({
        title: game.title,
        text: `Check out ${game.title} on Noam Gold AI Games!`,
        url: game.url,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
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
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div 
      className="group relative bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] hover:border-primary/60 dark:hover:border-primary/40 hover:ring-2 hover:ring-primary/20 dark:hover:ring-secondary/20 hover:-translate-y-2 hover:z-30 transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={handlePlay}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden rounded-t-xl bg-slate-200 dark:bg-slate-900">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-800 z-10 transition-opacity duration-300">
             <div className="relative flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400 dark:text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                <svg className="absolute w-16 h-16 text-primary/40 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" d="M4 12a8 8 0 018-8V2.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
             </div>
          </div>
        )}
        
        {isNew && (
          <div className="absolute top-2 left-2 z-20 transition-opacity duration-300 group-hover:opacity-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="absolute left-5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
              NEW
            </span>
          </div>
        )}

        <img 
          src={liveThumbnail} 
          alt={game.title} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            setIsLoading(false);
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${game.id}/600/400`;
          }}
        />
        
        <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${isLoading ? 'hidden' : ''} z-10`}>
           <span className="bg-primary text-white px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:scale-105 hover:bg-secondary">
             Play Now
           </span>
        </div>

        {/* --- DETAILED PREVIEW POPUP --- */}
        {!isLoading && showPreview && (
          <div className="absolute inset-x-0 bottom-0 top-0 z-50 pointer-events-none transition-all duration-300 ease-out animate-fade-in origin-bottom">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[110%] md:w-[130%] bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
               {/* Larger Live Image in Preview */}
               <div className="relative h-48 md:h-56 overflow-hidden border-b border-white/10">
                  <img 
                    src={liveThumbnail} 
                    alt={`${game.title} Preview`}
                    className="w-full h-full object-cover animate-pulse-slow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-tighter shadow-lg">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      Live Preview
                    </span>
                  </div>
               </div>
               
               {/* Metadata in Preview */}
               <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-black text-white leading-tight pr-4">{game.title}</h4>
                    <div className="text-primary font-bold text-xs bg-primary/10 px-2 py-1 rounded">Arcade v1.0</div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-4">
                    {game.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {game.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                     <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {viewers.toLocaleString()} active
                     </div>
                     <div className="text-primary font-black text-[10px] uppercase animate-pulse">
                        Click card to launch
                     </div>
                  </div>
               </div>
               {/* Arrow */}
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-primary/30 transform rotate-45"></div>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-medium text-white tracking-wide">
              {viewers.toLocaleString()} <span className="text-slate-400 font-normal ml-0.5">viewing</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate pr-2" title={game.url}>{game.title}</h3>
        </div>
        
        {/* Description */}
        <div className="relative mb-4 flex-grow">
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 overflow-hidden transition-colors">
            {game.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {game.tags.map(tag => (
            <span 
              key={tag} 
              title={tag}
              className={`px-3 py-1 text-xs font-medium rounded-full border cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${getTagStyle(tag)}`}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
           <div className="flex items-center gap-3 w-full">
             <div className="hidden sm:flex items-center text-slate-600 dark:text-slate-500 text-xs font-medium bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700/50" title="Total Shares">
               <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
               {shareCount}
             </div>

             <div className="flex space-x-1 items-center ml-auto">
               <div className="relative group/tooltip">
                 <button 
                   onClick={handleShareTwitter} 
                   className="text-slate-400 hover:text-[#1DA1F2] transition-all duration-200 transform hover:scale-125 p-1"
                 >
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                 </button>
                 <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-900 border border-slate-700 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                   Share on Twitter
                 </span>
               </div>

               <div className="relative group/tooltip">
                 <button 
                   onClick={handleShareFacebook} 
                   className="text-slate-400 hover:text-[#4267B2] transition-all duration-200 transform hover:scale-125 p-1"
                 >
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </button>
                 <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-900 border border-slate-700 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                   Share on Facebook
                 </span>
               </div>

               {canShare && (
                 <div className="relative group/tooltip">
                   <button 
                     onClick={handleNativeShare} 
                     className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all duration-200 transform hover:scale-125 p-1"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                   </button>
                   <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-900 border border-slate-700 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                     Share
                   </span>
                 </div>
               )}

               <div className="relative group/tooltip flex items-center">
                 <button 
                   onClick={handleCopyLink} 
                   className={`relative overflow-hidden transition-all duration-300 ease-out flex items-center justify-center ${
                     copied 
                       ? 'bg-emerald-500 text-white w-20 px-2 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' 
                       : 'text-slate-400 hover:text-primary p-1 hover:scale-125 w-7'
                   }`}
                 >
                   {copied ? (
                     <span className="text-[10px] font-bold uppercase tracking-wider animate-pulse whitespace-nowrap">Copied!</span>
                   ) : (
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                   )}
                 </button>
                 {!copied && (
                   <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-900 border border-slate-700 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                     Copy Link
                   </span>
                 )}
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};