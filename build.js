// iQ-Studio docs — keeps the shared page parts (shared/*.html) in sync across every page.
//
//   node build.js          copy shared/<name>.html into every page's  <!-- @shared:<name> --> … <!-- @end:<name> -->  block
//   node build.js --check  only report pages that are out of date (exit 1 if any), changes nothing
//
// Edit a part ONCE in shared/, run `node build.js`, and all pages are updated. Pages stay complete,
// self-contained files — nothing is loaded at runtime, so double-click / file:// / any web host all work.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SHARED = path.join(ROOT, 'shared');
const CHECK = process.argv.includes('--check');

const parts = {};
for (const f of fs.readdirSync(SHARED).filter(f => f.endsWith('.html'))) {
  parts[f.replace(/\.html$/, '')] = fs.readFileSync(path.join(SHARED, f), 'utf8').replace(/\s+$/, '');
}

// The shared nav marks "Docs" as the current page; pages outside the docs say which item is theirs instead.
const NAV_CURRENT = {
  'iQ-Studio Home A Datasheet.dc.html': 'Home',
  'iQ-Studio Get Started.dc.html': 'Get Started',
  'iQ-Studio Benchmarks.dc.html': 'Benchmarks',
  'iQ-Studio Architecture.dc.html': 'Architecture',
  'iQ-Studio In the News.dc.html': 'In the News'
};
function forPage(file, name, text) {
  const cur = NAV_CURRENT[file];
  if (name !== 'nav' || !cur) return text;
  const docs = /<a class="iq-nav__link--current" href="([^"]*)" aria-current="page">Docs<\/a>/;
  const item = new RegExp('<a class="iq-nav__link" href="([^"]*)">' + cur + '</a>');
  if (!docs.test(text) || !item.test(text)) throw new Error(file + ': cannot mark nav item "' + cur + '" as current');
  return text.replace(docs, '<a class="iq-nav__link" href="$1">Docs</a>').replace(item, '<a class="iq-nav__link--current" href="$1" aria-current="page">' + cur + '</a>');
}

const pages = fs.readdirSync(ROOT).filter(f => /^iQ-Studio .*\.dc\.html$/.test(f));
const BLOCK = /([ \t]*)<!-- @shared:([\w-]+) -->\n[\s\S]*?\n[ \t]*<!-- @end:\2 -->/g;
let stale = 0, changed = 0;

for (const f of pages) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const out = src.replace(BLOCK, (all, indent, name) => {
    if (!(name in parts)) throw new Error(f + ': unknown shared part "' + name + '" (no shared/' + name + '.html)');
    return indent + '<!-- @shared:' + name + ' -->\n' + forPage(f, name, parts[name]) + '\n' + indent + '<!-- @end:' + name + ' -->';
  });
  if (out !== src) {
    if (CHECK) { stale++; console.log('out of date:', f); }
    else { fs.writeFileSync(path.join(ROOT, f), out); changed++; console.log('updated:', f); }
  }
}
// ── iQ-Studio architecture diagram on the home page: regenerate it from iq-family-data.js (the same data the Architecture page reads) ──
const vm = require('vm');
const familyWin = {};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'iq-family-data.js'), 'utf8'), { window: familyWin });

