import { STORAGE_KEYS, THEMES, WIN_SCORES_LIMIT } from './constants.js';

export function saveGame(state) {
  localStorage.setItem(STORAGE_KEYS.save, JSON.stringify(state));
}

export function loadGame() {
  return readJson(STORAGE_KEYS.save, null);
}

export function clearSavedGame() {
  localStorage.removeItem(STORAGE_KEYS.save);
}

export function getScores() {
  const scores = readJson(STORAGE_KEYS.scores, []);
  return Array.isArray(scores) ? scores : [];
}

export function saveScore(score) {
  const enriched = { ...score, savedAt: Date.now() };
  const scores = [enriched, ...getScores()]
    .sort((a, b) => a.seconds - b.seconds)
    .slice(0, WIN_SCORES_LIMIT);
  localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(scores));
  return scores;
}

export function clearScores() {
  localStorage.removeItem(STORAGE_KEYS.scores);
}

export function getSavedTheme() {
  const theme = localStorage.getItem(STORAGE_KEYS.theme);
  return theme === THEMES.light || theme === THEMES.dark ? theme : THEMES.dark;
}

export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export function getSavedSound() {
  const value = localStorage.getItem(STORAGE_KEYS.sound);
  return value === null ? true : value === 'on';
}

export function saveSound(isEnabled) {
  localStorage.setItem(STORAGE_KEYS.sound, isEnabled ? 'on' : 'off');
}

function readJson(key, fallbackValue) {
  const value = localStorage.getItem(key);

  if (value === null) {
    return fallbackValue;
  }

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(key);
    return fallbackValue;
  }
}
