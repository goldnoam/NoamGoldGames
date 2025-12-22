import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-dark py-8 mt-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-2">
          (C) Noam Gold AI 2025
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-500">
          <span>Send Feedback:</span>
          <a 
            href="mailto:gold.noam@gmail.com" 
            className="text-primary hover:text-secondary transition-colors duration-300 underline underline-offset-4"
          >
            gold.noam@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};