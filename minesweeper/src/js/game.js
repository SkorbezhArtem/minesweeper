import {
  CELL_STATUS,
  DEFAULT_DIFFICULTY,
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  GAME_STATUS,
  THEMES,
} from './constants.js';
import {
  countHiddenSafeCells,
  openCell,
  prepareBoardForFirstMove,
  toggleFlag,
} from './board.js';
import {
  applyTheme,
  bindEvents,
  closeModal,
  createLayout,
  flashMessage,
  openModal,
  renderGame,
  renderSoundButton,
  renderStats,
  setBoardCelebrate,
  setBoardShake,
} from './render.js';
import { createInitialState } from './state.js';
import { playSound, toggleSound } from './sound.js';
import {
  autosaveGame,
  clearSavedGame,
  clearScores,
  getSavedTheme,
  getScores,
  loadGame,
  saveGame,
  saveScore,
  saveTheme,
} from './storage.js';
import { formatClock, startTimer, stopTimer } from './timer.js';
import { icon } from './icons.js';

let state = createInitialState();
let theme = getSavedTheme();
let lastLoadedSaveStamp = null;

export function initGame() {
  createLayout();
  bindEvents({
    onCellOpen: handleCellOpen,
    onCellFlag: handleCellFlag,
    onNewGame: handleNewGame,
    onContinueGame: handleContinueGame,
    onSaveGame: handleSaveGame,
    onRandomGame: handleRandomGame,
    onOpenScores: handleOpenScores,
    onToggleTheme: handleToggleTheme,
    onToggleSound: handleToggleSound,
    onDifficultyChange: handleDifficultyChange,
  });

  applyTheme(theme);
  renderSoundButton();
  renderGame(state);
}

function handleCellOpen(row, column) {
  if (state.status === GAME_STATUS.won || state.status === GAME_STATUS.lost) {
    return;
  }

  const cell = state.board[row][column];

  if (cell.status === CELL_STATUS.flagged || cell.status === CELL_STATUS.opened) {
    return;
  }

  startGameIfNeeded(row, column);
  state.moves += 1;
  const openResult = openCell(state.board, cell);
  state.flagsLeft += openResult.removedFlags;

  if (cell.hasMine) {
    loseGame();
    return;
  }

  if (countHiddenSafeCells(state.board) === 0) {
    winGame();
    return;
  }

  playSound('reveal');
  autosaveGame(state);
  renderGame(state, { fresh: false });
}

function handleCellFlag(row, column) {
  if (state.status === GAME_STATUS.won || state.status === GAME_STATUS.lost) {
    return;
  }

  const cell = state.board[row][column];

  if (cell.status === CELL_STATUS.opened) {
    return;
  }

  if (cell.status === CELL_STATUS.hidden && state.flagsLeft === 0) {
    flashMessage('No flags left.', 'warn');
    return;
  }

  const wasFlagged = cell.status === CELL_STATUS.flagged;
  const flagDelta = toggleFlag(cell);
  state.flagsLeft += flagDelta;
  playSound(wasFlagged ? 'unflag' : 'flag');
  autosaveGame(state);
  renderGame(state, { fresh: false });
}

function handleNewGame() {
  stopTimer();
  clearSavedGame();
  lastLoadedSaveStamp = null;
  state = createInitialState(state.difficulty);
  renderGame(state);
}

function handleContinueGame() {
  const savedState = loadGame();

  if (savedState === null) {
    flashMessage('Nothing to continue yet.', 'warn');
    return;
  }

  if (
    typeof savedState.savedAt === 'number'
    && savedState.savedAt === lastLoadedSaveStamp
    && state.status === savedState.status
    && state.moves === savedState.moves
  ) {
    flashMessage('Already at the saved checkpoint.', 'info');
    return;
  }

  stopTimer();
  state = savedState;
  lastLoadedSaveStamp = typeof savedState.savedAt === 'number' ? savedState.savedAt : null;

  if (state.status === GAME_STATUS.playing) {
    startTimer(handleTimerTick);
  }

  renderGame(state);
  flashMessage('Saved game restored.', 'info');
}

function handleSaveGame() {
  if (state.status !== GAME_STATUS.playing) {
    const reason = state.status === GAME_STATUS.idle
      ? 'Open at least one cell before saving.'
      : 'Mission is already finished — start a new game first.';
    flashMessage(reason, 'warn');
    return;
  }

  state.savedAt = Date.now();
  lastLoadedSaveStamp = state.savedAt;
  saveGame(state);
  flashMessage('Game saved.', 'info');
}

function handleRandomGame() {
  stopTimer();
  clearSavedGame();
  lastLoadedSaveStamp = null;
  let next = DIFFICULTY_ORDER[Math.floor(Math.random() * DIFFICULTY_ORDER.length)];

  if (next === state.difficulty && DIFFICULTY_ORDER.length > 1) {
    next = DIFFICULTY_ORDER[(DIFFICULTY_ORDER.indexOf(next) + 1) % DIFFICULTY_ORDER.length];
  }

  state = createInitialState(next);
  renderGame(state);
}

function handleDifficultyChange(difficulty) {
  if (difficulty === state.difficulty && state.status === GAME_STATUS.idle) {
    return;
  }

  stopTimer();
  clearSavedGame();
  lastLoadedSaveStamp = null;
  state = createInitialState(difficulty || DEFAULT_DIFFICULTY);
  renderGame(state);
}

function handleToggleTheme() {
  theme = theme === THEMES.dark ? THEMES.light : THEMES.dark;
  saveTheme(theme);
  applyTheme(theme);
}

