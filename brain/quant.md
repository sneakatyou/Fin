# The short version

1. **Most of a quant firm is not the signal.** Data, cost modelling, risk, execution and monitoring are the bulk of the machine (Narang, Inside the Black Box). A good idea with bad plumbing loses money.
2. **The core maths is breadth times skill.** `IR = IC × √BR` (Grinold and Kahn). Renaissance, WorldQuant and market makers live on many independent bets with a small edge each.
3. **We are the opposite design: depth, not breadth.** A 13-stock book, with about 57% of the pledged part in one group, has only a handful of independent bets. That only pays if research gives a high IC per name, and it makes measurement slow.
4. **The speed businesses are not our game.** Jane Street, Citadel Securities and the Indian prop firms are market makers. SEBI's data shows most individuals lose in F&O while prop traders and FPIs earn algo profits.
5. **The styles that fit an individual are the slow ones:** factor investing (AQR style) and trend following (AHL style). Both are low-turnover and cost-tolerant.
6. **Pipeline hygiene beats model cleverness.** Point-in-time data, realistic costs, out-of-sample tests and multiple-testing control decide whether a backtest means anything.
7. **Published edges decay.** McLean and Pontiff (2016): across 97 predictors, returns were 26% lower out of sample and 58% lower after publication. Expect smaller edges than any backtest shows.
8. **India costs are heavy for fast ideas.** About 24 bps round trip for delivery, 4.5 bps for intraday equity, about 6 bps for index futures since the April 2026 STT rise (about 3 bps before).
9. **SEBI's retail algo framework governs order APIs** (static IP, registration above 10 orders a second). Our system never places orders, and read-only data is not the constraint.
10. **Roadmap:** discipline, data, a research harness, automatic forward scoring, small separate live sleeves, then slow systematic sleeves. Each stage is gated by evidence, not the calendar.
11. **The cheapest high-value step is automatic scoring from candles.** Seven frozen setups and zero triggers is itself a measurement: track the trigger rate per family.
12. **Never:** leverage against pledged stock, infrastructure before a hypothesis worth testing, or re-running variants until one works.

> How to read this page. Researched 18 Oct 2026 from public information only. Evidence grades: Strong, Moderate, Weak, Anecdotal. The research sandbox could not open SEBI, NSE, Upstox or journal pages directly, so facts come from search summaries of those pages, cross-checked where I could. Anything unverified is marked and listed at the end. Research for Shashank's own decisions, not advice. Nothing here changes a rule; suggested changes are written as "Proposal for the weekly review:".

# Part 1: how quant firms work

## 1.1 The archetypes and what each actually does

**Renaissance Technologies (Medallion).** Short-horizon statistical trading by scientists. Jim Simons founded the predecessor firm in 1978 and died in May 2024. Zuckerman (The Man Who Solved the Market, 2019) reports Medallion at about 66% a year before fees and 39% after, 1988 to 2018; a 2024 critique says these are arithmetic averages, not compounded returns. Reported fees were about 5% management and 44% performance; sources disagree on when 44% began. Closed to outside investors since 1993 (Bloomberg), employee-owned, reported capped near \$10 billion. Its open fund, RIEF, trades equities more slowly and reportedly had large losing years (dates unverified). Unknown: the models. **Lesson:** capacity limits and cost control are part of the edge. **Copyable:** no.

**D. E. Shaw.** Founded in 1988 by David E. Shaw, a Columbia computer science professor who had worked on automated trading at Morgan Stanley; seed capital \$28 million from Donald Sussman (Brad Stone, The Everything Store, 2013). It hired scientists rather than financiers and stresses risk control. About \$65 billion of assets in 2025 (Wikipedia). Said to run both systematic and discretionary strategies (not re-verified). **Copyable:** no.

**Two Sigma.** Founded in 2001 by John Overdeck (formerly D. E. Shaw) and David Siegel, with Mark Pickard. Data science and machine learning at scale; about 1,700 staff, over 1,000 of them technologists (secondary source). The useful public case is governance. In January 2025 the SEC announced a settled \$90 million penalty: model-access weaknesses flagged in 2019 let an employee make unapproved parameter changes between November 2021 and August 2023, so some funds underperformed by \$165 million (repaid voluntarily) and others overperformed by \$400 million. **Lesson:** change control on models is a risk control. Our version is "PRE fields never rewritten".

**Citadel and Citadel Securities.** Two separate firms, both owned by Ken Griffin. Citadel (1990) is a multi-strategy hedge fund with fundamental and quantitative teams under central risk. Citadel Securities is a market maker; it says over a third of US-listed retail volume passes through it. **Lesson:** risk-taking and liquidity provision are different businesses. **Copyable:** no.

