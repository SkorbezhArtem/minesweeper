import {
  CELL_STATUS,
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  GAME_STATUS,
  STORAGE_KEYS,
  THEMES,
  WIN_SCORES_LIMIT,
} from './constants.js';

const VALID_GAME_STATUSES = Object.values(GAME_STATUS);
const VALID_CELL_STATUSES = Object.values(CELL_STATUS);

export function saveGame(state) {
  localStorage.setItem(STORAGE_KEYS.save, JSON.stringify(state));
}

export function autosaveGame(state) {
  localStorage.setItem(STORAGE_KEYS.autosave, JSON.stringify(state));
}

export function loadGame() {
  const manual = readValidatedSave(STORAGE_KEYS.save);

  if (manual !== null) {
    return manual;
  }

  return readValidatedSave(STORAGE_KEYS.autosave);
}

export function clearSavedGame() {
  localStorage.removeItem(STORAGE_KEYS.save);
  localStorage.removeItem(STORAGE_KEYS.autosave);
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

function readValidatedSave(key) {
  const value = readJson(key, null);

  if (value === null) {
    return null;
  }

  if (!isValidSavedState(value)) {
    localStorage.removeItem(key);
    return null;
  }

  return value;
}

function isValidSavedState(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  if (!DIFFICULTY_ORDER.includes(value.difficulty)) {
    return false;
  }

  const expected = DIFFICULTIES[value.difficulty];

  if (value.settings === null || typeof value.settings !== 'object') {
    return false;
  }

  if (
    value.settings.rows !== expected.rows
    || value.settings.columns !== expected.columns
    || value.settings.mines !== expected.mines
  ) {
    return false;
  }

  if (!VALID_GAME_STATUSES.includes(value.status)) {
    return false;
  }

  if (typeof value.isFirstMove !== 'boolean') {
    return false;
  }

  if (!Number.isInteger(value.moves) || value.moves < 0) {
    return false;
  }

  if (!Number.isInteger(value.flagsLeft) || value.flagsLeft < 0 || value.flagsLeft > expected.mines) {
    return false;
  }

  if (!Number.isInteger(value.elapsedSeconds) || value.elapsedSeconds < 0) {
    return false;
  }

  if (!Array.isArray(value.board) || value.board.length !== expected.rows) {
    return false;
  }

  for (let row = 0; row < expected.rows; row += 1) {
    const rowCells = value.board[row];

    if (!Array.isArray(rowCells) || rowCells.length !== expected.columns) {
      return false;
    }

    for (let column = 0; column < expected.columns; column += 1) {
      if (!isValidCell(rowCells[column], row, column)) {
        return false;
      }
    }
  }

  if (value.savedAt !== undefined && typeof value.savedAt !== 'number') {
    return false;
  }

  return true;
}

function isValidCell(cell, expectedRow, expectedColumn) {
  if (cell === null || typeof cell !== 'object') {
    return false;
  }

  if (cell.row !== expectedRow || cell.column !== expectedColumn) {
    return false;
  }

  if (!VALID_CELL_STATUSES.includes(cell.status)) {
    return false;
  }

  if (typeof cell.hasMine !== 'boolean') {
    return false;
  }

  if (!Number.isInteger(cell.adjacentMines) || cell.adjacentMines < 0 || cell.adjacentMines > 8) {
    return false;
  }

  return true;
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
