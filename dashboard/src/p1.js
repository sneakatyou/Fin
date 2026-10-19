<script>
/* ===== Page code ===== */
const $ = (id) => document.getElementById(id);
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined && text !== null) e.textContent = text;
  return e;
}
const chip = (text, tone) => el('span', 'pd-chip' + (tone ? ' ' + tone : ''), text);
const MINUS = '−';
const IST_MS = 19800000;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CLASSES = ['Core / Hold-for-thesis', 'Tactical Swing', 'Intraday', 'Valuation Rotation Candidate', 'Watch', 'Unclassified'];
const RULES = { gap: 1.2, vixMove: 8, vixLow: 11.5, vixMidLo: 12, vixMidHi: 18, vixHigh: 20, t1: 0.75, t2: 1.0 };
const SCORED_MIN = 20;
const STALE_DAYS = 3;
const LOG_TYPES = { 'Pre-market pulse': 0, 'Post-market review': 1, 'Weekly review': 2, 'Monthly IC': 3 };
const LOG_PRI = { 'Weekly review': 0, 'Monthly IC': 0, 'Post-market review': 1, 'Pre-market pulse': 2 };
const TABS = ['today', 'news', 'markets', 'portfolio', 'research', 'ideas', 'log', 'brain'];
const TAB_OF = {
  today: 'today', 'today-band': 'today', 'market-read': 'today', 'open-setups': 'today', 'day-gate': 'today', 'inbox-card': 'today', 'runs-card': 'today', 'today-news': 'today',
  news: 'news', 'news-top': 'news', 'news-feed': 'news',
  markets: 'markets', 'gauges-sec': 'markets', 'corr-sec': 'markets', 'sector-sec': 'markets', 'macro-sec': 'markets',
  portfolio: 'portfolio', overview: 'portfolio', 'holdings-card': 'portfolio', 'watch-card': 'portfolio', 'collateral-card': 'portfolio', 'waiting-card': 'portfolio',
  research: 'research', 'days-card': 'research', 'props-card': 'research', 'ledger-card': 'research', 'pipeline-card': 'research', 'rejected-card': 'research',
  ideas: 'ideas', 'radar-sec': 'ideas', 'money-sec': 'ideas', 'opps-sec': 'ideas',
  log: 'log', brain: 'brain',
};

const INIT_FNS = {};
let active = 'today';

/* ---- data access ---- */
const rowsOf = (id) => { const d = dash.data(id); return d && d.status === 'ok' && Array.isArray(d.data) ? d.data : []; };
const oneOf = (id) => rowsOf(id)[0] || null;
function stOf(...ids) {
  const s = ids.map((i) => dash.data(i).status);
  for (const k of ['error', 'missing', 'connect', 'loading']) if (s.includes(k)) return k;
  return 'ok';
}
const SIG = {};
function once(key, sig, fn) { if (SIG[key] === sig) return; SIG[key] = sig; fn(); }
function gateBox(box, st) {
  box.classList.remove('dash-skeleton', 'pd-failed');
  if (st === 'ok') return true;
  SIG[box.id] = null;
  box.replaceChildren();
  if (st === 'loading') box.classList.add('dash-skeleton');
  else if (st === 'connect') box.append(el('p', 'pd-empty', 'Needs your Notion connection. See the note at the top of the page.'));
  else { box.classList.add('pd-failed'); box.append("Couldn't load this from Notion. Use Refresh to try again."); }
  return false;
}
const safe = (fn) => { try { fn(); } catch (e) { setTimeout(() => { throw e; }); } };
const empty = (text) => el('p', 'pd-empty', text);
const dim = (td) => { td.textContent = '—'; td.classList.add('pd-dim'); };

/* ---- values ---- */
const cnt = (v) => new Intl.NumberFormat('en-IN').format(Number(v));
const num = (v) => (v === null || v === undefined || v === '' || !isFinite(Number(v)) ? null : Number(v));
const clean = (v) => (v === null || v === undefined ? '' : String(v)
  .replace(/\r/g, '')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/\[([^\]]*)\]\((?:[^()]|\([^)]*\))*\)/g, '$1')
  .trim());