**Jane Street and the market makers.** A market maker quotes both sides, earns spread and flow, and hedges inventory. Jane Street (founded 1999 per Wikipedia) said it averaged \$707 billion of ETF volume a month in 2024, nearly a quarter of primary US-listed ETF activity (IFR, from investor documents). Reports put its net trading revenue near \$20.5 billion for 2024, and Reuters reported \$39.6 billion for 2025; the firm did not confirm. In India, SEBI's interim order of 3 July 2025 alleged that Jane Street pushed up the Bank Nifty index with heavy morning buying in cash and futures, then sold later to profit on options, and impounded Rs 4,843.57 crore. The firm put the money in escrow on 14 July, was allowed to resume, and disputes the findings. These are allegations; I found no final ruling. **Lesson:** the other side of the options flow retail sees is a professional with more data, size and speed. **Copyable:** no.

**AQR and factor investing.** Founded in 1998 by Cliff Asness, David Kabiller, Robert Krail and John Liew, ex-Goldman. Systematic value, momentum, quality and carry. Asness, Moskowitz and Pedersen (Journal of Finance, 2013) find value and momentum premia in eight markets and asset classes, negatively correlated with each other, which is why they are combined. Evidence: Strong that the premia existed historically; Moderate that they persist after publication. **Copyable:** in spirit, yes (Stage 5).

**Man AHL and CTAs (trend following).** AHL was founded in 1987 by Michael Adam, David Harding and Martin Lueck; Man took a stake in 1989 and completed the purchase around 1994 (sources differ). Trend followers go long what is rising and short what is falling across many futures, sized by volatility. Moskowitz, Ooi and Pedersen (Journal of Financial Economics, 2012) report time-series momentum across 58 liquid futures; Hurst, Ooi and Pedersen (AQR, "A Century of Evidence on Trend-Following Investing") extend it back to 1880 using 1-, 3- and 12-month signals. Rob Carver worked at AHL until 2013. Evidence: Strong for diversified futures; Moderate to Weak for timing one equity index. **Copyable:** partly (Stage 5).

**WorldQuant.** Igor Tulchinsky founded it in 2007 after running a team at Millennium. The "alpha factory" idea: thousands of small, simple, short-horizon signals ("alphas"), combined. Kakushadze's "101 Formulaic Alphas" (2016, Wilmott; arXiv 1601.00991) publishes 101 real formulas with average holding periods of about 0.6 to 6.4 days and average pairwise correlation of 15.9%. Its BRAIN platform crowdsources alphas from consultants. **For us:** at about 24 bps per delivery round trip, many short-hold alphas would not survive an individual's costs. That is my inference; Stage 2 can test it.

**Bridgewater.** Systematic global macro: Pure Alpha (active) and All Weather (risk-balanced). Ray Dalio has fully exited; Nir Bar Dea is CEO. Reported 2025: Pure Alpha up about 33% (Hedgeweek, unnamed source). Little about its rules is publicly documented, so treat descriptions as marketing. **Copyable:** no; the habit of writing rules down is.

**Indian prop and quant firms.** Mostly private, so documentation is thin.

- **Tower Research Capital** (US firm, 1998) has an Indian entity incorporated in 2006 with a Gurgaon registered address, and a second (Gujarat, 2012; probably GIFT City, unconfirmed).
- **Graviton Research Capital:** tax authorities searched its offices in October 2025 (Bloomberg via Business Standard). It declared after-tax profit of Rs 1,010 crore for FY24 and was not accused of wrongdoing. One Bloomberg-sourced piece says it took part in a quarter of large NSE cash transactions in 2024 (secondary, unverified).
- **Quadeye** (Gurugram) and **iRage Capital** (Mumbai) are described in directories as proprietary firms; iRage's job posting describes market-making and mid-frequency arbitrage. Sources for dates and sizes are weak, so I give none.
- **SEBI's studies:** in FY24 proprietary traders and FPIs booked gross trading profits of Rs 33,000 crore and Rs 28,000 crore before costs, with secondary reports putting the algo share at 96 to 97%. Of over a crore individual F&O traders, 93% lost money over FY22 to FY24, about Rs 2 lakh each including costs and Rs 1.8 lakh crore in total. SEBI's July 2025 study found 91% lost in FY25, about Rs 1.05 lakh crore. A later study reportedly shows 87.7% lost in FY26 (unverified).
- **Speed is structural.** SEBI's April 2019 orders found NSE's tick-by-tick feed architecture gave some brokers a latency edge, with OPG Securities the main beneficiary. I did not check the appeals.

