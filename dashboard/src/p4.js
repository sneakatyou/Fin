<script>
/* ===== Trades and research ===== */
function renderStats() {
  const st = stOf('setup_stats');
  const s = oneOf('setup_stats'), ok = st === 'ok' && !!s;
  setTile('kpi-frozen', st, ok, ok && cnt(s.frozen), () => {});
  setTile('kpi-open', st, ok, ok && cnt(s.open), () => {});
  setTile('kpi-trig', st, ok, ok && cnt(s.triggered), (sub) => { sub.append(cnt(s.entered) + ' entered by you'); });
  setTile('kpi-rej', st, ok, ok && cnt(s.rejected), (sub) => { if (s.rejected_unscored) sub.append(cnt(s.rejected_unscored) + ' not scored yet'); });
  setTile('kpi-avgr', st, ok, ok && rfmt(s.avg_theoretical_R), (sub) => { sub.append('n = ' + cnt(s.scored)); });
  $('kpi-open').classList.toggle('hot', ok && Number(s.open) > 0);
  if (ok) { const v = $('kpi-avgr-v'); v.classList.remove('pos', 'neg'); if (num(s.avg_theoretical_R) !== null) v.classList.add(sgn(num(s.avg_theoretical_R))); }
  const note = $('stats-note');
  note.textContent = !ok ? '' : s.scored < SCORED_MIN ? 'Too few scored setups to judge any edge yet (n = ' + cnt(s.scored) + ').' : 'Average theoretical R across ' + cnt(s.scored) + ' scored setups. It describes what was frozen, not what comes next.';
}
const istDay = (s) => { const d = istDate(s); return d ? d.toISOString().slice(0, 10) : ''; };
function dayModel() {
  const days = new Map();
  const at = (k) => { if (!days.has(k)) days.set(k, { day: k, pulses: [], setups: [], rejects: [] }); return days.get(k); };
  rowsOf('pulse').forEach((r) => { const k = String(r['date:Date:start'] || '').slice(0, 10); if (k) at(k).pulses.push(r); });
  rowsOf('ledger').forEach((r) => { const k = istDay(r['date:Frozen at:start']); if (k) at(k).setups.push(r); });
  rowsOf('lab').filter((r) => r.Type === 'Rejected trade').forEach((r) => { const k = String(r['date:Date:start'] || '').slice(0, 10); if (k) at(k).rejects.push(r); });
  return Array.from(days.values()).sort((a, b) => cmp(a.day, b.day, 'desc'));
}
const outcomeOf = (r) => clean(r['POST Outcome']) || (r['POST Trigger occurred'] ? 'Trigger: ' + r['POST Trigger occurred'] : r.Status || '');
function setupChip(r, list) {
  const b = el('button', 'pd-chip');
  b.type = 'button';
  b.style.border = '0';
  b.style.cursor = 'pointer';
  b.textContent = r['Setup ID'] + ' · ' + (r.Direction || '') + (outcomeOf(r) ? ' · ' + outcomeOf(r).slice(0, 40) : '');
  b.addEventListener('click', (e) => { e.stopPropagation(); openSetup(r, list); });
  return b;
}
let DAYS_N = 10;
function renderDays() {
  const box = $('days-list'), more = $('days-more');
  if (!gateBox(box, stOf('pulse', 'ledger', 'lab'))) { more.hidden = true; return; }
  const days = dayModel();
  if (!days.length) { box.replaceChildren(empty('Nothing logged yet.')); more.hidden = true; return; }
  once(box.id, String(DAYS_N) + JSON.stringify(days.map((d) => [d.day, d.pulses.length, d.setups.map((s) => s.Status + s['POST Outcome']), d.rejects.length]) ), () => {
    const list = el('div', 'pd-days');
    days.slice(0, DAYS_N).forEach((d, i) => {
      const b = el('button', 'pd-day');
      b.type = 'button';
      const dt = el('div', 'dt', dayStr(d.day));
      dt.prepend(el('small', null, weekday(d.day)));
      const bd = el('div', 'bd');
      const pre = d.pulses.find((p) => p.Type === 'Pre-market pulse');
      const other = d.pulses.filter((p) => p.Type !== 'Pre-market pulse');
      if (pre && clean(pre.Regime)) bd.append(el('div', 'rg', clean(pre.Regime)));
      else if (pre && clean(pre.Headline)) bd.append(el('div', 'rg', clean(pre.Headline)));
      const row = el('div', 'row');
      if (d.setups.length) d.setups.forEach((s) => row.append(setupChip(s, d.setups)));
      else if (pre) row.append(chip('No setup frozen', 'muted'));
      if (d.rejects.length) row.append(chip(d.rejects.length + ' ' + plural(d.rejects.length, 'candidate', 'candidates') + ' passed on', 'warn'));
      other.forEach((p) => row.append(chip(p.Type, 'sec')));
      if (row.children.length) bd.append(row);
      b.append(dt, bd);
      b.addEventListener('click', () => openDay(d, days));
      list.append(b);
    });
    box.replaceChildren(list);
  });
  more.hidden = days.length <= DAYS_N;
}
function openDay(d, days) {
  const pre = d.pulses.find((p) => p.Type === 'Pre-market pulse');
  const post = d.pulses.find((p) => p.Type === 'Post-market review');
  openSheet({
    kicker: [chip(weekday(d.day), 'muted'), pre && pre.Regime ? null : null],
    title: dayStr(d.day) + (pre && clean(pre.Headline) ? ': ' + clean(pre.Headline).slice(0, 90) : ''),
    nav: days ? { list: days, index: days.indexOf(d), open: openDay } : null,
    build: (b) => {
      if (pre && clean(pre.Regime)) b.append(sec('Regime the pulse read', el('p', 'pd-pre', clean(pre.Regime))));
      const sl = el('div', 'pd-setups');
      d.setups.forEach((s, i) => sl.append(setupCard(s, i, 99, d.setups)));
      b.append(sec('Setups frozen', d.setups.length ? sl : empty('No setup was frozen. No trade is a valid answer.')));
      if (d.rejects.length) {
        const ul = el('ul', 'pd-inbox');
        d.rejects.forEach((r) => {
          const li = el('li');
          const t = el('button', 'pd-rowbtn t', clean(r.Name));
          t.type = 'button';
          t.addEventListener('click', () => openLab(r, d.rejects));
          li.append(t);
          if (clean(r['Rejection reason'])) li.append(el('div', 'note', 'Why passed on: ' + clean(r['Rejection reason'])));
          li.append(el('div', 'note', 'What price did next: ' + (clean(r['Subsequent price behaviour']) || 'not scored yet')));
          ul.append(li);
        });
        b.append(sec('Candidates passed on', ul));
      }
      if (post) {
        const s = sec('Post-market review', el('p', 'pd-takeaway', clean(post.Headline)));
        const ob = el('button', 'pd-btn small', 'Read the review');
        ob.type = 'button';
        ob.addEventListener('click', () => openLog(post));
        s.append(ob);
        b.append(s);
      }
      if (pre) b.append(pageSection(pre.url, 'The pre-market pulse'));
      const a = askSection({ kind: 'Trading day', title: dayStr(d.day), about: 'Day ' + d.day, text: () => {
        const bits = [];
        if (pre) bits.push('Pre-market pulse:\n' + rowText(pre, ['Headline', 'Regime']) + '\n' + ((pageData(pre.url).data[0] || {}).Body || ''));
        d.setups.forEach((s) => bits.push('Setup:\n' + rowText(s)));
        d.rejects.forEach((r) => bits.push('Rejected candidate:\n' + rowText(r)));
        if (post) bits.push('Post-market review: ' + clean(post.Headline));
        return bits.join('\n\n');
      }, suggestions: ['In hindsight, what would have worked this day?', 'Which rule cost us, and should it change?', 'What did the market tell us that the pulse missed?'] });
      if (a) b.append(a);
    },
  });
}
function proposalRows(body) {
  const lines = String(body || '').replace(/\r\n?/g, '\n').split('\n');
  let i = lines.findIndex((l) => /^\s*#{1,6}\s.*open proposals/i.test(l));
  if (i < 0) return null;
  let j = i + 1;
  while (j < lines.length && !/^\s*#{1,6}\s/.test(lines[j])) j++;
  const part = lines.slice(i + 1, j).join('\n');
  const t0 = part.indexOf('<table');
  if (t0 >= 0) {
    const t1 = part.indexOf('</table>', t0);
    const src = part.slice(t0, t1 > 0 ? t1 + 8 : undefined);
    const hr = /header-row="true"/.test(src.slice(0, src.indexOf('>') + 1));
    const rows = tableCells(src).map((r) => r.map((c) => plainOf(c.replace(/<br\s*\/?>/gi, ' '))));
    return { head: hr ? rows[0] : null, rows: hr ? rows.slice(1) : rows };
  }
  const pipe = part.split('\n').filter((l) => l.trim().startsWith('|'));
  if (pipe.length) {
    const rows = pipe.filter((l) => !NR_SEP.test(l.trim())).map((l) => splitRow(l).map(plainOf));
    return { head: rows[0], rows: rows.slice(1) };
  }
  return { head: null, rows: [] };
}
function renderProposals() {
  const box = $('props-list');
  const d = pageData(PAGES.checklists);
  if (!gateBox(box, d.status === 'ok' ? stOf('inbox') : d.status)) return;
  const page = d.data[0] || {};
  const parsed = proposalRows(page.Body);
  const sig = JSON.stringify(parsed) + inboxRows().length;
  once(box.id, sig, () => {
    if (!parsed || !parsed.rows.length) { box.replaceChildren(empty('No open proposals on the Checklists page.')); return; }
    const head = (parsed.head || []).map((h) => h.toLowerCase());
    const di = head.findIndex((h) => /decision|status|decided/.test(h));
    const ul = el('ul', 'pd-props');
    parsed.rows.forEach((row, i) => {
      const n = i + 1;
      const text = row[0] || '';
      const li = el('li');
      li.append(el('span', 'n', String(n)));
      const tx = el('div');
      tx.append(el('div', 'tx', text));
      if (row[1] && di !== 1) tx.append(el('div', 'src', 'From: ' + row[1]));
      li.append(tx);
      const decided = di >= 0 ? row[di] : '';
      const mine = inboxRows().find((x) => x.Kind === 'Decision' && clean(x.About).startsWith('Open proposal ' + n + ':'));
      const state = decided ? chip('Decided: ' + decided.slice(0, 60), 'ok') : mine ? chip('You chose ' + mine.Decision + (mine.Status === 'Applied' ? ', applied' : ', waiting for the Saturday review'), mine.Status === 'Applied' ? 'ok' : 'muted') : null;
      const dr = decideRow(['Adopt', 'Reject', 'Defer'], {
        current: mine ? mine.Decision : null,
        state,
        confirmText: (c) => c + ' proposal ' + n + '? The Saturday review applies it with a dated change-log line.',
        make: (c, why) => ({ item: c + ' open proposal ' + n, kind: 'Decision', about: 'Open proposal ' + n + ': ' + text.slice(0, 160), aboutPage: PAGES.checklists, decision: c, details: 'Proposal ' + n + ': ' + text + (why ? '\nReason: ' + why : '') }),
        toast: (c) => 'Proposal ' + n + ': ' + c + ' recorded.',
      });
      dr.classList.add('acts');
      dr.style.gridColumn = '2';
      li.append(dr);
      ul.append(li);
    });
    box.replaceChildren(ul);
  });
}
const rCell = (f) => (td, r) => { const v = num(r[f]); if (v === null) { dim(td); return; } td.textContent = rfmt(v); td.classList.add(sgn(v)); };
const LCOLS = [
  C('Setup ID', 'Setup', { stick: true }),
  C('date:Frozen at:start', 'Frozen (IST)', { first: 'desc', cell: (td, r) => { const s = r['date:Frozen at:start']; if (s) td.textContent = dayTimeStr(s); else dim(td); } }),
  C('Instrument', 'Instrument', { sort: (r) => clean(r.Instrument), cell: (td, r) => { const full = clean(r.Instrument); if (!full) { dim(td); return; } td.classList.add('wrapc'); td.textContent = firstSentence(full); } }),
  C('Direction', 'Direction', { cell: chipCell('Direction', DIR_TONE) }),
  C('Setup family', 'Setup family', { hide: true }),
  C('Status', 'Status', { cell: chipCell('Status', () => 'muted') }),
  C('POST Trigger occurred', 'Trigger occurred'),
  C('POST Outcome', 'Outcome', { cell: (td, r) => { const v = clean(r['POST Outcome']); if (!v) { dim(td); return; } td.classList.add('wrapc'); td.textContent = v.length > 90 ? v.slice(0, 88) + '…' : v; } }),
  C('POST Theoretical R', 'Theoretical R', { num: true, sort: (r) => num(r['POST Theoretical R']), cell: rCell('POST Theoretical R') }),
];
const RCOLS = [
  C('Name', 'Name', { stick: true, cell: (td, r) => { td.textContent = r.Name; td.classList.add('wrapc'); } }),
  C('date:Date:start', 'Date', { first: 'desc', cell: (td, r) => { if (r['date:Date:start']) td.textContent = dayStr(r['date:Date:start']); else dim(td); } }),
  C('Rejection reason', 'Rejection reason', { sort: (r) => clean(r['Rejection reason']), cell: (td, r) => { const v = clean(r['Rejection reason']); if (!v) { dim(td); return; } td.classList.add('wrapc'); td.textContent = v.length > 110 ? v.slice(0, 108) + '…' : v; } }),
  C('Subsequent price behaviour', 'What price did next', { sort: (r) => clean(r['Subsequent price behaviour']), cell: (td, r) => { const v = clean(r['Subsequent price behaviour']); td.classList.add('wrapc'); if (v) td.textContent = v.length > 110 ? v.slice(0, 108) + '…' : v; else { td.textContent = 'Not scored yet'; td.classList.add('pd-dim'); } } }),
];
let LT = null, RT = null;
const LSTATUS = new Set();
function renderLedger() {
  if (!LT) return;
  if (!tableGate($('ledger-state'), $('ledger-wrap'), stOf('ledger'))) return;
  const all = rowsOf('ledger');
  const statuses = Array.from(new Set(all.map((r) => r.Status).filter(Boolean))).sort();
  const box = $('ledger-status');
  if (box.dataset.sig !== statuses.join('|') + '|' + Array.from(LSTATUS).join('|')) {
    box.dataset.sig = statuses.join('|') + '|' + Array.from(LSTATUS).join('|');
    fchips(box, statuses, LSTATUS, renderLedger);
  }
  const q = $('ledger-search').value.trim().toLowerCase();
  const list = all.filter((r) => (!LSTATUS.size || LSTATUS.has(r.Status)) && (!q || Object.values(r).join(' ').toLowerCase().includes(q)));
  $('ledger-count').textContent = list.length + ' of ' + all.length;
  if (!all.length) { $('ledger-wrap').hidden = true; const s = $('ledger-state'); s.hidden = false; s.replaceChildren(empty('No setups have been frozen yet.')); return; }
  LT.paint(list);
}
function stageOf(r) { return r.Stage || 'Hypothesis'; }
function hcard(r, list) {
  const b = el('button', 'pd-hcard');
  b.type = 'button';
  b.append(el('span', 'pd-hcard-n', r.Name));
  const m = el('span', 'pd-hcard-m');
  const nSize = num(r['Sample size']), nWins = num(r.Wins);
  m.textContent = 'n = ' + (nSize === null ? '—' : cnt(nSize)) + ' · wins = ' + (nWins === null ? '—' : cnt(nWins));
  b.append(m);
  const ex = num(r['Expectancy R']);
  if (ex !== null) { const e = el('span', 'pd-hcard-m'); e.append('Expectancy ', el('span', sgn(ex), rfmt(ex))); b.append(e); }
  if (r['date:Date:start']) b.append(el('span', 'pd-hcard-m', dayStr(r['date:Date:start'])));
  b.addEventListener('click', () => openLab(r, list));
  return b;
}
function renderPipeline() {
  const box = $('pipe-board');
  if (!gateBox(box, stOf('lab', 'lab_stages'))) return;
  const stages = rowsOf('lab_stages');
  const hyp = rowsOf('lab').filter((r) => r.Type === 'Strategy hypothesis');
  once(box.id, JSON.stringify(hyp.map((r) => [r.Name, r.Stage, r['Sample size'], r.Wins, r['Expectancy R']])), () => {
    box.replaceChildren(...stages.map((s) => {
      const col = el('div', 'pd-col');
      const h = el('div', 'pd-col-head');
      h.append(el('span', null, s.Stage), el('span', 'n', cnt(s.n)));
      col.append(h);
      const cards = hyp.filter((r) => stageOf(r) === s.Stage).sort((a, b) => cmp(a['date:Date:start'], b['date:Date:start'], 'desc'));
      if (!cards.length) col.append(el('p', 'pd-note', 'None'));
      cards.forEach((r) => col.append(hcard(r, cards)));
      return col;
    }));
  });
}
function renderRejected() {
  if (!RT) return;
  if (!tableGate($('rej-state'), $('rej-wrap'), stOf('lab'))) return;
  const all = rowsOf('lab').filter((r) => r.Type === 'Rejected trade');
  if (!all.length) { $('rej-wrap').hidden = true; const s = $('rej-state'); s.hidden = false; s.replaceChildren(empty('No rejected trades logged yet.')); return; }
  const q = $('rej-search').value.trim().toLowerCase();
  const un = $('rej-unscored').getAttribute('aria-pressed') === 'true';
  const list = all.filter((r) => (!un || !clean(r['Subsequent price behaviour'])) && (!q || Object.values(r).join(' ').toLowerCase().includes(q)));
  $('rej-count').textContent = list.length + ' of ' + all.length;
  RT.paint(list);
}
INIT_FNS.research = () => {
  LT = makeTable($('ledger-table'), LCOLS, { sort: ['date:Frozen at:start', 'desc'], key: 'Setup ID', redraw: renderLedger, open: openSetup });
  RT = makeTable($('rej-table'), RCOLS, { sort: ['date:Date:start', 'desc'], key: 'Name', redraw: renderRejected, open: openLab });
  $('ledger-search').addEventListener('input', renderLedger);
  $('rej-search').addEventListener('input', renderRejected);
  $('rej-unscored').addEventListener('click', (e) => { const b = e.currentTarget; b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); renderRejected(); });
  $('days-more').addEventListener('click', () => { DAYS_N += 10; renderDays(); });
};

/* ===== Source quality and authorship ===== */
const VER_TONE = { 'Primary verified': 'ok', 'Secondary only': 'warn', Unverified: 'bad' };
/* Seed-edition rows were written from search summaries only, so an unmarked seed row is secondary. */
const verOf = (r) => r.Verification || (r.Edition === 'Seed' ? 'Secondary only' : '');
function verChip(r, long) {
  const v = verOf(r);
  if (!v) return chip(long ? 'Sources not graded' : 'Not graded', 'muted');
  return chip(long ? 'Sources: ' + v.toLowerCase() : v, VER_TONE[v] || 'muted');
}

/* ===== News ===== */
const SECTIONS = ['Top of the day', 'Holdings and watchlist', 'Politicians', 'Insiders and big investors', 'India macro', 'US macro', 'Rates and cross-asset', 'AI outlook', 'Emerging themes', 'Opportunities'];
const NEWS = { sections: new Set(), market: 'all', mine: false, unread: false, n: 24 };
const newsKey = (r) => idOfUrl(r.url) || clean(r.Headline);
function tickersIn(text) { return String(text || '').toUpperCase().split(/[,;\s/|]+/).map((s) => s.replace(/[^A-Z0-9.&-]/g, '')).filter((s) => /^[A-Z][A-Z0-9.&-]{0,14}$/.test(s)); }
function myTickers() { return new Set(rowsOf('mine').map((r) => r.Ticker)); }
function newsSorted() { return rowsOf('news').slice().sort((a, b) => cmp(a['date:Date:start'], b['date:Date:start'], 'desc') || cmp(num(a.Importance), num(b.Importance), 'desc') || cmp(a.createdTime, b.createdTime, 'desc')); }
function newsFor(t) { const T = String(t).toUpperCase(); return newsSorted().filter((r) => tickersIn(r.Tickers).includes(T)); }
const IMPACT_TONE = { Positive: 'ok', Negative: 'bad', Mixed: 'warn', Neutral: 'muted' };
function newsCard(r, o) {
  o = o || {};
  const mine = myTickers();
  const b = el('button', 'pd-ncard' + (o.hero ? ' hero' : '') + (SEEN.has(newsKey(r)) ? '' : ' unread'));
  b.type = 'button';
  const meta = el('div', 'meta');
  meta.append(chip(r.Section || 'News', 'sec'));
  if (r.Market) meta.append(el('span', null, r.Market));
  meta.append(el('span', null, relDay(r['date:Date:start'])));
  b.append(meta, el('div', 'hl', clean(r.Headline)));
  if (clean(r.Summary)) b.append(el('div', 'sum', clean(r.Summary)));
  const fu = clean(r['For us']);
  if (fu && !/^nothing direct\.?$/i.test(fu)) { const f = el('div', 'forus'); f.append(el('b', null, 'For you: '), fu); b.append(f); }
  const foot = el('div', 'foot');
  if (r.Impact) foot.append(chip(r.Impact, IMPACT_TONE[r.Impact] || 'muted'));
  if (r.Horizon) foot.append(chip(r.Horizon, 'muted'));
  foot.append(verChip(r));
  tickersIn(r.Tickers).slice(0, 5).forEach((t) => foot.append(chip(t, 'tk' + (mine.has(t) ? ' own' : ''))));
  if (foot.children.length) b.append(foot);
  b.addEventListener('click', () => openNews(r, o.list));
  return b;
}
function openNews(r, list) {
  markSeen(newsKey(r));
  const mine = myTickers();
  openSheet({
    kicker: [chip(r.Section || 'News', 'sec'), r.Market && el('span', null, r.Market), el('span', null, relDay(r['date:Date:start']))],
    title: clean(r.Headline),
    nav: list ? { list, index: list.indexOf(r), open: openNews } : null,
    build: (b) => {
      if (clean(r.Summary)) b.append(el('p', 'pd-takeaway', clean(r.Summary)));
      if (clean(r['For us'])) { const c = el('div', 'pd-callout'); c.append(el('b', null, 'WHAT IT MEANS FOR YOU'), clean(r['For us'])); b.append(c); }
      const chips = el('div', 'pd-sheet-kicker');
      if (r.Impact) chips.append(chip('Impact: ' + r.Impact, IMPACT_TONE[r.Impact] || 'muted'));
      if (r.Horizon) chips.append(chip('Horizon: ' + r.Horizon, 'muted'));
      if (r.Confidence) chips.append(chip('Confidence: ' + r.Confidence, 'muted'));
      if (num(r.Importance) !== null) chips.append(chip('Importance ' + num(r.Importance) + ' of 5', 'muted'));
      chips.append(verChip(r, true));
      if (r.Author) chips.append(chip('By ' + r.Author, 'sec'));
      tickersIn(r.Tickers).forEach((t) => {
        const own = mine.has(t);
        const c = el('button', 'pd-chip tk' + (own ? ' own' : ''), t);
        c.type = 'button';
        c.style.border = '0';
        if (own) c.addEventListener('click', () => { const h = rowsOf('portfolio').find((x) => String(x.Ticker).toUpperCase() === t); if (h) openHolding(h); });
        else c.style.cursor = 'default';
        chips.append(c);
      });
      b.append(chips);
      b.append(pageSection(r.url, 'The full read', { none: 'No longer read was written for this one.' }));
      const srcs = sourcesList(r.Sources);
      if (srcs) b.append(sec('Sources', srcs));
      const fb = el('div', 'pd-sheet-actions');
      const sent = inboxRows().find((x) => x.Kind === 'News feedback' && clean(x.About) === clean(r.Headline));
      [['Useful', 'More like this'], ['Not useful', 'Less like this']].forEach(([d, label]) => {
        const btn = el('button', 'pd-decide' + (sent && sent.Decision === d ? ' sel' : ''), label);
        btn.type = 'button';
        btn.addEventListener('click', async () => {
          btn.disabled = true;
          try {
            await inboxCreate({ item: d + ': ' + clean(r.Headline).slice(0, 120), kind: 'News feedback', about: clean(r.Headline), aboutPage: r.url, decision: d, details: 'Section: ' + (r.Section || '') + '. Tickers: ' + (r.Tickers || 'none') + '.' });
            fb.querySelectorAll('.pd-decide').forEach((x) => x.classList.toggle('sel', x === btn));
            toast('Thanks. The news run reads this when it picks stories.');
          } catch (e) { toast(writeError(e)); }
          finally { btn.disabled = false; }
        });
        fb.append(btn);
      });
      b.append(sec('Was this useful?', fb));
      b.append(noteForm(clean(r.Headline), r.url, 'Question'));
      const a = askSection({ kind: 'News item', title: clean(r.Headline), about: clean(r.Headline), url: r.url, text: () => rowText(r, ['Headline', 'date:Date:start', 'Section', 'Market', 'Tickers', 'Summary', 'For us', 'Impact', 'Horizon', 'Confidence', 'Sources']) + '\n\nFull read:\n' + ((pageData(r.url).data[0] || {}).Body || ''), suggestions: ['What does this mean for my book?', 'What is priced in already, and what is not?', 'What would prove this read wrong?'] });
      if (a) b.append(a);
      later(renderNewsBadge);
    },
  });
}
function topOfDay() {
  const all = newsSorted();
  if (!all.length) return { day: '', list: [] };
  const latest = String(all[0]['date:Date:start'] || '').slice(0, 10);
  let top = all.filter((r) => r.Section === 'Top of the day');
  if (top.length) { const d = String(top[0]['date:Date:start'] || '').slice(0, 10); top = top.filter((r) => String(r['date:Date:start'] || '').slice(0, 10) === d); return { day: d, list: top.slice(0, 6) }; }
  const recent = all.filter((r) => ageDays(r['date:Date:start']) <= ageDays(latest) + 2);
  return { day: latest, list: recent.slice().sort((a, b) => cmp(num(a.Importance), num(b.Importance), 'desc')).slice(0, 4) };
}
function renderTopInto(box) {
  if (!gateBox(box, stOf('news', 'mine'))) return;
  const t = topOfDay();
  once(box.id, JSON.stringify(t.list.map((r) => [r.url, r.Headline])) + SEEN.size, () => {
    if (!t.list.length) { box.replaceChildren(empty('No news yet. The first daily edition arrives tomorrow morning; this page fills as the runs write it.')); return; }
    box.replaceChildren(...t.list.map((r, i) => newsCard(r, { hero: i < 2, list: t.list })));
  });
}
function renderNewsBadge() {
  const b = $('news-badge');
  if (stOf('news') !== 'ok') { b.hidden = true; return; }
  const t = topOfDay();
  const n = newsSorted().filter((r) => String(r['date:Date:start'] || '').slice(0, 10) === t.day && !SEEN.has(newsKey(r))).length;
  b.hidden = !n;
  b.textContent = String(n);
}
function renderNews() {
  renderTopInto($('news-top-list'));
  const t = topOfDay();
  $('news-edition').textContent = t.day ? 'Latest edition: ' + relDay(t.day) + '. Written each weekday morning before the pre-market pulse.' : 'Written each weekday morning before the pre-market pulse.';
  const box = $('news-list'), more = $('news-more');
  if (!gateBox(box, stOf('news', 'mine'))) { more.hidden = true; return; }
  const all = newsSorted();
  const counts = {};
  all.forEach((r) => { counts[r.Section] = (counts[r.Section] || 0) + 1; });
  const secBox = $('news-sections');
  const present = SECTIONS.filter((s) => counts[s]).concat(Object.keys(counts).filter((s) => s && s !== 'undefined' && !SECTIONS.includes(s)));
  const ssig = present.map((s) => s + counts[s]).join('|') + Array.from(NEWS.sections).join('|');
  if (secBox.dataset.sig !== ssig) { secBox.dataset.sig = ssig; fchips(secBox, present, NEWS.sections, () => { NEWS.n = 24; renderNews(); }, (s) => s + ' ' + counts[s]); }
  const mine = myTickers();
  const q = $('news-search').value.trim().toLowerCase();
  const list = all.filter((r) => (!NEWS.sections.size || NEWS.sections.has(r.Section))
    && (NEWS.market === 'all' || r.Market === NEWS.market)
    && (!NEWS.mine || tickersIn(r.Tickers).some((x) => mine.has(x)))
    && (!NEWS.unread || !SEEN.has(newsKey(r)))
    && (!q || [r.Headline, r.Summary, r['For us'], r.Tickers, r.Section].join(' ').toLowerCase().includes(q)));
  $('news-count').textContent = list.length + ' of ' + all.length;
  if (!list.length) { box.replaceChildren(empty(all.length ? 'No stories match these filters.' : 'No news yet. The first daily edition arrives tomorrow morning.')); more.hidden = true; return; }
  const shown = list.slice(0, NEWS.n);
  const frag = el('div', 'pd-stack');
  frag.style.gap = 'var(--pd-s2)';
  let cur = null, grid = null;
  shown.forEach((r) => {
    const d = String(r['date:Date:start'] || '').slice(0, 10);
    if (d !== cur) {
      cur = d;
      const lab = el('h3', 'pd-daylabel', d ? relDay(d) : 'Undated');
      { const k = list.filter((x) => String(x['date:Date:start'] || '').slice(0, 10) === d).length; lab.append(el('span', 'n', k + ' ' + plural(k, 'story', 'stories'))); }
      grid = el('div', 'pd-news');
      frag.append(lab, grid);
    }
    grid.append(newsCard(r, { list: shown }));
  });
  box.replaceChildren(frag);
  more.hidden = list.length <= NEWS.n;
}
INIT_FNS.news = () => {
  $('news-search').addEventListener('input', () => { NEWS.n = 24; renderNews(); });
  $('news-market').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-m]');
    if (!b) return;
    NEWS.market = b.dataset.m;
    $('news-market').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderNews();
  });
  ['news-mine', 'news-unread'].forEach((id) => $(id).addEventListener('click', () => {
    const b = $(id);
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    if (id === 'news-mine') NEWS.mine = on; else NEWS.unread = on;
    renderNews();
  }));
  $('news-more').addEventListener('click', () => { NEWS.n += 24; renderNews(); });
};

