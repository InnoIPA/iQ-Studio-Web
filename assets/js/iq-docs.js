// iQ-Studio docs — behaviour shared by every docs page: scroll progress / "you are here" tracking,
// smooth jump-to-section, and all the render values for the nav, sidebar, mobile drawer, table of contents and dock.
//
// A page keeps only its own content. In its component class:
//   componentDidMount()    { IQ_DOCS.mount(this, TOC); }
//   componentWillUnmount() { IQ_DOCS.unmount(this); }
//   renderVals() { ...; return Object.assign({}, t, { ...IQ_DOCS.vals(this, { TOC, ACTIVE, SIDE, t, name, pal }), /* page values */ }); }
// where TOC = [[title, '#id', isSub], …] and ACTIVE = this page's title in the sidebar (see iq-pages.js).
window.IQ_DOCS = (function () {
  // little sparks that pop out of a table-of-contents row when the reader passes it
  function spark(el) {
    if (!el) return;
    el.style.animation = 'tocPop .5s cubic-bezier(.3,1.5,.4,1)';
    setTimeout(function () { el.style.animation = 'none'; }, 520);
    var host = document.createElement('span');
    host.style.cssText = 'position:absolute;left:-3px;top:.95em;width:1px;height:1px;pointer-events:none;z-index:3';
    var off = [[11, -7], [13, 4], [8, 10], [-6, -9], [14, -1], [4, -12]];
    off.forEach(function (o) {
      var i = document.createElement('i');
      i.style.cssText = 'position:absolute;left:-2px;top:-2px;width:4px;height:4px;border-radius:50%;background:var(--ac);opacity:0;' +
        '--tx:' + o[0] + 'px;--ty:' + o[1] + 'px;animation:tocSpark .55s ease-out forwards';
      host.appendChild(i);
    });
    el.appendChild(host);
    setTimeout(function () { host.remove(); }, 600);
  }

  // look up '#id' via getElementById — querySelector throws on ids that start with a digit (e.g. '#720p-30fps')
  function byHash(href) { return document.getElementById(String(href).replace(/^#/, '')); }

  // click handler for a table-of-contents link: eased scroll + a brief highlight on the target heading
  function goto(c, href) {
    return function (e) {
      if (e) e.preventDefault();
      var el = byHash(href);
      if (!el) return;
      var top = el.getBoundingClientRect().top + window.scrollY - 112;
      c._lockTo = href;
      c._lockUntil = Date.now() + 900;
      c._flip = !c._flip;
      c.setState({ activeSec: href });
      // rAF and native smooth scrolling are both no-ops in embedded views — tween on a timer
      var start = window.scrollY;
      var dest = Math.max(0, top);
      if (window.IQ_MOTION && window.IQ_MOTION.reduced()) { window.scrollTo(0, dest); return; }
      var t0 = Date.now();
      clearInterval(c._scrollT);
      c._scrollT = setInterval(function () {
        var u = Math.min(1, (Date.now() - t0) / 440);
        var k = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        window.scrollTo(0, Math.round(start + (dest - start) * k));
        if (u >= 1) { clearInterval(c._scrollT); window.scrollTo(0, dest); }
      }, 16);
      el.style.transition = 'none';
      el.style.background = 'color-mix(in srgb, var(--ac) 22%, transparent)';
      el.style.borderRadius = '8px';
      el.style.boxShadow = '0 0 0 6px color-mix(in srgb, var(--ac) 12%, transparent)';
      setTimeout(function () {
        el.style.transition = 'background .8s ease, box-shadow .8s ease';
        el.style.background = 'transparent';
        el.style.boxShadow = 'none';
      }, 240);
    };
  }

  function mount(c, TOC) {
    IQ_THEME.apply(c.state.theme || c.props.theme || 'dark');
    c._onScroll = function () {
      var d = document.documentElement;
      var max = d.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (!TOC.length) { if (Math.abs(p - c.state.prog) > 0.005) c.setState({ prog: p }); return; }
      // hysteresis: a section must clear the line by 12px before it takes over,
      // so a heading parked near the line cannot flip-flop on every scroll event
      var active = TOC[0][1];
      var prev = c.state.activeSec;
      TOC.forEach(function (item) {
        var el = byHash(item[1]);
        if (!el) return;
        var top = el.getBoundingClientRect().top;
        if (top <= (item[1] === prev ? 162 : 150)) active = item[1];
      });
      if (max > 0 && window.scrollY >= max - 24) active = TOC[TOC.length - 1][1];
      if (c._lockUntil && Date.now() < c._lockUntil) active = c._lockTo || active;
      if (active !== c.state.activeSec) c._flip = !c._flip;

      // ── rail playhead + spark bursts ──
      var rail = c._rail, fill = c._fill, head = c._head;
      if (rail && fill && head && rail.offsetParent !== null) {
        var links = Array.prototype.slice.call(rail.querySelectorAll('a[data-toc]'));
        var ai = TOC.findIndex(function (it) { return it[1] === active; });
        var cur = links[ai] || links[0];
        if (cur) {
          var rr = rail.getBoundingClientRect();
          var cr = cur.getBoundingClientRect();
          var y = cr.top - rr.top + cr.height / 2;
          fill.style.height = Math.max(0, y - 4) + 'px';
          head.style.top = y + 'px';
        }
        if (c._doneIx == null) c._doneIx = -1;
        if (ai > c._doneIx) {
          for (var i = Math.max(0, c._doneIx + 1); i < ai; i++) spark(links[i]);
          c._doneIx = ai;
        } else if (ai < c._doneIx) {
          c._doneIx = ai;
        }
        if (p >= 0.995 && !c._cheered) {
          c._cheered = true;
          head.style.animation = 'tocCheer .7s cubic-bezier(.3,1.5,.5,1)';
          setTimeout(function () { head.style.animation = 'tocSpin 6s linear infinite'; }, 760);
        }
      }
      if (Math.abs(p - c.state.prog) > 0.005 || active !== c.state.activeSec) c.setState({ prog: p, activeSec: active });
    };
    window.addEventListener('scroll', c._onScroll, { passive: true });
    c._onScroll();
  }

  function unmount(c) {
    window.removeEventListener('scroll', c._onScroll);
    clearInterval(c._scrollT);
  }

  // Render values for the shared page chrome (nav, sidebar, drawer, TOC rail, dock).
  function vals(c, o) {
    var TOC = o.TOC, ACTIVE = o.ACTIVE, SIDE = o.SIDE, t = o.t, name = o.name, pal = o.pal;
    var st = c.state;
    return Object.assign({
      navOpen: st.navOpen,
      navToggle: function () { c.setState({ navOpen: !c.state.navOpen }); },
      navClose: function () { c.setState({ navOpen: false }); },
      sideOpen: st.sideOpen,
      sideToggle: function () { c.setState({ sideOpen: !c.state.sideOpen }); },
      sideClose: function () { c.setState({ sideOpen: false }); },
      drawerX: st.sideOpen ? 'translateX(0)' : 'translateX(-102%)',
      scrimOp: st.sideOpen ? 1 : 0,
      scrimPe: st.sideOpen ? 'auto' : 'none',
      ac: pal.ac, acSoft: pal.soft, acBg: pal.bg,
      isDark: name === 'dark', isLight: name === 'light', themeName: name,
      railRef: function (el) { c._rail = el; },
      fillRef: function (el) { c._fill = el; },
      headRef: function (el) { c._head = el; },
      tocShow: TOC.length ? 'flex' : 'none',
      tocCol: TOC.length ? '220px' : '0px',
      tocPct: Math.round(st.prog * 100) + '%',
      tocDash: (40.8 * (1 - st.prog)).toFixed(1)
    }, IQ_THEME.controls(c, name), {
      sideGroups: SIDE.map(function (g) {
        return {
          name: g.name,
          pages: g.pages.map(function (pg) {
            var p = pg[0], href = pg[1];
            var soon = href === '#';
            return {
              name: p, href: soon ? undefined : IQ_PAGES.url(href),
              bg: p === ACTIVE ? 'color-mix(in srgb, var(--acBg) 14%, transparent)' : 'transparent',
              fg: p === ACTIVE ? 'var(--ac)' : t.fgMuted,
              edge: p === ACTIVE ? 'var(--ac)' : 'transparent',
              dotOp: p === ACTIVE ? 1 : 0,
              soon: soon ? 'true' : 'false',
              pending: soon,
              op: soon ? 0.5 : 1,
              pe: soon ? 'none' : 'auto',
              soonOp: soon ? 1 : 0
            };
          })
        };
      }),
      railPct: Math.round(st.prog * 100) + '%',
      railTop: (st.prog * 100).toFixed(2) + '%',
      dockEnter: function () { c.setState({ dockOpen: true }); },
      dockLeave: function () { var r = document.querySelector('.qs-reelbox'); if (r) r.scrollTop = 0; c.setState({ dockOpen: false }); },
      dockH: st.dockOpen ? (TOC.length * 36) + 'px' : '36px',
      dockOv: st.dockOpen ? 'auto' : 'hidden',
      dockTrH: st.dockOpen ? 'height .4s cubic-bezier(.2,1,.3,1)' : 'none',
      dockTrS: st.dockOpen ? 'transform .55s cubic-bezier(.28,1.35,.35,1)' : 'none',
      dockBg: st.dockOpen ? 'color-mix(in srgb, ' + t.fg + ' 5%, ' + t.bg + ')' : 'color-mix(in srgb, ' + t.bg + ' 82%, transparent)',
      dockHl: st.dockOpen ? 0 : 1,
      dockShift: st.dockOpen ? 'none' : 'translateY(' + (-Math.max(0, TOC.findIndex(function (x) { return x[1] === st.activeSec; })) * 36) + 'px)',
      railNum: String(Math.max(0, TOC.findIndex(function (x) { return x[1] === st.activeSec; })) + 1).padStart(2, '0'),
      railTotal: String(TOC.length).padStart(2, '0'),
      railSegs: TOC.filter(function (x) { return !x[2]; }).map(function (x, i) {
        var ai = TOC.filter(function (y) { return !y[2]; }).findIndex(function (y) { return y[1] === st.activeSec; });
        var cur = ai < 0 ? -1 : ai;
        var done = i < cur, on = i === cur;
        return {
          bg: on ? 'var(--ac)' : done ? 'color-mix(in srgb, var(--ac) 45%, transparent)' : t.line,
          glow: on ? '0 0 8px color-mix(in srgb, var(--ac) 70%, transparent)' : 'none',
          sy: on ? 1.6 : 1
        };
      }),
      railItems: TOC.map(function (item, i) {
        var nm = item[0], href = item[1], sub = item[2];
        var on = st.activeSec === href;
        var ai = Math.max(0, TOC.findIndex(function (x) { return x[1] === st.activeSec; }));
        return {
          name: nm, href: href,
          num: sub ? '·' : String(TOC.slice(0, i + 1).filter(function (x) { return !x[2]; }).length).padStart(2, '0'),
          numFg: on ? 'var(--ac)' : t.fgFaint,
          numOp: on ? 1 : 0.7,
          rowFg: on ? 'var(--ac)' : t.fgMuted,
          rowOp: st.dockOpen ? (on ? 1 : 0.72) : on ? 1 : 0.3,
          rowFw: on ? 650 : 500,
          rowBlur: st.dockOpen ? 'none' : on ? 'none' : 'blur(.5px)',
          rowDx: st.dockOpen ? '0px' : on ? '0px' : (Math.min(3, Math.abs(i - ai)) * 2) + 'px',
          delay: st.dockOpen ? '0ms' : Math.min(140, Math.abs(i - ai) * 22) + 'ms'
        };
      }),
      tocItems: TOC.map(function (item) {
        var nm = item[0], href = item[1], sub = item[2];
        var on = st.activeSec === href;
        return {
          name: nm, href: href, go: goto(c, href), pad: (sub ? 26 : 14) + 'px',
          dim: on ? 1 : 0.72,
          rowBg: on ? 'color-mix(in srgb, var(--ac) 12%, transparent)' : 'transparent',
          shift: on ? '3px' : '0px',
          weight: on ? 600 : 400,
          edge: t.line, barH: on ? '18px' : '0px', anim: on ? (c._flip ? 'tocJellyA' : 'tocJellyB') + ' .6s cubic-bezier(.3,1.6,.4,1)' : 'none', fg: on ? 'var(--ac)' : t.fgMuted, dotOp: on ? 1 : 0
        };
      })
    });
  }

  // GA4 via GTM dataLayer: every link click on docs/benchmarks pages (sidebar, TOC, content, nav, footer).
  document.addEventListener('click', function (e) {
    try {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href === '#' || href.indexOf('javascript:') === 0) return;
      var area = a.closest('.docs-side') || a.hasAttribute('data-toc') ? (a.hasAttribute('data-toc') ? 'toc' : 'sidebar')
        : a.closest('footer') ? 'footer' : a.closest('nav, header') ? 'nav' : 'content';
      (window.dataLayer = window.dataLayer || []).push({
        event: 'docs_link_click',
        link_text: (a.textContent || a.getAttribute('aria-label') || '').replace(/s+/g, ' ').trim().slice(0, 80),
        link_url: a.href, link_path: a.pathname + (a.hash || ''), link_external: a.hostname !== location.hostname,
        link_area: area, page_path: location.pathname, page_title: document.title
      });
    } catch (err) {}
  }, true);

  return { mount: mount, unmount: unmount, vals: vals, goto: goto, spark: spark };
})();
