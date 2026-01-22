import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GameCard } from './components/GameCard';
import { Game } from './types';

// Game Overlay Component for in-app play with controls
const GameOverlay: React.FC<{ game: Game; onClose: () => void }> = ({ game, onClose }) => {
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReset = () => {
    if (iframeRef.current) {
      // Logic to reload the game
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const simulateKey = (key: string) => {
    if (iframeRef.current?.contentWindow) {
      // Note: This only works if the target game is configured to listen to postMessages
      // or if it's on the same origin. For external games, we provide the UI.
      iframeRef.current.contentWindow.postMessage({ type: 'keydown', key }, '*');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
      {/* Game Bar */}
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

      {/* Main Viewport */}
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

      {/* Mobile Controls Overlay */}
      <div className="sm:hidden p-6 bg-slate-950 border-t border-slate-900 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-3">
          <div />
          <button 
            onMouseDown={() => simulateKey('w')}
            className="w-14 h-14 bg-slate-800 active:bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border border-slate-700 active:scale-95 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
          <div />
          <button 
            onMouseDown={() => simulateKey('a')}
            className="w-14 h-14 bg-slate-800 active:bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border border-slate-700 active:scale-95 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onMouseDown={() => simulateKey('s')}
            className="w-14 h-14 bg-slate-800 active:bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border border-slate-700 active:scale-95 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          <button 
            onMouseDown={() => simulateKey('d')}
            className="w-14 h-14 bg-slate-800 active:bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border border-slate-700 active:scale-95 transition-all"
          >
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
    description: 'Command your fleet and sink the enemy. A classic strategy game of maritime warfare. Deploy your ships wisely and dominate the seas!',
    tags: ['Strategy', 'Board', 'Classic'],
    createdAt: Date.now()
  },
  {
    id: 'godzilla-escape',
    title: 'Godzilla Escape',
    url: 'https://godzilla-escape.vercel.app',
    description: 'The city is under siege by the King of Monsters! Race through the crumbling streets, avoid debris, and survive the ultimate escape challenge.',
    tags: ['Action', 'Adventure', 'Arcade'],
    createdAt: Date.now() - 25
  },
  {
    id: 'steel-drop',
    title: 'Steel Drop',
    url: 'https://steel-drop.vercel.app',
    description: 'Precision and speed are your only allies. Navigate the falling steel and survive the industrial chaos in this fast-paced arcade challenge.',
    tags: ['Arcade', 'Action', 'Reflexes'],
    createdAt: Date.now() - 50
  },
  {
    id: 'rock-paper-scissors',
    title: 'Rock Paper Scissors',
    url: 'https://rockscissorsgame.vercel.app',
    description: 'The ultimate hand game! Challenge the computer in this classic battle of wits. Choose your move and see who reigns supreme.',
    tags: ['Classic', 'Casual', 'Strategy'],
    createdAt: Date.now() - 100
  },
  {
    id: 'the-great-heist',
    title: 'The Great Heist',
    url: 'https://the-great-heist.vercel.app/',
    description: 'Plan the perfect robbery in this intense strategy and action game. Can you escape with the loot?',
    tags: ['Strategy', 'Action', 'Stealth'],
    createdAt: Date.now() - 150
  },
  {
    id: 'tic-taq-toe',
    title: 'Tic Taq Toe',
    url: 'https://tic-taq-toe.vercel.app/',
    description: 'The classic game of X\'s and O\'s. Strategy and fun for all ages.',
    tags: ['Board', 'Strategy', 'Classic'],
    createdAt: Date.now() - 250
  },
  {
    id: 'sudoku-game',
    title: 'Suduku Game',
    url: 'https://sudokusudoku.vercel.app/',
    description: 'Classic Sudoku puzzle game. Challenge your logic and fill the grid with numbers 1 to 9.',
    tags: ['Puzzle', 'Logic', 'Strategy'],
    createdAt: Date.now() - 500
  },
  {
    id: 'dig-game',
    title: 'Dig Game',
    url: 'https://diggame.vercel.app',
    description: 'Exciting digging adventure. Uncover hidden treasures beneath the surface.',
    tags: ['Adventure', 'Action', 'Arcade'],
    createdAt: Date.now() - 1000
  },
  {
    id: 'astro-game',
    title: 'Astro Game',
    url: 'https://astrogame.vercel.app/',
    description: 'Navigate the cosmos and survive the dangers of deep space.',
    tags: ['Space', 'Sci-Fi', 'Action'],
    createdAt: Date.now() - 3000
  },
  {
    id: 'chips-game',
    title: 'Chips Game',
    url: 'https://chipsgame.vercel.app/',
    description: 'A strategic puzzle game. Stack, bet, and win with chips.',
    tags: ['Puzzle', 'Strategy', 'Board'],
    createdAt: Date.now() - 4000
  },
  {
    id: 'charity-game',
    title: 'Charity Game',
    url: 'https://charitygame.vercel.app/',
    description: 'Make a difference in the world through this philanthropic simulation.',
    tags: ['Simulation', 'Social', 'Educational'],
    createdAt: Date.now() - 5000
  },
  {
    id: 'ski-game',
    title: 'Ski Game',
    url: 'https://skigame.vercel.app/',
    description: 'Hit the slopes! Dodge obstacles and race to the finish line.',
    tags: ['Sports', 'Winter', 'Action'],
    createdAt: Date.now() - 6000
  },
  {
    id: 'zombie-survival',
    title: 'Zombie Survival',
    url: 'https://zombie.vercel.app/',
    description: 'Fight for survival against hordes of zombies in this intense game.',
    tags: ['Horror', 'Survival', 'Action'],
    createdAt: Date.now() - 7000
  },
  {
    id: 'pizza-ng',
    title: 'Pizza NG',
    url: 'https://pizzang.vercel.app/',
    description: 'Become a master chef and bake the most delicious pizzas.',
    tags: ['Cooking', 'Simulation', 'Fun'],
    createdAt: Date.now() - 8000
  },
  {
    id: 'chemistry-game',
    title: 'Chemistry Game',
    url: 'https://chemistrygame.vercel.app/',
    description: 'Explore chemical reactions and elements in a safe virtual lab.',
    tags: ['Science', 'Educational', 'Puzzle'],
    createdAt: Date.now() - 9000
  },
  {
    id: 'shoe-laces',
    title: 'Shoe Laces',
    url: 'https://shoe-laces.vercel.app/',
    description: 'Master the art of tying shoe laces with various techniques.',
    tags: ['Educational', 'Life Skills', 'Casual'],
    createdAt: Date.now() - 10000
  },
  {
    id: 'make-burger',
    title: 'Make Burger',
    url: 'https://makeburger.vercel.app',
    description: 'Stack ingredients and serve the perfect burger before time runs out.',
    tags: ['Cooking', 'Time Management', 'Arcade'],
    createdAt: Date.now() - 11000
  },
  {
    id: 'hotdog-game',
    title: 'Hotdog Game',
    url: 'https://hotdog-game.vercel.app/',
    description: 'A fun and fast-paced game centered around everyone\'s favorite snack.',
    tags: ['Arcade', 'Food', 'Casual'],
    createdAt: Date.now() - 12000
  },
  {
    id: 'fisherman-game',
    title: 'Fisherman Game',
    url: 'https://fishermangame.vercel.app/',
    description: 'Cast your line, hook the biggest catch, and master the art of fishing.',
    tags: ['Fishing', 'Simulation', 'Relaxing'],
    createdAt: Date.now() - 13000
  },
  {
    id: 'turbo-delivery',
    title: 'Turbo Delivery',
    url: 'https://turbogame.vercel.app/',
    description: 'Race against time to deliver packages in this high-speed arcade game.',
    tags: ['Arcade', 'Racing', 'Action'],
    createdAt: Date.now() - 14000
  },
  {
    id: 'hexa-memory',
    title: 'HexaMemory',
    url: 'https://hexa-memory.vercel.app',
    description: 'Challenge your memory skills by matching pairs in this hexagonal puzzle game.',
    tags: ['Puzzle', 'Memory', 'Strategy'],
    createdAt: Date.now() - 15000
  },
  {
    id: 'eggs-factory',
    title: 'Eggs Factory',
    url: 'https://eggs-factory-game.vercel.app',
    description: 'Build and manage your own egg production empire in this fun factory simulation.',
    tags: ['Simulation', 'Management', 'Tycoon'],
    createdAt: Date.now() - 16000
  },
  {
    id: 'city-guards',
    title: 'City Guards Game',
    url: 'https://city-guard-game.vercel.app/',
    description: 'Protect the city from relentless attacks in this exciting strategy defense game.',
    tags: ['Strategy', 'Defense', 'Action'],
    createdAt: Date.now() - 17000
  }
];

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingGame, setPlayingGame] = useState<Game | null>(null);

  const STORAGE_KEY = 'noam_gold_games_gallery_v21';

  useEffect(() => {
    const savedGames = localStorage.getItem(STORAGE_KEY);
    if (savedGames) {
      try {
        setGames(JSON.parse(savedGames));
      } catch (e) {
        console.error("Failed to parse saved games", e);
        setGames(INITIAL_GAMES);
      }
    } else {
      setGames(INITIAL_GAMES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GAMES));
    }
  }, []);

  // Compute unique categories from available games
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    games.forEach(game => game.tags.forEach(tag => categories.add(tag)));
    return ['All', ...Array.from(categories).sort()];
  }, [games]);

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || game.tags.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.createdAt - a.createdAt;
    } else {
      return a.createdAt - b.createdAt;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Your Ultimate <span className="text-primary">Web Game</span> Collection
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Curate, play, and share your favorite browser-based games in one stunning, streamlined gallery.
          </p>
        </div>

        {/* Toolbar: Search, Filter & Sort Bar directly above the grid */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-8 shadow-sm flex flex-col xl:flex-row items-center gap-4 sticky top-24 z-30">
          
          {/* Main Content Search Input (Synced with Header) */}
          <div className="relative flex-grow w-full xl:w-auto">
            <input
              type="text"
              placeholder="Search games by title or tag..."
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pl-11 pr-10 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-3.5 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 transition-colors"
                title="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
            <p className="hidden md:block text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
              {sortedGames.length} Result{sortedGames.length !== 1 ? 's' : ''}
            </p>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                <label htmlFor="categoryFilter" className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-tighter whitespace-nowrap">Category:</label>
                <select
                  id="categoryFilter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium shadow-sm"
                >
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                <label htmlFor="sortOrder" className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-tighter whitespace-nowrap">Sort:</label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                  className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium shadow-sm"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {sortedGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedGames.map(game => (
              <GameCard 
                key={game.id} 
                game={game} 
                onPlay={(g) => setPlayingGame(g)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/30">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No games found</h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6">We couldn't find anything matching your filters.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-primary hover:text-secondary font-bold underline transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}

      </main>

      <Footer />

      {/* Game Overlay */}
      {playingGame && (
        <GameOverlay 
          game={playingGame} 
          onClose={() => setPlayingGame(null)} 
        />
      )}
    </div>
  );
};

export default App;