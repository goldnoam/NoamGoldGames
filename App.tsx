import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GameCard } from './components/GameCard';
import { AddGameModal } from './components/AddGameModal';
import { Game, GameFormData } from './types';
import { generateGameMetadata } from './services/geminiService';

// Default initial data with user-specified games
const INITIAL_GAMES: Game[] = [
  {
    id: 'dig-game',
    title: 'Dig Game',
    url: 'https://diggame.vercel.app',
    description: 'Exciting digging adventure. Uncover hidden treasures beneath the surface.',
    tags: ['Adventure', 'Action', 'Arcade'],
    createdAt: Date.now()
  },
  {
    id: 'nego-ai',
    title: 'Nego AI',
    url: 'https://negoai.vercel.app/',
    description: 'Challenge an advanced AI in this strategic negotiation simulation.',
    tags: ['AI', 'Strategy', 'Simulation'],
    createdAt: Date.now() - 1000
  },
  {
    id: 'astro-game',
    title: 'Astro Game',
    url: 'https://astrogame.vercel.app/',
    description: 'Navigate the cosmos and survive the dangers of deep space.',
    tags: ['Space', 'Sci-Fi', 'Action'],
    createdAt: Date.now() - 2000
  },
  {
    id: 'chips-game',
    title: 'Chips Game',
    url: 'https://chipsgame.vercel.app/',
    description: 'A strategic puzzle game. Stack, bet, and win with chips.',
    tags: ['Puzzle', 'Strategy', 'Board'],
    createdAt: Date.now() - 3000
  },
  {
    id: 'charity-game',
    title: 'Charity Game',
    url: 'https://charitygame.vercel.app/',
    description: 'Make a difference in the world through this philanthropic simulation.',
    tags: ['Simulation', 'Social', 'Educational'],
    createdAt: Date.now() - 4000
  },
  {
    id: 'ski-game',
    title: 'Ski Game',
    url: 'https://skigame.vercel.app/',
    description: 'Hit the slopes! Dodge obstacles and race to the finish line.',
    tags: ['Sports', 'Winter', 'Action'],
    createdAt: Date.now() - 5000
  },
  {
    id: 'zombie-survival',
    title: 'Zombie Survival',
    url: 'https://zombie.vercel.app/',
    description: 'Fight for survival against hordes of zombies in this intense game.',
    tags: ['Horror', 'Survival', 'Action'],
    createdAt: Date.now() - 6000
  },
  {
    id: 'pizza-ng',
    title: 'Pizza NG',
    url: 'https://pizzang.vercel.app/',
    description: 'Become a master chef and bake the most delicious pizzas.',
    tags: ['Cooking', 'Simulation', 'Fun'],
    createdAt: Date.now() - 7000
  },
  {
    id: 'chemistry-game',
    title: 'Chemistry Game',
    url: 'https://chemistrygame.vercel.app/',
    description: 'Explore chemical reactions and elements in a safe virtual lab.',
    tags: ['Science', 'Educational', 'Puzzle'],
    createdAt: Date.now() - 8000
  },
  {
    id: 'shoe-laces',
    title: 'Shoe Laces',
    url: 'https://shoe-laces.vercel.app/',
    description: 'Master the art of tying shoe laces with various techniques.',
    tags: ['Educational', 'Life Skills', 'Casual'],
    createdAt: Date.now() - 9000
  },
  {
    id: 'make-burger',
    title: 'Make Burger',
    url: 'https://makeburger.vercel.app',
    description: 'Stack ingredients and serve the perfect burger before time runs out.',
    tags: ['Cooking', 'Time Management', 'Arcade'],
    createdAt: Date.now() - 10000
  },
  {
    id: 'hotdog-game',
    title: 'Hotdog Game',
    url: 'https://hotdog-game.vercel.app/',
    description: 'A fun and fast-paced game centered around everyone\'s favorite snack.',
    tags: ['Arcade', 'Food', 'Casual'],
    createdAt: Date.now() - 11000
  }
];

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Using a new key to ensure the new list loads for the user
  const STORAGE_KEY = 'noam_gold_games_gallery_v2';

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

  const saveGames = (newGames: Game[]) => {
    setGames(newGames);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGames));
  };

  const handleAddGame = async (formData: GameFormData) => {
    let finalTags: string[] = ['New'];
    let finalDescription = formData.description;

    // If description is missing, try to auto-fill one last time silently
    if (!finalDescription) {
       try {
         const metadata = await generateGameMetadata(formData.title, formData.url);
         if (metadata) {
            finalDescription = metadata.description;
            finalTags = metadata.tags;
         }
       } catch (e) {
         console.warn("Background generation failed", e);
         finalDescription = "No description provided.";
       }
    }

    const newGame: Game = {
      id: crypto.randomUUID(),
      title: formData.title,
      url: formData.url,
      thumbnailUrl: formData.thumbnailUrl,
      description: finalDescription || 'Explore this amazing game.',
      tags: finalTags,
      createdAt: Date.now()
    };

    saveGames([newGame, ...games]);
  };

  const handleDeleteGame = (id: string) => {
    if (window.confirm("Are you sure you want to remove this game from your gallery?")) {
      saveGames(games.filter(g => g.id !== id));
    }
  };

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-dark text-slate-100 font-sans selection:bg-primary/30">
      <Header onAddClick={() => setIsModalOpen(true)} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Hero Section / Intro */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Your Ultimate <span className="text-primary">Web Game</span> Collection
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Curate, play, and share your favorite browser-based games in one stunning, AI-powered gallery.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search games by title or tag..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-full px-6 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pl-12 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map(game => (
              <GameCard key={game.id} game={game} onDelete={handleDeleteGame} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
            <p className="text-slate-500 text-xl mb-4">No games found matching your search.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-primary hover:text-secondary font-medium hover:underline"
            >
              Add a new game to get started
            </button>
          </div>
        )}

      </main>

      <AddGameModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddGame} 
      />

      <Footer />
    </div>
  );
};

export default App;