const safeUrl = (u) => (typeof u === 'string' && /^https:\/\//i.test(u) ? u : null);
const safeId = (s) => String(s).replace(/[^A-Za-z0-9_-]/g, '-');
const sgn = (n) => (n === null || n === 0 ? 'flat' : n > 0 ? 'pos' : 'neg');
const andList = (s) => { const a = String(s || '').split(',').map((x) => x.trim()).filter(Boolean); return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; };
const plural = (n, one, many) => (Number(n) === 1 ? one : many);
const yes = (v) => v === true || v === '__YES__' || v === 'Yes' || v === 'true';

/* The page used to cite each value to its source; it now reads Notion directly, so these only build nodes. */
const mark = (node) => node;
const markIf = (node) => node;
function fillText(node, raw) { node.textContent = clean(raw); return node; }
const ms = (text, src, field, loc, cls) => el('span', cls || null, text);

/* ---- formats ---- */
const F = {
  in0: new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }),
  in2: new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  us0: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }),
  us2: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  qty: new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 }),
  g: new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }),
};
function inr(v, mode) {
  const n = num(v);
  if (n === null) return '—';
  const a = Math.abs(n), s = n < 0 ? MINUS : '';
  if (mode === 'p') return s + '₹' + F.in2.format(a);
  if (mode !== 'f' && a >= 1e7) return s + '₹' + (a / 1e7).toFixed(2) + ' Cr';
  if (mode !== 'f' && a >= 1e5) return s + '₹' + (a / 1e5).toFixed(2) + ' L';
  return s + '₹' + F.in0.format(a);
}
function usd(v, mode) {
  const n = num(v);
  if (n === null) return '—';
  return (n < 0 ? MINUS : '') + '$' + (mode === 'p' ? F.us2 : F.us0).format(Math.abs(n));
}
const money = (v, cur, mode) => (cur === 'USD' ? usd(v, mode) : inr(v, mode));
function signedMoney(v, cur) {
  const n = num(v);
  if (n === null) return '—';
  return (n < 0 ? MINUS : '+') + money(Math.abs(n), cur);
}
function pct(f, d, signed) {
  const n = num(f);
  if (n === null) return '—';
  const t = Math.abs(n * 100).toFixed(d === undefined ? 1 : d);
  const sign = +t === 0 ? '' : n < 0 ? MINUS : signed ? '+' : '';
  return sign + t + '%';
}
function rfmt(v) {
  const n = num(v);
  if (n === null) return '—';
  const t = Math.abs(n).toFixed(2);
  return (+t === 0 ? '' : n < 0 ? MINUS : '+') + t + ' R';
}
const p2 = (n) => String(n).padStart(2, '0');
function istDate(s) {
  if (s === null || s === undefined || s === '') return null;
  s = String(s).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { const d = new Date(s + 'T00:00:00Z'); return isNaN(d) ? null : d; }
  const z = /(?:Z|[+-]\d{2}:?\d{2})$/.test(s) ? s : s.replace(' ', 'T') + 'Z';
  const t = Date.parse(z);
  return isNaN(t) ? null : new Date(t + IST_MS);
}
const todayIso = () => new Date(Date.now() + IST_MS).toISOString().slice(0, 10);
function dayStr(s) {
  const d = istDate(s);
  if (!d) return '—';
  const yr = new Date(Date.now() + IST_MS).getUTCFullYear();
  return d.getUTCDate() + ' ' + MON[d.getUTCMonth()] + (d.getUTCFullYear() !== yr ? ' ' + d.getUTCFullYear() : '');
}
function weekday(s) { const d = istDate(s); return d ? WD[d.getUTCDay()] : ''; }
function dayTimeStr(s) {
  const d = istDate(s);
  if (!d) return '—';
  const base = dayStr(s);
  return /\d{2}:\d{2}/.test(String(s)) ? base + ', ' + p2(d.getUTCHours()) + ':' + p2(d.getUTCMinutes()) + ' IST' : base;
}
function ageDays(s) {
  const a = Date.parse(todayIso()), b = Date.parse(String(s).slice(0, 10));
  return isNaN(a) || isNaN(b) ? 0 : Math.round((a - b) / 86400000);
}
function relDay(s) {
  const a = ageDays(s);
  if (a === 0) return 'Today';
  if (a === 1) return 'Yesterday';
  return weekday(s) + ' ' + dayStr(s);
}
function cmp(a, b, dir) {
  const an = a === null || a === undefined || a === '' || (typeof a === 'number' && isNaN(a));
  const bn = b === null || b === undefined || b === '' || (typeof b === 'number' && isNaN(b));
  if (an && bn) return 0;
  if (an) return 1;
  if (bn) return -1;
  const r = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b), 'en', { numeric: true, sensitivity: 'base' });
  return dir === 'desc' ? -r : r;
}
function minsAgo(ms) {
  if (!ms) return '';
  const m = Math.round((Date.now() - ms) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + ' min ago';
  const h = Math.round(m / 60);
  return h < 24 ? h + ' h ago' : Math.round(h / 24) + ' d ago';
}

/* ---- per-viewer conveniences (never required) ---- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
};
const SEEN = new Set(LS.get('pd-seen', []));
function markSeen(key) { if (!key || SEEN.has(key)) return; SEEN.add(key); LS.set('pd-seen', Array.from(SEEN).slice(-600)); }

/* ---- moving around the page ---- */
const REDUCED = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
function go(id) {
  const tab = TAB_OF[id];
  if (tab && tab !== active) show(tab, true);
  const e = $(id);
  if (!e) return;
  e.scrollIntoView({ behavior: REDUCED() ? 'auto' : 'smooth', block: 'start' });
}
function jump(id) {
  const h = $(id);
  if (!h) return;
  h.scrollIntoView({ behavior: REDUCED() ? 'auto' : 'smooth', block: 'start' });
  try { h.focus({ preventScroll: true }); } catch (e) { /* focus is a nicety */ }
}
let toastT = 0;
function toast(text) {
  const t = $('pd-toast');
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => { t.hidden = true; }, 4200);
}

