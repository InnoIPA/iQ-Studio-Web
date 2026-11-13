// iQ-Studio shared design tokens — single source for all pages.
// Edit HERE; every page (Home, Get Started, Design System) reads this file.
window.IQ_TOKENS = {
  // Accent palettes (user-selectable primary colour)
  PALETTES: [
    { id: 'blue', name: 'Blue', ac: '#4c92ff', soft: '#8cc4ff', bg: '#1a6dff' },
    { id: 'sky', name: 'Sky', ac: '#38bdf8', soft: '#7dd3fc', bg: '#0284c7' },
    { id: 'cyan', name: 'Cyan', ac: '#22d3ee', soft: '#67e8f9', bg: '#0891b2' },
    { id: 'indigo', name: 'Indigo', ac: '#818cf8', soft: '#a5b4fc', bg: '#4f46e5' },
    { id: 'violet', name: 'Violet', ac: '#a78bfa', soft: '#c4b5fd', bg: '#7c3aed' }
  ],
  // Core theme tokens shared by every page (page THEMES may add keys, never override these)
  // Core theme tokens — the VALUES live in iq-tokens.css as CSS custom properties;
  // these entries just point at them. Non-colour bits (knob, label) stay per theme.
  CORE: {
    dark: {
      fg: 'var(--core-fg)', fgMuted: 'var(--core-fg-muted)', line: 'var(--core-line)',
      menuBg: 'var(--core-menu-bg)',
      navBg: 'var(--core-nav-bg)', navPillBg: 'var(--core-nav-pill)', navPillHover: 'var(--core-nav-pill-hover)',
      switchTrack: 'var(--acBg)', knobX: '14px', themeLabel: 'dark'
    },
    light: {
      fg: 'var(--core-fg)', fgMuted: 'var(--core-fg-muted)', line: 'var(--core-line)',
      menuBg: 'var(--core-menu-bg)',
      navBg: 'var(--core-nav-bg)', navPillBg: 'var(--core-nav-pill)', navPillHover: 'var(--core-nav-pill-hover)',
      switchTrack: 'rgba(16,24,48,.26)', knobX: '0px', themeLabel: 'light'
    }
  }
};
