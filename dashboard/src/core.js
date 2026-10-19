<script>
/* ===== Where the data lives (Notion: Trading Research System) ===== */
const NOTION = 'Notion';
const VIEWS = {
  portfolio: 'https://app.notion.com/p/97562cfcba2f4dfe92067252a79b98db?v=a92ff4a6b36d4d79854dc1adde201a03',
  ledger: 'https://app.notion.com/p/9ded500c55f6484f94f28665fa59f039?v=a54f077f0ac5444685d967dd341c0c3f',
  lab: 'https://app.notion.com/p/2320731d5d6f4d92ae6c87f75430b96c?v=9a9804d2f51a4d038329db9a4d841761',
  pulse: 'https://app.notion.com/p/a2e877372ad0460a887cfe9de226eaea?v=765ff8501e82456a8bd9189ba7fb9c1c',
  news: 'https://app.notion.com/p/e2d30eac13e64bbb98e732c367cd7ad2?v=3fe161afda38816cab18000cb36f5e16',
  gauges: 'https://app.notion.com/p/2dfabe517dc5470e94b9362af2671302?v=3fe161afda3881829467000cb788978e',
  sectors: 'https://app.notion.com/p/b2f3233aa81443c39a5fa5db6b29c206?v=3fe161afda3881cabfc6000c78f6b746',
  themes: 'https://app.notion.com/p/f48bd34f9d4b41fdb4c2c8219cec3c6d?v=3fe161afda3881319f65000c08d1d407',
  inbox: 'https://app.notion.com/p/e1336be4e2354c48ac27255deba1e9ee?v=3fe161afda3881db84ae000cccd7fe0f',
};
const PAGES = {
  collateral: 'https://app.notion.com/p/3f0161afda38813dad5eff184f819d25',
  brain: 'https://app.notion.com/p/3fd161afda388142b2aafba4568df165',
  checklists: 'https://app.notion.com/p/3fd161afda388121b978e82887bb6675',
  macro: 'https://app.notion.com/p/3fe161afda38811ab873e7e5ba888c2c',
  money: 'https://app.notion.com/p/3fe161afda388195b611f7154d9e7df7',
};
/* The only place this page writes: the Decisions Inbox data source. */
const INBOX_DS = '3bba7f9e-98a3-4a9d-b3e7-1ed23447f999';
/* Used only if the Market Gauges have no USD/INR yet: Weekly review, 17 Oct 2026, "Rupee about 95.0". */
const FX_FALLBACK = { rate: 95.0, asof: '2026-10-17', source: 'Weekly review, 17 Oct 2026' };