/* ===== Markets ===== */
const GAUGES = [
  { k: 'NIFTY 50', l: 'NIFTY 50', g: 'India', t: 'px', d: 0 },
  { k: 'India VIX', l: 'India VIX', g: 'India', t: 'px', d: 2 },
  { k: 'India 10Y', l: 'India 10-year', g: 'India', t: 'rate', d: 2 },
  { k: 'RBI repo', l: 'RBI repo rate', g: 'India', t: 'rate', d: 2 },
  { k: 'USD INR', l: 'USD/INR', g: 'India', t: 'px', d: 2 },
  { k: 'FII net cr', l: 'FII net, Rs cr', g: 'India', t: 'flow', d: 0 },
  { k: 'DII net cr', l: 'DII net, Rs cr', g: 'India', t: 'flow', d: 0 },
  { k: 'S&P 500', l: 'S&P 500', g: 'United States', t: 'px', d: 0 },
  { k: 'Nasdaq 100', l: 'Nasdaq 100', g: 'United States', t: 'px', d: 0 },
  { k: 'US 10Y', l: 'US 10-year', g: 'United States', t: 'rate', d: 2 },
  { k: 'US 2Y', l: 'US 2-year', g: 'United States', t: 'rate', d: 2 },
  { k: 'Fed funds upper', l: 'Fed funds, upper', g: 'United States', t: 'rate', d: 2 },
  { k: 'DXY', l: 'Dollar index', g: 'United States', t: 'px', d: 2 },
  { k: 'BoJ rate', l: 'BoJ policy rate', g: 'Japan', t: 'rate', d: 2 },
  { k: 'Japan 10Y', l: 'Japan 10-year', g: 'Japan', t: 'rate', d: 2 },
  { k: 'USD JPY', l: 'USD/JPY', g: 'Japan', t: 'px', d: 2 },
  { k: 'Gold USD', l: 'Gold, $/oz', g: 'Commodities', t: 'px', d: 0 },
  { k: 'Silver USD', l: 'Silver, $/oz', g: 'Commodities', t: 'px', d: 2 },
  { k: 'Brent USD', l: 'Brent, $/bbl', g: 'Commodities', t: 'px', d: 2 },
  { k: 'Aluminium USD', l: 'Aluminium, $/t', g: 'Commodities', t: 'px', d: 0 },
  { k: 'Zinc USD', l: 'Zinc, $/t', g: 'Commodities', t: 'px', d: 0 },
  { k: 'Copper USD', l: 'Copper, $/t', g: 'Commodities', t: 'px', d: 0 },
];
function gaugeRows() { return rowsOf('gauges').filter((r) => /^\d{4}-\d{2}-\d{2}/.test(String(r.Day || ''))).slice().sort((a, b) => cmp(String(a.Day), String(b.Day), 'asc')); }
function latestGauges() { const r = gaugeRows(); return r[r.length - 1] || null; }
function fmtGauge(x, v) {
  if (v === null) return '—';
  const s = new Intl.NumberFormat('en-IN', { minimumFractionDigits: x.d, maximumFractionDigits: x.d }).format(Math.abs(v));
  if (x.t === 'rate') return s + '%';
  if (x.t === 'flow') return (v < 0 ? MINUS : '+') + s;
  return (v < 0 ? MINUS : '') + s;
}
function seriesOf(x) { return gaugeRows().filter((r) => num(r[x.k]) !== null).map((r) => ({ day: String(r.Day).slice(0, 10), v: num(r[x.k]), row: r })); }
function changeText(x, s) {
  if (s.length < 2 || x.t === 'flow') return { text: s.length ? 'as of ' + dayStr(s[s.length - 1].day) : '', cls: '' };
  const a = s[s.length - 2].v, b = s[s.length - 1].v;
  if (x.t === 'rate') { const bp = Math.round((b - a) * 100); return { text: (bp > 0 ? '+' : bp < 0 ? MINUS : '') + Math.abs(bp) + ' bp since ' + dayStr(s[s.length - 2].day), cls: bp > 0 ? 'pos' : bp < 0 ? 'neg' : '' }; }
  const c = a ? (b - a) / a : null;
  return { text: pct(c, 2, true) + ' since ' + dayStr(s[s.length - 2].day), cls: c > 0 ? 'pos' : c < 0 ? 'neg' : '' };
}
function spark(svg, s) {
  const W = 160, H = 30, pts = s.slice(-30);
  if (pts.length < 2) return;
  const xs = d3.scaleLinear([0, pts.length - 1], [2, W - 4]);
  const ext = d3.extent(pts, (p) => p.v);
  const ys = d3.scaleLinear(ext[0] === ext[1] ? [ext[0] - 1, ext[1] + 1] : ext, [H - 3, 3]);
  const sel = d3.select(svg).attr('viewBox', '0 0 ' + W + ' ' + H).attr('preserveAspectRatio', 'none');
  sel.append('path').attr('class', 'spark-area').attr('d', d3.area().x((p, i) => xs(i)).y0(H).y1((p) => ys(p.v))(pts));
  sel.append('path').attr('class', 'spark-line').attr('d', d3.line().x((p, i) => xs(i)).y((p) => ys(p.v))(pts)).attr('vector-effect', 'non-scaling-stroke');
  sel.append('circle').attr('class', 'spark-dot').attr('r', 2.5).attr('cx', xs(pts.length - 1)).attr('cy', ys(pts[pts.length - 1].v));
}
function renderGauges() {
  const box = $('gauges-body');
  if (!gateBox(box, stOf('gauges'))) return;
  const rows = gaugeRows();
  once(box.id, JSON.stringify(rows.map((r) => r.Day + (r.Sources || '').length)) + GAUGES.map((x) => rows.map((r) => r[x.k]).join(',')).join(';'), () => {
    if (!rows.length) { box.replaceChildren(empty('No market snapshots yet. The news run records one every weekday morning.')); return; }
    const wrap = el('div', 'pd-stack');
    wrap.style.gap = 'var(--pd-s3)';
    let missing = 0;
    ['India', 'United States', 'Japan', 'Commodities'].forEach((g) => {
      const items = GAUGES.filter((x) => x.g === g);
      const grid = el('div', 'pd-gauges');
      items.forEach((x) => {
        const s = seriesOf(x);
        if (!s.length) { missing++; return; }
        const b = el('button', 'pd-gauge');
        b.type = 'button';
        const last = s[s.length - 1];
        const ch = changeText(x, s);
        b.append(el('span', 'l', x.l), el('span', 'v' + (x.t === 'flow' ? ' ' + sgn(last.v) : ''), fmtGauge(x, last.v)), el('span', 'd ' + ch.cls, ch.text));
        if (x.t !== 'flow' && s.length > 1) { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('aria-hidden', 'true'); b.append(svg); spark(svg, s); }
        b.setAttribute('aria-label', x.l + ' ' + fmtGauge(x, last.v) + ', ' + ch.text);
        b.addEventListener('click', () => openGauge(x));
        grid.append(b);
      });
      if (!grid.children.length) return;
      const grp = el('div', 'pd-ggroup');
      grp.append(el('h3', null, g), grid);
      wrap.append(grp);
    });
    box.replaceChildren(wrap);
    const last = rows[rows.length - 1];
    $('gauges-note').textContent = 'Snapshot of ' + relDay(last.Day) + ' at about 08:00 IST, from the news run. Changes are against the previous snapshot. ' + (missing ? missing + ' figures have not been recorded yet. ' : '') + 'Select a figure for its history and source.';
  });
}
function lineChart(box, s, x) {
  box.replaceChildren();
  const W = Math.max(280, Math.floor(box.clientWidth || 600)), H = 220, m = { l: 52, r: 16, t: 12, b: 28 };
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', '0 0 ' + W + ' ' + H).attr('role', 'img').attr('aria-label', x.l + ' history');
  const dates = s.map((p) => new Date(p.day + 'T00:00:00Z'));
  const xs = d3.scaleUtc(d3.extent(dates), [m.l, W - m.r]);
  const ext = d3.extent(s, (p) => p.v);
  const pad = (ext[1] - ext[0]) * 0.08 || Math.abs(ext[0]) * 0.02 || 1;
  const ys = d3.scaleLinear([ext[0] - pad, ext[1] + pad], [H - m.b, m.t]).nice(5);
  svg.append('g').attr('class', 'pd-grid').selectAll('line').data(ys.ticks(5)).join('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', (d) => ys(d)).attr('y2', (d) => ys(d));
  svg.append('g').attr('class', 'pd-axis').attr('transform', 'translate(0,' + (H - m.b) + ')').call(d3.axisBottom(xs).ticks(Math.min(6, s.length)).tickFormat((d) => d.getUTCDate() + ' ' + MON[d.getUTCMonth()]).tickSizeOuter(0));
  svg.append('g').attr('class', 'pd-axis').attr('transform', 'translate(' + m.l + ',0)').call(d3.axisLeft(ys).ticks(5).tickFormat((v) => fmtGauge(x, v)).tickSizeOuter(0)).call((g) => g.select('.domain').remove());
  svg.append('path').attr('class', 'spark-area').attr('d', d3.area().x((p, i) => xs(dates[i])).y0(H - m.b).y1((p) => ys(p.v))(s));
  svg.append('path').attr('class', 'spark-line').attr('d', d3.line().x((p, i) => xs(dates[i])).y((p) => ys(p.v))(s));
  svg.selectAll('circle.pt').data(s).join('circle').attr('class', 'spark-dot').attr('r', 3).attr('cx', (p, i) => xs(dates[i])).attr('cy', (p) => ys(p.v));
}
function openGauge(x) {
  const s = seriesOf(x);
  openSheet({
    kicker: [chip(x.g, 'muted'), s.length ? el('span', null, s.length + ' snapshots') : null],
    title: x.l,
    build: (b) => {
      const last = s[s.length - 1];
      if (last) b.append(el('p', 'pd-takeaway', fmtGauge(x, last.v) + ' on ' + dayStr(last.day) + '. ' + changeText(x, s).text));
      if (s.length > 1) {
        const cb = el('div', 'pd-lchart');
        b.append(sec('History', cb));
        later(() => lineChart(cb, s, x));
        SHEET.updaters.push(() => { if (cb.clientWidth && cb.dataset.w !== String(cb.clientWidth)) { cb.dataset.w = String(cb.clientWidth); lineChart(cb, s, x); } });
      }
      const t = el('table');
      const tr0 = el('tr');
      ['Day', 'Value', 'Change'].forEach((h) => { const th = el('th', null, h); th.scope = 'col'; tr0.append(th); });
      t.append(tr0);
      s.slice().reverse().forEach((p, i, arr) => {
        const tr = el('tr');
        const prev = arr[i + 1];
        let ch = '';
        if (prev && x.t === 'rate') ch = (p.v - prev.v >= 0 ? '+' : MINUS) + Math.abs(Math.round((p.v - prev.v) * 100)) + ' bp';
        else if (prev && x.t !== 'flow' && prev.v) ch = pct((p.v - prev.v) / prev.v, 2, true);
        tr.append(el('td', null, weekday(p.day) + ' ' + dayStr(p.day)), el('td', null, fmtGauge(x, p.v)), el('td', null, ch));
        t.append(tr);
      });
      const w = el('div', 'nr');
      const tw = el('div', 'nr-tw');
      tw.append(t);
      w.append(tw);
      b.append(sec('Every snapshot', w));
      if (last) b.append(sec('Sources for the latest snapshot', verChip(last.row, true), clean(last.row.Sources) ? sourcesList(last.row.Sources) : empty('No sources recorded on this row.')));
      if (last && clean(last.row.Notes)) b.append(sec('Notes', el('p', 'pd-pre', clean(last.row.Notes))));
    },
  });
}
const CORR = [
  { k: 'NIFTY 50', l: 'NIFTY' }, { k: 'S&P 500', l: 'S&P 500' }, { k: 'Gold USD', l: 'Gold' }, { k: 'Brent USD', l: 'Brent' },
  { k: 'Aluminium USD', l: 'Aluminium' }, { k: 'USD INR', l: 'USD/INR' }, { k: 'US 10Y', l: 'US 10Y', rate: true },
  { k: 'India 10Y', l: 'India 10Y', rate: true }, { k: 'USD JPY', l: 'USD/JPY' }, { k: 'Japan 10Y', l: 'Japan 10Y', rate: true },
];
function corrModel() {
  const rows = gaugeRows();
  const ch = {};
  CORR.forEach((c) => {
    ch[c.k] = {};
    for (let i = 1; i < rows.length; i++) {
      const a = num(rows[i - 1][c.k]), b = num(rows[i][c.k]);
      if (a === null || b === null) continue;
      ch[c.k][rows[i].Day] = c.rate ? b - a : a ? (b - a) / a : null;
    }
  });
  const usable = CORR.filter((c) => Object.keys(ch[c.k]).length >= 5);
  const pair = (x, y) => {
    const days = Object.keys(ch[x.k]).filter((d) => ch[y.k][d] !== undefined && ch[x.k][d] !== null && ch[y.k][d] !== null);
    if (days.length < 5) return { r: null, n: days.length };
    const xs = days.map((d) => ch[x.k][d]), ys = days.map((d) => ch[y.k][d]);
    const mx = d3.mean(xs), my = d3.mean(ys);
    let sxy = 0, sxx = 0, syy = 0;
    xs.forEach((v, i) => { sxy += (v - mx) * (ys[i] - my); sxx += (v - mx) ** 2; syy += (ys[i] - my) ** 2; });
    return { r: sxx && syy ? sxy / Math.sqrt(sxx * syy) : null, n: days.length };
  };
  return { usable, pair, days: rows.length };
}
function renderCorr() {
  const box = $('corr-body');
  if (!gateBox(box, stOf('gauges'))) return;
  const m = corrModel();
  once(box.id, m.days + ':' + m.usable.map((c) => c.k).join(','), () => {
    if (m.usable.length < 2) {
      box.replaceChildren(empty(m.days + ' ' + plural(m.days, 'snapshot', 'snapshots') + ' recorded so far. Correlations appear once at least two series have six snapshots, and mean something after about a month. Until then, the Macro map below explains the usual relationships.'));
      return;
    }
    const wrap = el('div', 'pd-heatwrap');
    const t = el('table', 'pd-corr');
    const hr = el('tr');
    hr.append(el('th'));
    m.usable.forEach((c) => { const th = el('th', null, c.l); th.scope = 'col'; hr.append(th); });
    const thead = el('thead');
    thead.append(hr);
    const tb = el('tbody');
    let nMin = Infinity, nMax = 0;
    m.usable.forEach((a, i) => {
      const tr = el('tr');
      const th = el('th', null, a.l);
      th.scope = 'row';
      tr.append(th);
      m.usable.forEach((b2, j) => {
        const td = el('td');
        if (i === j) { td.className = 'diag'; td.textContent = '1'; }
        else {
          const p = m.pair(a, b2);
          if (p.r === null) { td.textContent = '·'; td.title = 'Only ' + p.n + ' paired days'; }
          else {
            nMin = Math.min(nMin, p.n); nMax = Math.max(nMax, p.n);
            td.textContent = (p.r < 0 ? MINUS : '') + Math.abs(p.r).toFixed(2);
            td.style.background = 'color-mix(in oklab, var(--panel), ' + (p.r >= 0 ? 'var(--primary)' : 'var(--bad)') + ' ' + Math.round(Math.abs(p.r) * 55) + '%)';
            td.title = a.l + ' vs ' + b2.l + ': ' + p.r.toFixed(2) + ' over ' + p.n + ' days';
          }
        }
        tr.append(td);
      });
      tb.append(tr);
    });
    t.append(thead, tb);
    wrap.append(t);
    const note = el('p', 'pd-note', 'Day-to-day changes: percent for prices, percentage points for yields. ' + (nMax ? 'Based on ' + (nMin === nMax ? nMax : nMin + ' to ' + nMax) + ' paired days. ' : '') + (nMax < 20 ? 'Under 20 days these are anecdotes, not relationships.' : 'Correlations change with the regime; read them alongside the Macro map.'));
    box.replaceChildren(wrap, note);
  });
}
const DRIVERS = ['Oil up', 'Gold up', 'Base metals up', 'US yields up', 'Fed cuts', 'RBI hikes', 'BoJ hikes and yen up', 'Rupee weakens', 'Dollar strengthens', 'FII outflows', 'AI capex up'];
const SECTORS = ['IT services', 'Private banks', 'PSU banks', 'Metals and mining', 'Oil marketing', 'Upstream oil and gas', 'Power and utilities', 'Renewables', 'Capital goods', 'Autos', 'FMCG', 'Pharma', 'Realty', 'Insurance', 'Consumer internet', 'US AI hardware', 'US megacap tech', 'US nuclear and power'];
const STRENGTH_K = { Strong: 1, Moderate: 0.62, Weak: 0.32 };
const DIR_SYM = { Helps: '▲', Hurts: '▼', Mixed: '◆' };
let SECTOR_OWN = false;
function openLink(r) {
  openSheet({
    kicker: [chip(r.Direction || 'Mixed', r.Direction === 'Helps' ? 'ok' : r.Direction === 'Hurts' ? 'bad' : 'warn'), r.Strength && chip(r.Strength, 'muted'), r['date:Last reviewed:start'] && el('span', null, 'Reviewed ' + dayStr(r['date:Last reviewed:start']))],
    title: clean(r.Driver) + ' → ' + clean(r.Sector),
    build: (b) => {
      if (clean(r.Mechanism)) b.append(sec('How it works', el('p', 'pd-pre', clean(r.Mechanism))));
      if (clean(r['Your holdings'])) {
        const row = el('div', 'pd-sheet-kicker');
        const mine = myTickers();
        tickersIn(r['Your holdings']).forEach((t) => {
          const own = mine.has(t);
          const c = el('button', 'pd-chip tk' + (own ? ' own' : ''), t);
          c.type = 'button';
          c.style.border = '0';
          if (own) c.addEventListener('click', () => { const h = rowsOf('portfolio').find((x) => String(x.Ticker).toUpperCase() === t); if (h) openHolding(h); });
          row.append(c);
        });
        b.append(sec('Your holdings it touches', row));
      }
      if (clean(r.Evidence)) b.append(sec('Evidence', el('p', 'pd-pre', clean(r.Evidence))));
      const others = rowsOf('sectors').filter((x) => x.Driver === r.Driver && x !== r);
      if (others.length) {
        const bt = el('button', 'pd-btn small', 'Everything ' + clean(r.Driver).toLowerCase() + ' touches');
        bt.type = 'button';
        bt.addEventListener('click', () => openDriver(r.Driver));
        b.append(bt);
      }
      b.append(noteForm(clean(r.Link) || clean(r.Driver) + ' -> ' + clean(r.Sector), r.url));
    },
  });
}
function openDriver(dv) {
  const links = rowsOf('sectors').filter((x) => x.Driver === dv).sort((a, b) => cmp(STRENGTH_K[b.Strength] || 0, STRENGTH_K[a.Strength] || 0, 'asc'));
  openSheet({
    kicker: [chip('Driver', 'muted'), el('span', null, links.length + ' sectors')],
    title: dv,
    build: (b) => {
      const ul = el('ul', 'pd-inbox');
      links.forEach((x) => {
        const li = el('li');
        const top = el('div', 'top');
        top.append(chip(x.Direction || 'Mixed', x.Direction === 'Helps' ? 'ok' : x.Direction === 'Hurts' ? 'bad' : 'warn'), chip(x.Strength || '—', 'muted'));
        if (clean(x['Your holdings'])) top.append(el('span', null, 'You: ' + clean(x['Your holdings'])));
        const t = el('button', 'pd-rowbtn t', clean(x.Sector));
        t.type = 'button';
        t.addEventListener('click', () => openLink(x));
        li.append(top, t, el('div', 'note', clean(x.Mechanism)));
        ul.append(li);
      });
      b.append(ul);
      const a = askSection({ kind: 'Macro driver', title: dv, about: dv, text: () => links.map((x) => rowText(x, ['Sector', 'Direction', 'Strength', 'Mechanism', 'Your holdings', 'Evidence'])).join('\n\n'), suggestions: ['How exposed is my whole book to this?', 'Is this driver moving right now?', 'What would hedge this for me?'] });
      if (a) b.append(a);
    },
  });
}
function renderSectors() {
  const box = $('sector-body');
  if (!gateBox(box, stOf('sectors', 'mine'))) return;
  const rows = rowsOf('sectors');
  once(box.id, JSON.stringify(rows.map((r) => [r.Driver, r.Sector, r.Direction, r.Strength, r['Your holdings']])) + SECTOR_OWN, () => {
    if (!rows.length) { box.replaceChildren(empty('The sector map has not been written yet.')); return; }
    const mine = myTickers();
    const map = new Map(rows.map((r) => [r.Driver + '|' + r.Sector, r]));
    const ownSec = new Set(rows.filter((r) => tickersIn(r['Your holdings']).some((t) => mine.has(t))).map((r) => r.Sector));
    const secs = SECTORS.concat(Array.from(new Set(rows.map((r) => r.Sector))).filter((s) => s && !SECTORS.includes(s))).filter((s) => rows.some((r) => r.Sector === s) && (!SECTOR_OWN || ownSec.has(s)));
    const drv = DRIVERS.concat(Array.from(new Set(rows.map((r) => r.Driver))).filter((d) => d && !DRIVERS.includes(d))).filter((d) => rows.some((r) => r.Driver === d));
    const wrap = el('div', 'pd-heatwrap');
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Driver by sector map');
    const t = el('table', 'pd-heat');
    const hr = el('tr');
    hr.append(el('th'));
    secs.forEach((s) => { const th = el('th', ownSec.has(s) ? 'own' : null); th.scope = 'col'; th.append(el('span', null, s)); hr.append(th); });
    const thead = el('thead');
    thead.append(hr);
    const tb = el('tbody');
    drv.forEach((d) => {
      const tr = el('tr');
      const th = el('th');
      th.scope = 'row';
      const db = el('button', null, d);
      db.type = 'button';
      db.addEventListener('click', () => openDriver(d));
      th.append(db);
      tr.append(th);
      secs.forEach((s) => {
        const td = el('td');
        const r = map.get(d + '|' + s);
        const c = el('button', 'pd-cell');
        c.type = 'button';
        if (!r) { c.classList.add('empty'); c.disabled = true; c.setAttribute('aria-label', d + ', ' + s + ': no clear link'); }
        else {
          const dir = r.Direction || 'Mixed';
          c.classList.add(dir === 'Helps' ? 'helps' : dir === 'Hurts' ? 'hurts' : 'mixed');
          c.style.setProperty('--k', String(STRENGTH_K[r.Strength] || 0.5));
          c.textContent = DIR_SYM[dir] || '◆';
          c.setAttribute('aria-label', d + ' ' + dir.toLowerCase() + ' ' + s + (r.Strength ? ', ' + r.Strength.toLowerCase() : ''));
          c.title = d + ' → ' + s + ': ' + dir + (r.Strength ? ' (' + r.Strength + ')' : '');
          c.addEventListener('click', () => openLink(r));
        }
        td.append(c);
        tr.append(td);
      });
      tb.append(tr);
    });
    t.append(thead, tb);
    wrap.append(t);
    box.replaceChildren(wrap);
  });
}
function renderArticle(boxId, tocId, url) {
  const box = $(boxId);
  const d = pageData(url);
  if (!gateBox(box, d.status)) { $(tocId).hidden = true; return; }
  const r = d.data[0];
  if (!r || !r.Body || /^Being written\.?/.test(r.Body.trim())) { SIG[boxId] = null; $(tocId).hidden = true; box.replaceChildren(empty('Being written. It appears here as soon as the research run finishes.')); return; }
  once(boxId, r.Body, () => renderNotion(box, r.Body, { scope: boxId, toc: $(tocId) }));
}
function renderMacro() {
  renderArticle('macro-body', 'macro-toc', PAGES.macro);
  $('macro-ask').hidden = !SAMPLE || pageData(PAGES.macro).status !== 'ok';
}
INIT_FNS.markets = () => {
  $('sector-own').addEventListener('click', () => { SECTOR_OWN = !SECTOR_OWN; $('sector-own').setAttribute('aria-pressed', String(SECTOR_OWN)); renderSectors(); });
  $('macro-ask').addEventListener('click', () => openAsk({ kind: 'Macro map', title: 'The macro map', about: 'Macro Map', url: PAGES.macro, text: () => (pageData(PAGES.macro).data[0] || {}).Body || '', suggestions: ['Which scenario hurts my book most, and what is the signpost?', 'What does a BoJ hike mean for my holdings?', 'How do oil and the rupee hit my collateral?'] }));
};