**Lesson:** Indian speed shops compete on latency and scale. Do not try to be one.

## 1.2 The research-to-production pipeline

<table header-row="true">
	<tr>
		<td>Step</td>
		<td>What it means</td>
		<td>Main failure</td>
		<td>For us</td>
	</tr>
	<tr>
		<td>1. Data</td>
		<td>Sourcing, cleaning, corporate-action adjustment, point-in-time storage (each value as known on each date).</td>
		<td>Survivorship bias (testing only firms that still exist). Look-ahead bias (using data not yet public, such as restated results). Unadjusted prices around splits and demergers.</td>
		<td>The Vedanta demerger into five tickers is the live example. Store raw prices plus an adjustment table.</td>
	</tr>
	<tr>
		<td>2. Signal research</td>
		<td>Start from an economic reason. Measure the information coefficient (IC: correlation of signal with later returns) and its decay by horizon.</td>
		<td>Many tests, one "discovery". Harvey, Liu and Zhu (RFS 2016) catalogue 316 factors and argue a new one needs t above 3.0, not 2.0.</td>
		<td>Register every hypothesis before testing it.</td>
	</tr>
	<tr>
		<td>3. Backtest with costs</td>
		<td>Fill at the next bar; include every charge and slippage. Kissell splits cost into spread, market impact, delay and opportunity cost.</td>
		<td>Ignoring costs flatters high-turnover ideas.</td>
		<td>A dated Indian cost model (STT changed on 1 Oct 2024 and 1 Apr 2026).</td>
	</tr>
	<tr>
		<td>4. Out-of-sample</td>
		<td>Walk-forward; purged and embargoed cross-validation where labels overlap (López de Prado 2018, chapter 7); deflated Sharpe ratio (Bailey and López de Prado, JPM 2014); probability of backtest overfitting (Bailey et al.).</td>
		<td>The best of many variants is mostly luck.</td>
		<td>Our forward test is the real holdout.</td>
	</tr>
	<tr>
		<td>5. Portfolio construction</td>
		<td>Turn forecasts into weights given risk and costs (Grinold and Kahn).</td>
		<td>Counting correlated bets as independent.</td>
		<td>See the fundamental law below.</td>
	</tr>
	<tr>
		<td>6. Risk model</td>
		<td>Factor exposures, correlations, stress tests; limits set from them.</td>
		<td>Hidden common exposure.</td>
		<td>Vedanta group, Indian Bank, metals, PSU banks and INR are one cluster in the collateral.</td>
	</tr>
	<tr>
		<td>7. Execution</td>
		<td>Trade cheaply; measure implementation shortfall against the decision price (Kissell).</td>
		<td>Paper fills real markets would not give.</td>
		<td>Log slippage on every live fill.</td>
	</tr>
	<tr>
		<td>8. Monitoring and decay</td>
		<td>Track live against expected performance; retire decayed signals. Khandani and Lo link the August 2007 quant losses to the unwinding of similar portfolios.</td>
		<td>Treating a decayed edge as a drawdown.</td>
		<td>Review each family by regime in the monthly review.</td>
	</tr>
	<tr>
		<td>9. Capacity and kill switches</td>
		<td>Know the size at which impact eats the edge (Medallion was capped). Pre-set rules that halt trading.</td>
		<td>Kill rules invented after the loss.</td>
		<td>Write limits before the first live trade (Stage 4).</td>
	</tr>
</table>

**The fundamental law in numbers.** Grinold's approximation is `IR = IC × √BR`, where BR is the number of independent bets a year. Clarke, de Silva and Thorley (Financial Analysts Journal, 2002) add a transfer coefficient for constraints: `IR = TC × IC × √BR`. With IC 0.05, 100 independent bets give IR 0.5, 25 bets give 0.25 and 4 bets give 0.10. Reaching 0.5 with 4 bets needs IC 0.25, which is not realistic. Evidence: Strong as a framework; it assumes independent bets and constant IC. **For us:** concentration is rational only if research gives unusually high IC in each name, and correlated holdings count as one bet. Systematic sleeves add breadth cheaply.

**Team structure.** Public descriptions suggest researchers (signals), engineers (data, infrastructure, execution), portfolio managers (capital), independent risk, and operations; proportions are private. **For us:** he is every role, so separate in time instead: freeze, test, then review. The scheduled AI runs act as independent reviewer; deterministic code, not the model, computes every number.

## 1.3 Key books and what to take from each