/* ===== Data layer: each read runs on the viewer's own Notion connection ===== */
const READ_CACHE = { staleTime: 60000, gcTime: 86400000 };
const CONNECT_CODES = new Set(['needs_reauth', 'server_not_connected', 'selection_required', 'server_not_found', 'not_in_manifest', 'blocked_by_policy', 'approval_required', 'not_granted', 'capability_disabled', 'capability_removed', 'consent_required']);
let MCP = null;
let MCP_STATE = 'waiting'; // waiting | ready | none
let SAMPLE = null;
const DS = {};
const CALCS = {};
const LISTENERS = [];
let PARAMS = {};
let queued = false;
const later = (f) => (typeof requestAnimationFrame === 'function' && !document.hidden ? requestAnimationFrame(f) : setTimeout(f, 30));
function notify() {
  if (queued) return;
  queued = true;
  later(() => {
    queued = false;
    LISTENERS.forEach((f) => { try { f(); } catch (e) { setTimeout(() => { throw e; }); } });
  });
}
function textOf(res) {
  const c = res && Array.isArray(res.content) ? res.content : [];
  return c.filter((b) => b && b.type === 'text').map((b) => b.text).join('\n');
}
const payloadOf = (res) => (res && res.payload !== undefined ? res.payload : textOf(res));
function asObj(x) {
  if (typeof x !== 'string') return x;
  try { const p = JSON.parse(x); return p && typeof p === 'object' ? p : x; } catch (e) { return x; }
}
async function call(tool, input, fresh) {
  if (!MCP) { const e = new Error('Notion is not reachable from this view.'); e.code = 'not_granted'; throw e; }
  try {
    const res = await MCP.callTool(NOTION, tool, input, { cache: fresh ? Object.assign({ refresh: true }, READ_CACHE) : READ_CACHE });
    return payloadOf(res);
  } catch (err) {
    const e = new Error((err && err.message) || 'Notion did not answer.');
    e.code = err && err.code;
    throw e;
  }
}
function def(id, spec) {
  DS[id] = { id, spec, status: 'loading', data: [], v: 0, seq: 0, started: false, refreshing: false, message: '', code: '', at: 0 };
}
function begin(d) {
  if (!MCP) return;
  if (d.spec.once) { runOnce(d, false); return; }
  if (d.unsub) { try { d.unsub(); } catch (e) { /* already gone */ } }
  d.unsub = MCP.watchTool(NOTION, d.spec.tool, d.spec.input, (ev) => onEvent(d, ev), { cache: READ_CACHE });
}
function start(d) {
  if (d.started) return;
  d.started = true;
  if (MCP_STATE === 'none') { d.status = 'connect'; d.code = 'not_granted'; return; }
  begin(d);
}
async function settle(d, payload, at, fresh) {
  const seq = ++d.seq;
  try {
    const out = await d.spec.load(payload, (t, i) => call(t, i, fresh));
    if (seq !== d.seq) return;
    d.data = out; d.status = 'ok'; d.v++; d.at = at || Date.now(); d.message = ''; d.code = '';
  } catch (err) {
    if (seq !== d.seq) return;
    if (d.status !== 'ok') {
      d.status = err && CONNECT_CODES.has(err.code) ? 'connect' : 'error';
      d.code = (err && err.code) || ''; d.message = String((err && err.message) || err);
    }
  }
  d.refreshing = false;
  notify();
}
function onEvent(d, ev) {
  if (ev.type === 'error') {
    const e = ev.error || {};
    if (CONNECT_CODES.has(e.code)) { d.status = 'connect'; d.code = e.code; d.data = []; d.v++; }
    else if (d.status !== 'ok') { d.status = 'error'; d.code = e.code || ''; d.message = e.message || ''; }
    d.refreshing = false;
    notify();
    return;
  }
  const res = ev.result || {};
  d.refreshing = !!(res.cache && res.cache.revalidating);
  settle(d, payloadOf(res), res.cache ? res.cache.storedAt : Date.now(), !res.cache);
}
async function runOnce(d, fresh) {
  d.refreshing = d.status === 'ok';
  try {
    const p = await call(d.spec.tool, d.spec.input, fresh);
    await settle(d, p, Date.now(), fresh);
  } catch (err) {
    if (d.status !== 'ok' || CONNECT_CODES.has(err.code)) {
      d.status = CONNECT_CODES.has(err.code) ? 'connect' : 'error';
      d.code = err.code || ''; d.message = err.message || '';
    }
    d.refreshing = false;
    notify();
  }
}
async function refreshAll() {
  if (!MCP) return;
  Object.values(DS).forEach((d) => { if (d.started && d.status === 'ok') d.refreshing = true; });
  notify();
  try { await MCP.invalidate(NOTION); } catch (e) { /* nothing cached */ }
  Object.values(DS).forEach((d) => {
    if (!d.started) return;
    if (d.spec.once) runOnce(d, true);
    else if (d.status !== 'ok') begin(d);
  });
}
function restartAll() {
  Object.values(DS).forEach((d) => { if (d.started) { d.status = 'loading'; begin(d); } });
  notify();
}

