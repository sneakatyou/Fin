<script>
/* ===== Detail sheets ===== */
const DIR_TONE = (v) => (v === 'Long' ? 'ok' : v === 'Short' ? 'bad' : 'muted');
const firstSentence = (t) => { const m = /^[\s\S]*?[.!?](?=\s|$)/.exec(t); return m ? m[0] : t; };
function openSetup(r, list) {
  const id = r['Setup ID'];
  const keys = Object.keys(r);
  const pre = keys.filter((k) => /^PRE /.test(k));
  const post = keys.filter((k) => /^POST /.test(k)).concat(['Data quality'].filter((k) => k in r));
  const other = keys.filter((k) => !pre.includes(k) && !post.includes(k) && k !== 'Setup ID' && k !== 'Instrument');
  const strip = (k) => k.replace(/^(PRE|POST) /, '');
  openSheet({
    kicker: [chip(id, 'muted'), r.Direction && chip(r.Direction, DIR_TONE(r.Direction)), r.Status && chip(r.Status, 'muted'), r.Market && chip(r.Market, 'sec')],
    title: firstSentence(clean(r.Instrument)) || id,
    nav: list ? { list, index: list.indexOf(r), open: openSetup } : null,
    build: (b) => {
      const jumpTo = (target) => () => { target.scrollIntoView({ behavior: REDUCED() ? 'auto' : 'smooth', block: 'start' }); const f = target.querySelector('input, textarea, button'); if (f) try { f.focus({ preventScroll: true }); } catch (e) { /* fine */ } };
      const acts = el('div', 'pd-sheet-actions');
      const fill = el('button', 'pd-btn small primary', 'Record your fill');
      fill.type = 'button';
      const nt = el('button', 'pd-btn small', 'Add a note');
      nt.type = 'button';
      acts.append(fill, nt);
      const lk = notionLink(r.url);
      if (lk) acts.append(lk);
      b.append(acts);
      if (clean(r.Instrument)) b.append(sec('Instrument', el('p', 'pd-pre', clean(r.Instrument))));
      b.append(sec('Plan, frozen before the open', fieldsKv(r, pre, { label: strip }) || empty('No plan fields recorded.')));
      b.append(sec('What happened', fieldsKv(r, post, { label: strip }) || empty('Not scored yet. The post-market review scores it after the close.')));
      const o = fieldsKv(r, other);
      if (o) b.append(sec('Details', o));
      b.append(pageSection(r.url, 'Notes on the page', { none: 'No notes on the page beyond the fields above.' }));
      const ib = inboxFor((x) => clean(x.About).includes(id));
      if (ib) b.append(ib);
      const ff = inboxForm({
        key: 'fill-' + id, title: 'Record your fill',
        hint: 'Only if you acted on it. The post-market review copies this into the ledger\'s actual-fill fields; the frozen plan is never changed.',
        fields: [
          { id: 'took', label: 'Did you take it?', type: 'choice', choices: ['Took trade', 'Did not take'] },
          { id: 'entry', label: 'Entry price', type: 'number' },
          { id: 'exit', label: 'Exit price', type: 'number' },
          { id: 'qty', label: 'Quantity or lots', type: 'number' },
          { id: 'notes', label: 'Anything else (times, partial exits, why)', type: 'textarea', wide: true },
        ],
        button: 'Save fill',
        make: (v) => {
          if (!v.took) return null;
          const parts = ['Took trade: ' + (v.took === 'Took trade' ? 'yes' : 'no')];
          if (v.entry) parts.push('Entry: ' + v.entry);
          if (v.exit) parts.push('Exit: ' + v.exit);
          if (v.qty) parts.push('Quantity: ' + v.qty);
          if (v.notes && v.notes.trim()) parts.push('Notes: ' + v.notes.trim());
          return { item: 'Fill for ' + id, kind: 'Fill', about: id, aboutPage: r.url, decision: v.took, details: parts.join('\n') };
        },
        invalid: 'Choose whether you took it.',
        done: 'Saved. The post-market review records it.',
      });
      const nf = noteForm(id, r.url);
      b.append(ff, nf);
      fill.addEventListener('click', jumpTo(ff));
      nt.addEventListener('click', jumpTo(nf));
      const a = askSection({ kind: 'Frozen setup', title: id, about: id, url: r.url, text: () => rowText(r) + '\n\nPage notes:\n' + ((pageData(r.url).data[0] || {}).Body || ''), suggestions: ['Is the trigger still valid against the latest pulse?', 'What would make this a false breakout?', 'How does this interact with my pledged collateral?'] });
      if (a) b.append(a);
    },
  });
}
function openLab(r, list) {
  const isRej = r.Type === 'Rejected trade';
  openSheet({
    kicker: [r.Type && chip(r.Type, 'muted'), !isRej && chip(r.Stage || 'Hypothesis'), r['date:Date:start'] && el('span', null, dayStr(r['date:Date:start']))],
    title: clean(r.Name) || 'Untitled',
    nav: list ? { list, index: list.indexOf(r), open: openLab } : null,
    build: (b) => {
      const lk = notionLink(r.url);
      if (lk) { const a0 = el('div', 'pd-sheet-actions'); a0.append(lk); b.append(a0); }
      if (isRej) {
        if (clean(r['Rejection reason'])) b.append(sec('Why it was passed on', el('p', 'pd-pre', clean(r['Rejection reason']))));
        b.append(sec('What the price did next', clean(r['Subsequent price behaviour']) ? el('p', 'pd-pre', clean(r['Subsequent price behaviour'])) : empty('Not scored yet. The post-market review fills this in.')));
      } else {
        ['Statement', 'Evidence so far', 'Decision log'].forEach((k) => { if (clean(r[k])) b.append(sec(k, el('p', 'pd-pre', clean(r[k])))); });
      }
      const skip = new Set(['Rejection reason', 'Subsequent price behaviour', 'Statement', 'Evidence so far', 'Decision log', 'Type', 'Stage']);
      const kv = fieldsKv(r, null, { skip });
      if (kv) b.append(sec('Details', kv));
      b.append(pageSection(r.url, 'Notes on the page', { none: 'No notes on the page beyond the fields above.' }));
      const ib = inboxFor((x) => clean(x.About) === clean(r.Name));
      if (ib) b.append(ib);
      b.append(noteForm(clean(r.Name), r.url));
      const a = askSection({ kind: r.Type || 'Hypothesis Lab entry', title: clean(r.Name), about: clean(r.Name), url: r.url, text: () => rowText(r) + '\n\nPage notes:\n' + ((pageData(r.url).data[0] || {}).Body || ''), suggestions: isRej ? ['Was rejecting this right, in hindsight?', 'What rule would have caught the better trade?', 'What does this teach about the setup family?'] : ['How much evidence would it take to promote this?', 'What could make this edge disappear?', 'How would I test this forward without overfitting?'] });
      if (a) b.append(a);
    },
  });
}
function proposalOf(notes) {
  const s = String(notes || '').replace(/\r/g, '');
  const i = s.indexOf('PROPOSED (');
  if (i < 0) return null;
  let rest = s.slice(i);
  const dbl = /<br\s*\/?>\s*<br\s*\/?>|\n\s*\n/i.exec(rest);
  if (dbl) rest = rest.slice(0, dbl.index);
  else { const one = /<br\s*\/?>|\n/i.exec(rest); if (one) rest = rest.slice(0, one.index); }
  return clean(rest);
}
function proposedLabel(text, current) {
  const body = text.replace(/^PROPOSED \([^)]*\):?/, '');
  const find = (skip) => {
    let best = null;
    for (const c of CLASSES) {
      const i = body.indexOf(c);
      if (i >= 0 && !(skip && c === current) && (best === null || i < best.i)) best = { c, i };
    }
    return best;
  };
  const b = find(true) || find(false);
  return b ? b.c : null;
}
function classDecider(r) {
  const text = proposalOf(r['Thesis and notes']);
  const cur = clean(r.Classification) || 'Unclassified';
  const prop = text ? proposedLabel(text, cur) : null;
  const done = inboxRows().find((x) => x.Kind === 'Classification' && clean(x.About) === r.Ticker && (x.Status === 'New' || x.pending));
  const state = done ? chip('You chose ' + (/to (.+?)\./.exec(clean(x0(done.Details))) || [0, done.Decision])[1] + ', waiting for the weekly review', 'muted') : null;
  return decideRow(CLASSES.filter((c) => c !== 'Unclassified'), {
    current: prop,
    state,
    confirmText: (c) => (c === prop ? 'Confirm the proposed label, ' + c + ', for ' + r.Ticker + '?' : 'Set ' + r.Ticker + ' to ' + c + ' instead of the proposal?'),
    make: (c, why) => ({ item: 'Classify ' + r.Ticker + ' as ' + c, kind: 'Classification', about: r.Ticker, aboutPage: r.url, decision: c === prop ? 'Confirm' : 'Change', details: 'Set classification to ' + c + '.' + (prop ? ' Proposal was ' + prop + '.' : '') + (why ? ' Reason: ' + why : '') }),
    toast: (c) => r.Ticker + ': ' + c + ' recorded. The weekly review applies it.',
  });
}
function x0(v) { return v || ''; }
function openHolding(r, list) {
  const t = String(r.Ticker || '');
  openSheet({
    kicker: [chip(t, 'muted'), r.Account && chip(r.Account, 'sec'), r.Status && chip(r.Status), chip(clean(r.Classification) || 'Unclassified', clean(r.Classification) && r.Classification !== 'Unclassified' ? '' : 'muted')],
    title: clean(r.Company) || t,
    nav: list ? { list, index: list.indexOf(r), open: openHolding } : null,
    build: (b) => {
      const lk = notionLink(r.url);
      if (lk) { const a0 = el('div', 'pd-sheet-actions'); a0.append(lk); b.append(a0); }
      const cur = curOf(r);
      const nums = el('dl', 'pd-kv');
      const add = (l, v) => { if (v && v !== '—') { const d = el('div'); d.append(el('dt', null, l), el('dd', 'num', v)); nums.append(d); } };
      add('Quantity', num(r.Qty) !== null ? F.qty.format(num(r.Qty)) : '');
      add('Average cost', num(r['Avg cost']) !== null ? money(r['Avg cost'], cur, 'p') : '');
      add('Last price', num(r['Last price']) !== null ? money(r['Last price'], cur, 'p') + (r['date:Price as of:start'] ? ', ' + dayStr(r['date:Price as of:start']) : '') : '');
      add('Current value', num(r['Current value']) !== null ? money(r['Current value'], cur, 'f') : '');
      add('Invested', num(r.Invested) !== null ? money(r.Invested, cur, 'f') : '');
      const p = rowsOf('holdings_pnl').find((x) => x.Ticker === t);
      add('P&L', p ? pct(p.pnl_pct, 1, true) : '');
      add('Weight in its book', num(r['Weight in own book pct']) !== null ? num(r['Weight in own book pct']).toFixed(1) + '%' : '');
      add('Pledged', clean(r.Pledged));
      if (nums.children.length) b.append(sec('Position', nums));
      if (clean(r['Thesis and notes'])) b.append(sec('Thesis and notes', clampBox(clean(r['Thesis and notes']), 10, 'hold:' + t, { cls: 'pd-pre' })));
      if (clean(r['Next catalyst'])) b.append(sec('Next catalyst', el('p', 'pd-pre', clean(r['Next catalyst']))));
      if (r.Status === 'Holding') {
        const text = proposalOf(r['Thesis and notes']);
        const s = sec('Classification', text ? el('p', 'pd-note', 'The weekly review proposed a label. Confirm it or pick another.') : el('p', 'pd-note', 'Set or change its label. The weekly review applies it.'));
        s.append(classDecider(r));
        b.append(s);
      }
      const skip = new Set(['Ticker', 'Company', 'Account', 'Status', 'Classification', 'Qty', 'Avg cost', 'Last price', 'Current value', 'Invested', 'Weight in own book pct', 'Pledged', 'Thesis and notes', 'Next catalyst', 'date:Price as of:start']);
      const kv = fieldsKv(r, null, { skip });
      if (kv) b.append(sec('Other fields', kv));
      const news = newsFor(t);
      if (news.length) {
        const g = el('div', 'pd-news');
        g.append(...news.slice(0, 6).map((n, i, arr) => newsCard(n, { list: arr })));
        b.append(sec('In the news', g));
      }
      const links = rowsOf('sectors').filter((x) => tickersIn(x['Your holdings']).includes(t.toUpperCase()));
      if (links.length) {
        const ul = el('ul', 'pd-inbox');
        links.forEach((x) => {
          const li = el('li');
          const top = el('div', 'top');
          top.append(chip(x.Direction || 'Mixed', x.Direction === 'Helps' ? 'ok' : x.Direction === 'Hurts' ? 'bad' : 'warn'), chip(x.Strength || '', 'muted'));
          li.append(top, el('div', 't', clean(x.Driver) + ' → ' + clean(x.Sector)), el('div', 'note', clean(x.Mechanism)));
          ul.append(li);
        });
        b.append(sec('Macro drivers that move it', ul));
      }
      b.append(pageSection(r.url, 'Notes on the page', { none: 'No notes on the page beyond the fields above.' }));
      const ib = inboxFor((x) => clean(x.About) === t);
      if (ib) b.append(ib);
      b.append(noteForm(t, r.url));
      const a = askSection({ kind: 'Holding', title: t, about: t, url: r.url, text: () => rowText(r) + '\n\nRecent news:\n' + news.slice(0, 8).map((n) => '- ' + clean(n.Headline) + ': ' + clean(n.Summary)).join('\n'), suggestions: ['If I were all cash, would I rebuild this position at this size?', 'What would falsify the thesis?', 'What does the market already price in?'] });
      if (a) b.append(a);
    },
  });
}
function openLog(r, list) {
  openSheet({
    kicker: [r.Type && chip(r.Type, 'muted'), el('span', null, dayStr(r['date:Date:start']))],
    title: clean(r.Title) || 'Log entry',
    nav: list ? { list, index: list.indexOf(r), open: openLog } : null,
    build: (b) => {
      const lk = notionLink(r.url);
      if (lk) { const a0 = el('div', 'pd-sheet-actions'); a0.append(lk); b.append(a0); }
      if (clean(r.Headline)) b.append(el('p', 'pd-takeaway', clean(r.Headline)));
      if (clean(r.Regime)) b.append(sec('Regime', el('p', 'pd-pre', clean(r.Regime))));
      b.append(pageSection(r.url, 'The full note'));
      const a = askSection({ kind: r.Type || 'Log entry', title: clean(r.Title), about: clean(r.Title), url: r.url, text: () => rowText(r) + '\n\n' + ((pageData(r.url).data[0] || {}).Body || ''), suggestions: ['Summarise this in five lines.', 'What did this get right and wrong, in hindsight?', 'What should I carry into tomorrow?'] });
      if (a) b.append(a);
    },
  });
}

