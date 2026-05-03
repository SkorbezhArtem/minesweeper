const ICONS = {
  bomb: '<circle cx="11" cy="13" r="6"/><path d="M14.5 8 17 5.5"/><path d="M17 5h2v2"/><path d="M16.5 8.5 18 7"/><circle cx="6" cy="14" r="0.6" fill="currentColor"/>',
  flag: '<path d="M4 21v-7"/><path d="M4 4h11l-1.5 4L15 12H4"/>',
  play: '<polygon points="6 4 20 12 6 20 6 4"/>',
  refresh: '<path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  resume: '<polygon points="5 3 19 12 5 21 5 3"/>',
  shuffle: '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>',
  bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c1 .9 1 1.8 1 3.3h6c0-1.5 0-2.4 1-3.3A7 7 0 0 0 12 2z"/>',
  trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 4H4v3a4 4 0 0 0 4 4"/><path d="M17 4h3v3a4 4 0 0 1-4 4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.9 19.1l1.4-1.4"/><path d="M17.7 6.3l1.4-1.4"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/>',
  mute: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>',
  close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  chevron: '<polyline points="6 9 12 15 18 9"/>',
  check: '<polyline points="4 12 10 18 20 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
  move: '<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>',
  spark: '<path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M5 5l3 3"/><path d="M16 16l3 3"/><path d="M5 19l3-3"/><path d="M16 8l3-3"/>',
  medal: '<circle cx="12" cy="14" r="6"/><path d="M8 14l-3-9h14l-3 9"/>',
  shield: '<path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/>',
};

export function icon(name, options = {}) {
  const inner = ICONS[name];

  if (inner === undefined) {
    return '';
  }

  const size = options.size || 18;
  const stroke = options.stroke || 2;
  const className = options.className ? ` class="${options.className}"` : '';

  return `<svg${className} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