/* ===== Ideas ===== */
const RADAR = new Set();
const POT = { High: 3, Medium: 2, Low: 1 };
const notOwned = (r) => { const a = clean(r['Already own']).toLowerCase(); return !a || /^(none|no|nothing|-|—|n\/a)\b/.test(a); };
function themeCard(r, list) {
  const b = el('button', 'pd-tcard');
  b.type = 'button';
  const meta = el('div', 'pd-sheet-kicker');
  if (r.Stage) meta.append(chip(r.Stage, r.Stage === 'Owned' ? 'ok' : 'muted'));
  if (r.Market) meta.append(chip(r.Market, 'sec'));
  if (r.Evidence) meta.append(chip('Evidence: ' + r.Evidence, r.Evidence === 'Speculative' ? 'warn' : 'muted'));
  meta.append(verChip(r));
  b.append(meta, el('div', 'hl', clean(r.Theme)));
  const pot = el('div', 'pd-sheet-kicker');
  const mtr = el('span', 'pd-meter');
  for (let i = 1; i <= 3; i++) mtr.append(el('i', i <= (POT[r.Potential] || 0) ? 'on' : null));
  pot.append(mtr, el('span', null, (r.Potential || '—') + ' potential over 3 years'));
  b.append(pot);
  if (clean(r['Why it could be big'])) b.append(el('div', 'why', clean(r['Why it could be big'])));
  if (clean(r['What would kill it'])) b.append(el('div', 'kill', 'What would kill it: ' + clean(r['What would kill it'])));
  b.append(notOwned(r) ? chip('Not owned yet', 'warn') : chip('You own: ' + clean(r['Already own']).slice(0, 60), 'tk own'));
  b.addEventListener('click', () => openTheme(r, list));
  return b;
}
function openTheme(r, list) {
  openSheet({
    kicker: [r.Stage && chip(r.Stage, 'muted'), r.Potential && chip(r.Potential + ' potential'), r.Market && chip(r.Market, 'sec'), r.Evidence && chip('Evidence: ' + r.Evidence, 'muted'), verChip(r, true), r.Author && chip('By ' + r.Author, 'sec')],
    title: clean(r.Theme),
    nav: list ? { list, index: list.indexOf(r), open: openTheme } : null,
    build: (b) => {
      ['Why it could be big', 'What would kill it', 'How to get exposure', 'Already own', 'Signals to watch'].forEach((k) => { if (clean(r[k])) b.append(sec(k, el('p', 'pd-pre', clean(r[k])))); });
      b.append(pageSection(r.url, 'The full read', { none: 'No longer read yet.' }));
      const srcs = sourcesList(r.Sources);
      if (srcs) b.append(sec('Sources', srcs));
      const s = sec('What next', el('p', 'pd-note', 'Ask the weekly macro and themes run to go deeper, or park it.'));
      s.append(decideRow(['Research deeper', 'Keep watching', 'Not for me'], {
        confirmText: (c) => (c === 'Research deeper' ? 'Ask the Sunday run to research ' + clean(r.Theme) + ' in depth: listed plays, valuations, and how it would fit your book?' : c + ': ' + clean(r.Theme) + '?'),
        make: (c, why) => ({ item: c + ': ' + clean(r.Theme), kind: c === 'Research deeper' ? 'Question' : 'Note', about: clean(r.Theme), aboutPage: r.url, details: (c === 'Research deeper' ? 'Research this theme in depth for me: the best listed ways in from India and the US, current valuations, and how it would fit my mandate.' : c + '.') + (why ? ' ' + why : '') }),
        toast: (c) => (c === 'Research deeper' ? 'Sent. The Sunday run researches it.' : 'Noted.'),
      }));
      b.append(s);
      const a = askSection({ kind: 'Theme', title: clean(r.Theme), about: clean(r.Theme), url: r.url, text: () => rowText(r) + '\n\nFull read:\n' + ((pageData(r.url).data[0] || {}).Body || ''), suggestions: ['How would I get exposure from India with Rs 1 lakh a month?', 'Is this already priced in?', 'What is the first signal that it is working?'] });
      if (a) b.append(a);
    },
  });
}
function renderRadar() {
  const box = $('radar-list');
  if (!gateBox(box, stOf('themes'))) return;
  const all = rowsOf('themes').slice().sort((a, b) => cmp(POT[b.Potential] || 0, POT[a.Potential] || 0, 'asc') || cmp(a.Theme, b.Theme, 'asc'));
  const list = all.filter((r) => (!RADAR.has('notown') || notOwned(r)) && (!RADAR.has('high') || r.Potential === 'High') && (!RADAR.has('India') || r.Market === 'India' || r.Market === 'Global') && (!RADAR.has('US') || r.Market === 'US' || r.Market === 'Global'));
  $('radar-count').textContent = all.length ? list.length + ' of ' + all.length : '';
  once(box.id, JSON.stringify(list.map((r) => [r.Theme, r.Stage, r.Potential, r['Already own']])), () => {
    if (!all.length) { box.replaceChildren(empty('The theme radar is being written. It appears here as soon as the research run finishes.')); return; }
    if (!list.length) { box.replaceChildren(empty('No themes match these filters.')); return; }
    const g = el('div', 'pd-themes');
    g.append(...list.map((r) => themeCard(r, list)));
    box.replaceChildren(g);
  });
}
function initCalcs() {
  const v = (id) => { const x = Number($(id).value); return $(id).value.trim() === '' || !isFinite(x) ? null : x; };
  const pc = (x, d) => (x === null || !isFinite(x) ? '—' : (x < 0 ? MINUS : '') + Math.abs(x * 100).toFixed(d === undefined ? 1 : d) + '%');
  function cagr() {
    const g = v('cagr-gain'), y = v('cagr-years');
    if (g === null || y === null || y <= 0 || g <= -100) { $('cagr-out').textContent = '—'; $('cagr-note').textContent = 'Enter a total gain and the years held.'; return; }
    const r = Math.pow(1 + g / 100, 1 / y) - 1;
    $('cagr-out').textContent = pc(r, 1) + ' a year';
    $('cagr-note').textContent = 'A ' + g + '% total gain over ' + y + ' years compounds at ' + pc(r, 2) + ' a year. If your app shows ' + g + '% as XIRR, that is already the yearly figure. With SIPs, XIRR is the fair measure because each instalment was invested for a different time.';
  }
  function drag() {
    const a = v('drag-amt'), r = v('drag-ret'), c = v('drag-gap'), n = v('drag-yrs');
    if ([a, r, c, n].some((x) => x === null) || n <= 0) { $('drag-out').textContent = '—'; $('drag-note').textContent = 'Fill in all four.'; return; }
    const hi = a * Math.pow(1 + r / 100, n), lo = a * Math.pow(1 + (r - c) / 100, n);
    $('drag-out').textContent = inr(hi - lo) + ' lost to costs';
    $('drag-note').textContent = inr(a) + ' at ' + r + '% grows to ' + inr(hi) + ' in ' + n + ' years; with ' + c + '% a year more in costs it grows to ' + inr(lo) + '. A regular plan typically costs more than the same fund\'s direct plan; check your funds\' actual expense ratios.';
  }
  function tax() {
    const g = v('tax-gain'), st = v('tax-st'), lr = v('tax-ltcg'), ex = v('tax-ex'), sr = v('tax-stcg');
    if ([g, st, lr, ex, sr].some((x) => x === null)) { $('tax-out').textContent = '—'; $('tax-note').textContent = 'Fill in all five.'; return; }
    const lt = Math.max(0, g - ex) * lr / 100, s2 = Math.max(0, st) * sr / 100;
    $('tax-out').textContent = inr(lt + s2, 'f') + ' tax';
    $('tax-note').textContent = 'Long-term: ' + inr(Math.max(0, g - ex), 'f') + ' taxable after the ' + inr(ex, 'f') + ' exemption, at ' + lr + '% = ' + inr(lt, 'f') + '. Short-term: ' + inr(st, 'f') + ' at ' + sr + '% = ' + inr(s2, 'f') + '. The exemption is per financial year across all your equity gains, so booking gains within it each year (and reinvesting) costs no tax.';
  }
  ['cagr-gain', 'cagr-years'].forEach((id) => $(id).addEventListener('input', cagr));
  ['drag-amt', 'drag-ret', 'drag-gap', 'drag-yrs'].forEach((id) => $(id).addEventListener('input', drag));
  ['tax-gain', 'tax-st', 'tax-ltcg', 'tax-ex', 'tax-stcg'].forEach((id) => $(id).addEventListener('input', tax));
  cagr(); drag(); tax();
}
function renderMoney() {
  renderArticle('money-body', 'money-toc', PAGES.money);
  $('money-ask').hidden = !SAMPLE;
}
function renderOpps() {
  const box = $('opps-list');
  if (!gateBox(box, stOf('news', 'mine'))) return;
  const list = newsSorted().filter((r) => r.Section === 'Opportunities' || r.Section === 'Emerging themes');
  once(box.id, JSON.stringify(list.map((r) => r.url)) + SEEN.size, () => {
    if (!list.length) { box.replaceChildren(empty('Nothing yet.')); return; }
    box.replaceChildren(...list.slice(0, 12).map((r) => newsCard(r, { list })));
  });
}
INIT_FNS.ideas = () => {
  $('radar-filters').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-f]');
    if (!b) return;
    const f = b.dataset.f;
    if (RADAR.has(f)) RADAR.delete(f); else RADAR.add(f);
    b.setAttribute('aria-pressed', String(RADAR.has(f)));
    renderRadar();
  });
  initCalcs();
  $('money-ask').addEventListener('click', () => openAsk({ kind: 'Mutual funds note', title: 'My mutual funds', about: 'Mutual funds', url: PAGES.money, text: () => 'His mutual funds on 19 Oct 2026 (from his app): invested Rs 6,92,465; current value Rs 8,41,621; total gain Rs 1,49,156 (21.53%); current XIRR 8.83% on holdings now; lifetime XIRR 7.38% including past redemptions. Held over about 4 to 5 years; he feels they are not growing and is thinking of getting out. Fund names, plan type (regular or direct), how much was bought in the last 12 months and whether any units are pledged are not known yet.\n\nThe Money moves note:\n' + ((pageData(PAGES.money).data[0] || {}).Body || ''), suggestions: ['Should I exit, switch or stay? Walk me through the decision.', 'What do I need to find out about my funds first?', 'How would the tax work if I switch this year?'] }));
};