/* ---- show more / show less ---- */
const OPENED = new Set();
function clampBox(full, lines, key, o) {
  o = o || {};
  const short = o.short && o.short !== full ? o.short : '';
  const open = OPENED.has(key);
  const box = el('div', 'pd-clampbox');
  box.style.setProperty('--lines', String(lines));
  box.dataset.key = key;
  box.classList.toggle('open', open);
  const t = el('div', 'pd-clamp' + (o.cls ? ' ' + o.cls : ''));
  if (short) { t.dataset.short = short; t.dataset.full = full; box.dataset.force = '1'; }
  t.textContent = open || !short ? full : short;
  const b = el('button', 'pd-textbtn', open ? 'Show less' : 'Show more');
  b.type = 'button';
  b.setAttribute('aria-expanded', String(open));
  b.hidden = !(open || short);
  box.append(t, b);
  return box;
}
function setClamp(box, open) {
  const t = box.firstElementChild, b = box.lastElementChild;
  box.classList.toggle('open', open);
  b.setAttribute('aria-expanded', String(open));
  b.textContent = open ? 'Show less' : 'Show more';
  if (t.dataset.short) t.textContent = open ? t.dataset.full : t.dataset.short;
  if (box.dataset.key) { if (open) OPENED.add(box.dataset.key); else OPENED.delete(box.dataset.key); }
}
function measureClamps() {
  document.querySelectorAll('#pd-app .pd-clampbox').forEach((box) => {
    const t = box.firstElementChild, b = box.lastElementChild;
    if (!t || !b || !t.clientWidth) return;
    const open = box.classList.contains('open');
    const over = !open && t.scrollHeight > t.clientHeight + 1;
    b.hidden = !(open || over || box.dataset.force === '1');
  });
}
function clampCell(td, full, lines, key, short) {
  if (!full) { dim(td); return; }
  td.classList.add('wrapc');
  td.append(clampBox(full, lines, key, { short }));
}
function clipper(box, btn) {
  const set = (o) => { box.classList.toggle('open', o); btn.setAttribute('aria-expanded', String(o)); btn.textContent = o ? 'Show less' : 'Show more'; };
  btn.addEventListener('click', () => { set(!box.classList.contains('open')); check(); });
  function check() {
    const o = box.classList.contains('open');
    const over = !o && box.scrollHeight > box.clientHeight + 4;
    box.classList.toggle('is-clipped', over);
    btn.hidden = !(over || o);
  }
  return check;
}