const dash = {
  data(id) {
    if (CALCS[id]) return calcData(id);
    const d = DS[id];
    if (!d) return { status: 'missing', data: [] };
    start(d);
    return { status: d.status, data: d.data, refreshing: d.refreshing, message: d.message, code: d.code, at: d.at, v: d.v };
  },
  onData(fn) { LISTENERS.push(fn); fn(); },
  calc(id, o) { CALCS[id] = { inputs: o.inputs, optional: new Set(o.optional || []), fn: o.fn, sig: '', val: [] }; },
  params() { return PARAMS; },
  setParams(p) { PARAMS = Object.assign({}, PARAMS, p); notify(); },
  setLink(name) { try { localStorage.setItem('pd-tab', String(name)); } catch (e) { /* per-viewer convenience only */ } },
  colors: ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)', 'var(--s7)', 'var(--s8)'],
};
function calcData(id) {
  const c = CALCS[id];
  const ins = c.inputs.map((i) => {
    const x = dash.data(i);
    return c.optional.has(i) && (x.status === 'error' || x.status === 'connect' || x.status === 'missing') ? { status: 'ok', data: [], v: 'none' } : x;
  });
  for (const k of ['error', 'missing', 'connect', 'loading']) if (ins.some((x) => x.status === k)) return { status: k, data: [] };
  const sig = ins.map((x) => x.v).join(',');
  if (c.sig !== sig) { c.val = c.fn(...ins.map((x) => x.data)); c.sig = sig; }
  return { status: 'ok', data: c.val, v: sig };
}

/* ---- loaders ---- */
async function viewRows(payload, callT, input) {
  let a = asObj(payload);
  const rows = [];
  let extra = 0;
  for (;;) {
    if (!a || !Array.isArray(a.results)) {
      const m = a && (a.message || a.error || a.text);
      throw new Error(typeof m === 'string' ? m : typeof a === 'string' ? a.slice(0, 300) : 'Notion returned no results');
    }
    rows.push(...a.results);
    if (!(a.has_more && a.next_cursor) || extra >= 5) break;
    extra++;
    a = asObj(await callT('notion-query-data-sources', { data: Object.assign({}, input.data, { start_cursor: a.next_cursor }) }));
  }
  return rows;
}
function defView(id) {
  const input = { data: { mode: 'view', view_url: VIEWS[id], page_size: 100 } };
  def(id, { tool: 'notion-query-data-sources', input, load: (p, c) => viewRows(p, c, input) });
}
['portfolio', 'ledger', 'lab', 'pulse', 'news', 'gauges', 'sectors', 'themes', 'inbox'].forEach(defView);

