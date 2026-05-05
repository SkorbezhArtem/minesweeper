import { initGame } from './game.js';

initGame();

let resizeFrame = 0;
let resizeIdleTimer = 0;

window.addEventListener('resize', () => {
  if (resizeFrame === 0) {
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      document.body.classList.add('is-resizing');
    });
  }

  clearTimeout(resizeIdleTimer);
  resizeIdleTimer = setTimeout(() => {
    document.body.classList.remove('is-resizing');
  }, 160);
}, { passive: true });
