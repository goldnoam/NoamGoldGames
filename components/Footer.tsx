import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-dark py-8 mt-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium">
          (C) Noam Gold AI 2026
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <span>Send Feedback:</span>
            <a 
              href="mailto:goldnoamai@gmail.com" 
              className="text-primary hover:text-secondary transition-colors duration-300 underline underline-offset-4 font-semibold"
            >
              goldnoamai@gmail.com
            </a>
          </div>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <a 
            href="https://www.linkedin.com/in/noamgold" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors duration-300 underline underline-offset-4 font-semibold"
          >
            LinkedIn
          </a>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <a 
            href="https://noam-gold-games.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors duration-300 underline underline-offset-4 font-semibold"
          >
            More Games
          </a>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-500">Premium Arcade Experience</span>
      </div>
    </footer>
  );
};