<table header-row="true">
	<tr>
		<td>Book</td>
		<td>What to take</td>
		<td>Caution</td>
	</tr>
	<tr>
		<td>López de Prado, Advances in Financial Machine Learning (Wiley, 2018)</td>
		<td>Validation hygiene: triple-barrier labelling and meta-labelling (chapter 3), fractional differentiation (chapter 5), purged k-fold with embargo (chapter 7).</td>
		<td>Built for large datasets. Take the validation ideas, not the machine learning.</td>
	</tr>
	<tr>
		<td>Chan, Quantitative Trading (Wiley, 2008; second edition 2021) and Algorithmic Trading (Wiley, 2013)</td>
		<td>The independent trader's view: simple mean-reversion and momentum strategies, backtest pitfalls, risk management.</td>
		<td>Re-test every example on India.</td>
	</tr>
	<tr>
		<td>Carver, Systematic Trading (2015) and Leveraged Trading (2019)</td>
		<td>Volatility-based sizing, diversification, how much leverage a system can carry. Ex-AHL; open-source code (pysystemtrade).</td>
		<td>Futures-centred; the sizing logic transfers.</td>
	</tr>
	<tr>
		<td>Narang, Inside the Black Box (Wiley; 2009, 2013, third edition 2024)</td>
		<td>Anatomy of a quant strategy: alpha, risk, transaction-cost, portfolio-construction and execution models, plus data and research.</td>
		<td>Descriptive, not a how-to.</td>
	</tr>
	<tr>
		<td>Grinold and Kahn, Active Portfolio Management (McGraw-Hill, second edition 1999 to 2000)</td>
		<td>Information ratio, the fundamental law (chapter 6), forecasting and information analysis (chapters 10 to 12), costs in construction (chapter 16).</td>
		<td>Heavy maths; take the framework.</td>
	</tr>
	<tr>
		<td>Kissell, The Science of Algorithmic Trading and Portfolio Management (2013); Algorithmic Trading Methods (second edition 2020)</td>
		<td>Transaction-cost analysis, market impact, implementation shortfall.</td>
		<td>Institutional size; for us spread and fees dominate.</td>
	</tr>
</table>

Titles, years and chapter numbers come from publisher and library listings, not from reading the books.

## 1.4 The India regulatory and cost frame

**SEBI's retail algo framework (circular of 4 February 2025),** from the summaries I could access:

- API access for retail clients uses a unique broker-vendor-client key and a registered static IP. The client supplies the IP and may change it at most once a week. API sessions must end before the next trading day.
- NSE's standards (5 May 2025) set a threshold of 10 orders a second per exchange. At or below it, an algo need not be registered as a strategy; above it, registration through the broker is required. Whether sub-threshold orders still carry an exchange algo tag differs between summaries (unverified).
- Timeline: 1 August 2025, then 1 October 2025, then a glide path (first retail algo registered by 31 October, wider registration by 30 November, a mock session by 3 January 2026, no new retail API clients from 5 January for laggard brokers) and full applicability from 1 April 2026, per the 30 September 2025 circular as reported. I did not check for later extensions.
- Read-only data is not an order API. Our note `docs/broker-integration.md` says Upstox does not apply the static-IP rule to read-only market data, while account data needs a registered static IP from June 2026. I could not open Upstox's pages, so this is unverified.
- This matters only if he later automates his own order placement; our system never places orders.

**Charges** (secondary sources; confirm against the Upstox charge sheet):

<table header-row="true">
	<tr>
		<td>Item</td>
		<td>Delivery equity</td>
		<td>Intraday equity</td>
		<td>Index futures</td>
		<td>Index options (premium)</td>
	</tr>
	<tr>
		<td>STT</td>
		<td>0.1% buy and sell</td>
		<td>0.025% sell</td>
		<td>0.05% sell (from 1 Apr 2026; was 0.02%)</td>
		<td>0.15% sell (from 1 Apr 2026; was 0.1%)</td>
	</tr>
	<tr>
		<td>Stamp duty (buy)</td>
		<td>0.015%</td>
		<td>0.003%</td>
		<td>0.002%</td>
		<td>0.003%</td>
	</tr>
	<tr>
		<td>NSE transaction charge</td>
		<td>0.00297%</td>
		<td>0.00297%</td>
		<td>0.00173%</td>
		<td>0.03503%</td>
	</tr>
</table>

Also: SEBI fee Rs 10 per crore; GST 18% on brokerage and exchange charges; Upstox headline brokerage a flat Rs 20 per executed order; DP charge on delivery sells (about Rs 18.5 plus GST, third-party figure). Tax since 23 July 2024: short-term listed equity gains 20%, long-term 12.5% above Rs 1.25 lakh a year; intraday equity is speculative business income and F&O non-speculative business income, both at slab rates. Confirm with a chartered accountant.

