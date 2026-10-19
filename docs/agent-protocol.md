# Agent protocol: how Claude and ChatGPT share the desk

Two assistants feed the Portfolio Desk: Claude (the scheduled runs and research agents) and ChatGPT (Shashank's own research conversations). This sets who may write what, how sources are graded and how failed runs are recorded, so the two can be compared without hindsight editing. The live copy is the "Agent protocol" page under the Trading Research System hub in Notion.

Every view comes as a call with conviction, the odds and the downside. No assistant places orders or acts in a brokerage account; broker access is read-only.

## Calls with conviction

Shashank wants calls, not hedging, and no disclaimers such as "not advice" or "do your own research". Every setup, holding view, theme and scenario states:

- **The call**: what to do (take it, skip it, add, hold, trim, exit, switch) and the conviction: High, Medium or Low, with a one-line reason.
- **The odds**, as numbers. For a setup: the chance it triggers, the chance the target comes before the stop once triggered, and the expected value in R after costs (Ledger fields PRE Conviction, PRE P trigger pct, PRE P target pct, PRE Expected R, frozen with the plan). For a theme: the chance a sensible basket of its plays beats NIFTY 50 or the S&P 500 over three years (Theme Radar fields Conviction, P outperform 3y pct, Downside). Scenario probabilities sum to 100%.
- **The risk**: what breaks it, the realistic bad case in rupees and as a share of the book or the collateral, and the signpost that would change the call.

Calibration keeps conviction honest: each probability says what it rests on (Ledger base rates, published evidence or judgement); 50% means a coin flip; thin evidence is a Low-conviction call said plainly, never a refusal to call; a call resting on figures graded Unverified or Secondary only says so. The weekly review scores the frozen probabilities against outcomes (Brier score and a reliability table) once ten or more setups are scored, overall and by author.

## Who writes what

| Writer | May create | May change | Never |
|---|---|---|---|
| Shashank, on the dashboard | Decisions Inbox rows (Author Shashank) | Nothing else | |
| ChatGPT | Decisions Inbox rows with Author ChatGPT: Kind Proposed setup, Verification, Note or Question. Run Log rows with Task ChatGPT | Nothing | Edit any existing row; write to the Ledger, Hypothesis Lab, Portfolio Book, News Desk, Market Gauges, Sector Map, Theme Radar or Brain |
| Claude scheduled runs | Ledger, Hypothesis Lab, Pulse and Review Log, News Desk, Market Gauges, Sector Map and Theme Radar rows; Run Log rows | POST fields, Status and Data quality on Ledger rows; prices on holdings; Status and Run note on inbox rows; Verification grades | Change a PRE field, Setup ID or "Frozen at"; edit the author's own inbox fields (Item, Kind, About, About page, Decision, Details, Author) |

ChatGPT gets its rows in either by Shashank pasting its output into the dashboard's "Paste from ChatGPT" form (Today, "Add a note"), which saves the row with Author ChatGPT, or by writing the inbox row itself if it has Notion access.

A row with Author ChatGPT is never treated as Shashank's statement: it cannot record a fill, a classification, a quantity, a pledge or a decision on a proposal.

## Frozen setups

A setup is frozen when a pre-market run writes it to the Trading Ledger with "Frozen at". From then on nobody changes its PRE fields, whatever happens.

A ChatGPT proposal reaches the Ledger only through a Claude pre-market run. That run either freezes it as a Ledger row with Author ChatGPT, saying in PRE Thesis that it came from ChatGPT and what was changed (levels re-checked against current prices), or rejects it into the Hypothesis Lab (Type Rejected trade, Author ChatGPT) with the reason. It counts toward the run's limit of 0-2 intraday and 0-2 swing setups. Because Author stays on every Ledger and Lab row, the weekly review can score each assistant's setups separately once either has five or more scored.

## Formats for ChatGPT input

**Proposed setup.** Item "ChatGPT proposed setup: <instrument>". About: instrument and market. Details (and page body if long): direction, setup family, why now, trigger, entry zone, stop or invalidation, targets, time stop, gap-up and gap-down handling, opening-range and acceptance rules, intended R, maximum rupee risk, event risk, and sources with dates. An intraday proposal must be in the inbox by 08:15 IST on its trading day; a proposal whose session has passed is set to Ignored as stale.

**Verification (fact check).** Item "ChatGPT fact check: <claim>". About page: the Notion row it concerns, if any. Details: the claim, the primary source with its URL and date, what the source says, and the verdict (Confirms, Contradicts or Partly). The next news desk run (or the Sunday macro run) opens the cited source. If it holds, the run sets the row's Verification to Primary verified, correcting the row if needed with a dated line in its body naming the check. If it does not, the run says why in Run note.

## Source grades

Every News Desk, Market Gauges and Theme Radar row carries a Verification grade, the weakest of its key claims:

- **Primary verified**: every key figure was read in that run on a primary source listed in Sources: exchange or regulator filings and calendars (NSE, BSE, SEBI, SEC EDGAR), central bank statements (RBI, Fed, BoJ), official statistics, or company investor-relations releases.
- **Secondary only**: rests on reputable press or data aggregators (Reuters, Bloomberg, the New York Times, Economic Times, Moneycontrol and the like).
- **Unverified**: comes only from a search summary, or could not be checked.

Grade down when in doubt; never upgrade without reading the primary source in that run. The 19 October seed edition was written from search summaries, so the dashboard shows its ungraded rows as Secondary only until a run checks them. Each news desk run regrades up to five rows that matter most to the book.

## Run Log

Every scheduled run writes one Run Log row before it finishes: Run "<Task> YYYY-MM-DD", Date, Task, Status (Complete, Partial, Failed or Skipped), Wrote (what it created or changed, with counts), Missing (what it could not do or verify, and why), Verification (the weakest grade among what it wrote) and Author. An exchange holiday or a day with nothing to score is Skipped, not silence.

A run that cannot reach Notion cannot write its row, so the dashboard's "How the runs went" panel flags any scheduled task with no record for its latest due date. ChatGPT sessions that write to the desk log themselves with Task ChatGPT.

## Sources, subscriptions and secrets

- No passwords, session cookies, API keys or tokens in chat, in Notion, in the dashboard or in this repository. A broker token, when there is one, lives only in the environment's settings and is read-only.
- Paid publications such as the New York Times: store the link, headline, date and an original summary with citation; never full-text copies, and never a shared login.
- Prices, levels and triggers come from exchange or broker data, not from news articles.