function handleToggleSound() {
  toggleSound();
  renderSoundButton();
}

function handleOpenScores() {
  showScoresModal();
}

function startGameIfNeeded(row, column) {
  if (!state.isFirstMove) {
    return;
  }

  prepareBoardForFirstMove(state.board, state.settings.mines, row, column);
  state.isFirstMove = false;
  state.status = GAME_STATUS.playing;
  startTimer(handleTimerTick);
}

function handleTimerTick() {
  state.elapsedSeconds += 1;
  autosaveGame(state);
  renderStats(state);
}

function winGame() {
  state.status = GAME_STATUS.won;
  stopTimer();
  clearSavedGame();
  saveScore({
    difficulty: state.difficulty,
    seconds: state.elapsedSeconds,
    moves: state.moves,
  });
  playSound('win');
  setBoardCelebrate(true);
  renderGame(state, { fresh: false });
  setTimeout(() => setBoardCelebrate(false), 1400);
  setTimeout(() => showResultModal('won'), 220);
}

function loseGame() {
  state.status = GAME_STATUS.lost;
  stopTimer();
  clearSavedGame();
  state.board.flat().forEach((cell) => {
    if (cell.hasMine) {
      cell.status = CELL_STATUS.opened;
    }
  });
  playSound('lose');
  setBoardShake(true);
  renderGame(state, { fresh: false });
  setTimeout(() => setBoardShake(false), 600);
  setTimeout(() => showResultModal('lost'), 220);
}

function showResultModal(outcome) {
  const isWin = outcome === 'won';
  const eyebrow = isWin ? 'Mission complete' : 'Mission failed';
  const title = isWin ? 'Field cleared.' : 'Boom — wrong tile.';

  const body = document.createElement('div');
  body.className = 'result';
  body.innerHTML = `
    <div class="result__hero ${isWin ? 'result__hero--win' : 'result__hero--lose'}">
      <span class="result__icon">${icon(isWin ? 'trophy' : 'bomb', { size: 26 })}</span>
      <span class="result__time mono">${formatClock(state.elapsedSeconds)}</span>
    </div>
    <p class="result__copy">${
  isWin
    ? `You found all mines in <strong>${state.elapsedSeconds} seconds</strong> and <strong>${state.moves} moves</strong>.`
    : 'You stepped on a mine. Try the same field again or pick a new mission.'
}</p>
    <div class="result__meta">
      <div><span>${icon('shield', { size: 12 })} Mission</span><strong>${DIFFICULTIES[state.difficulty].label}</strong></div>
      <div><span>${icon('move', { size: 12 })} Moves</span><strong>${state.moves}</strong></div>
      <div><span>${icon('flag', { size: 12 })} Flags left</span><strong>${state.flagsLeft}</strong></div>
    </div>
  `;

  const footer = document.createElement('div');
  footer.className = 'result__actions';
  footer.innerHTML = `
    <button class="pill pill--ghost" data-modal-close type="button">Close</button>
    <button class="pill pill--primary" data-result-newgame type="button">${icon('refresh', { size: 16 })}<span>New game</span></button>
  `;

  const overlay = openModal({
    title,
    eyebrow,
    body,
    footer,
  });

  overlay.querySelector('[data-result-newgame]').addEventListener('click', () => {
    closeModal();
    handleNewGame();
  });
}

function showScoresModal() {
  const scores = getScores();

  const body = document.createElement('div');
  body.className = 'scoreboard';

  if (scores.length === 0) {
    body.innerHTML = `
      <div class="scoreboard__empty">
        <span class="scoreboard__icon">${icon('trophy', { size: 28 })}</span>
        <p>No wins yet — your fastest defuses will live here.</p>
      </div>
    `;
  } else {
    body.innerHTML = `
      <div class="scoreboard__head">
        <span>#</span><span>Mission</span><span>Time</span><span>Moves</span>
      </div>
      <ul class="scoreboard__list">
        ${scores.map((score, index) => `
          <li class="scoreboard__row scoreboard__row--rank-${index + 1}">
            <span class="scoreboard__rank">${rankBadge(index + 1)}</span>
            <span class="scoreboard__mission">
              <span class="dot dot--${score.difficulty}" aria-hidden="true"></span>
              ${DIFFICULTIES[score.difficulty]?.label || score.difficulty}
              <small>${DIFFICULTIES[score.difficulty]?.short || ''}</small>
            </span>
            <span class="scoreboard__time mono">${formatClock(score.seconds)}</span>
            <span class="scoreboard__moves">${score.moves}</span>
          </li>
        `).join('')}
      </ul>
    `;
  }

  const footer = document.createElement('div');
  footer.className = 'scoreboard__actions';
  footer.innerHTML = `
    <button class="pill pill--ghost" data-clear-scores type="button">Clear scores</button>
    <button class="pill pill--primary" data-modal-close type="button">Done</button>
  `;

  openModal({
    eyebrow: `${icon('trophy', { size: 12 })} High scores`,
    title: 'Top 10 fastest defuses',
    body,
    footer,
  });

  footer.querySelector('[data-clear-scores]').addEventListener('click', () => {
    clearScores();
    closeModal();
    flashMessage('High scores cleared.', 'info');
  });
}

function rankBadge(rank) {
  if (rank === 1) {
    return '🥇';
  }

  if (rank === 2) {
    return '🥈';
  }

  if (rank === 3) {
    return '🥉';
  }

  return rank;
}