/* ---- safe renderer for Notion enhanced markdown (DOM nodes, text only) ---- */
const TAG_RE = /<\/?[a-z][a-z0-9_-]*(?:\s[^<>]*)?\/?>/g;
const NR_SEP = /^\|?\s*:?-{2,}:?\s*(?:\|\s*:?-{2,}:?\s*)*\|?$/;
const prep = (s) => s.replace(/<mention-date\b([^>]*)>/g, (m, a) => {
  const g = (k) => { const x = new RegExp('\\b' + k + '="([^"]*)"').exec(a); return x ? x[1] : ''; };
  const f = (d) => { const t = dayStr(d); return t === '—' ? d : t; };
  const s0 = g('start'), e0 = g('end');
  return s0 ? f(s0) + (e0 ? ' to ' + f(e0) : '') : '';
});
function inline(parent, raw, depth) {
  const s = prep(String(raw))
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/!?\[([^\]]*)\]\((?:[^()]|\([^)]*\))*\)/g, '$1')
    .replace(/\s*\{(?:[a-z_-]+="[^"]*"\s*)+\}/g, '')
    .replace(TAG_RE, '');
  const re = /\\([\\`*_{}\[\]()#+\-.!|~<>$])|`([^`]+)`|\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|~~(.+?)~~|\*([^*\s][^*]*?)\*|\n/g;
  let last = 0, m;
  while ((m = re.exec(s))) {
    if (m.index > last) parent.append(s.slice(last, m.index));
    if (m[1] !== undefined) parent.append(m[1]);
    else if (m[2] !== undefined) parent.append(el('code', null, m[2]));
    else if (m[3] !== undefined) { const b = el('strong'); b.append(el('em', null, m[3])); parent.append(b); }
    else if (m[4] !== undefined) { const b = el('strong'); if ((depth || 0) < 3) inline(b, m[4], (depth || 0) + 1); else b.textContent = m[4]; parent.append(b); }
    else if (m[5] !== undefined) parent.append(el('del', null, m[5]));
    else if (m[6] !== undefined) parent.append(el('em', null, m[6]));
    else parent.append(document.createElement('br'));
    last = re.lastIndex;
  }
  if (last < s.length) parent.append(s.slice(last));
}
function tableCells(src) {
  const out = [];
  for (const rm of src.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)) {
    const row = [];
    for (const cm of rm[1].matchAll(/<(td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/g)) row.push(cm[2].trim());
    if (row.length) out.push(row);
  }
  return out;
}
function buildTable(src) {
  const wrap = el('div', 'nr-tw');
  const table = el('table');
  wrap.append(table);
  const open = src.slice(0, src.indexOf('>') + 1);
  const hr = /header-row="true"/.test(open), hc = /header-column="true"/.test(open);
  tableCells(src).forEach((row, ri) => {
    const tr = el('tr');
    row.forEach((cell, ci) => {
      const head = hr && ri === 0;
      const side = !head && hc && ci === 0;
      const c = el(head || side ? 'th' : 'td');
      if (head || side) c.scope = head ? 'col' : 'row';
      inline(c, cell);
      tr.append(c);
    });
    table.append(tr);
  });
  return wrap;
}
function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells = [];
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && s[i + 1] === '|') { cur += '|'; i++; }
    else if (s[i] === '|') { cells.push(cur.trim()); cur = ''; }
    else cur += s[i];
  }
  cells.push(cur.trim());
  return cells;
}
function buildPipe(rows) {
  const wrap = el('div', 'nr-tw');
  const table = el('table');
  wrap.append(table);
  const head = rows.length > 1 && rows[1].includes('|') && NR_SEP.test(rows[1]);
  const aligns = head ? splitRow(rows[1]).map((c) => (/^:-+:$/.test(c) ? 'center' : /-:$/.test(c) ? 'right' : '')) : [];
  const lines = head ? [rows[0]].concat(rows.slice(2)) : rows;
  lines.forEach((ln, ri) => {
    const tr = el('tr');
    splitRow(ln).forEach((cell, ci) => {
      const c = el(head && ri === 0 ? 'th' : 'td');
      if (head && ri === 0) c.scope = 'col';
      if (aligns[ci]) c.style.textAlign = aligns[ci];
      inline(c, cell);
      tr.append(c);
    });
    table.append(tr);
  });
  return wrap;
}
const calloutTone = (c) => (/^(red|pink)/.test(c) ? 'bad' : /^(yellow|orange|brown)/.test(c) ? 'warn' : /^green/.test(c) ? 'ok' : /^(blue|purple)/.test(c) ? 'acc' : '');
let NR_N = 0;
function renderNotion(root, body, opts) {
  opts = opts || {};
  root.replaceChildren();
  const scope = opts.scope || 'nr' + (++NR_N);
  const heads = [];
  let hn = 0;
  const src = String(body || '').replace(/\r\n?/g, '\n').split('\n');
  const stack = [];
  let cur = root;
  let lists = [];
  let quote = null;
  const flush = () => { lists = []; quote = null; };
  const emit = (t, raw) => {
    let m;
    if ((m = /^<summary[^>]*>(.*?)(?:<\/summary>)?$/.exec(t))) {
      const inDetails = cur.tagName === 'DETAILS' && !cur.firstElementChild;
      const s = el(inDetails ? 'summary' : 'div', inDetails ? null : 'nr-summary');
      inline(s, m[1]);
      cur.append(s);
      flush();
      return;
    }
    if ((m = /^(#{1,6})\s+(.*)$/.exec(t))) {
      const lvl = Math.min(m[1].length, 4);
      const h = el('h' + Math.min(lvl + 3, 6), 'nr-h' + lvl);
      inline(h, m[2]);
      h.id = scope + '-h' + hn++;
      h.tabIndex = -1;
      if (!stack.length) heads.push({ id: h.id, lvl: m[1].length, text: h.textContent });
      cur.append(h);
      flush();
      return;
    }
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(t)) { cur.append(el('hr')); flush(); return; }
    if ((m = /^>\s?(.*)$/.exec(t))) {
      if (!quote || quote.parentNode !== cur) { quote = el('blockquote'); cur.append(quote); }
      const p = el('p');
      inline(p, m[1]);
      quote.append(p);
      lists = [];
      return;
    }
    let kind = null, text = '', start = 0;
    if ((m = /^[-*+]\s+(.*)$/.exec(t))) { kind = 'ul'; text = m[1]; }
    else if ((m = /^(\d+)[.)]\s+(.*)$/.exec(t))) { kind = 'ol'; start = Number(m[1]); text = m[2]; }
    if (kind) {
      const ind = raw.match(/^[\t ]*/)[0].replace(/\t/g, '    ').length;
      let task = false;
      text = text.replace(/^\[( |x|X)\]\s+/, (x, c) => { task = true; return c === ' ' ? '☐ ' : '☑ '; });
      while (lists.length && ind < lists[lists.length - 1].ind) lists.pop();
      const mk = () => {
        const prev = lists[lists.length - 1];
        const parent = prev ? (prev.ul.lastElementChild || prev.ul) : cur;
        const ul = el(kind);
        if (kind === 'ol' && start > 1) ul.start = start;
        parent.append(ul);
        lists.push({ ind, kind, ul });
      };
      const top = lists[lists.length - 1];
      if (!top || ind > top.ind) mk();
      else if (top.kind !== kind) { lists.pop(); mk(); }
      const li = el('li', task ? 'nr-task' : null);
      inline(li, text);
      lists[lists.length - 1].ul.append(li);
      quote = null;
      return;
    }
    if (!t.replace(TAG_RE, '').trim()) return;
    const p = el('p');
    inline(p, t);
    const topList = lists[lists.length - 1];
    const pInd = raw.match(/^[\t ]*/)[0].replace(/\t/g, '    ').length;
    if (topList && pInd > topList.ind && topList.ul.lastElementChild) { topList.ul.lastElementChild.append(p); return; }
    cur.append(p);
    flush();
  };
  for (let i = 0; i < src.length; i++) {
    const raw = src[i];
    let t = prep(raw.trim());
    if (!t) { flush(); continue; }
    if (t.startsWith('```')) {
      const buf = [];
      i++;
      while (i < src.length && !/^\s*```/.test(src[i])) { buf.push(src[i]); i++; }
      const pre = el('pre', 'nr-pre');
      pre.textContent = buf.join('\n');
      cur.append(pre);
      flush();
      continue;
    }
    if (/^<table\b/.test(t)) {
      const buf = [raw];
      while (!/<\/table>/.test(buf[buf.length - 1]) && i + 1 < src.length) { i++; buf.push(src[i]); }
      cur.append(buildTable(buf.join('\n')));
      flush();
      continue;
    }
    if (t.charAt(0) === '|' && t.split('|').length > 2) {
      const rows = [t];
      while (i + 1 < src.length && src[i + 1].trim().charAt(0) === '|') { i++; rows.push(prep(src[i].trim())); }
      cur.append(buildPipe(rows));
      flush();
      continue;
    }
    const open = /^<(callout|details)\b([^>]*)>(.*)$/.exec(t);
    if (open) {
      let box;
      if (open[1] === 'details') box = el('details', 'nr-details');
      else {
        box = el('div', 'nr-callout');
        const cc = /\bcolor="([a-z_]+)"/.exec(open[2]);
        const tone = cc ? calloutTone(cc[1]) : '';
        if (tone) box.classList.add('tone-' + tone);
      }
      cur.append(box);
      stack.push(box);
      cur = box;
      flush();
      t = open[3].trim();
    }
    let closes = 0, c;
    while ((c = /^(.*?)\s*<\/(?:callout|details)>\s*$/.exec(t))) { t = c[1]; closes++; }
    if (t) emit(t, raw);
    while (closes-- > 0 && stack.length) { stack.pop(); cur = stack.length ? stack[stack.length - 1] : root; flush(); }
  }
  if (opts.toc) buildToc(opts.toc, heads);
  return heads;
}
function buildToc(box, heads) {
  box.replaceChildren();
  box.hidden = true;
  if (!heads.length) return;
  const L = heads.some((h) => h.lvl === 2) ? 2 : Math.min(...heads.map((h) => h.lvl));
  const items = heads.filter((h) => h.lvl === L);
  if (items.length < 2) return;
  const d = el('details');
  d.open = $('pd-app').clientWidth >= 640;
  const ol = el('ol');
  items.forEach((h) => {
    const li = el('li');
    const b = el('button', 'pd-toc-link', h.text);
    b.type = 'button';
    b.dataset.target = h.id;
    li.append(b);
    ol.append(li);
  });
  d.append(el('summary', null, 'On this page'), ol);
  box.append(d);
  box.hidden = false;
}
function sectionOf(body, re) {
  const lines = String(body).replace(/\r\n?/g, '\n').split('\n');
  const lvl = (l) => { const m = /^\s*(#{1,6})\s/.exec(l); return m ? m[1].length : 0; };
  let i = lines.findIndex((l) => lvl(l) > 0 && re.test(l));
  const L = i >= 0 ? lvl(lines[i]) : 0;
  if (i < 0) i = lines.findIndex((l) => l.length < 120 && re.test(l));
  if (i < 0) return '';
  let j = i + 1;
  while (j < lines.length && !(lvl(lines[j]) > 0 && (L === 0 || lvl(lines[j]) <= L))) j++;
  return lines.slice(i + 1, j).join('\n').trim();
}
const plainOf = (s) => String(s || '').replace(TAG_RE, ' ').replace(/[*_`>#|]/g, ' ').replace(/[ \t]+/g, ' ').trim();

/* ---- tooltip inside a position:relative box ---- */
function makeTip(box) {
  const t = el('div', 'pd-tip');
  t.hidden = true;
  t.setAttribute('role', 'tooltip');
  box.append(t);
  return {
    show(head, lines, x, y) {
      t.replaceChildren(el('div', 'pd-tip-h', head), ...lines.map(([k, v]) => {
        const d = el('div', 'pd-tip-l'); d.append(el('span', null, k), el('span', null, v)); return d;
      }));
      t.hidden = false;
      const w = t.offsetWidth, h = t.offsetHeight, bw = box.clientWidth;
      t.style.left = Math.max(4, Math.min(x + 12, bw - w - 4)) + 'px';
      t.style.top = (y - h - 8 < 0 ? y + 16 : y - h - 8) + 'px';
    },
    hide() { t.hidden = true; },
  };
}

/* ---- sortable table ---- */
const C = (f, l, o) => Object.assign({
  f, l,
  sort: (r) => r[f],
  cell: (td, r) => { const v = clean(r[f]); if (v) td.textContent = v; else dim(td); },
}, o || {});
function makeTable(table, cols, opts) {
  const st = { key: opts.sort[0], dir: opts.sort[1] };
  const thead = el('thead'), htr = el('tr'), tbody = el('tbody');
  thead.append(htr);
  const ths = [];
  cols.forEach((c) => {
    const th = el('th', [c.num ? 'num' : '', c.hide ? 'hide-sm' : '', c.stick ? 'stick' : ''].filter(Boolean).join(' '));
    th.scope = 'col';
    const b = el('button', 'pd-sort', c.l);
    b.type = 'button';
    b.addEventListener('click', () => {
      if (st.key === c.f) st.dir = st.dir === 'asc' ? 'desc' : 'asc';
      else { st.key = c.f; st.dir = c.num || c.first === 'desc' ? 'desc' : 'asc'; }
      opts.redraw();
      measureClamps();
    });
    th.append(b);
    htr.append(th);
    ths.push([c, th]);
  });
  table.replaceChildren(thead, tbody);
  return {
    st,
    paint(list) {
      ths.forEach(([c, th]) => th.setAttribute('aria-sort', st.key === c.f ? (st.dir === 'asc' ? 'ascending' : 'descending') : 'none'));
      const col = cols.find((c) => c.f === st.key) || cols[0];
      const sorted = list.slice().sort((a, b) => cmp(col.sort(a), col.sort(b), st.dir));
      tbody.replaceChildren(...sorted.map((r) => {
        const tr = el('tr');
        if (opts.key) tr.dataset.key = r[opts.key];
        cols.forEach((c) => {
          const td = el('td', [c.num ? 'num' : '', c.hide ? 'hide-sm' : '', c.stick ? 'stick' : ''].filter(Boolean).join(' '));
          c.cell(td, r);
          tr.append(td);
        });
        if (opts.open) {
          tr.tabIndex = 0;
          tr.classList.add('click');
          tr.addEventListener('click', (e) => { if (!e.target.closest('.pd-clampbox, a, button')) opts.open(r, sorted); });
          tr.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === tr) { e.preventDefault(); opts.open(r, sorted); } });
        }
        return tr;
      }));
      return sorted;
    },
  };
}
function tableGate(state, wrap, st) {
  if (st === 'ok') { state.classList.remove('dash-skeleton', 'pd-failed'); state.replaceChildren(); state.hidden = true; wrap.hidden = false; return true; }
  state.hidden = false; wrap.hidden = true;
  gateBox(state, st);
  return false;
}
function fchips(box, values, sel, onPick, label) {
  box.replaceChildren(...values.map((v) => {
    const b = el('button', 'pd-fchip', label ? label(v) : v);
    b.type = 'button';
    b.dataset.v = v;
    b.setAttribute('aria-pressed', String(sel.has(v)));
    b.addEventListener('click', () => { if (sel.has(v)) sel.delete(v); else sel.add(v); onPick(); });
    return b;
  }));
}

/* ===== Calculations ===== */
function fxFrom(gauges) {
  const g = (gauges || []).filter((r) => num(r['USD INR']) !== null).sort((a, b) => cmp(a.Day, b.Day, 'desc'))[0];
  return g ? { rate: num(g['USD INR']), asof: g.Day, source: 'Market Gauges, ' + dayStr(g.Day) } : FX_FALLBACK;
}
dash.calc('fx', { inputs: ['gauges'], optional: ['gauges'], fn: (gauges) => [fxFrom(gauges)] });
dash.calc('totals', {
  inputs: ['portfolio', 'fx'],
  fn: (portfolio, fx) => {
    const n = (v) => (v === null || v === undefined || v === '' || !isFinite(Number(v)) ? 0 : Number(v));
    const rate = n(fx[0] && fx[0].rate);
    const held = portfolio.filter((r) => r.Status === 'Holding');
    const sum = (list, k) => list.reduce((s, r) => s + n(r[k]), 0);
    const inrV = (r) => n(r['Current value']) * (r.Currency === 'USD' ? rate : 1);
    const acct = (a) => held.filter((r) => r.Account === a);
    const india = acct('Upstox'), us = acct('INDmoney'), other = acct('Other / not shown');
    const iv = sum(india, 'Current value'), ii = sum(india, 'Invested');
    const uv = sum(us, 'Current value'), ui = sum(us, 'Invested');
    const ov = sum(other, 'Current value');
    const total = iv + (uv + ov) * rate;
    const ved = held.filter((r) => r.Theme === 'Vedanta cluster');
    const vv = ved.reduce((s, r) => s + inrV(r), 0);
    const pos = {};
    held.forEach((r) => {
      const k = r.Theme === 'Vedanta cluster' ? 'Vedanta group (' + ved.length + ')' : r.Ticker;
      pos[k] = (pos[k] || 0) + inrV(r);
    });
    const top = Object.entries(pos).sort((a, b) => b[1] - a[1])[0] || ['', 0];
    return [{
      rate, asof: fx[0] && fx[0].asof, fxsource: fx[0] && fx[0].source, total_inr: total,
      india_value: iv, india_invested: ii, india_pnl: iv - ii, india_pnl_pct: ii > 0 ? (iv - ii) / ii : null,
      us_value: uv, us_invested: ui, us_pnl: uv - ui, us_pnl_pct: ui > 0 ? (uv - ui) / ui : null,
      elsewhere_value: ov, elsewhere_tickers: other.map((r) => r.Ticker).join(', '),
      vedanta_value: vv, vedanta_count: ved.length, vedanta_share_of_india: iv > 0 ? vv / iv : null,
      largest_name: top[0], largest_value_inr: top[1], largest_share: total > 0 ? top[1] / total : null,
    }];
  },
});
dash.calc('by_theme', {
  inputs: ['portfolio', 'fx'],
  fn: (portfolio, fx) => {
    const rate = Number(fx[0] && fx[0].rate) || 0;
    const t = {};
    let all = 0;
    portfolio.filter((r) => r.Status === 'Holding').forEach((r) => {
      const v = (Number(r['Current value']) || 0) * (r.Currency === 'USD' ? rate : 1);
      const k = r.Theme || 'Other';
      t[k] = t[k] || { Theme: k, value_inr: 0, positions: 0 };
      t[k].value_inr += v;
      t[k].positions += 1;
      all += v;
    });
    return Object.values(t).map((x) => Object.assign(x, { share: all > 0 ? x.value_inr / all : null })).sort((a, b) => b.value_inr - a.value_inr);
  },
});
dash.calc('holdings_pnl', {
  inputs: ['portfolio'],
  fn: (portfolio) => portfolio
    .filter((r) => r.Status === 'Holding' && Number(r.Invested) > 0 && num(r['Current value']) !== null)
    .map((r) => ({ Ticker: r.Ticker, pnl_pct: Number(r['Current value']) / Number(r.Invested) - 1 })),
});
dash.calc('data_gaps', {
  inputs: ['portfolio'],
  fn: (portfolio) => {
    const held = portfolio.filter((r) => r.Status === 'Holding');
    const unv = held.filter((r) => r.Market === 'India' && r.Pledged === 'Unverified');
    const noq = held.filter((r) => r.Qty === undefined || r.Qty === null || r.Qty === '');
    const prop = held.filter((r) => String(r['Thesis and notes'] || '').includes('PROPOSED ('));
    return [{
      unverified_pledged_india: unv.length, unverified_tickers: unv.map((r) => r.Ticker).join(', '),
      no_qty: noq.length, no_qty_tickers: noq.map((r) => r.Ticker).join(', '),
      proposals: prop.length,
    }];
  },
});
dash.calc('setup_stats', {
  inputs: ['ledger', 'lab'],
  fn: (ledger, lab) => {
    const ok = (v) => num(v) !== null;
    const scoredRows = ledger.filter((r) => ok(r['POST Theoretical R']) && r.Status !== 'Proposed');
    const sumT = scoredRows.reduce((s, r) => s + Number(r['POST Theoretical R']), 0);
    const rej = lab.filter((r) => r.Type === 'Rejected trade');
    return [{
      frozen: ledger.length,
      open: ledger.filter((r) => r.Status === 'Proposed' || r.Status === 'Entered').length,
      triggered: ledger.filter((r) => r['POST Trigger occurred'] === 'Yes').length,
      entered: ledger.filter((r) => yes(r['POST Trade entered'])).length,
      scored: scoredRows.length,
      avg_theoretical_R: scoredRows.length ? sumT / scoredRows.length : null,
      rejected: rej.length,
      rejected_unscored: rej.filter((r) => !clean(r['Subsequent price behaviour'])).length,
    }];
  },
});
dash.calc('lab_stages', {
  inputs: ['lab'],
  fn: (lab) => ['Hypothesis', 'Testing', 'Validated', 'Active', 'Degraded', 'Retired'].map((s) => ({
    Stage: s,
    n: lab.filter((r) => r.Type === 'Strategy hypothesis' && (r.Stage || 'Hypothesis') === s).length,
  })),
});
/* Tickers you hold or watch, for matching news and the sector map. */
dash.calc('mine', {
  inputs: ['portfolio'],
  fn: (portfolio) => portfolio.filter((r) => r.Status === 'Holding' || r.Status === 'Watch').map((r) => ({ Ticker: String(r.Ticker || '').toUpperCase(), Status: r.Status, Theme: r.Theme })),
});
</script>