**Worked round trips** (my arithmetic from these rates, before spread and slippage):

- Delivery, Rs 5 lakh each way: about Rs 1,180, or **24 bps**. STT alone is Rs 1,000.
- Intraday equity, Rs 5 lakh each way: about Rs 223, or **4.5 bps**.
- Index futures, Rs 15 lakh notional each way: about Rs 892, or **6 bps**. At the old 0.02% STT it was Rs 442, or 3 bps; the April 2026 rise doubled the cost.
- Index options, Rs 1 lakh premium bought and sold: about Rs 283, or **0.28% of premium** (0.23% before the rise).

**What this does to high-frequency ideas for an individual.**

- A strategy earning a fraction of a basis point per trade is dead at 3 to 6 bps of fees. Market makers rely on exchange access, co-location, direct feeds and scale, which a retail API does not provide (general knowledge; latency not verified).
- The 10 orders a second threshold is not our binding constraint. Costs, latency and data are.
- Budget 2026 raised F&O STT to curb speculative trading; commentary says it hits high-frequency, low-margin strategies hardest.
- Slow ideas pay the same rates less often. A sleeve with 200% one-way annual turnover pays about 0.44% a year in STT, stamp duty and exchange charges, before brokerage, DP charges, spread and impact (my arithmetic). That is survivable if the edge is several percent.

# Part 2: our roadmap

**Principles.** Hypothesis first, infrastructure second. Every stage has an exit test. Effort assumes about 5 hours a week of his time; AI-run time is not counted. An individual can do disciplined measurement and a few slow systematic sleeves well; he cannot compete on speed, data budget or cost.

## Stage 0, now: discipline and data capture

- **Goal:** every decision becomes a row that can be tested later.
- **Steps:** keep freezing setups with all fields; log rejected candidates with what price did next at fixed horizons (end of day, T+1, T+5); log skipped days with the reason; add regime tags (trend state, volatility, event risk); keep rows append-only. Report a **trigger rate** per family (valid triggers divided by frozen setups). Today it is 0 of 7, which says either the triggers are tight or the regime is hostile; only a rate over time tells which.
- **Tools:** Notion Hypothesis Lab and Trading Ledger as now.
- **Effort:** about 10 minutes a day.
- **Done:** 12 weeks of complete rows, no rewritten PRE fields, trigger rate reported per family.
- **Main risk:** outcome-based editing, and logging only what felt interesting.
- **Proposal for the weekly review:** add trigger rate and "frozen with no trigger" as standing metrics.

## Stage 1: data

- **Goal:** a point-in-time price store that the scheduled runs and the research code both read.
- **Steps:**
	1. Daily candles for NIFTY, Bank Nifty, India VIX, the 13 holdings and the watchlist from Upstox historical candles (V3). Minute and hour data reportedly start January 2022 and day data January 2000 (Upstox announcement via community post; unverified): about 1,190 trading days of intraday history.
	2. Intraday candles at 5 and 15 minutes, snapshotted nightly, append-only with a fetch timestamp. For 24 instruments, 5-minute bars are about 450,000 rows a year (1-minute: 2.25 million), so skip 1-minute until a hypothesis needs it.
	3. A corporate-actions table (splits, bonus, demergers with ex-dates). Store raw prices; derive adjusted series. Test it on the Vedanta demerger: no fake crash.
	4. NSE bhavcopy end-of-day files (UDiFF format since 8 July 2024) to build a survivorship-free universe from the day collection starts. Check NSE's terms on automated access.
	5. The IIMA factor library (Agarwalla, Jacob, Varma 2013; new series from October 1993, CMIE Prowess data with a survivorship correction) as the benchmark for any momentum, value or quality sleeve.
	6. Fundamentals: free sources are not point-in-time. Snapshot quarterly results and any consensus data with the date seen, starting now. History before that stays contaminated.
- **Tools:** Python; Supabase Postgres for intraday and snapshots; CSV files in the repo for daily data. The token is an environment secret and `api.upstox.com` must be on the environment's allowed list (`docs/broker-integration.md`).
- **Effort:** one or two weekends.
- **Done:** 20 trading days of nightly loads with row-count checks and no gaps; a daily check of Upstox closes against bhavcopy; any past scheduled run's price inputs reproducible.
- **Main risk:** silent gaps and API changes. The daily cross-check is the canary.

## Stage 2: research harness

