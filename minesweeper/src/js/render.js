import {
  CELL_STATUS,
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  GAME_STATUS,
  THEMES,
} from './constants.js';
import { getSoundStatus } from './sound.js';
import { formatClock } from './timer.js';
import { icon } from './icons.js';

const elements = {};
const cellNodes = new Map();

const CELL_FONT_MIN_PX = 8.8;
const CELL_FONT_MAX_PX = 16.8;

let popoverState = {
  trigger: null,
  onSelect: null,
};

let modalState = {
  closeHandler: null,
};

let cellFontFrame = 0;
let cellFontObserver = null;

export function createLayout() {
  document.body.innerHTML = '';

  const app = document.createElement('main');
  app.className = 'app';
  app.innerHTML = `
    <header class="brand">
      <div class="brand__mark" aria-hidden="true">
        ${icon('shield', { size: 22 })}
      </div>
      <div class="brand__text">
        <span class="brand__eyebrow">RSS / Vanilla JS</span>
        <span class="brand__title">Minesweeper</span>
      </div>
    </header>

    <section class="hero">
      <div class="hero__head">
        <span class="hero__label">${icon('spark', { size: 12 })} <span>Mission status</span></span>
      </div>
      <div class="hero__hud">
        <div class="hud-card hud-card--time">
          <span class="hud-card__label">${icon('clock', { size: 12 })} Time</span>
          <strong class="hud-card__value mono" data-stat="time">00:00</strong>
          <span class="hud-card__pulse" aria-hidden="true"></span>
        </div>
        <div class="hud-card">
          <span class="hud-card__label">${icon('move', { size: 12 })} Moves</span>
          <strong class="hud-card__value" data-stat="moves">0</strong>
        </div>
        <div class="hud-card">
          <span class="hud-card__label">${icon('flag', { size: 12 })} Flags</span>
          <strong class="hud-card__value"><span data-stat="flags">0</span><small>/<span data-stat="mines">0</span></small></strong>
        </div>
      </div>
    </section>

    <section class="toolbar" data-toolbar>
      <div class="toolbar__group" data-group="puzzle">
        <span class="toolbar__label">${icon('spark', { size: 12 })} Mission</span>
        <div class="toolbar__row" data-difficulty></div>
        <button class="pill" data-action="random" type="button">
          ${icon('shuffle', { size: 16 })}
          <span>Random</span>
        </button>
      </div>
      <div class="toolbar__group" data-group="game">
        <span class="toolbar__label">${icon('play', { size: 12 })} Match</span>
        <div class="toolbar__row">
          <button class="pill" data-action="new-game" type="button">
            ${icon('refresh', { size: 16 })}
            <span>New game</span>
          </button>
          <button class="pill" data-action="save-game" type="button">
            ${icon('save', { size: 16 })}
            <span>Save</span>
          </button>
          <button class="pill" data-action="continue-game" type="button">
            ${icon('resume', { size: 16 })}
            <span>Continue</span>
          </button>
        </div>
      </div>
      <div class="toolbar__group" data-group="more">
        <span class="toolbar__label">${icon('trophy', { size: 12 })} More</span>
        <div class="toolbar__row">
          <button class="pill" data-action="open-scores" type="button">
            ${icon('trophy', { size: 16 })}
            <span>Top 10</span>
          </button>
          <button class="pill pill--icon" data-action="toggle-theme" type="button" aria-label="Toggle theme" data-theme-button>
            ${icon('moon', { size: 16 })}
          </button>
          <button class="pill pill--icon" data-action="toggle-sound" type="button" aria-label="Toggle sound" data-sound-button>
            ${icon('volume', { size: 16 })}
          </button>
        </div>
      </div>
    </section>

    <section class="board-wrap">
      <div class="board-aura" aria-hidden="true"></div>
      <div class="board-frame">
        <div class="board" data-board></div>
      </div>
      <p class="message" data-message>Open any cell to start.</p>
    </section>

    <footer class="appfoot">
      <span class="appfoot__legend">
        <span class="dot dot--safe"></span> safe tile
        <span class="dot dot--flag"></span> flag (RMB)
        <span class="dot dot--mine"></span> mine
      </span>
      <span class="appfoot__credit">
        <span data-cheat-trigger>SkorbezhArtem</span> · <a href="https://github.com/SkorbezhArtem/minesweeper" target="_blank" rel="noreferrer">source</a>
      </span>
    </footer>
  `;

  document.body.append(app);

  elements.app = app;
  elements.toolbar = app.querySelector('[data-toolbar]');
  elements.board = app.querySelector('[data-board]');
  elements.boardWrap = app.querySelector('.board-wrap');
  elements.message = app.querySelector('[data-message]');
  elements.timeStat = app.querySelector('[data-stat="time"]');
  elements.movesStat = app.querySelector('[data-stat="moves"]');
  elements.flagsStat = app.querySelector('[data-stat="flags"]');
  elements.minesStat = app.querySelector('[data-stat="mines"]');
  elements.themeButton = app.querySelector('[data-theme-button]');
  elements.soundButton = app.querySelector('[data-sound-button]');
  elements.difficultyHost = app.querySelector('[data-difficulty]');

  observeCellFont();
}

