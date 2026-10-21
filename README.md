# Fin

Shashank's personal investing research system: the dashboard he reads every day, and the notes on how it is fed.

Every call comes with a conviction level, the odds and the downside, and the runs are scored on how well those odds hold up. Nothing here places orders or touches a brokerage account; broker access is read-only.

## How it fits together

```
Scheduled Claude runs (claude.ai)              Notion: Trading Research System             Portfolio Desk (claude.ai artifact)
  Markets news desk   07:37 IST Mon-Sat  -->   Markets and News Desk:                -->   reads Notion live with the viewer's
  Pre-market pulse    08:23 IST Mon-Fri  -->     News Desk, Market Gauges,                own Notion access (saved views only,
  Post-market review  16:15 IST Mon-Fri  -->     Sector Map, Theme Radar,                 so it does not use the workspace's
  Weekly review       09:55 IST Sat      -->     Macro Map, Money moves                   SQL query allowance)
  Macro and themes    10:41 IST Sun      -->   Portfolio Book, Trading Ledger,
  Monthly IC review   10:52 IST, 1st     -->   Hypothesis Lab, Pulse and Review Log,
                                               Playbook, Agent Mandate, Collateral,
                                               Brain pages
                                               Decisions Inbox  <------------------------   the only thing the dashboard writes:
                                                 (runs apply each row, then mark it)        decisions, fills, classifications,
                                               Run Log                                      notes, questions, news feedback,
                                                 (one row per run, even when skipped)       and ChatGPT input (Author ChatGPT)
```

- **Notion is the single source of truth.** The scheduled runs write to it. The dashboard reads it, and writes only new rows in the Decisions Inbox; the runs apply those under the Playbook's rules (frozen PRE fields are never changed).
- **Two assistants, one record.** Claude runs the schedule; ChatGPT's proposals and fact checks enter only as Decisions Inbox rows with Author ChatGPT, which a Claude run freezes, rejects or checks. Every News Desk, Market Gauges and Theme Radar row carries a source grade (Primary verified, Secondary only or Unverified), Ledger and Hypothesis Lab rows carry their author, setups carry their frozen odds (conviction, chance of triggering, chance the target comes first, expected R) and themes their three-year odds, and every run leaves a Run Log row saying what it wrote and what it could not do. The rules are in `docs/agent-protocol.md` and on the "Agent protocol: Claude and ChatGPT" page in Notion.
- **What updates when.**

  | Data | Refreshed by | How often |
  |---|---|---|
  | Pre-market pulse, setups and their odds, rejected trades | Pre-market pulse | Every NSE trading day, 08:23 IST |
  | US holdings and watchlist prices | Pre-market pulse (last US close) | Every NSE trading day |
  | Indian holdings and watchlist prices, book weights | Post-market review (NSE close) | Every NSE trading day, 16:15 IST |
  | Setup scoring, fills, post-market review | Post-market review | Every NSE trading day |
  | News Desk and Market Gauges | Markets news desk (07:37 IST Mon-Sat); the pre-market pulse writes a smaller set if the news run leaves nothing | Daily |
  | Classifications, statistics, Retrospective, Brain checklists | Weekly review | Saturday |
  | Macro Map, Sector Map, Theme Radar and its odds | Macro and themes | Sunday |
  | Collateral stress, capital plan, mutual-fund call, Money moves | Monthly IC (Money moves also on the first Sunday) | 1st of the month |

  The dashboard's "How the runs went" panel shows the last record of each run and flags any run with no record.
- **The dashboard** is a private claude.ai artifact: https://claude.ai/artifact/7zyNJLRe8y96unh2NLNr43 . It declares two capabilities: the Notion connector (`notion-query-data-sources`, `notion-fetch`, `notion-create-pages`) and Ask Claude (`sample`), which answers questions on the viewer's own Claude account.
- The earlier read-only version (claude.ai Dashboard type) is at https://claude.ai/artifact/K5cUrrGok9cnM3fhVJVzeJ ; its files are in `dashboard/v2-dashboard-type/`.
- **Google Drive** holds a mirror of the Strategy Playbook. The Google Sheet "Trading Portfolio Book" is empty and unused.

## Dashboard tabs

| Tab | What it shows | What you can do there |
|---|---|---|
| Today | Pulse date, regime, setups, day gate; top stories; market read; open setups; your decisions and notes; how the runs went (last Run Log row per task, missing runs flagged) | Record a fill, add a note, paste ChatGPT input, ask about the pulse, run the day gate and position sizer |
| News | Top of the day and a month of News Desk items, by section, market and your tickers, each with its source grade | Read the full piece and sources, mark useful or not, send a question to the next run, ask Claude |
| Markets | Morning gauges with history, correlations from the recorded history, driver-by-sector map, Macro Map | Open any gauge's history, any driver or sector link, ask about the macro map |
| Portfolio | Totals, themes, holdings, watchlist, collateral | Open a holding (thesis, news, macro drivers), confirm or change its classification, tell the runs what is pledged |
| Trades & research | Setup record, day-by-day retrospective, open proposals, ledger, pipeline, rejected trades | Decide open proposals, record fills, add notes, ask about any setup, day or hypothesis |
| Ideas | Theme radar, mutual-fund calculators and Money moves note, opportunities | Ask for deeper research on a theme, work the numbers on switching funds |
| Log, Brain | Every pulse and review; the Brain pages | Read in full, ask about any page |

## This repository

| Path | What it is |
|---|---|
| `dashboard/index.html` | The built dashboard page, as published |
| `dashboard/src/` | Its source: `head.html` (title, fonts, theme tokens), `base.css` and `extra.css`, `body.html` (markup and tab templates), `core.js` (Notion data layer and the one write), `p1.js` to `p4.js` (rendering, sheets, Ask Claude, tabs) |
| `dashboard/build.sh` | Concatenates `src/` into `index.html` |
| `dashboard/v2-dashboard-type/` | The previous read-only dashboard and its data-source definitions |
| `docs/agent-protocol.md` | Who may write what (Shashank, ChatGPT, the Claude runs), source grades, the Run Log, and the rules on frozen setups and subscriptions |
| `docs/broker-integration.md` | How Upstox and INDmoney could feed real holdings and prices |
| `desk/` | First editions of the Macro Map and Money moves (mutual funds and new money) pages from the Markets and News Desk; Notion holds the live versions, rewritten by the Sunday run |
| `brain/` | Copies of the Notion Brain pages: checklists (read by every run), the rolling retrospective, masters of investing, traders and psychology, research evidence, and quant firms with the roadmap |

## Updating the dashboard

Edit the files in `dashboard/src/`, run `dashboard/build.sh`, then ask Claude to publish `dashboard/index.html` to the artifact URL above with the same capabilities. Notion views, page IDs and the Decisions Inbox data source are constants at the top of `src/core.js`.