function familyHtml(F) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const live = F.entities.filter((e) => !e.deprecated && (e.status === 'supported' || e.status === 'planned') && e.evidence && e.evidence.length);
  const byId = new Map(live.map((e) => [e.id, e]));
  const kids = (e) => live.filter((c) => c.parent === e.id && c.display !== 'tag');
  const planned = (e) => { for (let x = e; x; x = byId.get(x.parent)) if (x.status === 'planned') return true; return false; };
  const ext = (h) => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : '');

  const tile = (e, card) => {
    const cls = ['fam-tile', planned(e) ? 'plan' : '', card.provider === 'qualcomm' ? 'ext' : '', e.badge === 'live' ? 'live' : ''].filter(Boolean).join(' ');
    return e.href ? `<a class="${cls}" href="${e.href}"${ext(e.href)}>${esc(e.name)}</a>` : `<span class="${cls}">${esc(e.name)}</span>`;
  };

  const card = (e) => {
    const cls = ['fam-blk', e.accent ? 'entry' : '', planned(e) ? 'plan' : '', e.provider === 'qualcomm' ? 'ext' : '', e.layout === 'inline' ? 'inline' : ''].filter(Boolean).join(' ');
    const ttl = e.href ? `<a class="fam-ttl" href="${e.href}"${ext(e.href)}>${esc(e.name)}</a>` : `<span class="fam-ttl">${esc(e.name)}</span>`;
    const tags = e.tags && e.tags.length ? `<div class="fam-tags">${e.tags.map((t) => `<span class="fam-tag">${esc(t)}</span>`).join('')}</div>` : '';
    const groups = new Map();
    kids(e).forEach((c) => { const g = c.group || ''; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(c); });
    let h = `<div class="${cls}" style="flex:${e.flex || 1} 1 220px">\n`;
    h += `  <div class="fam-hd"><div>${ttl}${e.subtitle ? `<div class="fam-dsc">${esc(e.subtitle)}</div>` : ''}</div>${tags}</div>\n  <div class="fam-secs">\n`;
    groups.forEach((list, label) => {
      h += `    <div class="fam-sec">${label ? `<div class="fam-grp">${esc(label)}</div>` : ''}<div class="fam-tiles">${list.map((c) => tile(c, e)).join('')}</div></div>\n`;
    });
    return h + '  </div>\n</div>';
  };

  let out = '      <div class="fam">\n        <div class="fam-key"><label class="fam-switch"><input type="checkbox"><span class="fam-sw" aria-hidden="true"></span>Built by Innodisk</label><span><i class="ext"></i>Qualcomm</span><span><i></i>Supported</span><span><i class="plan"></i>Planned</span></div>\n';
  F.layers.forEach((layer, i) => {
    const tops = live.filter((e) => e.layer === layer.id && !e.parent);
    if (!tops.length) return;
    const bands = tops.filter((e) => e.placement === 'base_band');
    const cards = tops.filter((e) => e.placement !== 'base_band');
    let body;
    if (cards.length === 1 && cards[0].hide_title) {
      body = `<div class="fam-body"><div class="fam-line">\n            <div class="fam-blk fam-hw">\n${kids(cards[0]).map((c) => '              ' + tile(c, cards[0])).join('\n')}\n            </div>\n          </div></div>`;
    } else {
      body = `<div class="fam-body">\n            <div class="fam-line">\n${cards.map(card).join('\n').replace(/^/gm, '              ')}\n            </div>\n`
        + bands.map((b) => `            <a class="fam-band" href="${b.href}"${ext(b.href)}>${esc(b.name)}</a>\n`).join('') + '          </div>';
    }
    out += `        <div class="fam-row fam-rise">\n          <span class="fam-lbl">${esc(layer.label)}</span>\n          ${body}\n        </div>\n${i < F.layers.length - 1 ? '\n' : ''}`;
  });
  return out.replace(/\n\n$/, '\n') + '      </div>';
}

{
  const FAMILY_BLOCK = /([ \t]*)<!-- @family -->\n[\s\S]*?\n[ \t]*<!-- @end:family -->/;
  const file = 'iQ-Studio Home A Datasheet.dc.html';
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (!FAMILY_BLOCK.test(src)) throw new Error(file + ': missing <!-- @family --> block');
  const out = src.replace(FAMILY_BLOCK, (all, indent) => indent + '<!-- @family -->\n' + familyHtml(familyWin.IQ_FAMILY) + '\n' + indent + '<!-- @end:family -->');
  if (out !== src) {
    if (CHECK) { stale++; console.log('out of date:', file, '(architecture diagram)'); }
    else { fs.writeFileSync(path.join(ROOT, file), out); changed++; console.log('updated:', file, '(architecture diagram)'); }
  }
}

// ── search index: docs-search.js lists every page + its sections; rebuild it from iq-pages.js and each page's TOC ──
const win = {};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'iq-pages.js'), 'utf8'), { window: win });
const INDEX = [];
for (const g of win.IQ_PAGES.SIDE) {
  for (const [title, file] of g.pages) {
    if (file === '#') continue;
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const m = src.match(/^const TOC = (\[[\s\S]*?\n\]);/m);
    const toc = m ? vm.runInNewContext(m[1]) : [];
    INDEX.push({ f: file, title, group: g.name, secs: toc.map(t => [t[0], t[1]]) });
  }
}
const SEARCH = path.join(ROOT, 'docs-search.js');
const sSrc = fs.readFileSync(SEARCH, 'utf8');
const sOut = sSrc.replace(/^  var INDEX = .*;$/m, () => '  var INDEX = ' + JSON.stringify(INDEX) + ';');
if (sOut !== sSrc) {
  if (CHECK) { stale++; console.log('out of date: docs-search.js (search index)'); }
  else { fs.writeFileSync(SEARCH, sOut); changed++; console.log('updated: docs-search.js (search index)'); }
}

if (CHECK) { console.log(stale ? stale + ' file(s) out of date — run: node build.js' : 'all up to date'); process.exit(stale ? 1 : 0); }
console.log(changed ? changed + ' file(s) updated' : 'everything already up to date');
