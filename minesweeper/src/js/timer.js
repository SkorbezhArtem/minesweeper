let timerId = null;

export function startTimer(onTick) {
  stopTimer();
  timerId = setInterval(onTick, 1000);
}

export function stopTimer() {
  if (timerId === null) {
    return;
  }

  clearInterval(timerId);
  timerId = null;
}

export function formatClock(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(value) {
  return String(value).padStart(2, '0');
}