export function bindEvents(handlers) {
  elements.board.addEventListener('click', (event) => {
    const cellButton = event.target.closest('[data-cell]');

    if (cellButton === null) {
      return;
    }

    handlers.onCellOpen(Number(cellButton.dataset.row), Number(cellButton.dataset.column));
  });

  elements.board.addEventListener('contextmenu', (event) => {
    const cellButton = event.target.closest('[data-cell]');

    if (cellButton === null) {
      return;
    }

    event.preventDefault();
    handlers.onCellFlag(Number(cellButton.dataset.row), Number(cellButton.dataset.column));
  });

  elements.app.addEventListener('click', (event) => {
    const actionElement = event.target.closest('[data-action]');

    if (actionElement === null) {
      return;
    }

    const actions = {
      'new-game': handlers.onNewGame,
      'continue-game': handlers.onContinueGame,
      'save-game': handlers.onSaveGame,
      random: handlers.onRandomGame,
      'open-scores': handlers.onOpenScores,
      'toggle-theme': handlers.onToggleTheme,
      'toggle-sound': handlers.onToggleSound,
    };

    const action = actions[actionElement.dataset.action];

    if (typeof action === 'function') {
      action();
    }
  });

  const cheatTrigger = elements.app.querySelector('[data-cheat-trigger]');

  if (cheatTrigger !== null) {
    cheatTrigger.addEventListener('dblclick', (event) => {
      event.preventDefault();
      elements.board.classList.toggle('board--cheat');
    });
  }

  renderDifficultySelect(handlers.onDifficultyChange);
}

export function renderGame(state, options = {}) {
  if (options.fresh !== false && elements.board.dataset.signature !== boardSignature(state)) {
    rebuildBoard(state);
  }

  state.board.flat().forEach((cell) => updateCell(cell, state.status));

  renderStats(state);
  renderMessage(state);
  setSelectedDifficulty(state.difficulty);
}

export function renderStats(state) {
  elements.timeStat.textContent = formatClock(state.elapsedSeconds);
  elements.movesStat.textContent = state.moves;
  elements.flagsStat.textContent = state.flagsLeft;
  elements.minesStat.textContent = state.settings.mines;
  elements.timeStat.parentElement.classList.toggle(
    'hud-card--running',
    state.status === GAME_STATUS.playing,
  );
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  elements.themeButton.innerHTML = theme === THEMES.dark
    ? icon('sun', { size: 16 })
    : icon('moon', { size: 16 });
  elements.themeButton.setAttribute(
    'aria-label',
    theme === THEMES.dark ? 'Switch to light theme' : 'Switch to dark theme',
  );
}

export function renderSoundButton() {
  const isOn = getSoundStatus();
  elements.soundButton.innerHTML = isOn ? icon('volume', { size: 16 }) : icon('mute', { size: 16 });
  elements.soundButton.setAttribute('aria-label', isOn ? 'Mute sound' : 'Enable sound');
  elements.soundButton.classList.toggle('pill--muted', !isOn);
}