/* ===== Log ===== */
const LOGF = { f: 'all', n: 30 };
function logItem(r, list) {
  const li = el('li');
  const b = el('button', 'pd-log-item pd-ncard');
  b.type = 'button';
  b.style.setProperty('--chip', dash.colors[LOG_TYPES[r.Type] !== undefined ? LOG_TYPES[r.Type] : 0]);
  const top = el('div', 'pd-log-top');
  top.append(el('span', null, weekday(r['date:Date:start']) + ' ' + dayStr(r['date:Date:start'])));
  if (r.Type) top.append(chip(r.Type, 'tag'));
  b.append(top, el('div', 'pd-log-title', clean(r.Title)));
  if (clean(r.Headline)) b.append(el('div', 'pd-log-headline', clean(r.Headline)));
  if (clean(r.Regime)) { const d = el('div', 'pd-log-regime'); d.textContent = clean(r.Regime); d.style.display = '-webkit-box'; d.style.webkitBoxOrient = 'vertical'; d.style.webkitLineClamp = '2'; d.style.overflow = 'hidden'; b.append(d); }
  b.addEventListener('click', () => openLog(r, list));
  li.append(b);
  return li;
}
function renderLog() {
  const box = $('log-list'), more = $('log-more');
  if (!gateBox(box, stOf('pulse'))) { more.hidden = true; return; }
  const q = $('log-search').value.trim().toLowerCase();
  const all = rowsOf('pulse').filter((r) => (LOGF.f === 'all' || r.Type === LOGF.f) && (!q || [r.Title, r.Headline, r.Regime].join(' ').toLowerCase().includes(q)));
  all.sort((a, b) => cmp(a['date:Date:start'], b['date:Date:start'], 'desc')
    || cmp(LOG_PRI[a.Type] === undefined ? 9 : LOG_PRI[a.Type], LOG_PRI[b.Type] === undefined ? 9 : LOG_PRI[b.Type], 'asc')
    || cmp(a.Title, b.Title, 'asc'));
  if (!all.length) { box.replaceChildren(empty('Nothing logged yet.')); more.hidden = true; return; }
  const ol = el('ol', 'pd-log');
  const shown = all.slice(0, LOGF.n);
  ol.append(...shown.map((r) => logItem(r, shown)));
  box.replaceChildren(ol);
  more.hidden = all.length <= LOGF.n;
}
INIT_FNS.log = () => {
  $('log-filter').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-f]');
    if (!b) return;
    LOGF.f = b.dataset.f;
    LOGF.n = 30;
    $('log-filter').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderLog();
  });
  $('log-search').addEventListener('input', () => { LOGF.n = 30; renderLog(); });
  $('log-more').addEventListener('click', () => { LOGF.n += 30; renderLog(); });
};

