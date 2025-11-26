import React, { useState } from 'react';
import { Game } from '../types';
import { Button } from './Button';

interface GameCardProps {
  game: Game;
  onDelete: (id: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onDelete }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const handlePlay = () => {
    window.open(game.url, '_blank', 'noopener,noreferrer,width=1280,height=720');
  };

  const handleShareTwitter = () => {
    const text = `Check out ${game.title} on Noam Gold AI Games!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(game.url)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(game.url)}`;
    window.open(url, '_blank');
  };

  const liveThumbnail = game.thumbnailUrl || `https://image.thum.io/get/width/600/crop/800/noanimate/${game.url}`;

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-900 cursor-pointer" onClick={handlePlay}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 z-10 transition-opacity duration-300">
             <div className="relative flex items-center justify-center">
                {/* Static Gamepad Icon */}
                <svg className="w-10 h-10 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                
                {/* Orbital Spinner Animation */}
                <svg className="absolute w-16 h-16 text-primary/40 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" d="M4 12a8 8 0 018-8V2.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
             </div>
          </div>
        )}
        <img 
          src={liveThumbnail} 
          alt={game.title} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            setIsLoading(false);
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${game.id}/600/400`;
          }}
        />
        <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${isLoading ? 'hidden' : ''}`}>
           <span className="bg-primary text-white px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
             Play Now
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white truncate pr-2" title={game.title}>{game.title}</h3>
        </div>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
          {game.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {game.tags.map(tag => (
            <span key={tag} className="px-2 py-1 text-xs font-medium rounded-md bg-slate-700 text-slate-300 border border-slate-600">
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
           <div className="flex space-x-2">
             <button 
               onClick={handleShareTwitter} 
               className="text-slate-400 hover:text-[#1DA1F2] transition-colors"
               title="Share on Twitter"
             >
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
             </button>
             <button 
               onClick={handleShareFacebook} 
               className="text-slate-400 hover:text-[#4267B2] transition-colors"
               title="Share on Facebook"
             >
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
             </button>
           </div>
           <Button variant="danger" size="sm" onClick={() => onDelete(game.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
             Delete
           </Button>
        </div>
      </div>
    </div>
  );
};