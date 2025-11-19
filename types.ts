export interface Game {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  description: string;
  tags: string[];
  createdAt: number;
}

export interface GameFormData {
  title: string;
  url: string;
  thumbnailUrl: string;
  description: string;
}

export enum GameCategory {
  ACTION = 'Action',
  PUZZLE = 'Puzzle',
  STRATEGY = 'Strategy',
  RPG = 'RPG',
  CASUAL = 'Casual',
  OTHER = 'Other'
}