function pageBody(payload) {
  const a = asObj(payload);
  const text = typeof a === 'string' ? a : a && a.text;
  if (typeof text !== 'string') {
    const m = a && (a.message || a.error);
    throw new Error(typeof m === 'string' ? m : 'The page came back without text');
  }
  const i = text.indexOf('<content>');
  const j = text.lastIndexOf('</content>');
  return { Title: (a && a.title) || '', url: (a && a.url) || '', Body: (i >= 0 && j > i ? text.slice(i + 9, j) : text).trim(), raw: text };
}
function idOfUrl(u) {
  const full = String(u || '');
  const seg = full.split(/[?#]/)[0].split('/').pop().replace(/-/g, '');
  const m = /[0-9a-f]{32}$/i.exec(seg) || /[0-9a-f]{32}/i.exec(full.replace(/-/g, ''));
  return m ? m[0].toLowerCase() : '';
}
/* A page read on demand (a sheet, a Brain page): one read, cached for a day, refreshed with the Refresh button. */
function pageData(url) {
  const id = 'page:' + (idOfUrl(url) || url);
  if (!DS[id]) def(id, { once: true, tool: 'notion-fetch', input: { id: url }, load: (p) => [pageBody(p)] });
  return dash.data(id);
}

def('latest_pulse', {
  tool: 'notion-query-data-sources',
  input: { data: { mode: 'view', view_url: VIEWS.pulse, page_size: 100 } },
  load: async (p, c) => {
    const rows = await viewRows(p, c, { data: { mode: 'view', view_url: VIEWS.pulse, page_size: 100 } });
    const pre = rows.filter((r) => r.Type === 'Pre-market pulse');
    if (!pre.length) return [];
    const day = (r) => String(r['date:Date:start'] || '');
    let best = pre[0];
    for (const r of pre.slice(1)) if (day(r) > day(best) || (day(r) === day(best) && String(r.createdTime || '') > String(best.createdTime || ''))) best = r;
    const page = pageBody(await c('notion-fetch', { id: best.url }));
    return [{ Title: best.Title, Date: best['date:Date:start'], Headline: best.Headline, Regime: best.Regime, 'Setups proposed': best['Setups proposed'], url: best.url, Body: page.Body }];
  },
});
def('collateral', { once: true, tool: 'notion-fetch', input: { id: PAGES.collateral }, load: (p) => [pageBody(p)] });
def('brain_index', {
  once: true, tool: 'notion-fetch', input: { id: PAGES.brain },
  load: (p) => {
    const a = asObj(p);
    const t = typeof a === 'string' ? a : a && a.text;
    if (typeof t !== 'string' || !t) throw new Error('The Brain index came back without text');
    const i = t.indexOf('<content>'), j = t.lastIndexOf('</content>');
    const text = i >= 0 && j > i ? t.slice(i + 9, j) : t;
    const lead = /^[\s‍️⃣\p{Extended_Pictographic}\p{Emoji_Modifier}\u{1F1E6}-\u{1F1FF}]+/u;
    const ents = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
    const rows = [], seen = new Set(), tag = /<page\b([^>]*?)(\/?)>/g;
    let m;
    while ((m = tag.exec(text))) {
      const u = /\burl="([^"]+)"/.exec(m[1]);
      if (!u) continue;
      let title = 'Untitled';
      if (!m[2]) {
        const end = text.indexOf('</page>', tag.lastIndex);
        if (end < 0) continue;
        const inner = text.slice(tag.lastIndex, end);
        if (inner.includes('\n')) continue;
        title = inner.replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot|#39);/g, (e) => ents[e]).replace(lead, '').trim() || 'Untitled';
        tag.lastIndex = end + 7;
      }
      const id = idOfUrl(u[1]) || u[1];
      if (seen.has(id)) continue;
      seen.add(id);
      rows.push({ Title: title, url: u[1] });
    }
    return rows;
  },
});

/* ---- writes: one tool, one data source, only on a click ---- */
async function inboxCreate(f) {
  if (!MCP) { const e = new Error('Notion is not reachable from this view.'); e.code = 'not_granted'; throw e; }
  const props = { Item: String(f.item).slice(0, 180), Kind: f.kind, Status: 'New' };
  if (f.about) props.About = String(f.about).slice(0, 1900);
  if (f.aboutPage && /^https:\/\//.test(f.aboutPage)) props['About page'] = f.aboutPage;
  if (f.decision) props.Decision = f.decision;
  if (f.details) props.Details = String(f.details).slice(0, 1900);
  const page = { properties: props };
  if (f.content) page.content = String(f.content).slice(0, 60000);
  const res = await MCP.callTool(NOTION, 'notion-create-pages', { parent: { type: 'data_source_id', data_source_id: INBOX_DS }, pages: [page] }, { cache: false });
  const out = asObj(payloadOf(res));
  const made = out && Array.isArray(out.pages) && out.pages[0];
  PENDING.push(Object.assign({ at: new Date().toISOString(), url: made && made.url }, props));
  try { await MCP.invalidate(NOTION, 'notion-query-data-sources', DS.inbox.spec.input); } catch (e) { /* refetch on next refresh */ }
  if (DS.inbox.started) begin(DS.inbox);
  notify();
  return made;
}
const PENDING = [];

/* ---- connect: Notion and Claude, each optional ---- */
(async () => {
  let m = null, s = null;
  try { m = window.claude && window.claude.use ? await window.claude.use('mcp') : null; } catch (e) { m = null; }
  MCP = m;
  MCP_STATE = m ? 'ready' : 'none';
  if (m) Object.values(DS).forEach((d) => { if (d.started) begin(d); });
  else Object.values(DS).forEach((d) => { d.status = 'connect'; d.code = 'not_granted'; });
  notify();
  try { s = window.claude && window.claude.use ? await window.claude.use('sample') : null; } catch (e) { s = null; }
  SAMPLE = s;
  notify();
})();
</script>