- **Goal:** test hypotheses cheaply and honestly.
- **Steps:**
	1. **Registry rule:** a hypothesis row exists, timestamped, before any test: statement, expected sign, universe, horizon, rules in words, cost-model version, success criterion, number of variants to try, development and holdout windows. **Proposal for the weekly review:** add these fields to the Hypothesis Lab.
	2. A small Python backtester that reads a frozen setup spec and walks candles. Signal on bar t, fill on bar t+1; a gap fills at the open, never at the level; if stop and target hit in one bar, assume the stop.
	3. A dated cost model matching Upstox's calculator within Rs 1 on five sample trades, plus slippage.
	4. The metrics he asked for: sample size, win rate, payoff, expectancy in R, MFE and MAE, drawdown, regime splits, and a bootstrap interval on expectancy. At 30 trades and a 50% win rate the 95% interval is about 32% to 68%, so no family is judged on fewer than 30 trades.
	5. Validation: walk-forward with parameters fixed before the run; report variants tried and raise the hurdle as they rise (deflated Sharpe).
	6. Baselines: a random-entry null with the same stop, target and costs, and the IIMA factors.
- **What can be tested:** price-only families (oversold index reversal, failed breakout, support breakdown, gap-and-go, opening-range breakout, intraday momentum gate, sector waves). Earnings and revision, valuation and event-driven families need point-in-time fundamentals or event data, so they are forward-test only.
- **Effort:** three to five weekends for version 1; his job is the specification.
- **Done:** 10 trades hand-checked; the random-entry null earns about minus cost; one registered hypothesis tested end to end with a written verdict, "rejected" included.
- **Main risk:** the harness becoming the project, and re-running until something works. With about 1,190 days of intraday history, most intraday setups will stay "inconclusive".

## Stage 3: forward test

- **Goal:** automatic paper scoring of every frozen setup and rejected candidate from candles instead of web search.
- **Steps:** make each frozen setup machine-readable (trigger type, level, side, entry, stop, target, time stop, gap rule); a scorer using the Stage 2 rules library runs after the 16:15 IST review and writes outcome in R, MFE, MAE and "no trigger" days; rejected candidates are scored at T+1 and T+5 by the same code; compare forward results with the family's backtest. **Proposal for the weekly review:** add structured trigger fields to frozen setup pages so code can read them.
- **Promotion gate:** at least 30 forward trades, positive expectancy after costs, drawdown inside a limit set beforehand, and results in at least two regimes. At today's trigger rate this takes months, so widen the sample with daily-timeframe setups and more instruments.
- **Tools:** a Python script run after the post-market review (a GitHub Actions cron also works for read-only data). Code computes; the model reviews.
- **Effort:** two or three weekends.
- **Done:** 20 straight trading days fully code-scored, with 10 spot-checks showing no disagreement.
- **Main risk:** prose rules that cannot be coded. Finding them is a benefit.

## Stage 4: small live sleeves with hard limits

- **Goal:** learn real execution cost with money small enough to be tuition.
- **Preconditions:** a family has passed the Stage 3 gate; limits are written; he places orders by hand (our system still never does).
- **Steps:** set sleeve capital as an amount he accepts losing entirely, funded from new money. Ring-fence it from the pledged collateral; the simplest way is a separate cash-funded account, because pledge margin at Upstox probably cannot be excluded from a segment (unverified). Write limits in R: risk per trade, daily and weekly stops, a drawdown level that pauses the sleeve until the monthly review, maximum open positions, no averaging down, no leverage beyond cash. Log slippage against the decision price on every fill and compare live with paper.
- **Effort:** one weekend to set up, then three to six months minimum.
- **Done:** at least 30 live trades; live slippage matches the cost model; no limit breached.
- **Main risk:** live money revives the known failure modes (retrofitting, buying because it fell, treating collateral as cash, promoting on one result). Do not scale before a second regime.

## Stage 5: systematic portfolio sleeves

**Why these and not high-frequency.** His edge is patience, concentration and research depth, not speed. Slow sleeves have low turnover, tolerate India's costs, use liquid names where capacity is irrelevant, and add the breadth a 13-stock book lacks. This is an argument, not a proven result.