export function flashMessage(text, tone = 'info') {
  const message = elements.message;
  message.textContent = text;
  message.dataset.tone = tone;
  message.classList.remove('message--in');

  // restart animation
  void message.offsetWidth;
  message.classList.add('message--in');
}

export function setBoardCelebrate(isCelebrating) {
  elements.boardWrap.classList.toggle('board-wrap--win', isCelebrating);
}

export function setBoardShake(isShaking) {
  elements.boardWrap.classList.toggle('board-wrap--lose', isShaking);
}

export function openModal({ title, eyebrow, body, footer, onClose }) {
  closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal';
  overlay.dataset.modal = '';
  overlay.innerHTML = `
    <div class="modal__panel" role="dialog" aria-modal="true">
      <button class="modal__close" data-modal-close type="button" aria-label="Close">
        ${icon('close', { size: 18 })}
      </button>
      <div class="modal__head">
        ${eyebrow ? `<p class="modal__eyebrow">${eyebrow}</p>` : ''}
        <h2 class="modal__title">${title}</h2>
      </div>
      <div class="modal__body" data-modal-body></div>
      ${footer ? `<div class="modal__footer" data-modal-footer></div>` : ''}
    </div>
  `;

  const bodyHost = overlay.querySelector('[data-modal-body]');
  const footerHost = overlay.querySelector('[data-modal-footer]');

  if (body instanceof Node) {
    bodyHost.append(body);
  } else if (typeof body === 'string') {
    bodyHost.innerHTML = body;
  }

  if (footer instanceof Node && footerHost) {
    footerHost.append(footer);
  } else if (typeof footer === 'string' && footerHost) {
    footerHost.innerHTML = footer;
  }

  document.body.append(overlay);
  document.body.classList.add('has-modal');

  // animate in
  requestAnimationFrame(() => overlay.classList.add('modal--open'));

  const close = () => closeModal();

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.closest('[data-modal-close]')) {
      close();
    }
  });

  const onKey = (event) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  document.addEventListener('keydown', onKey);

  modalState = {
    overlay,
    closeHandler: () => {
      document.removeEventListener('keydown', onKey);

      if (typeof onClose === 'function') {
        onClose();
      }
    },
  };

  return overlay;
}

export function closeModal() {
  if (!modalState.overlay) {
    return;
  }

  const overlay = modalState.overlay;
  modalState.closeHandler?.();

  overlay.classList.remove('modal--open');
  setTimeout(() => {
    overlay.remove();
    document.body.classList.remove('has-modal');
  }, 180);

  modalState = { closeHandler: null };
}

function rebuildBoard(state) {
  cellNodes.clear();
  elements.board.innerHTML = '';
  elements.board.style.setProperty('--columns', state.settings.columns);
  elements.board.dataset.size = state.difficulty;
  elements.board.dataset.signature = boardSignature(state);

  state.board.flat().forEach((cell) => {
    const button = document.createElement('button');
    button.className = 'cell';
    button.type = 'button';
    button.dataset.cell = '';
    button.dataset.row = cell.row;
    button.dataset.column = cell.column;
    button.setAttribute('aria-label', describeCell(cell));
    elements.board.append(button);
    cellNodes.set(cellKey(cell.row, cell.column), button);
  });

  updateCellFont();
}

function updateCellFont() {
  if (elements.board === undefined) {
    return;
  }

  const width = elements.board.clientWidth;
  const rawColumns = elements.board.style.getPropertyValue('--columns').trim();
  const columns = Number.parseInt(rawColumns, 10);

  if (!Number.isFinite(columns) || columns <= 0 || width <= 0) {
    return;
  }

  const px = Math.max(
    CELL_FONT_MIN_PX,
    Math.min(CELL_FONT_MAX_PX, (width / columns) * 0.5),
  );

  elements.board.style.setProperty('--cell-font', `${px}px`);
}

