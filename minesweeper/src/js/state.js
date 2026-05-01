import { DEFAULT_DIFFICULTY, DIFFICULTIES, GAME_STATUS } from './constants.js';
import { createBoard } from './board.js';

export function createInitialState(difficulty = DEFAULT_DIFFICULTY) {
  const settings = DIFFICULTIES[difficulty];

  return {
    difficulty,
    settings,
    board: createBoard(settings.rows, settings.columns),
    status: GAME_STATUS.idle,
    isFirstMove: true,
    moves: 0,
    flagsLeft: settings.mines,
    elapsedSeconds: 0,
  };
}
