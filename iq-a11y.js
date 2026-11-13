// iQ-Studio — shared accessibility layer, loaded by every page.
//   1. Keyboard focus ring (:focus-visible) for links, buttons and the click targets below.
//   2. prefers-reduced-motion: switches animations / transitions / smooth scrolling off.
//   3. Click targets that are <span>/<div> with a pointer cursor (theme toggle, accent picker, menu, copy buttons,
//      cards, tabs …) get role="button", tabindex="0" and Enter / Space activation, so keyboard and
//      screen-reader users can use them. Real <a>, <button> and <input> elements are left alone.
(function () {
  var css =
    ':where(a, button, input, textarea, select, summary, [role="button"], [tabindex]):focus-visible {' +
    '  outline: 2px solid var(--ac, #4c92ff); outline-offset: 3px; border-radius: 6px; }' +
    '[role="button"]:focus-visible { outline-offset: 2px; }' +
    'input:focus-visible { outline-offset: 0; }' +
    '@media (prefers-reduced-motion: reduce) {' +
    '  *, *::before, *::after { animation-duration: .001ms !important; animation-delay: 0s !important; animation-iteration-count: 1 !important;' +
    '    transition-duration: .001ms !important; transition-delay: 0s !important; scroll-behavior: auto !important; }' +
    '}';
  var st = document.createElement('style');
  st.setAttribute('data-iq-a11y', '');
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  window.IQ_MOTION = {
    reduced: function () {
      try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
    }
  };

  // what counts as a click target: the shared classes + anything styled with an inline pointer cursor
  var SEL = '.iq-roundbtn, .iq-copy, .iq-pal__item, .iq-search, .gs-search, [style*="cursor:pointer"], [style*="cursor: pointer"]';
  var LABELS = { 'iq-copy': 'Copy code', 'iq-search': 'Search docs', 'gs-search': 'Search docs' };

  function label(el) {
    if (el.hasAttribute('aria-label') || (el.textContent || '').trim()) return;
    for (var k in LABELS) if (el.classList.contains(k)) { el.setAttribute('aria-label', LABELS[k]); return; }
  }

  function enhance(root) {
    var list = (root.querySelectorAll ? root.querySelectorAll(SEL) : []);
    for (var i = 0; i < list.length; i++) {
      var el = list[i], tag = el.tagName;
      if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'SUMMARY') continue;
      if (el.closest('a, button')) continue;
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      label(el);
    }
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    (window.requestAnimationFrame || setTimeout)(function () { queued = false; enhance(document); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var el = e.target;
    if (!el || !el.getAttribute || el.getAttribute('role') !== 'button') return;
    var tag = el.tagName;
    if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
    el.click();
  });

  function init() {
    enhance(document);
    if (window.MutationObserver) new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