<table header-row="true">
	<tr>
		<td>Sleeve</td>
		<td>Rule sketch (to register, not assume)</td>
		<td>Evidence</td>
		<td>Data need</td>
	</tr>
	<tr>
		<td>A. Momentum plus quality, monthly</td>
		<td>Rank Nifty 200 names on 12- and 6-month volatility-adjusted return, skipping the latest month; keep those passing a quality screen (return on equity, leverage, earnings stability); hold 20 to 30; rebalance monthly with a buffer band to cut turnover.</td>
		<td>Momentum: Strong abroad (Jegadeesh and Titman 1993). India: Weak to Moderate; older NSE studies (1997 to 2013) find short-term momentum, size-dependent, lasting up to 12 months in large caps. NSE's Nifty200 Momentum 30 and Quality 30 indices (semi-annual rebalance) give a public benchmark.</td>
		<td>Momentum: price-only, available. Quality: point-in-time fundamentals (start snapshots).</td>
	</tr>
	<tr>
		<td>B. Index trend-following</td>
		<td>NIFTY above or below a long moving average, used first as a risk indicator on the dashboard, later as a switch between equity and a liquid fund.</td>
		<td>Futures trend: Strong (Moskowitz, Ooi, Pedersen; Hurst et al.). Single-index timing: Moderate to Weak; it mainly trims drawdowns, and each switch costs STT and short-term tax.</td>
		<td>Price-only, available.</td>
	</tr>
	<tr>
		<td>C. Earnings-revision screens</td>
		<td>Rank on revision breadth or the price reaction around results, as a post-earnings drift proxy.</td>
		<td>US: Moderate (Bernard and Thomas 1989; Chan, Jegadeesh, Lakonishok 1996; from memory). India: unverified.</td>
		<td>Results dates and consensus snapshots; forward-test first.</td>
	</tr>
</table>

- **Steps:** register each sleeve; test sleeve A on price-only data against the IIMA factors (is it just the momentum factor?); paper-run at least six monthly rebalances before real money; compare with simply holding a published momentum index, which a custom sleeve must beat after costs to justify the work; report each sleeve's overlap with the collateral cluster (Vedanta group, Indian Bank, metals, PSU banks) and cap it.
- **Effort:** two to three months to the first paper rebalance; six to twelve months for evidence.
- **Done:** six logged paper rebalances, tracking against benchmark, and a written go or no-go.
- **Main risk:** decay and crowding (McLean and Pontiff), and momentum crashes after sharp rebounds from deep drawdowns (Daniel and Moskowitz 2016, from memory). Check regime splits, especially around the current rebound from the 8 October low.

## What not to do

- **Overfit.** The more variants you try, the longer the history you need to trust the best (Bailey et al.). Fix parameters first and count variants.
- **Lever the pledged stock.** About 57% of the pledged book is one group. Margin against it for a sleeve hits collateral value, haircuts and trade losses at once. Keep sleeves cash-funded and separate (see Collateral and Stress Test).
- **Build infrastructure before a hypothesis worth testing.** No new system unless a registered hypothesis needs it.
- **Promote on one result.** Respect the sample-size gates.
- **Copy published alphas.** Short-hold formulas fail on India's costs and edges decay.
- **Let a model do arithmetic.** Code computes, the model judges.
- **Use unadjusted prices** around demergers and bonuses.
- **Automate against the spirit of broker rules.** No scripted logins around the daily token, no shared keys, nothing managing other people's money.
- **Change rules mid-test.** A changed rule is a new hypothesis.

# Quant ideas mapped to our hypotheses

