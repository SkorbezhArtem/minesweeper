import { CELL_STATUS } from './constants.js';

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export function createCell(row, column) {
  return {
    row,
    column,
    status: CELL_STATUS.hidden,
    hasMine: false,
    adjacentMines: 0,
  };
}

export function createBoard(rows, columns) {
  return Array.from({ length: rows }, (_, row) => (
    Array.from({ length: columns }, (_, column) => createCell(row, column))
  ));
}

export function isInsideBoard(board, row, column) {
  return row >= 0
    && row < board.length
    && column >= 0
    && column < board[0].length;
}

export function getNeighborCells(board, row, column) {
  return DIRECTIONS
    .map(([rowOffset, columnOffset]) => ({
      row: row + rowOffset,
      column: column + columnOffset,
    }))
    .filter((position) => isInsideBoard(board, position.row, position.column))
    .map((position) => board[position.row][position.column]);
}

export function placeMines(board, minesCount, safeRow, safeColumn) {
  const availableCells = board
    .flat()
    .filter((cell) => cell.row !== safeRow || cell.column !== safeColumn);

  const shuffledCells = shuffleCells(availableCells);

  shuffledCells.slice(0, minesCount).forEach((cell) => {
    cell.hasMine = true;
  });
}

function shuffleCells(cells) {
  const shuffledCells = [...cells];

  for (let index = shuffledCells.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledCells[index], shuffledCells[randomIndex]] = [shuffledCells[randomIndex], shuffledCells[index]];
  }

  return shuffledCells;
}

export function calculateAdjacentMines(board) {
  board.flat().forEach((cell) => {
    cell.adjacentMines = getNeighborCells(board, cell.row, cell.column)
      .filter((neighbor) => neighbor.hasMine)
      .length;
  });
}

export function prepareBoardForFirstMove(board, minesCount, safeRow, safeColumn) {
  placeMines(board, minesCount, safeRow, safeColumn);
  calculateAdjacentMines(board);
}

export function openCell(board, startCell) {
  const cellsToOpen = [startCell];
  const openedCells = [];
  let removedFlags = 0;

  while (cellsToOpen.length > 0) {
    const cell = cellsToOpen.pop();

    if (cell.status === CELL_STATUS.opened) {
      continue;
    }

    if (cell.status === CELL_STATUS.flagged) {
      removedFlags += 1;
    }

    cell.status = CELL_STATUS.opened;
    openedCells.push(cell);

    if (cell.hasMine || cell.adjacentMines > 0) {
      continue;
    }

    getNeighborCells(board, cell.row, cell.column)
      .filter((neighbor) => neighbor.status !== CELL_STATUS.opened)
      .forEach((neighbor) => cellsToOpen.push(neighbor));
  }

  return {
    openedCells,
    removedFlags,
  };
}

export function toggleFlag(cell) {
  if (cell.status === CELL_STATUS.opened) {
    return 0;
  }

  if (cell.status === CELL_STATUS.flagged) {
    cell.status = CELL_STATUS.hidden;
    return 1;
  }

  cell.status = CELL_STATUS.flagged;
  return -1;
}

export function countHiddenSafeCells(board) {
  return board
    .flat()
    .filter((cell) => !cell.hasMine && cell.status !== CELL_STATUS.opened)
    .length;
}
