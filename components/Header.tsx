import React, { useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'colorful';

interface HeaderProps {
  // Props removed
}

export const Header: React.FC<HeaderProps> = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['dark', 'light', 'colorful'].includes(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // default to dark
      setTheme('dark');
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('dark', 'light', 'colorful');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['dark', 'light', 'colorful'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-dark/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 hidden lg:block">
            Noam Gold Games
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold tracking-tighter text-slate-500 dark:text-slate-400 uppercase border border-slate-200 dark:border-slate-700">
              Arcade
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary transition-all duration-300 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center group"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'colorful' : 'dark'} mode`}
          >
            {theme === 'dark' && (
              <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
            {theme === 'light' && (
              <svg className="w-5 h-5 transition-transform duration-500 group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {theme === 'colorful' && (
              <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};