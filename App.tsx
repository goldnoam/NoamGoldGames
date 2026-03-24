
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GameCard } from './components/GameCard';
import { AdBanner } from './components/AdBanner';
import { Game } from './types';

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
    id: 'trivia',
    title: 'Trivia',
    url: 'https://trivia12.vercel.app/',
    description: 'Test your knowledge with this fun and challenging trivia game.',
    tags: ['Trivia', 'Educational', 'Casual'],
    createdAt: Date.now() + 2100
  },
  {
    id: 'grandma-revenge',
    title: 'Grandma Revenge',
    url: 'https://grandma-revenge.vercel.app/',
    description: 'Help Grandma get her revenge in this hilarious action game.',
    tags: ['Action', 'Funny', 'Arcade'],
    createdAt: Date.now() + 2000
  },
  {
    id: 'canoe-racer',
    title: 'Canoe Racer',
    url: 'https://canoe-racer.vercel.app/',
    description: 'Race your canoe through challenging waters and obstacles.',
    tags: ['Racing', 'Sports', 'Arcade'],
    createdAt: Date.now() + 1900
  },
  {
    id: 'monkey-forest',
    title: 'Monkey Forest',
    url: 'https://monkey-forest-jump.vercel.app/',
    description: 'Jump through the forest as a monkey in this addictive arcade game.',
    tags: ['Arcade', 'Casual', 'Adventure'],
    createdAt: Date.now() + 1800
  },
  {
    id: 'octopus-gunner',
    title: 'Octopus Gunner',
    url: 'https://octopus-gunner.vercel.app/',
    description: 'Defend the ocean as an octopus with a gun in this action-packed shooter.',
    tags: ['Action', 'Shooter', 'Arcade'],
    createdAt: Date.now() + 1700
  },
  {
    id: 'pac-ai',
    title: 'PacAI',
    url: 'https://pac-ai.vercel.app/',
    description: 'A modern AI-enhanced twist on the classic maze-running game.',
    tags: ['Arcade', 'Classic', 'AI'],
    createdAt: Date.now() + 1600
  },
  {
    id: 'space-game',
    title: 'Space Game',
    url: 'https://space-game-gray.vercel.app/',
    description: 'Explore the cosmos in this exciting space adventure.',
    tags: ['Space', 'Action', 'Arcade'],
    createdAt: Date.now() + 1500
  },
  {
    id: 'passover',
    title: 'Passover',
    url: 'https://passover1.vercel.app',
    description: 'Celebrate the holiday with this fun and festive game.',
    tags: ['Holiday', 'Casual'],
    createdAt: Date.now() + 1400
  },
  {
    id: 'baby-run',
    title: 'Baby Run',
    url: 'https://babyrun.vercel.app/',
    description: 'Help the baby run through obstacles in this cute arcade game.',
    tags: ['Casual', 'Arcade'],
    createdAt: Date.now() + 1300
  },
  {
    id: 'lion-rorr',
    title: 'Lion Rorr',
    url: 'https://roar12.vercel.app/',
    description: 'Hear the lion roar! A wild adventure awaits.',
    tags: ['Adventure', 'Action'],
    createdAt: Date.now() + 1200
  },
  {
    id: 'dizingoff',
    title: 'Dizingoff',
    url: 'https://dizengoff.vercel.app',
    description: 'Explore the vibrant streets of Dizingoff in this exciting adventure.',
    tags: ['Adventure', 'Casual'],
    createdAt: Date.now() + 1100
  },
  {
    id: 'duck',
    title: 'Duck',
    url: 'https://duckduck2.vercel.app',
    description: 'A fun and quirky game featuring a duck. Quack your way to victory!',
    tags: ['Casual', 'Arcade', 'Funny'],
    createdAt: Date.now() + 1000
  },
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

  const STORAGE_KEY = 'noam_gold_games_gallery_v30';

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Noam Gold <span className="text-primary">Arcade</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Next-generation web gaming collection.
          </p>
        </div>

        {/* TOP AD PLACEMENT */}
        <AdBanner slot="TOP_BANNER_SLOT_ID" className="mb-12" />

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-12 shadow-sm flex flex-col xl:flex-row items-center gap-4 sticky top-24 z-30">
          <div className="relative flex-grow w-full xl:w-auto">
            <input
              type="text"
              placeholder="Search games, genres, or titles..."
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all pl-12 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end">
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none font-bold"
              >
                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </div>

        {sortedGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedGames.map((game, index) => (
              <React.Fragment key={game.id}>
                <GameCard game={game} onPlay={setPlayingGame} />
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
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No games matched your search</h3>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="text-primary font-bold underline">Reset Browsing</button>
          </div>
        )}

        {/* BOTTOM AD PLACEMENT */}
        <AdBanner slot="BOTTOM_BANNER_SLOT_ID" className="mt-16" />
      </main>

      <Footer />
      {playingGame && <GameOverlay game={playingGame} onClose={() => setPlayingGame(null)} />}
    </div>
  );
};

export default App;