function observeCellFont() {
  if (typeof ResizeObserver === 'undefined' || elements.board === undefined) {
    updateCellFont();
    return;
  }

  if (cellFontObserver !== null) {
    cellFontObserver.disconnect();
  }

  cellFontObserver = new ResizeObserver(() => {
    if (cellFontFrame !== 0) {
      return;
    }

    cellFontFrame = requestAnimationFrame(() => {
      cellFontFrame = 0;
      updateCellFont();
    });
  });

  cellFontObserver.observe(elements.board);
}

function updateCell(cell, gameStatus) {
  const button = cellNodes.get(cellKey(cell.row, cell.column));

  if (button === undefined) {
    return;
  }

  button.disabled = gameStatus === GAME_STATUS.won || gameStatus === GAME_STATUS.lost;

  const previousStatus = button.dataset.status;
  const previousMines = button.dataset.mines || '';
  const previousMine = button.classList.contains('cell--mine');

  let mines = '';
  let label = '';
  let isMine = false;

  if (cell.status === CELL_STATUS.flagged) {
    label = svgFlag();
  } else if (cell.status === CELL_STATUS.opened) {
    if (cell.hasMine) {
      label = svgMine();
      isMine = true;
    } else if (cell.adjacentMines > 0) {
      label = String(cell.adjacentMines);
      mines = String(cell.adjacentMines);
    }
  }

  // diff to avoid clobbering active animations needlessly
  if (previousStatus !== cell.status || previousMines !== mines || previousMine !== isMine) {
    button.dataset.status = cell.status;

    if (mines) {
      button.dataset.mines = mines;
    } else {
      delete button.dataset.mines;
    }

    button.innerHTML = label;
    button.classList.toggle('cell--hidden', cell.status === CELL_STATUS.hidden);
    button.classList.toggle('cell--opened', cell.status === CELL_STATUS.opened && !cell.hasMine);
    button.classList.toggle('cell--flagged', cell.status === CELL_STATUS.flagged);
    button.classList.toggle('cell--mine', isMine);
    button.classList.toggle('cell--zero', cell.status === CELL_STATUS.opened && !cell.hasMine && cell.adjacentMines === 0);
    button.setAttribute('aria-label', describeCell(cell));
  }

  if (cell.hasMine) {
    button.dataset.hasMine = 'true';
  } else {
    delete button.dataset.hasMine;
  }
}

function describeCell(cell) {
  const base = `Cell row ${cell.row + 1}, column ${cell.column + 1}`;

  if (cell.status === CELL_STATUS.flagged) {
    return `${base}, flagged`;
  }

  if (cell.status === CELL_STATUS.opened) {
    if (cell.hasMine) {
      return `${base}, mine`;
    }

    if (cell.adjacentMines === 0) {
      return `${base}, empty`;
    }

    const noun = cell.adjacentMines === 1 ? 'adjacent mine' : 'adjacent mines';
    return `${base}, ${cell.adjacentMines} ${noun}`;
  }

  return `${base}, hidden`;
}

function renderMessage(state) {
  if (state.status === GAME_STATUS.idle) {
    flashMessage('Open any cell to start.', 'info');
  } else if (state.status === GAME_STATUS.playing) {
    flashMessage('Game in progress.', 'info');
  } else if (state.status === GAME_STATUS.won) {
    flashMessage(
      `Hooray! You found all mines in ${state.elapsedSeconds} seconds and ${state.moves} moves!`,
      'win',
    );
  } else if (state.status === GAME_STATUS.lost) {
    flashMessage('Game over. Try again', 'lose');
  }
}

function renderDifficultySelect(onChange) {
  const host = elements.difficultyHost;
  host.classList.add('select');
  host.innerHTML = `
    <button class="select__trigger" type="button" data-select-trigger>
      ${icon('shield', { size: 16 })}
      <span class="select__value" data-select-value>Easy</span>
      <span class="select__chevron" aria-hidden="true">${icon('chevron', { size: 14 })}</span>
    </button>
  `;

  const trigger = host.querySelector('[data-select-trigger]');
  trigger.addEventListener('click', (event) => {
    event.stopPropagation();

    if (popoverState.popover && popoverState.trigger === trigger) {
      closeSelectPopover();
      return;
    }

    openSelectPopover({
      trigger,
      options: DIFFICULTY_ORDER.map((value) => ({
        value,
        label: DIFFICULTIES[value].label,
        summary: DIFFICULTIES[value].summary,
      })),
      selected: host.dataset.value || 'easy',
      onSelect: (value) => onChange(value),
    });
  });
}

