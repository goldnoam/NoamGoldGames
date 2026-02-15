import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GameCard } from './components/GameCard';
import { AdBanner } from './components/AdBanner';
import { Game } from './types';
import { generateGameMetadata } from './services/geminiService';

// Game Overlay Component for in-app play with controls
const GameOverlay: React.FC<{ game: Game; onClose: () => void }> = ({ game, onClose }) => {
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReset = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const simulateKey = (key: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'keydown', key }, '*');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
      <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Back to Gallery"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h3 className="text-white font-bold leading-tight">{game.title}</h3>
            <p className="text-slate-500 text-xs hidden sm:block">Noam Gold Premium Arcade</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${isPaused ? 'bg-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
          <button 
            onClick={handleReset}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-sm transition-all"
          >
            RESET
          </button>
        </div>
      </div>

      <div className="relative flex-grow bg-black overflow-hidden flex items-center justify-center">
        {isPaused && (
          <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 animate-pulse">
               <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h4V4z" />
               </svg>
            </div>
            <h2 className="text-3xl font-black text-white tracking-widest uppercase">Paused</h2>
            <button 
              onClick={() => setIsPaused(false)}
              className="mt-8 bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Resume Game
            </button>
          </div>
        )}
        <iframe 
          ref={iframeRef}
          src={game.url} 
          className="w-full h-full border-none shadow-2xl" 
          title={game.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="sm:hidden p-6 bg-slate-950 border-t border-slate-900 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-3">
          <div />
          <button onMouseDown={() => simulateKey('w')} className="w-14 h-14 bg-slate-800 active:bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border border-slate-700 active:scale-95 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
          <div />
          <button onMouseDown={() => simulateKey('a')} className="w-14 h-14 bg-slate-800 active:bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border border-slate-700 active:scale-95 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onMouseDown={() => simulateKey('s')} className="w-14 h-14 bg-slate-800 active:bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border border-slate-700 active:scale-95 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          <button onMouseDown={() => simulateKey('d')} className="w-14 h-14 bg-slate-800 active:bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border border-slate-700 active:scale-95 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Default initial data
const INITIAL_GAMES: Game[] = [
  {
    id: 'cards-game-war',
    title: 'Cards Game War',
    url: 'https://cards12.vercel.app/',
    description: 'Experience the classic game of War! Battle against the dealer in this fast-paced card game where high card wins. Simple, addictive, and perfect for a quick match.',
    tags: ['Classic', 'Cards', 'Casual'],
    createdAt: Date.now() + 900
  },
  {
    id: 'bat-shooter',
    title: 'Bat Shooter',
    url: 'https://bar-shooter.vercel.app/',
    description: 'Take aim and clear the skies! Test your reflexes in this fast-paced arcade shooter where you must defend against swarms of nocturnal pests.',
    tags: ['Action', 'Arcade', 'Shooter'],
    createdAt: Date.now() + 800
  },
  {
    id: 'super-fan-simulator',
    title: 'Super Fan Simulator',
    url: 'https://fan1.vercel.app/',
    description: 'Channel your inner enthusiast! Experience the extreme energy and dedication of being a true super fan in this unique and hilarious simulation game.',
    tags: ['Simulation', 'Casual', 'Funny'],
    createdAt: Date.now() + 700
  },
  {
    id: 'bingo-game',
    title: 'Bingo Game',
    url: 'https://bingo12.vercel.app/',
    description: 'A fun and classic bingo experience. Play with multiple cards, track your numbers, and aim for that winning pattern in this digital version of the timeless social game.',
    tags: ['Classic', 'Casual', 'Board'],
    createdAt: Date.now() + 600
  },
  {
    id: 'find-treasure',
    title: 'Find Treasure',
    url: 'https://treaseuregame.vercel.app/',
    description: 'Embark on an epic quest for riches! Search through mysterious islands and ancient ruins to discover long-lost treasures in this exciting adventure game.',
    tags: ['Adventure', 'Puzzle', 'Casual'],
    createdAt: Date.now() + 500
  },
  {
    id: 'rescue-babies-stork',
    title: 'Rescue Babies fall from stork',
    url: 'https://stork-operation-game.vercel.app/',
    description: 'A fast-paced rescue mission! Catch the falling babies dropped by the confused storks in this high-stakes arcade challenge. Precision and timing are everything.',
    tags: ['Action', 'Arcade', 'Casual'],
    createdAt: Date.now() + 400
  },
  {
    id: 'fire-rescue-game',
    title: 'Fire Rescue Game',
    url: 'https://fire-rescue-pro.vercel.app/',
    description: 'Be a hero in this intense fire rescue simulator. Extinguish blazes, rescue trapped citizens, and manage your resources to save the city from the inferno.',
    tags: ['Action', 'Simulation', 'Arcade'],
    createdAt: Date.now() + 300
  },
  {
    id: 'cat-bins-peek',
    title: 'Cat bins peek',
    url: 'https://cat-bin-peek.vercel.app/',
    description: 'A delightful game of hide and seek! Help the curious cat peek out of the bins at the right moment. Fast-paced, adorable, and purely addictive.',
    tags: ['Casual', 'Arcade', 'Cute'],
    createdAt: Date.now() + 200
  },
  {
    id: 'middle-east-hegemony',
    title: 'Middle East Hegemony',
    url: 'https://middle-east-hegemony.vercel.app/',
    description: 'Lead your nation to regional dominance in this deep geopolitical strategy simulator. Balance diplomacy, resource management, and military strategy to shape the future of the Middle East.',
    tags: ['Strategy', 'Simulation', 'Geopolitics'],
    createdAt: Date.now() + 100
  },
  {
    id: 'battleships-game',
    title: 'BattleShips',
    url: 'https://battleships1.vercel.app/',
    description: 'Command your fleet and sink the enemy. A classic strategy game of maritime warfare.',
    tags: ['Strategy', 'Board', 'Classic'],
    createdAt: Date.now()
  }
];

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [newGameUrl, setNewGameUrl] = useState('');
  const [newGameTitle, setNewGameTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const STORAGE_KEY = 'noam_gold_games_gallery_v28';

  // Debounce mechanism for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const savedGames = localStorage.getItem(STORAGE_KEY);
    if (savedGames) {
      try {
        setGames(JSON.parse(savedGames));
      } catch (e) {
        setGames(INITIAL_GAMES);
      }
    } else {
      setGames(INITIAL_GAMES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GAMES));
    }
  }, []);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    games.forEach(game => game.tags.forEach(tag => categories.add(tag)));
    return ['All', ...Array.from(categories).sort()];
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const query = debouncedSearchQuery.toLowerCase();
      const matchesSearch = game.title.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query));
      const matchesCategory = selectedCategory === 'All' || game.tags.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [games, debouncedSearchQuery, selectedCategory]);

  const sortedGames = useMemo(() => {
    return [...filteredGames].sort((a, b) => 
      sortOrder === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );
  }, [filteredGames, sortOrder]);

  const handleAddGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameUrl || !newGameTitle) return;

    setIsGenerating(true);
    const metadata = await generateGameMetadata(newGameTitle, newGameUrl);
    
    const newGame: Game = {
      id: `game-${Date.now()}`,
      title: newGameTitle,
      url: newGameUrl,
      description: metadata?.description || "A new game added to the gallery.",
      tags: metadata?.tags || ["Casual"],
      createdAt: Date.now(),
    };

    const updatedGames = [newGame, ...games];
    setGames(updatedGames);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGames));
    
    setNewGameUrl('');
    setNewGameTitle('');
    setIsAddingGame(false);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Your Ultimate <span className="text-primary">Web Game</span> Collection
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Curate, play, and share your favorite browser-based games in one stunning, streamlined gallery.
          </p>
        </div>

        {/* TOP AD PLACEMENT */}
        <AdBanner slot="TOP_BANNER_SLOT_ID" className="mb-12" />

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-8 shadow-sm flex flex-col xl:flex-row items-center gap-4 sticky top-24 z-30">
          <div className="relative flex-grow w-full xl:w-auto">
            <input
              type="text"
              placeholder="Search games..."
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all pl-11 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-3.5 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end">
            <button 
              onClick={() => setIsAddingGame(true)}
              className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Game
            </button>

            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none font-medium shadow-sm"
              >
                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                className="bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none font-medium shadow-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {sortedGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedGames.map((game, index) => (
              <React.Fragment key={game.id}>
                <GameCard game={game} onPlay={setPlayingGame} />
                {/* IN-FEED AD PLACEMENT: Every 6 items */}
                {(index + 1) % 6 === 0 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <AdBanner slot={`IN_FEED_SLOT_${index}`} format="fluid" layoutKey="-fb+5w+4e-db+86" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/30">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No games found</h3>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="text-primary font-bold underline">Reset all filters</button>
          </div>
        )}

        {/* BOTTOM AD PLACEMENT */}
        <AdBanner slot="BOTTOM_BANNER_SLOT_ID" className="mt-16" />
      </main>

      {/* Add Game Modal */}
      {isAddingGame && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Game</h3>
                <button onClick={() => setIsAddingGame(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleAddGameSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Game Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Find Treasure"
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    value={newGameTitle}
                    onChange={(e) => setNewGameTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Game URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://example.com"
                    className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    value={newGameUrl}
                    onChange={(e) => setNewGameUrl(e.target.value)}
                  />
                </div>
                <div className="pt-4">
                  <button
                    disabled={isGenerating}
                    type="submit"
                    className="w-full bg-primary hover:bg-secondary disabled:bg-slate-400 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        AI Generating Metadata...
                      </>
                    ) : 'Add to Gallery'}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700">
               <p className="text-[10px] text-slate-500 text-center italic">AI will automatically analyze your game to generate descriptions and tags.</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
      {playingGame && <GameOverlay game={playingGame} onClose={() => setPlayingGame(null)} />}
    </div>
  );
};

export default App;