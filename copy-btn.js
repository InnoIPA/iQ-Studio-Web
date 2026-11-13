// iQ-Studio shared "copy to clipboard" button — the single source for every docs page.
// Markup:  <span class="iq-copy" onClick="{{ cb.copy }}"><svg …/></span>
// Logic:   copy: IQ_COPY.make(text)
// Look:    .iq-copy / .iq-copy.is-copied in iq-tokens.css (colour token: --core-copied)
(function () {
  var FEEDBACK_MS = 1600; // "Copied!" / "Copy failed" stays this long
  var timers = new WeakMap();
  var lastBtn = null;

  // resolves true when the text really reached the clipboard, false otherwise
  function fallback(text) {
    var ok = false;
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      ok = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
    return ok;
  }

  function write(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(text); });
      }
    } catch (e) {}
    return Promise.resolve(fallback(text));
  }

  function flash(btn, ok) {
    if (!btn) return;
    var good = ok !== false;
    btn.classList.remove(good ? 'is-failed' : 'is-copied');
    btn.classList.add(good ? 'is-copied' : 'is-failed');
    clearTimeout(timers.get(btn));
    timers.set(btn, setTimeout(function () { btn.classList.remove('is-copied', 'is-failed'); }, FEEDBACK_MS));
  }

  // Remember which button was clicked, in case the framework's event has no usable currentTarget.
  document.addEventListener('click', function (e) {
    var t = e.target;
    lastBtn = t && t.closest ? t.closest('.iq-copy') : null;
  }, true);

  window.IQ_COPY = {
    make: function (text) {
      return function (e) {
        var el = e && e.currentTarget && e.currentTarget.classList ? e.currentTarget : lastBtn;
        write(text).then(function (ok) { flash(el, ok); });
      };
    },
    write: write,
    flash: flash
  };
})();
