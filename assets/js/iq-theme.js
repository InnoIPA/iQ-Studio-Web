// iQ-Studio docs — shared theme / accent-palette logic for every docs page.
// Colour VALUES live in iq-tokens.css / iq-tokens.js; this file only wires them to a page component.
// Usage in a page:  const { t, pal } = IQ_THEME.resolve(name, this.state.pal);
//                   ...IQ_THEME.controls(this, name)   // palOpen, togglePal, pals, toggleTheme
window.IQ_THEME = (function () {
  var TOKENS = window.IQ_TOKENS || {};
  var PALETTES = TOKENS.PALETTES || [{ id: 'blue', name: 'Blue', ac: '#4c92ff', soft: '#8cc4ff', bg: '#1a6dff' }];

  var THEMES = {
    dark: {
      bg: '#080a12', panelBg: 'rgba(255,255,255,.03)', chipBg: 'color-mix(in srgb, var(--ac) 12%, transparent)',
      fg: '#eef3ff', fgMuted: 'rgba(190,203,226,.7)', line: 'rgba(255,255,255,.12)'
    },
    light: {
      bg: '#ffffff', panelBg: 'rgba(16,26,50,.03)', chipBg: 'color-mix(in srgb, var(--acBg) 10%, transparent)',
      fg: '#0d1220', fgMuted: 'rgba(45,56,80,.72)', line: 'rgba(16,26,50,.13)'
    }
  };

  // The visitor's choice (dark/light + accent colour) is remembered in the browser and shared by every page,
  // so switching pages keeps it. Storage can be blocked (private mode, file://) — then it just isn't remembered.
  var PREFS_KEY = 'iq-studio-prefs';
  function load() {
    try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch (e) { return {}; }
  }
  function save(patch) {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(Object.assign(load(), patch))); } catch (e) {}
  }
  // No saved choice yet → follow the operating-system light/dark preference.
  function systemTheme() {
    try { return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; } catch (e) { return 'dark'; }
  }
  var stored = load();
  var saved = {
    theme: stored.theme === 'dark' || stored.theme === 'light' ? stored.theme : systemTheme(),
    pal: PALETTES.some(function (p) { return p.id === stored.pal; }) ? stored.pal : 'blue'
  };

  // Page background + browser colour scheme for the given theme name.
  function apply(name) {
    var t = THEMES[name] || THEMES.dark;
    var root = document.documentElement;
    root.style.colorScheme = name === 'light' ? 'light' : 'dark';
    root.style.background = t.bg;
    root.style.setProperty('--iq-page-bg', t.bg);
    if (document.body) document.body.style.background = t.bg;
  }
  // Paint the right page colour immediately (this script loads in <head>, before the page renders),
  // so a light-theme visitor never sees a dark flash while the page boots.
  apply(saved.theme);

  // Theme tokens (page theme + shared CORE tokens) and the selected accent palette.
  function resolve(name, palId) {
    var t = Object.assign({}, THEMES[name] || THEMES.dark, (TOKENS.CORE || {})[name] || {});
    var pal = PALETTES.find(function (p) { return p.id === palId; }) || PALETTES[0];
    return { t: t, pal: pal };
  }

  // Render values + handlers for the palette dropdown and the dark/light switch.
  function controls(c, name) {
    return {
      palOpen: c.state.palOpen,
      togglePal: function () { c.setState(function (st) { return { palOpen: !st.palOpen }; }); },
      pals: PALETTES.map(function (p) {
        return {
          name: p.name, sw: p.ac, tickOp: p.id === c.state.pal ? 1 : 0,
          pick: function () { save({ pal: p.id }); c.setState({ pal: p.id, palOpen: false }); }
        };
      }),
      toggleTheme: function () {
        var next = name === 'dark' ? 'light' : 'dark';
        apply(next);
        save({ theme: next });
        c.setState({ theme: next });
      }
    };
  }

  return { PALETTES: PALETTES, THEMES: THEMES, saved: saved, save: save, apply: apply, resolve: resolve, controls: controls };
})();