/* ===== Brain ===== */
let lastRail = '';
function brainUrl() { return (PARAMS.brain_page) || LS.get('pd-brain', PAGES.checklists); }
function renderRail(sel) {
  const box = $('brain-list');
  if (!gateBox(box, stOf('brain_index'))) return;
  const rows = rowsOf('brain_index');
  if (!rows.length) { SIG[box.id] = null; box.replaceChildren(empty('No Brain pages were found.')); return; }
  once(box.id, JSON.stringify(rows), () => {
    box.replaceChildren(...rows.map((r) => {
      const b = el('button', 'pd-rail-item');
      b.type = 'button';
      b.dataset.url = r.url;
      b.dataset.id = idOfUrl(r.url);
      b.textContent = r.Title;
      return b;
    }));
  });
  let curBtn = null;
  box.querySelectorAll('.pd-rail-item').forEach((b) => {
    const on = !!sel && b.dataset.id === sel;
    if (on) { b.setAttribute('aria-current', 'page'); curBtn = b; } else b.removeAttribute('aria-current');
  });
  if (curBtn && lastRail !== sel && box.scrollWidth > box.clientWidth + 2 && getComputedStyle(box).flexDirection === 'row') {
    box.scrollTo({ left: Math.max(0, curBtn.offsetLeft - (box.clientWidth - curBtn.offsetWidth) / 2), behavior: REDUCED() ? 'auto' : 'smooth' });
  }
  lastRail = sel;
}
function renderBrainArticle(url) {
  const box = $('brain-body'), head = $('brain-title'), toc = $('brain-toc');
  const d = pageData(url);
  const idx = rowsOf('brain_index').find((x) => idOfUrl(x.url) === idOfUrl(url));
  const r = d.status === 'ok' ? d.data[0] : null;
  head.textContent = (r && clean(r.Title)) || (idx && idx.Title) || 'Brain';
  $('brain-main').setAttribute('aria-busy', String(d.status === 'loading' || !!d.refreshing));
  $('brain-ask').hidden = !SAMPLE || !r;
  if (!gateBox(box, d.status)) { toc.hidden = true; return; }
  if (!r || !r.Body) { SIG[box.id] = null; toc.hidden = true; box.replaceChildren(empty('This page has no text yet.')); return; }
  once(box.id, String(r.Body), () => renderNotion(box, String(r.Body), { scope: 'brain', toc }));
}
function renderBrain() {
  const url = brainUrl();
  renderRail(idOfUrl(url));
  renderBrainArticle(url);
}
INIT_FNS.brain = () => {
  $('brain-list').addEventListener('click', (e) => {
    const b = e.target.closest('.pd-rail-item');
    if (!b) return;
    PARAMS.brain_page = b.dataset.url;
    LS.set('pd-brain', b.dataset.url);
    const a = $('brain-main');
    if (a && a.getBoundingClientRect().top < 72) a.scrollIntoView({ behavior: 'auto', block: 'start' });
    render();
  });
  $('brain-ask').addEventListener('click', () => {
    const url = brainUrl();
    const r = pageData(url).data[0] || {};
    openAsk({ kind: 'Brain page', title: clean(r.Title) || 'Brain page', about: clean(r.Title), url, text: () => r.Body || '', suggestions: ['How does this apply to my book right now?', 'Which of these ideas do I break most often?', 'Turn this into three rules I can check before a trade.'] });
  });
};

