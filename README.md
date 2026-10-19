# Fin

Shashank's personal investing research system: the dashboard he reads every day, and the notes on how it is fed.

Nothing here places orders or touches a brokerage account. It is research for his own decisions, not advice.

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
                                                                                            notes, questions, news feedback
```

- **Notion is the single source of truth.** The scheduled runs write to it. The dashboard reads it, and writes only new rows in the Decisions Inbox; the runs apply those under the Playbook's rules (frozen PRE fields are never changed).
- **The dashboard** is a private claude.ai artifact: https://claude.ai/artifact/7zyNJLRe8y96unh2NLNr43 . It declares two capabilities: the Notion connector (`notion-query-data-sources`, `notion-fetch`, `notion-create-pages`) and Ask Claude (`sample`), which answers questions on the viewer's own Claude account.
- The earlier read-only version (claude.ai Dashboard type) is at https://claude.ai/artifact/K5cUrrGok9cnM3fhVJVzeJ ; its files are in `dashboard/v2-dashboard-type/`.
- **Google Drive** holds a mirror of the Strategy Playbook. The Google Sheet "Trading Portfolio Book" is empty and unused.

## Dashboard tabs

| Tab | What it shows | What you can do there |
|---|---|---|
| Today | Pulse date, regime, setups, day gate; top stories; market read; open setups; your decisions and notes | Record a fill, add a note, ask about the pulse, run the day gate and position sizer |
| News | Top of the day and a month of News Desk items, by section, market and your tickers | Read the full piece and sources, mark useful or not, send a question to the next run, ask Claude |
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
| `docs/broker-integration.md` | How Upstox and INDmoney could feed real holdings and prices |
| `brain/` | Copies of the Notion Brain pages: checklists (read by every run), the rolling retrospective, masters of investing, traders and psychology, research evidence, and quant firms with the roadmap |

## Updating the dashboard

Edit the files in `dashboard/src/`, run `dashboard/build.sh`, then ask Claude to publish `dashboard/index.html` to the artifact URL above with the same capabilities. Notion views, page IDs and the Decisions Inbox data source are constants at the top of `src/core.js`.
