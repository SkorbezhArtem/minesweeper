export const GAME_STATUS = {
  idle: 'idle',
  playing: 'playing',
  won: 'won',
  lost: 'lost',
};

export const CELL_STATUS = {
  hidden: 'hidden',
  opened: 'opened',
  flagged: 'flagged',
};

export const DIFFICULTIES = {
  easy: {
    label: 'Easy',
    summary: '10 × 10 · 10 mines',
    short: '10×10',
    rows: 10,
    columns: 10,
    mines: 10,
  },
  medium: {
    label: 'Medium',
    summary: '15 × 15 · 40 mines',
    short: '15×15',
    rows: 15,
    columns: 15,
    mines: 40,
  },
  hard: {
    label: 'Hard',
    summary: '25 × 25 · 99 mines',
    short: '25×25',
    rows: 25,
    columns: 25,
    mines: 99,
  },
};

export const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];

export const DEFAULT_DIFFICULTY = 'easy';

export const STORAGE_KEYS = {
  save: 'rss-minesweeper-save',
  scores: 'rss-minesweeper-scores',
  theme: 'rss-minesweeper-theme',
  sound: 'rss-minesweeper-sound',
};

export const THEMES = {
  light: 'light',
  dark: 'dark',
};

export const WIN_SCORES_LIMIT = 10;
