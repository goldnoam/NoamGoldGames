import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-dark py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-slate-400 mb-2">
          &copy; Noam Gold AI 2025
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>Send Feedback:</span>
          <a 
            href="mailto:gold.noam@gmail.com" 
            className="text-primary hover:text-secondary transition-colors duration-300"
          >
            gold.noam@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};