/* ===== Header ===== */
function renderHeader() {
  const p = $('pd-takeaway');
  const st = stOf('latest_pulse');
  p.classList.remove('dash-skeleton', 'pd-failed');
  if (st === 'loading') { p.classList.add('dash-skeleton'); p.textContent = '—'; }
  else if (st !== 'ok') p.textContent = st === 'connect' ? 'Waiting for your Notion connection.' : 'The latest pulse did not load.';
  else {
    const r = oneOf('latest_pulse');
    if (!r) p.textContent = 'No pre-market pulse has been logged yet.';
    else { p.replaceChildren(el('span', null, dayStr(r.Date) + ' pre-market')); if (clean(r.Headline)) p.append(' · ', clean(r.Headline)); }
  }
  const started = Object.values(DS).filter((d) => d.started);
  const busy = started.some((d) => d.refreshing || d.status === 'loading');
  const at = Math.max(0, ...started.filter((d) => d.status === 'ok').map((d) => d.at || 0));
  $('pd-updated').textContent = busy ? 'Updating…' : at ? 'Updated ' + minsAgo(at) : '';
  $('pd-ask-desk').hidden = !SAMPLE;
  /* one message for the whole page when Notion is not reachable */
  const bn = $('pd-banner'), bt = $('pd-banner-text'), bb = $('pd-banner-btn');
  const codes = started.filter((d) => d.status === 'connect').map((d) => d.code);
  bn.hidden = !codes.length;
  bb.hidden = true;
  if (codes.length) {
    const c = codes[0];
    if (MCP_STATE === 'none' || c === 'not_granted' || c === 'capability_disabled') bt.textContent = 'Open this page in claude.ai, signed in, to read your Notion. It reads your Notion with your own access and needs your OK the first time.';
    else if (c === 'needs_reauth') bt.textContent = 'Your Notion connection needs signing in again: claude.ai Settings, Connectors, Notion.';
    else if (c === 'server_not_connected' || c === 'server_not_found') bt.textContent = 'Add the Notion connector in claude.ai Settings, Connectors, then refresh.';
    else if (c === 'selection_required') bt.textContent = 'You have more than one Notion connector. Choose one when claude.ai asks.';
    else if (c === 'blocked_by_policy') bt.textContent = 'Your organisation\'s policy blocks this page from reading Notion.';
    else {
      bt.textContent = 'This page needs your OK to read your Notion.';
      bb.hidden = false;
      bb.textContent = 'Allow Notion';
      bb.onclick = async () => {
        bb.disabled = true;
        try { await call('notion-query-data-sources', DS.portfolio.spec.input); restartAll(); }
        catch (e) { bt.textContent = 'Still not allowed. Use the page\'s permissions menu to allow Notion.'; }
        finally { bb.disabled = false; }
      };
    }
  }
}

