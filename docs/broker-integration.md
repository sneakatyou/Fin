# Connecting Upstox and INDmoney

Research done 18 Oct 2026. Strictly read-only: nothing here can place, modify or cancel an order.
Upstox's own pages could not be fetched from the research sandbox, so Upstox facts come from search summaries of its documentation and are marked where unverified.

## Upstox (Indian equities, pledged collateral)

| Option | Lifetime | What it can read | Catch |
|---|---|---|---|
| **Analytics token** (Developer Apps > Analytics tab) | 1 year, read-only, free | Market data without a static IP: LTP, quotes, historical and intraday candles. Account data (holdings, positions, funds) only from a registered static IP (June 2026 change). | Cloud runs have no static IP, so use it for prices and candles only. |
| **Standard OAuth token** | Until 3:30 AM IST next day | Holdings (with `collateral_quantity`, `haircut`), positions, funds and margin, without a static IP | Needs a manual login every day. Upstox staff say automating that login is not supported; third-party TOTP scripts exist but are against the spirit of the rules. |
| Extended token | 1 year, read-only | Account data | Given on request, reportedly to business or multi-client apps only. |

Endpoints (base `https://api.upstox.com`): `GET /v2/portfolio/long-term-holdings`, `GET /v2/portfolio/short-term-positions`, `GET /v2/user/get-funds-and-margin`, `GET /v3/market-quote/ltp`, `GET /v3/historical-candle/{instrumentKey}/{unit}/{interval}/{to}/{from}`, `GET /v3/historical-candle/intraday/{instrumentKey}/{unit}/{interval}`. Rate limits for standard APIs: 50/s, 500/min, 2000/30 min.

SEBI's retail algo framework (circular of 4 Feb 2025, fully in force at Upstox from 1 Apr 2026) restricts order APIs (static IP, registered app). Upstox does not apply the static-IP rule to read-only standard APIs.

**Plan**
1. Shashank creates an Upstox API app and an analytics token, then stores it as the environment secret `UPSTOX_ANALYTICS_TOKEN`. It is never pasted into chat, a web page or this repository.
2. `api.upstox.com` is added to the cloud environment's allowed domains (it is blocked today).
3. The scheduled runs then take Indian prices and 5- and 15-minute candles from Upstox instead of web search. This also unblocks scoring the opening-range hypotheses, which need intraday candles.
4. Holdings and pledge details stay owner-confirmed. Optionally Shashank can do one manual OAuth login on days he trades, if a holdings sync is worth that.

## INDmoney (US equities)

- No public developer API. US custody is DriveWealth and Alpaca; neither gives end users API keys.
- **INDmoney runs an official read-only connector for Claude** at `https://mcp.indmoney.com/mcp` (see indmoney.com/mcp). Add it in claude.ai under Settings > Connectors as a custom connector and sign in on INDmoney's site. Holdings, allocations, SIPs and watchlist are covered; whether US stocks are included is not confirmed.
- Once added, the scheduled runs can be given that connector, and the dashboard could read it directly.
- Fallback: Tax Centre > Download Report exports.

## Mutual funds and a full Indian picture

- The CDSL/NSDL Consolidated Account Statement (monthly email PDF, password = PAN in capitals) covers demat holdings and mutual funds. The open-source `casparser` library reads it.
- Account Aggregator access is limited to regulated institutions; not usable for a personal script.