function setSelectedDifficulty(value) {
  const host = elements.difficultyHost;
  host.dataset.value = value;
  host.querySelector('[data-select-value]').textContent = DIFFICULTIES[value].label;
}

function openSelectPopover({ trigger, options, selected, onSelect }) {
  closeSelectPopover();

  const popover = document.createElement('div');
  popover.className = 'popover';
  popover.dataset.popover = '';
  popover.innerHTML = options.map((option) => `
    <button class="popover__option ${option.value === selected ? 'popover__option--active' : ''}" type="button" data-option="${option.value}">
      <span class="popover__check" aria-hidden="true">${icon('check', { size: 14 })}</span>
      <span class="popover__copy">
        <strong>${option.label}</strong>
        <small>${option.summary || ''}</small>
      </span>
    </button>
  `).join('');

  document.body.append(popover);
  document.body.classList.add('has-popover');
  positionPopover(popover, trigger);

  popoverState = {
    trigger,
    onSelect,
    popover,
    onResize: () => positionPopover(popover, trigger),
    onDocClick: (event) => {
      if (!popover.contains(event.target) && !trigger.contains(event.target)) {
        closeSelectPopover();
      }
    },
    onKey: (event) => {
      if (event.key === 'Escape') {
        closeSelectPopover();
      }
    },
  };

  popover.addEventListener('click', (event) => {
    const option = event.target.closest('[data-option]');

    if (option === null) {
      return;
    }

    const value = option.dataset.option;
    closeSelectPopover();
    onSelect(value);
  });

  window.addEventListener('resize', popoverState.onResize);
  window.addEventListener('scroll', popoverState.onResize, true);
  document.addEventListener('click', popoverState.onDocClick);
  document.addEventListener('keydown', popoverState.onKey);

  trigger.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => popover.classList.add('popover--open'));
}

function closeSelectPopover() {
  if (!popoverState.popover) {
    return;
  }

  const { popover, trigger } = popoverState;
  popover.classList.remove('popover--open');
  trigger.setAttribute('aria-expanded', 'false');

  window.removeEventListener('resize', popoverState.onResize);
  window.removeEventListener('scroll', popoverState.onResize, true);
  document.removeEventListener('click', popoverState.onDocClick);
  document.removeEventListener('keydown', popoverState.onKey);

  setTimeout(() => {
    popover.remove();
    document.body.classList.remove('has-popover');
  }, 160);

  popoverState = { trigger: null, onSelect: null };
}

function positionPopover(popover, trigger) {
  const rect = trigger.getBoundingClientRect();
  const padding = 8;
  popover.style.minWidth = `${Math.max(220, rect.width)}px`;
  // measure
  popover.style.visibility = 'hidden';
  popover.style.left = '0';
  popover.style.top = '0';
  const pop = popover.getBoundingClientRect();
  let top = rect.bottom + padding;
  let left = rect.left;

  if (top + pop.height > window.innerHeight - 8) {
    top = rect.top - padding - pop.height;
  }

  if (left + pop.width > window.innerWidth - 8) {
    left = window.innerWidth - 8 - pop.width;
  }

  if (left < 8) {
    left = 8;
  }

  popover.style.left = `${Math.max(8, left)}px`;
  popover.style.top = `${Math.max(8, top)}px`;
  popover.style.visibility = 'visible';
}

function svgFlag() {
  return `<span class="cell__icon cell__icon--flag">${icon('flag', { size: 16, stroke: 2.4 })}</span>`;
}

function svgMine() {
  return `<span class="cell__icon cell__icon--mine">${icon('bomb', { size: 16, stroke: 2.4 })}</span>`;
}

function boardSignature(state) {
  return `${state.difficulty}-${state.settings.rows}x${state.settings.columns}`;
}

function cellKey(row, column) {
  return `${row}:${column}`;
}