/* ===== Today ===== */
function bandFill(node, st, build) {
  node.classList.remove('dash-skeleton', 'pd-failed', 'pd-dim');
  node.replaceChildren();
  if (st === 'loading') { node.classList.add('dash-skeleton'); node.textContent = '—'; return false; }
  if (st !== 'ok') { node.textContent = '—'; return false; }
  build(node);
  return true;
}
function renderBand() {
  const st = stOf('latest_pulse');
  const r = st === 'ok' ? oneOf('latest_pulse') : null;
  const cell = $('band-c-setups'), sub = $('band-setups-s');
  cell.classList.remove('hot');
  bandFill($('band-date'), st, (n) => {
    if (!r) { n.textContent = 'None yet'; n.classList.add('pd-dim'); return; }
    n.textContent = dayStr(r.Date);
  });
  bandFill($('band-regime'), st, (n) => {
    if (!r || !clean(r.Regime)) { n.textContent = '—'; n.classList.add('pd-dim'); return; }
    n.textContent = clean(r.Regime);
  });
  bandFill($('band-setups'), st, (n) => {
    const v = r ? num(r['Setups proposed']) : null;
    if (v === null) { n.textContent = '—'; n.classList.add('pd-dim'); return; }
    n.textContent = cnt(v);
    cell.classList.toggle('hot', v > 0);
  });
  sub.replaceChildren();
  if (st === 'ok') { const s = stOf('setup_stats') === 'ok' ? oneOf('setup_stats') : null; if (s) sub.append(cnt(s.open) + ' open in the ledger'); }
}
function renderRegime() {
  const box = $('regime-body');
  if (!gateBox(box, stOf('latest_pulse'))) return;
  const r = oneOf('latest_pulse');
  if (!r) { box.replaceChildren(empty('No pre-market pulse has been logged yet.')); return; }
  const top = el('div', 'pd-regime-top');
  top.append(el('span', null, dayStr(r.Date)), chip('Pre-market pulse', 'muted'));
  const main = el('div', 'pd-regime-main');
  main.append(top);
  if (clean(r.Regime)) main.append(el('div', 'pd-regime-regime pd-pre', clean(r.Regime)));
  if (clean(r.Headline)) main.append(el('div', 'pd-regime-headline pd-pre', clean(r.Headline)));
  box.replaceChildren(main);
}
let clipPulse = null;
function renderPulse() {
  const box = $('pulse-box'), key = $('pulse-key'), btn = $('pulse-toggle');
  $('pulse-ask').hidden = !SAMPLE || stOf('latest_pulse') !== 'ok' || !oneOf('latest_pulse');
  if (!gateBox(box, stOf('latest_pulse'))) { key.hidden = true; btn.hidden = true; return; }
  const r = oneOf('latest_pulse');
  const body = r && r.Body ? String(r.Body) : '';
  if (!body) {
    SIG[box.id] = null;
    box.replaceChildren(empty(r ? 'This pulse has no body text.' : 'No pre-market pulse has been logged yet.'));
    key.hidden = true; btn.hidden = true;
    return;
  }
  once(box.id, body, () => {
    renderNotion(box, body, { scope: 'pulse' });
    const s = sectionOf(body, /what matters for me today/i);
    key.hidden = !s;
    if (s) renderNotion($('pulse-key-body'), s, { scope: 'pulsekey' });
  });
  if (clipPulse) clipPulse();
}
const CARD_OPEN = new Map();
function setupCard(r, i, n, list) {
  const id = r['Setup ID'];
  const card = el('article', 'pd-setup');
  card.id = 'setup-' + safeId(id);
  const bodyId = card.id + '-body';
  const isOpen = CARD_OPEN.has(id) ? CARD_OPEN.get(id) : (n <= 2 || i === 0);
  card.classList.toggle('open', isOpen);
  const tg = el('button', 'pd-setup-toggle');
  tg.type = 'button';
  tg.setAttribute('aria-expanded', String(isOpen));
  tg.setAttribute('aria-controls', bodyId);
  const head = el('span', 'pd-setup-head');
  head.append(el('strong', 'pd-setup-id', id));
  if (r.Direction) head.append(chip(r.Direction, DIR_TONE(r.Direction)));
  if (r.Status) head.append(chip(r.Status, 'muted'));
  tg.append(head);
  const meta = el('span', 'pd-setup-meta');
  const bits = [r.Horizon, clean(r['Setup family']), r.Market, r['date:Frozen at:start'] ? 'Frozen ' + dayTimeStr(r['date:Frozen at:start']) : ''].filter(Boolean);
  meta.textContent = bits.join(' · ');
  if (bits.length) tg.append(meta);
  if (clean(r.Instrument)) tg.append(el('span', 'pd-setup-inst', clean(r.Instrument)));
  card.append(tg);
  const val = (field, lines) => {
    const full = clean(r[field]);
    if (!full) return el('div', 'pd-blk-v pd-dim', '—');
    return clampBox(full, lines, 'blk:' + id + ':' + field, { cls: 'pd-blk-v' });
  };
  const blk = (label, field) => { const b = el('div', 'pd-blk'); b.append(el('div', 'pd-blk-l', label), val(field, 4)); return b; };
  const body = el('div', 'pd-setup-body');
  body.id = bodyId;
  body.hidden = !isOpen;
  const grid = el('div', 'pd-blks');
  grid.append(blk('Trigger', 'PRE Trigger'), blk('Entry zone', 'PRE Entry zone'), blk('Stop', 'PRE Stop'), blk('Targets', 'PRE Targets'), blk('Time stop', 'PRE Time stop'));
  const acts = el('div', 'pd-sheet-actions');
  const more = el('button', 'pd-btn small tonal', 'Full plan, fill and notes');
  more.type = 'button';
  more.addEventListener('click', () => openSetup(r, list));
  acts.append(more);
  body.append(grid, acts);
  card.append(body);
  tg.addEventListener('click', () => {
    const o = !card.classList.contains('open');
    card.classList.toggle('open', o);
    tg.setAttribute('aria-expanded', String(o));
    body.hidden = !o;
    CARD_OPEN.set(id, o);
    measureClamps();
  });
  return card;
}
function renderOpenSetups() {
  const box = $('open-setups-list');
  if (!gateBox(box, stOf('ledger'))) return;
  const open = rowsOf('ledger').filter((r) => r.Status === 'Proposed' || r.Status === 'Entered').sort((a, b) => cmp(a['date:Frozen at:start'], b['date:Frozen at:start'], 'desc'));
  if (!open.length) { SIG[box.id] = null; box.replaceChildren(empty('No open setups. No trade is a valid answer.')); return; }
  once(box.id, JSON.stringify(open), () => {
    const list = el('div', 'pd-setups');
    list.append(...open.map((r, i) => setupCard(r, i, open.length, open)));
    box.replaceChildren(list);
  });
}
function renderInbox() {
  const box = $('inbox-list');
  if (!gateBox(box, stOf('inbox'))) return;
  const rows = inboxRows();
  if (!rows.length) { box.replaceChildren(empty('Nothing recorded yet. Decisions, fills, notes and questions you save on this page appear here.')); return; }
  const ul = el('ul', 'pd-inbox');
  ul.append(...rows.slice(0, 12).map(inboxItem));
  box.replaceChildren(ul);
}
function initGate() {
  const readNum = (id) => { const v = $(id).value.trim(); return v === '' || !isFinite(Number(v)) ? null : Number(v); };
  const flag = (id) => $(id).getAttribute('aria-pressed') === 'true';
  const fmt = (n) => String(Math.round(n * 100) / 100);
  function gate() {
    const gap = readNum('gate-gap'), vix = readNum('gate-vix'), mv = readNum('gate-vixmove');
    const ev = flag('gate-event'), dv = flag('gate-diverge');
    const why = [];
    if (gap !== null && Math.abs(gap) > RULES.gap) why.push('Opening gap of ' + fmt(gap) + '% is beyond ±' + RULES.gap.toFixed(2) + '%.');
    if (mv !== null && Math.abs(mv) > RULES.vixMove) why.push('VIX moved ' + fmt(mv) + '% today, beyond ±' + RULES.vixMove + '%.');
    if (ev) why.push('A high-impact event falls inside 09:15–14:30.');
    if (dv) why.push('Heavyweights are diverging.');
    const any = gap !== null || vix !== null || mv !== null || ev || dv;
    const v = why.length ? 'skip' : any ? 'go' : 'wait';
    $('gate-verdict').dataset.v = v;
    $('gate-word').textContent = v === 'skip' ? 'SKIP' : v === 'go' ? 'GO' : 'Enter the opening numbers';
    $('gate-why').replaceChildren(...why.map((t) => el('li', null, t)));
    $('band-gate').dataset.v = v;
    $('band-gate-word').textContent = v === 'skip' ? 'SKIP' : v === 'go' ? 'GO' : 'Not checked';
    $('band-gate-s').textContent = v === 'skip' ? 'A skip rule is triggered' : v === 'go' ? 'No skip rule is triggered' : 'Enter the opening numbers below';
    const note = $('gate-vixnote');
    let t = '';
    if (vix !== null) {
      if (vix < RULES.vixLow) t = 'chop and false-breakout risk';
      else if (vix < RULES.vixMidLo) t = 'between the chop and momentum bands, no clear read';
      else if (vix <= RULES.vixMidHi) t = 'momentum range';
      else if (vix <= RULES.vixHigh) t = 'between the momentum and whipsaw bands, no clear read';
      else t = 'whipsaw risk: cut size or skip';
      t = 'VIX at ' + fmt(vix) + ': ' + t + '.';
    }
    note.hidden = !t;
    note.textContent = t;
  }
  ['gate-gap', 'gate-vix', 'gate-vixmove'].forEach((id) => $(id).addEventListener('input', gate));
  ['gate-event', 'gate-diverge'].forEach((id) => $(id).addEventListener('click', () => { $(id).setAttribute('aria-pressed', String(!flag(id))); gate(); }));
  $('band-gate').addEventListener('click', () => go('day-gate'));
  let dir = 'Long';
  function size() {
    const risk = readNum('size-risk'), entry = readNum('size-entry'), stop = readNum('size-stop');
    const sign = dir === 'Long' ? 1 : -1;
    const sg = sign > 0 ? '+' : MINUS;
    $('size-t1-l').textContent = 'T1, book half (' + sg + RULES.t1.toFixed(2) + '%)';
    $('size-t2-l').textContent = 'T2, trail to cost (' + sg + RULES.t2.toFixed(2) + '%)';
    const out = ['size-qty', 'size-val', 'size-loss', 'size-t1', 'size-t2'];
    const warn = $('size-warn');
    const reset = (msg) => { out.forEach((id) => { $(id).textContent = '—'; }); warn.hidden = !msg; warn.textContent = msg || ''; };
    if (risk === null || entry === null || stop === null) { reset(''); return; }
    if (entry <= 0 || stop <= 0 || risk <= 0) { reset('Risk, entry and stop must be above zero.'); return; }
    if (entry === stop) { reset('Entry and stop are the same price.'); return; }
    if ((dir === 'Long' && stop > entry) || (dir === 'Short' && stop < entry)) {
      reset('The stop is on the wrong side of entry for a ' + dir.toLowerCase() + '. A ' + dir.toLowerCase() + ' needs the stop ' + (dir === 'Long' ? 'below' : 'above') + ' entry.');
      return;
    }
    const dist = Math.abs(entry - stop);
    const qty = Math.floor(risk / dist);
    warn.hidden = qty > 0;
    warn.textContent = qty > 0 ? '' : 'Risk is too small for one share at this stop distance.';
    $('size-qty').textContent = F.in0.format(qty);
    $('size-val').textContent = inr(qty * entry, 'f');
    $('size-loss').textContent = inr(qty * dist, 'f');
    $('size-t1').textContent = inr(entry * (1 + sign * RULES.t1 / 100), 'p');
    $('size-t2').textContent = inr(entry * (1 + sign * RULES.t2 / 100), 'p');
  }
  ['size-risk', 'size-entry', 'size-stop'].forEach((id) => $(id).addEventListener('input', size));
  const setDir = (d) => { dir = d; $('size-long').setAttribute('aria-pressed', String(d === 'Long')); $('size-short').setAttribute('aria-pressed', String(d === 'Short')); size(); };
  $('size-long').addEventListener('click', () => setDir('Long'));
  $('size-short').addEventListener('click', () => setDir('Short'));
  gate();
  size();
}
INIT_FNS.today = () => {
  initGate();
  clipPulse = clipper($('pulse-box'), $('pulse-toggle'));
  $('today-all-news').addEventListener('click', () => { show('news', true); window.scrollTo({ top: 0 }); });
  $('inbox-new').addEventListener('click', () => openSheet({ kicker: [chip('Decisions Inbox', 'muted')], title: 'Add a note or question', build: (b) => { b.append(noteForm('General', ''), noteForm('General', '', 'Question')); } }));
  $('pulse-ask').addEventListener('click', () => {
    const r = oneOf('latest_pulse');
    if (r) openAsk({ kind: 'Pre-market pulse', title: 'Pulse, ' + dayStr(r.Date), about: 'Pulse ' + dayStr(r.Date), url: r.url, text: () => rowText(r, ['Date', 'Headline', 'Regime', 'Setups proposed']) + '\n\n' + r.Body, suggestions: ['What matters most for my book today?', 'Where could this read be wrong?', 'Is there anything to do before the open?'] });
  });
};

