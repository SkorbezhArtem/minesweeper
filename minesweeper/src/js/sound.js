import { getSavedSound, saveSound } from './storage.js';

let audioContext = null;
let isSoundEnabled = getSavedSound();

const SOUND_CONFIG = {
  reveal: { frequency: 540, duration: 0.06, type: 'sine', gain: 0.07 },
  flag: { frequency: 380, duration: 0.06, type: 'square', gain: 0.06 },
  unflag: { frequency: 280, duration: 0.05, type: 'square', gain: 0.05 },
  win: { frequency: 760, duration: 0.18, type: 'triangle', gain: 0.09 },
  lose: { frequency: 110, duration: 0.32, type: 'sawtooth', gain: 0.09 },
};

export function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  saveSound(isSoundEnabled);
  return isSoundEnabled;
}

export function getSoundStatus() {
  return isSoundEnabled;
}

export function playSound(soundName) {
  if (!isSoundEnabled || !SOUND_CONFIG[soundName]) {
    return;
  }

  if (audioContext === null) {
    audioContext = new AudioContext();
  }

  const {
    frequency,
    duration,
    type,
    gain,
  } = SOUND_CONFIG[soundName];
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = gain;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}