<table header-row="true">
	<tr>
		<td>Quant idea</td>
		<td>Source and evidence</td>
		<td>Our hypothesis or family</td>
		<td>Testable now?</td>
		<td>Next step</td>
	</tr>
	<tr>
		<td>Breadth and the fundamental law</td>
		<td>Grinold and Kahn; Strong framework</td>
		<td>Concentrated Core book, collateral cluster</td>
		<td>Yes, from holdings correlations</td>
		<td>Report effective independent bets in the monthly review</td>
	</tr>
	<tr>
		<td>Time-series momentum (trend)</td>
		<td>Moskowitz, Ooi, Pedersen 2012; Strong in futures</td>
		<td>Sector-wave momentum; index regime read</td>
		<td>Yes, price-only</td>
		<td>Register; Stage 5B indicator</td>
	</tr>
	<tr>
		<td>Cross-sectional momentum</td>
		<td>Jegadeesh and Titman 1993; Strong abroad, Weak to Moderate in India</td>
		<td>Earnings and revision momentum; sector waves</td>
		<td>Yes, price-only</td>
		<td>Stage 5A paper run</td>
	</tr>
	<tr>
		<td>Quality premium</td>
		<td>AQR; NSE Quality 30 rules; Moderate</td>
		<td>Valuation dislocation; Core selection</td>
		<td>Only forward</td>
		<td>Start point-in-time snapshots</td>
	</tr>
	<tr>
		<td>Post-earnings drift and revisions</td>
		<td>Bernard and Thomas 1989; Moderate in the US, India unverified</td>
		<td>Earnings and revision momentum</td>
		<td>Partly, via results-date price reaction</td>
		<td>Forward-test first</td>
	</tr>
	<tr>
		<td>Short-term mean reversion</td>
		<td>Chan; Moderate, regime-dependent</td>
		<td>Oversold index reversal; failed-breakout reversal; support-breakdown continuation (its mirror)</td>
		<td>Yes, index candles from January 2022</td>
		<td>Stage 2 with the random-entry null</td>
	</tr>
	<tr>
		<td>Intraday momentum and opening range</td>
		<td>Chan; Weak to Moderate, cost-sensitive</td>
		<td>15-minute ORB; intraday momentum gate</td>
		<td>Yes, small sample</td>
		<td>Register; expect "inconclusive"</td>
	</tr>
	<tr>
		<td>Gap behaviour</td>
		<td>Our failure mode SETUP-IN-0001; Anecdotal</td>
		<td>Post-capitulation gap-and-go; gap-handling rules</td>
		<td>Yes, daily open versus prior close</td>
		<td>Measure gap-fill and continuation rates</td>
	</tr>
	<tr>
		<td>Event probability trees</td>
		<td>Practitioner method; Anecdotal</td>
		<td>Event-driven special situations; IDBI anchor</td>
		<td>No, too few events</td>
		<td>Forward log with stated probabilities; score calibration</td>
	</tr>
	<tr>
		<td>Factor and credit beta</td>
		<td>Asness, Moskowitz, Pedersen 2013; Moderate</td>
		<td>AI-infrastructure credit beta</td>
		<td>Partly (US data)</td>
		<td>Regress the book on credit proxies</td>
	</tr>
	<tr>
		<td>Alpha decay, multiple testing, change control</td>
		<td>McLean and Pontiff 2016; Harvey, Liu, Zhu 2016; SEC v. Two Sigma; Strong</td>
		<td>Hypothesis Lab discipline; PRE fields never rewritten</td>
		<td>Yes, process</td>
		<td>Registry fields and variant counts (proposals above)</td>
	</tr>
</table>

# Sources and what I could not verify

Links (found through search; not opened directly):

- [Kakushadze, 101 Formulaic Alphas](https://arxiv.org/abs/1601.00991)
- [McLean and Pontiff 2016](https://ivey.uwo.ca/media/3775549/pontiff.pdf)
- [Harvey, Liu, Zhu 2016](https://nber.org/papers/w20592)
- [Bailey and López de Prado, Deflated Sharpe Ratio](https://papers.ssrn.com/abstract=2460551)
- [IIMA factor library](https://faculty.iima.ac.in/~iffm/Indian-Fama-French-Momentum/)
- [NSE Nifty200 Momentum 30 factsheet](https://www.niftyindices.com/Factsheet/Factsheet_Nifty200_Momentum30.pdf) and [Quality 30 factsheet](https://www.niftyindices.com/Factsheet/Factsheet_Nifty200_Quality30.pdf)
- [Zerodha on NSE's retail algo circular](https://zerodha.com/z-connect/general/a-comprehensive-overview-of-nses-circular-on-the-new-retail-algo-trading-framework)
- [Business Standard, SEBI algo extension](https://www.business-standard.com/markets/news/sebi-extends-retail-algo-trading-framework-rollout-to-2026-125093000956_1.html)
- [Business Standard, Jane Street order](https://www.business-standard.com/amp/markets/news/sebi-bars-jane-street-orders-rs-4844-cr-disgorgement-market-manipulation-125070400081_1.html)
- [Taxmann, SEBI FY22 to FY24 F&O study](https://www.taxmann.com/post/blog/93-of-1-crore-fo-traders-saw-rs-2l-avg-loss-while-top-3-5-faced-rs-28l-avg-loss-incl-costs-sebi/) and [Business Standard, FY25](https://www.business-standard.com/markets/news/net-losses-of-traders-in-fo-widens-in-fy25-sebi-study-125070701221_1.html)
- [Business Standard, Graviton search](https://www.business-standard.com/companies/news/i-t-dept-raids-proprietary-trading-firm-graviton-as-govt-steps-up-scrutiny-125101600682_1.html)

Not verified, or only from secondary sources:

- Primary SEBI, NSE and Upstox documents. Any extension after 1 April 2026, and how Upstox treats a self-built algo, are unchecked.
- Medallion fee history; Bridgewater's rules; Graviton's market share; Quadeye and iRage details; the FY26 SEBI figures; Jane Street's final order status and revenue (reported, not confirmed by the firm).
- Jegadeesh and Titman (1993), Daniel and Moskowitz (2016), Chan, Jegadeesh and Lakonishok (1996) and Bernard and Thomas (1989) are cited from memory; book chapter numbers come from listings; Upstox limits come from search summaries and our earlier note.