/* ===== Run health: the last run of each scheduled task ===== */
const SCHED = [
  { task: 'Markets news desk', days: [1, 2, 3, 4, 5, 6], h: 7, m: 37 },
  { task: 'Pre-market pulse', days: [1, 2, 3, 4, 5], h: 8, m: 23 },
  { task: 'Post-market review', days: [1, 2, 3, 4, 5], h: 16, m: 15 },
  { task: 'Weekly review', days: [6], h: 9, m: 55 },
  { task: 'Macro and themes', days: [0], h: 10, m: 41 },
  { task: 'Monthly IC', monthly: true, h: 10, m: 52 },
];
/* Runs began writing to the Run Log on this day; earlier runs have no record to look for. */
const RUNLOG_FROM = '2026-10-20';
const RUN_TONE = { Complete: 'ok', Partial: 'warn', Failed: 'bad', Skipped: 'muted' };
/* The day (IST) of the latest scheduled run that should have finished by now, allowing an hour. */
function lastDue(s) {
  const now = Date.now() + IST_MS;
  const t = new Date(now);
  for (let i = 0; i < 40; i++) {
    const d = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() - i));
    if (s.monthly ? d.getUTCDate() !== 1 : !s.days.includes(d.getUTCDay())) continue;
    if (d.getTime() + (s.h * 60 + s.m + 60) * 60000 <= now) return d.toISOString().slice(0, 10);
  }
  return '';
}
function openRun(r) {
  openSheet({
    kicker: [chip(r.Status || 'No status', RUN_TONE[r.Status] || 'muted'), r.Task && chip(r.Task, 'sec'), r.Author && chip('By ' + r.Author, 'sec'), verChip(r, true)],
    title: clean(r.Run) || 'Run',
    build: (b) => {
      if (clean(r.Wrote)) b.append(sec('What it wrote', el('p', 'pd-pre', clean(r.Wrote))));
      b.append(sec('What it could not do', clean(r.Missing) ? el('p', 'pd-pre', clean(r.Missing)) : empty('Nothing recorded as missing.')));
    },
  });
}
function runItem(r, flag) {
  const li = el('li');
  const top = el('div', 'top');
  top.append(r ? chip(r.Status || 'No status', RUN_TONE[r.Status] || 'muted') : chip(flag.label, flag.tone));
  if (r && r['date:Date:start']) top.append(el('span', null, weekday(r['date:Date:start']) + ' ' + dayStr(r['date:Date:start'])));
  if (r) top.append(verChip(r));
  li.append(top);
  if (r) {
    const t = el('button', 'pd-rowbtn t', clean(r.Run) || r.Task || 'Run');
    t.type = 'button';
    t.addEventListener('click', () => openRun(r));
    li.append(t);
  } else li.append(el('div', 't', flag.task));
  if (flag && flag.text) li.append(el('div', 'note', flag.text));
  if (r && clean(r.Missing)) li.append(clampBox(clean(r.Missing), 2, 'run:' + (r.url || r.Run), { cls: 'note' }));
  return li;
}
function renderRuns() {
  const box = $('runs-list');
  if (!gateBox(box, stOf('runs'))) return;
  const rows = rowsOf('runs').slice().sort((a, b) => cmp(a['date:Date:start'], b['date:Date:start'], 'desc') || cmp(a.createdTime, b.createdTime, 'desc'));
  const ul = el('ul', 'pd-inbox');
  SCHED.forEach((s) => {
    const due = lastDue(s);
    const latest = rows.find((r) => r.Task === s.task);
    const onDue = rows.find((r) => r.Task === s.task && String(r['date:Date:start'] || '').slice(0, 10) === due);
    if (onDue) ul.append(runItem(onDue));
    else if (due && due >= RUNLOG_FROM) ul.append(runItem(null, { task: s.task, label: 'No record', tone: 'bad', text: (latest ? 'Last logged ' + dayStr(latest['date:Date:start']) + '. ' : '') + 'No record for ' + weekday(due) + ' ' + dayStr(due) + '. The run may have failed or may lack its Notion connector.' }));
    else if (latest) ul.append(runItem(latest));
    else ul.append(runItem(null, { task: s.task, label: 'Not logged yet', tone: 'muted', text: 'No Run Log record yet. Logging starts with its next run.' }));
  });
  const other = rows.filter((r) => !SCHED.some((s) => s.task === r.Task)).slice(0, 10);
  const parts = [ul];
  if (other.length) {
    const ul2 = el('ul', 'pd-inbox');
    ul2.append(...other.map((r) => runItem(r)));
    parts.push(el('h3', 'pd-card-t', 'Research agents and checks'), ul2);
  }
  box.replaceChildren(...parts);
}

