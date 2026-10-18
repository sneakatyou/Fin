# Fin

Shashank's personal investing research system: the dashboard he reads every day, and the notes on how it is fed.

Nothing here places orders or touches a brokerage account. It is research for his own decisions, not advice.

## How it fits together

```
Scheduled Claude runs (claude.ai)          Notion: Trading Research System          Portfolio Desk (claude.ai artifact)
  Pre-market pulse   08:23 IST Mon-Fri  -->  Portfolio Book                    -->   reads Notion live with the
  Post-market review 16:15 IST Mon-Fri  -->  Trading Ledger                    -->   viewer's own Notion access
  Weekly review      09:55 IST Sat      -->  Hypothesis Lab                    -->   (saved views, so it does not
  Monthly IC review  10:52 IST, 1st     -->  Pulse and Review Log              -->   use the workspace's SQL query
                                             Strategy Playbook, Agent Mandate,       allowance)
                                             Collateral and Stress Test
```

- **Notion is the single source of truth.** The scheduled runs write to it; the dashboard only reads.
- **The dashboard** is a private claude.ai artifact: https://claude.ai/artifact/K5cUrrGok9cnM3fhVJVzeJ
- **Google Drive** holds a mirror of the Strategy Playbook. The Google Sheet "Trading Portfolio Book" is empty and unused.

## This repository

| Path | What it is |
|---|---|
| `dashboard/index.html` | The dashboard page (the copy deployed to the artifact's store) |
| `dashboard/datasets.json` | Where each number on the page comes from: the Notion views and the FX file |
| `dashboard/fx-usdinr.json` | The USD/INR rate used to convert the US book, with its date and source |
| `docs/broker-integration.md` | How Upstox and INDmoney could feed real holdings and prices |
| `brain/` | Copies of the Notion Brain pages: checklists (read by every run), the rolling retrospective, masters of investing, traders and psychology, research evidence, and quant firms with the roadmap |

## Updating the dashboard

The page and its data sources live in the artifact's own store, not in a web server. To change them, ask Claude in a session that has this repository; it edits `dashboard/`, then writes the same files to the artifact. Keep the two in step.
