*Research for Shashank's own decisions, not advice. Written 18 Oct 2026. Evidence labels: Strong / Moderate / Weak / Anecdotal. Facts were checked against web sources this session unless marked † (standard reference quoted from memory). Everything is paraphrased because I could not check exact wording at source.*

## The short version

1. Most of what the "masters" teach is risk control, not entry technique; the evidence is Anecdotal because the sample was picked after the winners were known.
2. Trend and momentum have the best long-run evidence here (Jegadeesh and Titman 1993; Moskowitz, Ooi, Pedersen 2012; Hurst, Ooi, Pedersen 2017), with whipsaws and crashes in sharp rebounds after panics (Daniel and Moskowitz 2016).
3. Pattern recipes (boxes, bases, VCP, follow-through days) are Weak or Anecdotal evidence: use them to define a trigger and a stop, not as proof of an edge.
4. Breakout attempts fail often (Brooks's 70-80% is secondhand); Turtle Soup trades the failure only after price reclaims the broken level, so confirmation is the price of the trade.
5. Published ORB results enter early (5-minute range, second bar); his 15-minute ORB and 09:15-09:45 no-entry window are a slower variant nobody I can cite has tested.
6. In US ETFs the first half-hour return from the previous close predicts the last half-hour (Gao et al 2018), a small effect and a cheap forward test for the Intraday momentum gate.
7. Macro masters add regime context: liquidity and credit set the tide, reflexive loops overshoot, concentrate only on asymmetric payoffs, defend first.
8. Size in R from the stop, never from the target; expectancy needs hundreds of trades; for him ruin means a forced sale of pledged core holdings, not a zero balance.
9. Losing streaks are normal: at a 40% win rate, a run of 10 losses has about a 38% chance of appearing somewhere in 200 trades.
10. Guard against resulting, hindsight, overconfidence and chasing a daily rupee number; zero triggers in a hostile regime is output, not failure.
11. Honest base rate: SEBI finds roughly 7 in 10 individual intraday cash traders and roughly 9 in 10 individual F&O traders lose money; the burden of proof sits on his Ledger.

## 1. Trend, stage and momentum

### What the practitioners say

- **Jesse Livermore**, Reminiscences of a Stock Operator (Edwin Lefèvre, 1923, a fictionalised account of his career). Trade with the main trend, wait for confirmation, and note that holding a correct position is rarer and worth more than being right ("sitting tight"). He went through several bankruptcies and died by suicide in 1940 with liabilities reported above assets, so the book is also a warning about leverage and ego. Anecdotal.
- **Nicolas Darvas**, How I Made 2,000,000 USD in the Stock Market (1960). Box theory: buy a decisive break above a consolidation box, stop just under it. Self-reported. Anecdotal.
- **William O'Neil**, How to Make Money in Stocks (1988). CAN SLIM covers earnings growth, new highs, supply and demand, leadership, institutional sponsorship and market direction. The market-direction tool is the follow-through day. Day 1 of a rally attempt is the first up close after a low. A follow-through is a gain of about 1.25% or more (the threshold has ranged from 1% to 1.7%) on higher volume than the prior day, on day 4 or later. It fails if the day-1 low is undercut. IBD itself says not every follow-through leads to a new uptrend. Weak: I know of no independent test.
- **Mark Minervini**, Trade Like a Stock Market Wizard (2013). Trend template: a stage 2 uptrend (price above rising 150- and 200-day averages, 50-day above both, well above the 52-week low, near the high). Then buy a volatility contraction pattern (VCP: successive tighter pullbacks) and cut losses small. Won the US Investing Championship in 1997 and 2021 (self-reported returns). Anecdotal.
- **Stan Weinstein**, Secrets for Profiting in Bull and Bear Markets (1988). Read the weekly chart against the 30-week average: stage 1 basing, 2 advancing, 3 topping, 4 declining. Buy stage 2 breakouts on volume; avoid longs in stages 3 and 4. Weak to Anecdotal.
- **Jack Schwager**, Market Wizards (1989) and four later volumes. Recurring lessons, as I read the series†: a method that suits your temperament; risk control before return; cut losses, let winners run; sit out when there is no edge; losses are a business cost; many had an early blow-up. The caveat is selection: interviewees were chosen because they had already won, so the books cannot say how many others followed the same habits and failed.

### What the research says

<table header-row="true">
<tr>
<td>Idea</td>
<td>Source</td>
<td>Evidence</td>
<td>Caveat</td>
</tr>
<tr>
<td>Stocks that won over 3-12 months keep winning for a while</td>
<td>Jegadeesh and Titman 1993, Journal of Finance; their 1999 NBER follow-up found it continued in the 1990s</td>
<td>Strong, US</td>
<td>Fades after about a year; crashes after panics</td>
</tr>
<tr>
<td>An asset's own past return predicts its next return</td>
<td>Moskowitz, Ooi, Pedersen 2012, Journal of Financial Economics 104: 58 liquid futures</td>
<td>Moderate to Strong</td>
<td>Kim, Tse, Wald say it is mostly volatility scaling; Goyal and Jegadeesh 2017 dispute that it is distinct from stock momentum</td>
</tr>
<tr>
<td>Trend following over a century</td>
<td>Hurst, Ooi, Pedersen 2017, Journal of Portfolio Management 44(1): 67 markets from 1880</td>
<td>Moderate</td>
<td>Authors are at AQR, a trend-following manager</td>
</tr>
<tr>
<td>Momentum crashes in "panic" states</td>
<td>Daniel and Moskowitz 2016, Journal of Financial Economics 122(2): after market declines, in high volatility, momentum loses as the market rebounds</td>
<td>Strong, US</td>
<td>A volatility-aware version did much better in their tests</td>
</tr>
<tr>
<td>Momentum in India</td>
<td>Dhankar and Maheshwari 2014; Maheshwari and Dhankar 2016 (NSE, 1997-2013); an ISB blog summary</td>
<td>Weak to Moderate</td>
<td>Short-horizon momentum, long-horizon reversal. Few papers, one author group, not independently checked</td>
</tr>
<tr>
<td>Short-term reversal, the other side of momentum</td>
<td>Jegadeesh 1990†; Lehmann 1990†; Nagel 2012†</td>
<td>Moderate</td>
<td>Pays for supplying liquidity; largest in stress</td>
</tr>
</table>

For Earnings/revision momentum, post-earnings drift (Ball and Brown 1968†, Bernard and Thomas 1989†) is Strong in US data and unverified for India here.

Takeaways. Momentum lives at weekly-to-monthly horizons and reversal at the shortest, so the same tape can reward trend-following over weeks and fading over days. Moving-average timing (Faber 2007†, Brock, Lakonishok, LeBaron 1992†) cuts drawdowns more reliably than it adds return, which fits Paul Tudor Jones's 200-day rule: in a widely reproduced interview with Tony Robbins he calls the 200-day average his central metric and says he was flat at the top of the 1987 crash. A note on his wall reportedly reads "losers average losers".

**For us:**
- The pattern books are vocabulary for triggers and stops; promote nothing on a book's word. Momentum evidence supports Earnings/revision momentum and Sector-wave momentum over weeks to months, not 15-minute NIFTY trades.
- NIFTY rebounded 4.4% in six sessions from the 2026 low (22,179.90 on 8 Oct to 23,146 on 16 Oct) after a nine-week fall. That is the state where Daniel and Moskowitz find momentum most exposed and frozen shorts most likely to be squeezed, and it is what a Weinstein stage 4 rally looks like. Whether a follow-through day has occurred is a countable fact.
- Proposal for the weekly review: tag every frozen setup and rejected candidate with a regime label (index versus 200-day average, slope of the 30-week average, O'Neil rally-attempt day count), so results can be split by regime as he wants.
- Proposal for the weekly review: add Weinstein stage and distance from the 200-day average as a descriptive column in the Portfolio Book (not a sell rule). It shows whether pledged names are in downtrends.

## 2. Breakouts, failed breakouts and the opening range

### The sources

- **Toby Crabel**, Day Trading with Short Term Price Patterns and Opening Range Breakout (Traders Press, 1990). ORB: a buy stop at the open plus a "stretch" and a sell stop at the open minus it; the first to trigger is the position and the other is its stop. Narrow-range days (NR4: narrowest of the last four days; NR7: of seven) and inside days flag compression that tends to precede expansion but give no direction. His Stocks and Commodities articles (abstracts only) say a strong one-directional move in the first five minutes happens on only about 10% of days, and 70-80% of days rotate or chop early. Third-party futures backtests exist but are not his tables. Weak to Moderate; futures; older data.
- **Linda Raschke and Larry Connors**, Street Smarts (1995; one source says 1996). Turtle Soup: a new 20-day low whose previous 20-day low is at least four sessions old; go long only if price reclaims that old low. The premise is that Turtles bought 20-day breakouts, so failures trap them. I could not check these rules against the book, nor the 80-20 and Holy Grail setups. A circulated list of Raschke rules says large gaps favour continuation and the best reversals come in the morning; that is an unverified reproduction, not her wording. Anecdotal to Weak.
- **Al Brooks**, Trading Price Action series. Secondhand summaries put the failure rate of breakout attempts from ranges near 80% and of channel breakouts at 70-75%, varying by context. It is discretionary chart reading, not a backtest. Anecdotal.
- **Zarattini and Aziz (2023)**, "Can Day Trading Really Be Profitable?", SSRN 4416622. A 5-minute ORB on QQQ, 2016-2023: if the first 5-minute candle is up, buy at the start of the second. Large leveraged returns. An independent blog replication on five other indices found gross results reproduced and net results indistinguishable from zero, and notes the original charges commission but no spread or slippage and has no out-of-sample period. Weak to Moderate; US; a strong bull period for QQQ.
- **Gao, Han, Li, Zhou (2018)**, "Market intraday momentum", Journal of Financial Economics 129(2), 394-414. The first half-hour return from the previous close predicts the last half-hour return, more on volatile, high-volume and macro-news days, and in ten other ETFs. An early draft put R-squared near 2%. Moderate; US ETFs; small effect.

### Confirmation timing

Zarattini and Aziz enter on the second 5-minute bar (about 09:20 on NSE hours), so they wait for almost nothing. Crabel enters when price travels the stretch from the open, so distance is the confirmation. Turtle Soup enters after the reclaim, which proves the break failed but gives a worse price. His Intraday Desk rules allow nothing before 09:45, which protects against opening noise and gap-as-trigger errors (SETUP-IN-0001).

### Mapping onto his families

<table header-row="true">
<tr>
<td>Family</td>
<td>Closest published idea</td>
<td>What it suggests</td>
<td>Catch</td>
</tr>
<tr>
<td>Failed-breakout reversal</td>
<td>Turtle Soup; Brooks</td>
<td>Base rate favours breakout failure; enter on the reclaim, not the break</td>
<td>The reclaim often completes early, inside the no-entry window</td>
</tr>
<tr>
<td>Support-breakdown continuation</td>
<td>Weinstein stage 4; time-series momentum</td>
<td>Shorts with the larger trend have more support than shorts against it</td>
<td>High breakout failure rate; squeezes in panic rebounds</td>
</tr>
<tr>
<td>Post-capitulation gap-and-go</td>
<td>O'Neil follow-through day</td>
<td>Needs confirmation beyond the gap</td>
<td>Crabel: directional starts are rare. His rule: a gap through a level is not a reclaim</td>
</tr>
<tr>
<td>15-min ORB</td>
<td>Crabel; Zarattini and Aziz; NR4/NR7</td>
<td>Compression days first; trade the break of a defined range</td>
<td>Published versions enter earlier and understate costs; untested in India</td>
</tr>
<tr>
<td>Intraday momentum gate</td>
<td>Gao et al 2018</td>
<td>Early direction from the previous close mildly predicts the close</td>
<td>The documented effect is on the last half-hour, not a mid-morning continuation</td>
</tr>
</table>

### The 09:15-09:45 window and fades that finish inside it

His record shows fades completing inside the window. There are two honest readings. The window is a deliberate filter, Crabel's numbers say most opening action is rotation, and missing fast reversals is its known cost. Or the window is too wide for the failed-breakout family, because the reclaim Turtle Soup requires happens early. The record cannot yet separate them. What matters is the R still available from the first permitted entry. A fade finished by 09:40 has no R left at 09:45, so it was not a missed trade. A fade that reclaims at 09:40 and runs for hours was. With few rejected candidates, a handful of cases should not move the window.

The 15-minute ORB range closes at 09:30. If the no-entry window applies to it, the ORB cannot trigger for another 15 minutes, slower than any published ORB.

**For us:**
- Treat published ORB and failed-breakout results as ideas about structure, not numbers to expect: faster entries, US instruments, generous costs.
- Proposal for the weekly review: add a "completion clock bucket" to every rejected candidate (09:15-09:30, 09:30-09:45, 09:45-10:30, 10:30-13:00, 13:00-14:30, 14:30-15:30) and record the R available after the first permitted entry. Decide about the window only after a pre-stated N, and test any change forward.
- Proposal for the weekly review: state which rule wins when an ORB trigger lands inside the no-entry window.
- Log 5-minute and stretch-based ORB variants as paper observations beside the 15-minute one; it costs nothing.

## 3. Macro, liquidity and reflexivity

- **George Soros**, The Alchemy of Finance (1987). Reflexivity: participants' views shape the fundamentals they try to read (credit, collateral, currencies), which feeds back into their views. Booms self-reinforce until a turning point, and busts are faster. As a testable claim this is Weak; as a framework it is useful, and it fits Kindleberger's Manias, Panics, and Crashes (1978)† and Brunnermeier and Pedersen (2009, Review of Financial Studies)† on margin and funding spirals.
- **Stanley Druckenmiller**, in Schwager's The New Market Wizards (1992). He credits Soros with the lesson that what matters is how much you make when right and lose when wrong, not how often you are right (wording varies by source). He describes going big when conviction and payoff are high. His widely quoted macro view is that central-bank liquidity moves indexes more than earnings do†. His record of about 30% a year with no losing year over three decades is widely reported but unaudited. Anecdotal.
- **Ray Dalio**, Principles (2017)† and the debt-cycle template†. A shorter credit cycle sits inside a longer debt cycle; deleveraging can be deflationary or inflationary. A map, not a timing tool.
- **Rate surprises.** Bernanke and Kuttner (2005, Journal of Finance)†: unexpected easing lifts US stocks, unexpected tightening hurts. The surprise moves prices, not the level.
- **Foreign flows.** Froot, O'Connell, Seasholes (2001, Journal of Financial Economics)†: emerging-market flows persist and relate to returns. I could not verify India-specific evidence.

**For us:**
- Macro map from the briefing: RBI hiked to 5.50% on 7 Oct; FII selling, DII buying; Brent near 100-107; USD/INR near 95-97; US 10-year near 5.1-5.3%. NIFTY printed its 2026 low the session after the hike. By the surprise principle, record whether each event was in consensus before reading the reaction. One instance proves nothing; log it.
- Proposal for the weekly review: add prior-day FII net cash flow, DII net flow and USD/INR change as regime columns in the Ledger, and check whether trigger quality differs by FII flow sign.
- The AI-capex credit cycle as a reflexive loop: borrowing funds capex, capex lifts supplier revenue and equity prices, higher prices cheapen funding. It reverses when funding costs rise or credit spreads widen; the 12-16 Oct US selloff is the kind of state change to log. The INDmoney book is about 56% AI hardware and datacentre, and GOOG and INTC are exposed to the same cycle, so the AI-infrastructure credit beta hypothesis is also a portfolio risk. Ask which side is stressed, funding or demand.
- Pledged Indian collateral has its own loop: falling prices shrink margin, which can force selling, which pushes prices down (the Brunnermeier and Pedersen margin spiral). Concentration plus leverage plus correlation is the combination to treat with care. The mandate allows concentration; this page only notes the cost.

## 4. Risk, sizing and expectancy in R

### Definitions and measurement

**Van Tharp**, Trade Your Way to Financial Freedom (1999)† and The Definitive Guide to Position Sizing†. R is the initial risk on a trade (entry to stop, times size). A trade's R-multiple is its result divided by R. Expectancy is average R per trade: win rate times average win in R, minus loss rate times average loss in R. The System Quality Number is the square root of N times mean R divided by the standard deviation of R (some versions cap N at 100).

<table header-row="true">
<tr>
<td>Win rate</td>
<td>Average win</td>
<td>Average loss</td>
<td>Expectancy per trade</td>
</tr>
<tr>
<td>40%</td>
<td>2.0R</td>
<td>1R</td>
<td>+0.20R</td>
</tr>
<tr>
<td>35%</td>
<td>1.5R</td>
<td>1R</td>
<td>-0.13R</td>
</tr>
<tr>
<td>50%</td>
<td>1.2R</td>
<td>1R</td>
<td>+0.10R</td>
</tr>
</table>

Costs are fixed in rupees, so tight stops make them larger in R: net R is gross R minus costs divided by risk. A gross +0.20R with 0.10R of costs is +0.10R.

**How many trades.** The standard error of average R is about the standard deviation of R divided by the square root of N. With a standard deviation of 1.3R (illustrative), it is about 0.24R at 30 trades, 0.13R at 100 and 0.065R at 400. Telling +0.2R from zero at two standard errors takes about 170 trades; +0.1R about 680.

**Streaks.** Chance of at least one run of 10 straight losses (my calculation):

<table header-row="true">
<tr>
<td>Win rate</td>
<td>100 trades</td>
<td>200 trades</td>
<td>300 trades</td>
<td>500 trades</td>
</tr>
<tr>
<td>40%</td>
<td>21%</td>
<td>38%</td>
<td>52%</td>
<td>71%</td>
</tr>
<tr>
<td>50%</td>
<td>4%</td>
<td>9%</td>
<td>13%</td>
<td>22%</td>
</tr>
</table>

Equity lost after 10 straight losses when risking a fixed share of current equity: 0.5% a trade loses 4.9%; 1% loses 9.6%; 2% loses 18.3%; 5% loses 40.1%.

### Kelly and fractions

Kelly (1956, Bell System Technical Journal) found the bet size that maximises long-run growth. Thorp brought it to blackjack (Beat the Dealer, 1962) and markets. MacLean, Thorp and Ziemba (2010, Quantitative Finance 10(7)) discuss fractions: growth is traded for security as the fraction drops. In the standard continuous approximation (my arithmetic), betting k times Kelly yields k(2-k) of maximum growth: half Kelly keeps 75%, and double Kelly yields zero even with a positive edge. One secondary source gives the chance of ever falling to half of starting wealth as about 50% at full Kelly and about 12.5% at half Kelly. The real danger is that Kelly needs the true edge and variance, and we have noisy, usually flattering, estimates, so use a fraction computed from a conservative edge. Ralph Vince's optimal f (The Mathematics of Money Management, early 1990s) implies a drawdown equal to f if the worst historical loss repeats, per a secondary source, and commentators suggest using only a small share of it.

### Sizing against leveraged, pledged collateral

1. **Define ruin.** For him it is a margin shortfall or forced sale of pledged core holdings at bad prices, not a zero account. Taleb's point is that survival comes first because losses compound along a single path (Ole Peters's 2019 Nature Physics paper on ergodicity† argues this formally and remains debated). Size so a stress case leaves headroom; the Collateral and Stress Test page is the reference.
2. **Count risk by factor, not ticker.** About 57% of the pledged book is Vedanta group plus Indian Bank, and index, metal and PSU-bank longs are the same bet. Intraday risk on those factors adds to the collateral's own exposure. NIFTY shorts may partly offset a long book, but only as far as the book moves with NIFTY, a number to compute from data. A squeeze lifts collateral and hurts the shorts; a crash does the reverse.
3. **Margin value is not linear.** Pledged stock is credited at value less a haircut, and haircuts and prices can move against you together. Check the broker's current haircut list.
4. **Size from the stop.** Shares equal risk in rupees divided by stop distance. Never size from a target. Illustration only: if 1R is Rs 5,000, Rs 10,000 is 2R and Rs 50,000 is 10R, and a 10R day is rare, so reaching it by sizing means taking about ten times the risk.
5. **Cap the heat.** Limit combined open risk by factor, and set a daily loss limit in R.

**For us:**
- Proposal for the weekly review: define 1R in rupees for each label (Intraday, Tactical Swing) as a fixed fraction of "free risk capital", defined with the Collateral page and not as the Rs 25 lakh margin figure. Record planned R at freeze and realised R at close.
- Proposal for the weekly review: report open risk by factor each week (metals/Vedanta, PSU banks, NIFTY beta, AI hardware).
- Report every result in R, gross and net of a stated cost model, with N and a confidence interval. Until a family has real N, keep size at the smallest unit that still teaches something.

## 5. Psychology and decision quality

- **Mark Douglas**, Trading in the Zone (2000). Five truths: anything can happen; you do not need to know what happens next to make money; wins and losses are randomly distributed within an edge; an edge is just a higher probability; every moment is unique. Anecdotal.
- **Brett Steenbarger**, The Psychology of Trading (2003)†, Enhancing Trader Performance (2006)†, The Daily Trading Coach (2009, 101 lessons). Treat trading as deliberate practice: journal, review, build on strengths. With Lo and Repin (2005, American Economic Review 95(2)), a study of 80 day traders found stronger emotional reactions to gains and losses went with worse results. Moderate; small sample.
- **Daniel Kahneman**, Thinking, Fast and Slow (2011)†; with Tversky, prospect theory (1979, Econometrica)† on loss aversion; with Klein (2009, American Psychologist)† on intuition: trustworthy only in regular environments with fast, clear feedback, which intraday markets are not.
- **Overconfidence and activity.** Barber and Odean (2000, Journal of Finance 55(2)): 66,465 US households, 1991-1996; the most active earned 11.4% a year against 17.9% for the market and 16.4% for the average household. They blame overconfidence; a later SEC comment letter argues the link holds mainly after costs. Strong.
- **Hindsight.** Fischhoff (1975)† showed that once people know an outcome they overrate how predictable it was. That is what retrofitting does. PRE fields never rewritten are the defence.
- **Nassim Taleb**, Fooled by Randomness (2001), The Black Swan (2007), Antifragile (2012)†. Skill is confused with luck, rare large moves dominate, ruin outranks expected value. Fat tails are well documented (Mandelbrot 1963†); Taleb's own trading claims are Anecdotal.
- **Annie Duke**, Thinking in Bets (2018). "Resulting" means judging a decision by its outcome. Estimate odds beforehand; review the decision, not the result.
- **Philip Tetlock**, Expert Political Judgment (2005)† and Superforecasting (2015, with Dan Gardner)†. State probabilities, score them with the Brier score (mean squared gap between forecast probability and the 0/1 outcome; always saying 50% scores 0.25), update in small steps.
- **Daily income targets.** Camerer, Babcock, Loewenstein, Thaler (1997, Quarterly Journal of Economics 112(2)) found New York cab drivers set a loose daily income target and quit when they hit it. Contested: Farber's 2005 re-estimation did not reproduce the pattern, though later models (Crawford and Meng 2011†) keep a role for targets. Coval and Shumway (2005, Journal of Finance 60(1)) found Chicago Board of Trade proprietary traders strongly loss-averse, taking more afternoon risk to recover morning losses. Moderate.

**For us:**
- **No-trade weeks.** Whether a drought is unusual depends on how often a setup should fire. If a family triggers on one session in 10, the chance of zero triggers in 9 sessions is 39%; at one in 15 it is 54%; at one in 5 it is 13%. Proposal for the weekly review: record each family's historical trigger frequency when it is frozen, so a run of zeros can be judged against it. The danger is boredom turning a near-miss into a trigger, the SETUP-IN-0001 pattern. The mandate says no trade is valid, and Livermore's "sitting" makes the same point.
- **Resulting runs both ways.** Logging rejected candidates with what price did next is the right antidote, but one move is not proof the rule was wrong.
- **The rupee aspiration.** Both the cab-driver and Coval-Shumway results say targets bend behaviour: below the line invites more risk, above it invites stopping or carelessness. The aspiration is safe as an outcome, unsafe as an input. Proposal for the weekly review: pre-commit a daily loss limit in R and a maximum trade count per day, and test whether second trades on losing days do worse.
- **The AI runs too.** The scheduled reviews can write a tidy story after the fact. Proposal for the weekly review: add a probability field to each frozen setup (probability of trigger, of target before stop) and score it with the Brier score.

## 6. What the record of retail intraday traders says

<table header-row="true">
<tr>
<td>Study</td>
<td>Sample</td>
<td>Finding</td>
</tr>
<tr>
<td>SEBI, Jan 2023</td>
<td>Individual F&O traders, FY22</td>
<td>89% lost money (as reported later)</td>
</tr>
<tr>
<td>SEBI, July 2024</td>
<td>Individual intraday traders, cash segment, FY23; top 10 brokers</td>
<td>About 71% lost; 80% of those trading more than 500 times a year; 76% of under-30s; loss-makers paid costs equal to 57% of their losses, profit-makers 19% of profits</td>
</tr>
<tr>
<td>SEBI, Sept 2024</td>
<td>FY22-FY24, over one crore individual F&O traders</td>
<td>93% lost; aggregate losses over Rs 1.8 lakh crore; average about Rs 2 lakh; proprietary desks and FPIs made gross profits of about Rs 33,000 crore and Rs 28,000 crore in FY24, 96-97% algorithmic; over 75% of loss-makers kept trading</td>
</tr>
<tr>
<td>SEBI, July 2025</td>
<td>Individual F&O traders, FY25, 13 brokers</td>
<td>Over 91% lost; net loss Rs 1,05,603 crore after costs, up from Rs 74,812 crore; unique traders fell from 61.4 lakh (Q1) to 42.7 lakh (Q4). A later revision I could not confirm is cited elsewhere</td>
</tr>
<tr>
<td>SEBI, Aug 2026</td>
<td>Individual equity-derivatives traders, FY26</td>
<td>87.7% lost; net loss about Rs 91,685 crore, down about 18%; options about 92% of losses. Secondary reporting only, plus a SEBI post confirming the study exists</td>
</tr>
<tr>
<td>Barber, Lee, Liu, Odean 2014, Journal of Financial Markets</td>
<td>Taiwan day traders, 1992-2006</td>
<td>Fewer than 1% predictably profitable after fees</td>
</tr>
<tr>
<td>Chague, De-Losso, Giovannetti 2020, "Day Trading for a Living?"</td>
<td>Brazilian index futures, entrants 2013-2015</td>
<td>Of those persisting 300+ days, 97% lost; no evidence of learning</td>
</tr>
</table>

My reading:

1. **The base rate is strongly negative and stable.** Between about 88% and 93% of individual derivatives traders lost in each SEBI release, and participation fell by roughly a fifth without moving the loss rate. (The Sept 2024 figure is a three-year cumulative, so it is not like-for-like.)
2. **Where losses come from.** Costs (57% of losses against 19% of profits), activity (80% loss rate above 500 trades), options (92% of FY26 losses) and counterparties (algorithmic proprietary desks and FPIs took the profits). Persisting after losses is itself typical.
3. **What the studies do not show.** They average over everyone, including expiry-day option buyers, and do not test a low-frequency, pre-registered, small-size process. They set the prior: assume negative expectancy after costs until the Ledger says otherwise. If his NIFTY intraday ideas run through options, the FY26 split applies directly.
4. **His own evidence is nil so far.** Seven frozen setups, no valid triggers, no trades: a clean start, not a result.

**For us:**
- Treat every intraday family as guilty until the Ledger shows positive expectancy after a stated cost model. Winning days in a small sample prove little.
- Proposal for the weekly review: set a promotion bar before any result arrives, for example at least 100 closed trades (or 30 per regime) and a lower bound for expectancy above zero after costs.
- Keep Intraday small within the risk budget while the core plan (concentrated long-term positions, valuation-driven rotation) carries the compounding. The mandate already points this way; this adds the SEBI numbers.

## Rules of thumb worth testing

Hypotheses from the sources, not rules. Most can be tested forward as paper observations, so they cost no capital.

<table header-row="true">
<tr>
<td>Rule of thumb</td>
<td>Source</td>
<td>Forward test in the Ledger</td>
</tr>
<tr>
<td>Shorts only with the index below its 200-day average, longs only above</td>
<td>Paul Tudor Jones; Faber 2007†; Hurst et al 2017</td>
<td>Tag every setup and rejected candidate by index versus 200-day average. Compare expectancy in R by tag at 30 per tag</td>
</tr>
<tr>
<td>Single-stock swings only in Weinstein stage 2 (long) or stage 4 (short)</td>
<td>Weinstein 1988</td>
<td>Record the stage on each Tactical Swing candidate. Compare 20-day outcomes</td>
</tr>
<tr>
<td>Enter failed-breakout reversals after a reclaim, not at first touch</td>
<td>Raschke and Connors</td>
<td>Log paper entries at both points. Compare R, with slippage in R</td>
</tr>
<tr>
<td>The 09:15-09:45 window removes more noise than edge</td>
<td>Crabel's early-action numbers; his own rule</td>
<td>Log completion clock bucket and R available after 09:45 for each rejected candidate. Retest at a pre-set N</td>
</tr>
<tr>
<td>The 09:15-09:45 return from the previous close predicts the 15:00-15:30 return</td>
<td>Gao, Han, Li, Zhou 2018</td>
<td>Record both numbers every session. Check sign agreement and correlation over 60 or more sessions</td>
</tr>
<tr>
<td>ORB works better after a narrow-range day; a 5-minute ORB beats a 15-minute one</td>
<td>Crabel; Zarattini and Aziz 2023</td>
<td>Tag prior-day range rank. Log 5-minute, 15-minute and stretch ORBs side by side, net of costs, as paper trades</td>
</tr>
<tr>
<td>A follow-through day marks a durable low</td>
<td>O'Neil 1988</td>
<td>Count NIFTY follow-through days. Report the next 20 and 60 sessions and the failure rate</td>
</tr>
<tr>
<td>Rebounds after panic hurt short-biased trades most</td>
<td>Daniel and Moskowitz 2016</td>
<td>Tag setups within 10 sessions of a multi-week low. Compare R for shorts there versus other days</td>
</tr>
<tr>
<td>Prior-day FII flow shifts the odds on the next trigger</td>
<td>Soros and Druckenmiller on liquidity; Froot et al 2001†</td>
<td>Add FII net flow sign to the Ledger. Compare trigger-to-target rates by sign</td>
</tr>
<tr>
<td>A daily loss limit and trade-count cap reduce damage</td>
<td>Coval and Shumway 2005; Steenbarger</td>
<td>Compare R and size on trades after a same-day stop versus first trades</td>
</tr>
<tr>
<td>Halving size after a drawdown protects capital at little cost</td>
<td>Fractional Kelly; Vince; Tharp</td>
<td>Replay the Ledger's R series with and without the rule. Compare drawdown and final R</td>
</tr>
</table>

## Verification notes

- Checked against secondary web sources this session: the SEBI studies (via news and finance coverage; my tools could not reach SEBI's own documents), Barber and Odean 2000, Barber-Lee-Liu-Odean 2014, Chague et al, Camerer et al, Coval and Shumway, Lo-Repin-Steenbarger, Gao et al, Zarattini and Aziz, Jegadeesh and Titman, Moskowitz-Ooi-Pedersen, Daniel and Moskowitz, Hurst et al, the Indian momentum papers, Duke, Douglas, Crabel's abstracts, and the Livermore and Minervini facts.
- Not verified at source: exact book wording, Schwager's interview details, the Druckenmiller liquidity view and track record, Raschke's 80-20 and Holy Grail rules, Brooks's failure rates, the exact follow-through threshold, the Kelly drawdown figures. Items marked † are from memory. The web-search allowance ran out before I could check Tetlock, Fischhoff, Taleb and Kahneman.
- That fades complete inside the 09:15-09:45 window comes from the briefing; I did not re-read the Hypothesis Lab.