/* ===== Tabs ===== */
const mounted = {};
function revealTab(b) {
  const bar = $('pd-tabs');
  if (!b || bar.scrollWidth <= bar.clientWidth + 2) return;
  bar.scrollTo({ left: Math.max(0, b.offsetLeft - (bar.clientWidth - b.offsetWidth) / 2), behavior: REDUCED() ? 'auto' : 'smooth' });
}
function show(key, fromUser, skipRender) {
  if (!TABS.includes(key)) key = 'today';
  active = key;
  if (!mounted[key]) {
    $('pd-panels').append($('tpl-' + key).content.cloneNode(true));
    mounted[key] = true;
    $(key).classList.add('pd-in');
    if (INIT_FNS[key]) INIT_FNS[key]();
  }
  TABS.forEach((k) => {
    const p = $(k), b = $('tab-' + k);
    if (p) p.hidden = k !== key;
    b.setAttribute('aria-selected', String(k === key));
    b.tabIndex = k === key ? 0 : -1;
  });
  revealTab($('tab-' + key));
  if (fromUser) dash.setLink(key);
  if (!skipRender) render();
}
TABS.forEach((k) => $('tab-' + k).addEventListener('click', () => show(k, true)));
$('pd-tabs').addEventListener('keydown', (e) => {
  const i = TABS.indexOf(document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.tab : '');
  if (i < 0) return;
  let n = null;
  if (e.key === 'ArrowRight') n = (i + 1) % TABS.length;
  else if (e.key === 'ArrowLeft') n = (i + TABS.length - 1) % TABS.length;
  else if (e.key === 'Home') n = 0;
  else if (e.key === 'End') n = TABS.length - 1;
  if (n === null) return;
  e.preventDefault();
  show(TABS[n], true);
  $('tab-' + TABS[n]).focus();
});
$('pd-takeaway-box').dataset.key = 'takeaway';
$('pd-app').addEventListener('click', (e) => {
  const b = e.target.closest('.pd-textbtn');
  const box = b && b.closest('.pd-clampbox');
  if (box) { setClamp(box, !box.classList.contains('open')); measureClamps(); return; }
  const t = e.target.closest('.pd-toc-link');
  if (t) jump(t.dataset.target);
});
$('pd-refresh').addEventListener('click', () => { refreshAll(); toast('Reading Notion again.'); });
$('pd-ask-desk').addEventListener('click', () => openAsk({ kind: 'Whole desk', title: 'Ask the desk', about: 'Desk', text: deskContext, suggestions: ['What are the three things that matter most for my book this week?', 'Where am I most exposed if the rally fails?', 'What am I missing that could be big in three years?', 'Should I move my mutual fund money? What would I need to know first?'] }));
let lastW = 0;
window.addEventListener('resize', () => { const w = $('pd-app').clientWidth; if (Math.abs(w - lastW) > 8) { lastW = w; notify(); } });

