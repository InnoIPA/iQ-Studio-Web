(function () {
  // Matches the design-system Code window palette
  var C = {
    comment: '#7f95c4',
    str: '#a5e8b0',
    num: '#a5e8b0',
    kw: '#c792ea',
    vari: '#82aaff',
    flag: '#f0a868',
    fn: '#dbe6ff',
    punct: '#dbe6ff',
    prompt: '#7f95c4'
  };
  var KW = new RegExp('\\b(' + [
    // shell
    'if','then','else','elif','fi','for','while','do','done','in','case','esac','function','return','export','source','local','set','unset',
    'sudo','cd','ls','cp','mv','rm','mkdir','cat','echo','curl','wget','git','python','python3','pip','pip3','vim','nano','chmod','chown','tar','unzip','sh','bash',
    // powershell
    'ForEach-Object','Get-Content','Get-FileHash','Get-ChildItem','Set-Content','Write-Host','Where-Object','Select-Object','param','TrimStart','TrimEnd',
    // python
    'import','from','as','def','class','print','with','try','except','finally','raise','lambda','yield','and','or','not','is','None','True','False','self','await','async'
  ].join('|') + ')\\b');

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function span(color, text) {
    return '<span style="color:' + color + '">' + esc(text) + '</span>';
  }

  // token regex: strings | comments(rest of line) | variables | numbers | flags | words
  var RE = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(#.*$|\/\/.*$)|(\$\{[^}]*\}|\$[A-Za-z_][\w]*|\$[0-9*@#?]|%\w+%)|(\b\d+(?:\.\d+)?\b)|(\s--?[A-Za-z][\w-]*)|([A-Za-z_][\w-]*)/g;

  function hlLine(line) {
    // whole-line comment
    if (/^\s*(#|\/\/)/.test(line) && !/^#!\//.test(line)) return span(C.comment, line);
    var out = '', last = 0, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(line)) !== null) {
      if (m.index > last) out += esc(line.slice(last, m.index));
      if (m[1]) out += span(C.str, m[1]);
      else if (m[2]) out += span(C.comment, m[2]);
      else if (m[3]) out += span(C.vari, m[3]);
      else if (m[4]) out += span(C.num, m[4]);
      else if (m[5]) out += span(C.flag, m[5]);
      else if (m[6]) {
        var w = m[6];
        if (KW.test(w)) out += span(C.kw, w);
        else {
          // function-call name if followed by '('
          var after = line.slice(m.index + w.length);
          if (/^\s*\(/.test(after)) out += span(C.fn, w);
          else out += esc(w);
        }
      }
      last = m.index + m[0].length;
    }
    if (last < line.length) out += esc(line.slice(last));
    // dim a leading shell prompt "$ " or "PS> "
    out = out.replace(/^(\s*)(\$|PS[^&]*&gt;|#)(\s)/, function (_, a, p, b) {
      return a + '<span style="color:' + C.prompt + '">' + p + '</span>' + b;
    });
    return out;
  }

  function highlight(raw) {
    return raw.replace(/\r\n?/g, '\n').split('\n').map(hlLine).join('\n');
  }

  class CodeHL extends HTMLElement {
    static get observedAttributes() { return ['code']; }
    connectedCallback() {
      this.style.display = 'block';
      this.style.whiteSpace = 'pre';
      this.style.font = 'inherit';
      if (this.hasAttribute('code')) this._render(this.getAttribute('code'));
      else this._render(this.textContent); // one-shot; no observer (observer loops against the runtime)
    }
    attributeChangedCallback(name, oldV, newV) {
      if (name === 'code' && newV != null && this.isConnected) this._render(newV);
    }
    _render(raw) {
      if (raw == null) return;
      var html = highlight(String(raw));
      if (this._last === html) return;
      this._last = html;
      this.innerHTML = html;
    }
  }
  if (!customElements.get('code-hl')) customElements.define('code-hl', CodeHL);
})();