/* ===== Portfolio ===== */
function renderAttn() {
  const box = $('attn-items'), wrap = $('portfolio-attn'), label = $('attn-label');
  if (!gateBox(box, stOf('data_gaps'))) { wrap.classList.remove('warn'); return; }
  const g = oneOf('data_gaps');
  box.replaceChildren();
  if (!g) return;
  const defs = [
    ['proposals', 'classification proposal waiting for your yes or no', 'classification proposals waiting for your yes or no', 'waiting-card'],
    ['unverified_pledged_india', 'Indian holding with an unverified pledge', 'Indian holdings with an unverified pledge', 'waiting-card'],
    ['no_qty', 'holding without a quantity', 'holdings without a quantity', 'waiting-card'],
  ];
  let any = 0;
  defs.forEach(([f, one, many, target]) => {
    const n = num(g[f]);
    if (!n) return;
    any++;
    const b = el('button', 'pd-attn-item');
    b.type = 'button';
    b.append(el('span', 'pd-attn-n', cnt(n)), el('span', null, plural(n, one, many)));
    b.addEventListener('click', () => go(target));
    box.append(b);
  });
  if (!any) box.append(chip('Nothing is waiting on you', 'ok'));
  wrap.classList.toggle('warn', any > 0);
  label.textContent = any ? 'Needs your attention' : 'All clear';
}
function setTile(prefix, st, ok, text, build) {
  const v = $(prefix + '-v'), s = $(prefix + '-s');
  v.classList.toggle('dash-skeleton', st === 'loading');
  s.replaceChildren();
  v.textContent = ok ? text : '—';
  if (!ok) { if (st === 'error') s.append(el('div', 'pd-failed', 'Did not load')); return; }
  build(s);
}
function pnlSub(s, t, valKey, pctKey, cur) {
  const v = num(t[valKey]);
  const cls = sgn(v);
  s.append('P&L ', el('span', cls, signedMoney(v, cur)), ' (', el('span', cls, pct(t[pctKey], 1, true)), ')');
}
function renderKpis() {
  const st = stOf('totals');
  const t = oneOf('totals'), ok = st === 'ok' && !!t;
  setTile('kpi-total', st, ok, ok && inr(t.total_inr), (s) => {
    s.append('US at ₹' + F.in2.format(Number(t.rate)) + '/$ (' + (t.fxsource || 'latest') + ')');
    const names = andList(t.elsewhere_tickers);
    s.append('; ' + (names || 'held-elsewhere stocks') + ' at the approximate values you gave');
  });
  setTile('kpi-india', st, ok, ok && inr(t.india_value), (s) => pnlSub(s, t, 'india_pnl', 'india_pnl_pct', 'INR'));
  setTile('kpi-us', st, ok, ok && usd(t.us_value), (s) => pnlSub(s, t, 'us_pnl', 'us_pnl_pct', 'USD'));
  setTile('kpi-else', st, ok, ok && usd(t.elsewhere_value), (s) => { s.append(t.elsewhere_tickers ? t.elsewhere_tickers + ' (approx.)' : 'Nothing held outside the two books'); });
  setTile('kpi-ved', st, ok, ok && pct(t.vedanta_share_of_india, 1), (s) => { s.append(inr(t.vedanta_value) + ' across ' + cnt(t.vedanta_count) + ' tickers, one position'); });
  setTile('kpi-top', st, ok, ok && pct(t.largest_share, 1), (s) => { s.append(String(t.largest_name || '—') + ' · ' + inr(t.largest_value_inr)); });
}
function drawThemes(box, data) {
  box.replaceChildren();
  const W = Math.floor(box.clientWidth);
  if (W < 60) return;
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('role', 'img').attr('aria-label', 'Bar chart of portfolio value by theme');
  const measure = (txt, cls) => { const t = svg.append('text').attr('class', 'pd-ct ' + (cls || '')).text(txt); const w = t.node().getComputedTextLength(); t.remove(); return w; };
  const endTxt = (d) => inr(d.value_inr) + ' · ' + pct(d.share, 1);
  const endW = d3.max(data, (d) => measure(endTxt(d), 'v'));
  let labelW = Math.min(d3.max(data, (d) => measure(d.Theme)), W * 0.36);
  const stacked = W < 480 || W - labelW - 12 - endW - 8 < 90;
  if (stacked) labelW = 0;
  const x0 = stacked ? 0 : labelW + 12;
  const barMax = stacked ? W : W - x0 - endW - 8;
  const sx = d3.scaleLinear([0, d3.max(data, (d) => d.value_inr) || 1], [0, barMax]);
  const rowH = stacked ? 56 : 44, barH = stacked ? 12 : 16, pad = 4;
  const H = pad * 2 + data.length * rowH;
  svg.attr('viewBox', '0 0 ' + W + ' ' + H).attr('height', H);
  const tip = makeTip(box);
  const fit = (sel, label, maxW) => {
    let s = label;
    sel.text(s);
    while (sel.node().getComputedTextLength() > maxW && s.length > 1) { s = s.slice(0, -1); sel.text(s.trimEnd() + '…'); }
  };
  const lines = (d) => [['Value', inr(d.value_inr, 'f')], ['Share', pct(d.share, 1)], ['Holdings', cnt(d.positions)]];
  data.forEach((d, i) => {
    const y = pad + i * rowH;
    const w = Math.max(2, sx(d.value_inr));
    const g = svg.append('g').attr('class', 'pd-row').attr('tabindex', 0).attr('aria-label', d.Theme + ': ' + endTxt(d));
    g.append('rect').attr('class', 'pd-hit').attr('x', 0).attr('y', y).attr('width', W).attr('height', rowH).attr('rx', 12);
    const fill = i === 0 ? 'var(--primary)' : 'var(--chart-muted)';
    if (stacked) {
      fit(g.append('text').attr('class', 'pd-ct').attr('x', 0).attr('y', y + 20), d.Theme, W - endW - 12);
      g.append('text').attr('class', 'pd-ct v').attr('x', W).attr('y', y + 20).attr('text-anchor', 'end').text(endTxt(d));
      g.append('rect').attr('x', 0).attr('y', y + 30).attr('width', w).attr('height', barH).attr('rx', barH / 2).style('fill', fill);
    } else {
      fit(g.append('text').attr('class', 'pd-ct').attr('x', 0).attr('y', y + rowH / 2).attr('dy', '0.35em'), d.Theme, labelW);
      g.append('rect').attr('x', x0).attr('y', y + (rowH - barH) / 2).attr('width', w).attr('height', barH).attr('rx', barH / 2).style('fill', fill);
      g.append('text').attr('class', 'pd-ct v').attr('x', x0 + w + 8).attr('y', y + rowH / 2).attr('dy', '0.35em').text(endTxt(d));
    }
    g.on('pointermove', (e) => { const b = box.getBoundingClientRect(); tip.show(d.Theme, lines(d), e.clientX - b.left, e.clientY - b.top); })
      .on('pointerleave', () => tip.hide())
      .on('focus', () => tip.show(d.Theme, lines(d), Math.min(W - 20, x0 + w), y + rowH / 2))
      .on('blur', () => tip.hide());
  });
}
function renderThemes() {
  const box = $('theme-chart');
  if (!gateBox(box, stOf('by_theme'))) return;
  const data = rowsOf('by_theme');
  if (!data.length) { box.replaceChildren(empty('No holdings to chart yet.')); return; }
  once(box.id, JSON.stringify(data) + '|' + box.clientWidth, () => drawThemes(box, data));
}
let RATE = 1;
const PNL = new Map();
const curOf = (r) => r.Currency || (r.Market === 'US' ? 'USD' : 'INR');
const valInr = (r) => { const v = num(r['Current value']); return v === null ? null : v * (curOf(r) === 'USD' ? RATE : 1); };
const priceCell = (f) => (td, r) => { const v = num(r[f]); if (v === null) dim(td); else td.textContent = money(v, curOf(r), 'p'); };
const chipCell = (f, tone) => (td, r) => { const v = clean(r[f]); if (!v) { dim(td); return; } td.append(chip(v, tone(v))); };
const asOfCell = (td, r) => {
  const s = r['date:Price as of:start'];
  if (!s) { dim(td); return; }
  td.textContent = dayStr(s);
  const age = ageDays(s);
  if (age > STALE_DAYS) { td.classList.add('stale'); td.title = 'Price is ' + age + ' days old'; }
};
const HCOLS = [
  C('Ticker', 'Ticker', { stick: true }),
  C('Company', 'Company', { hide: true }),
  C('Account', 'Account'),
  C('Qty', 'Qty', { num: true, sort: (r) => num(r.Qty), cell: (td, r) => { const v = num(r.Qty); if (v === null) dim(td); else td.textContent = F.qty.format(v); } }),
  C('Avg cost', 'Avg cost', { num: true, hide: true, sort: (r) => num(r['Avg cost']), cell: priceCell('Avg cost') }),
  C('Last price', 'Last price', { num: true, sort: (r) => num(r['Last price']), cell: priceCell('Last price') }),
  C('Current value', 'Current value', { num: true, sort: valInr, cell: (td, r) => { const v = num(r['Current value']); if (v === null) { dim(td); return; } td.textContent = (r.Account === 'Other / not shown' ? '≈' : '') + money(v, curOf(r), 'f'); } }),
  { f: 'pnl_pct', l: 'P&L %', num: true, sort: (r) => (PNL.has(r.Ticker) ? PNL.get(r.Ticker) : null), cell: (td, r) => { const v = PNL.get(r.Ticker); if (v === undefined) { dim(td); return; } td.textContent = pct(v, 1, true); td.classList.add(sgn(v)); } },
  C('Weight in own book pct', 'Weight', {
    num: true, sort: (r) => num(r['Weight in own book pct']),
    cell: (td, r) => {
      const w = num(r['Weight in own book pct']);
      if (w === null) { dim(td); return; }
      const wrap = el('div', 'wcell'), track = el('span', 'w-track'), fill = el('span', 'w-fill');
      fill.style.width = Math.max(0, Math.min(100, w)) + '%';
      track.append(fill);
      wrap.append(el('span', null, w.toFixed(1) + '%'), track);
      td.append(wrap);
    },
  }),
  C('Theme', 'Theme', { hide: true }),
  C('Classification', 'Classification', { cell: chipCell('Classification', (v) => (v === 'Unclassified' ? 'muted' : '')) }),
  C('Pledged', 'Pledged', { cell: chipCell('Pledged', (v) => (v === 'Unverified' ? 'warn' : v === 'No' ? 'muted' : '')) }),
  C('date:Price as of:start', 'Price as of', { cell: asOfCell, first: 'desc' }),
];
const WCOLS = [
  C('Ticker', 'Ticker', { stick: true }),
  C('Company', 'Company'),
  C('Theme', 'Theme', { hide: true }),
  C('Last price', 'Last price', { num: true, sort: (r) => num(r['Last price']), cell: priceCell('Last price') }),
  C('date:Price as of:start', 'Price as of', { cell: asOfCell, first: 'desc' }),
  C('Next catalyst', 'Next catalyst', { sort: (r) => clean(r['Next catalyst']), cell: (td, r) => clampCell(td, clean(r['Next catalyst']), 2, 'watch:' + r.Ticker) }),
];
let HT = null, WT = null;
function renderHoldings() {
  if (!HT) return;
  if (!tableGate($('holdings-state'), $('holdings-wrap'), stOf('portfolio'))) { $('holdings-empty').hidden = true; return; }
  RATE = num((oneOf('fx') || {}).rate) || 1;
  PNL.clear();
  rowsOf('holdings_pnl').forEach((r) => PNL.set(r.Ticker, r.pnl_pct));
  const q = $('holdings-search').value.trim().toLowerCase();
  const list = rowsOf('portfolio').filter((r) => r.Status === 'Holding').filter((r) => !q || [r.Ticker, r.Company, r.Account, r.Theme, r.Classification, r.Pledged].join(' ').toLowerCase().includes(q));
  HT.paint(list);
  $('holdings-empty').hidden = list.length > 0;
}
function renderWatch() {
  if (!WT) return;
  if (!tableGate($('watch-state'), $('watch-wrap'), stOf('portfolio'))) return;
  const list = rowsOf('portfolio').filter((r) => r.Status === 'Watch');
  if (!list.length) { $('watch-wrap').hidden = true; const s = $('watch-state'); s.hidden = false; s.replaceChildren(empty('Nothing on the watchlist.')); return; }
  WT.paint(list);
}
function renderWaiting() {
  const box = $('waiting-body');
  if (!gateBox(box, stOf('portfolio', 'data_gaps', 'inbox'))) return;
  const g = oneOf('data_gaps');
  const props = rowsOf('portfolio').filter((r) => r.Status === 'Holding' && proposalOf(r['Thesis and notes']));
  const sig = JSON.stringify(props.map((r) => [r.Ticker, r.Classification, r['Thesis and notes']])) + JSON.stringify(g) + inboxRows().length;
  once(box.id, sig, () => {
    box.replaceChildren(el('h3', 'pd-card-t', 'Classification proposals'));
    if (!props.length) box.append(empty('No classification proposals are waiting for a yes or no.'));
    else {
      const ul = el('ul', 'pd-sublist');
      props.forEach((r) => {
        const text = proposalOf(r['Thesis and notes']);
        const li = el('li', 'pd-prop');
        const h = el('div', 'pd-prop-h');
        const tb = el('button', 'pd-rowbtn', r.Ticker);
        tb.type = 'button';
        tb.addEventListener('click', () => openHolding(r));
        h.append(tb, chip('now ' + (clean(r.Classification) || 'Unclassified'), 'muted'));
        const label = proposedLabel(text, clean(r.Classification));
        if (label) h.append(chip('proposed: ' + label));
        li.append(h, clampBox(text, 4, 'prop:' + r.Ticker, { cls: 'pd-pre' }), classDecider(r));
        ul.append(li);
      });
      box.append(ul);
    }
    box.append(el('h3', 'pd-card-t', 'Data gaps'));
    const gl = el('ul', 'pd-gaps');
    if (g) {
      const a = el('li');
      a.append(el('span', 'pd-gap-n', cnt(g.unverified_pledged_india)), ' Indian holdings have an unverified pledge status' + (g.unverified_tickers ? ' (' + g.unverified_tickers + ')' : '') + '. Which stocks are pledged, and their haircuts, are unverified.');
      const b = el('li');
      b.append(el('span', 'pd-gap-n', cnt(g.no_qty)), ' holdings have no quantity' + (g.no_qty_tickers ? ' (' + g.no_qty_tickers + ')' : '') + ', so their value is the approximate figure you gave.');
      gl.append(a, b);
    }
    const tell = el('li');
    const tb = el('button', 'pd-btn small', 'Tell the runs what is pledged');
    tb.type = 'button';
    tb.addEventListener('click', () => openSheet({ kicker: [chip('Decisions Inbox', 'muted')], title: 'Pledged holdings and quantities', build: (bd) => bd.append(noteForm('Collateral and quantities', PAGES.collateral)) }));
    tell.append(el('p', null, 'You can fill these gaps from here; the weekly review records what you say.'), tb);
    gl.append(tell);
    box.append(gl);
  });
}
let clipColl = null;
function renderCollateral() {
  const box = $('collateral-body'), btn = $('collateral-toggle');
  if (!gateBox(box, stOf('collateral'))) { btn.hidden = true; return; }
  const r = oneOf('collateral');
  if (!r || !r.Body) { SIG[box.id] = null; box.replaceChildren(empty('The collateral page has no text yet.')); btn.hidden = true; return; }
  once(box.id, String(r.Body), () => renderNotion(box, String(r.Body), { scope: 'coll' }));
  if (clipColl) clipColl();
}
INIT_FNS.portfolio = () => {
  HT = makeTable($('holdings-table'), HCOLS, { sort: ['Current value', 'desc'], key: 'Ticker', redraw: renderHoldings, open: openHolding });
  WT = makeTable($('watch-table'), WCOLS, { sort: ['Ticker', 'asc'], key: 'Ticker', redraw: renderWatch, open: openHolding });
  $('holdings-search').addEventListener('input', renderHoldings);
  clipColl = clipper($('collateral-body'), $('collateral-toggle'));
};
</script>