/* ===== Draw what the open tab needs ===== */
function render() {
  safe(renderHeader);
  safe(renderNewsBadge);
  if (active === 'today') { safe(renderBand); safe(() => renderTopInto($('today-news-list'))); safe(renderRegime); safe(renderPulse); safe(renderOpenSetups); safe(renderInbox); safe(renderRuns); }
  else if (active === 'news') safe(renderNews);
  else if (active === 'markets') { safe(renderGauges); safe(renderCorr); safe(renderSectors); safe(renderMacro); }
  else if (active === 'portfolio') { safe(renderAttn); safe(renderKpis); safe(renderThemes); safe(renderWaiting); safe(renderHoldings); safe(renderWatch); safe(renderCollateral); }
  else if (active === 'research') { safe(renderStats); safe(renderDays); safe(renderProposals); safe(renderLedger); safe(renderPipeline); safe(renderRejected); }
  else if (active === 'ideas') { safe(renderRadar); safe(renderMoney); safe(renderOpps); }
  else if (active === 'log') safe(renderLog);
  else if (active === 'brain') safe(renderBrain);
  safe(sheetUpdate);
  safe(measureClamps);
}
let start0 = 'today';
try { const h = decodeURIComponent((location.hash || '').slice(1)); if (TAB_OF[h]) start0 = TAB_OF[h]; else start0 = LS.get('pd-tab', 'today'); } catch (e) { start0 = 'today'; }
if (!TABS.includes(start0)) start0 = 'today';
show(start0, false, true);
dash.onData(render);
</script>
