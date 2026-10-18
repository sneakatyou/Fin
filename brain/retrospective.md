> Scope. Ten sessions, Mon 5 Oct to Fri 16 Oct 2026, written Sun 18 Oct. Shashank thought ChatGPT had also written logs into Notion. An earlier search found none outside this system. The only trace before 5 Oct is SETUP-IN-0001 (a Ledger row reconstructed from a handoff, undated) and two September artifacts, now Hypothesis Lab rows entered 18 Oct and untested (the RIL 15-minute opening-range paper trade of 21 Sep; the Intraday Desk go/no-go rules). The Pulse and Review Log starts on 6 Oct, so 5 Oct has no pulse or review, and the 8 Oct post-market run never happened (scored late on 9 Oct). Tue 20 Oct is an NSE holiday (Dussehra); the next session is Mon 19 Oct. Research for Shashank's own decisions, not advice. Nothing here changes a rule. Evidence rating for everything on this page: Anecdotal (one regime, ten sessions, correlated names).

## 1. The short version

1. Ten sessions, six frozen NIFTY setups in the window (SETUP-IN-0002 to 0007: one long, five shorts), plus the reconstructed 0001. Valid triggers: 0. Trades: 0. Realised R: 0. Nothing here is evidence of an edge, for or against.
2. The five shorts (12 to 16 Oct) met a market that fell on two days (12 and 14 Oct) and rose on three (13, 15, 16 Oct). The rules kept us out of the three wrong-way days and also out of the two right-way days.
3. On 12 and 16 Oct the gap fade finished before the first valid entry. On 12 Oct it kept going (a winner missed). On 16 Oct it reversed (a loser probably avoided). Two events, opposite results: the record cannot say the confirmation window is wrong.
4. Of 28 rejected candidates (15 NIFTY, 13 stocks), the NIFTY ones split: one probably paid (6 Oct long, +0.2R to +1.1R, unverified), one is unsettled (8 Oct short, 0R to +1.5R), ten never triggered or scratched, three needed option prices nobody found.
5. Ten of 12 marked swing rejects were down at the 16 Oct close, but that is one factor (AI hardware and credit) in one week. After week one the same filter looked neutral (mean +0.6%).
6. Eight NIFTY longs were rejected partly as the same bet as the collateral. Six would not have triggered anyway, one was a scratch at best, one (6 Oct) probably paid. The trigger did the work, not the collateral rule.
7. India decoupled upward: NIFTY rose 4.4% from the 8 Oct low (22,179.90) to the 16 Oct high (23,149.85), and 22,180-22,640 held on every test. The "nine-week downtrend" label outlived two up weeks (+0.44%, +2.78%) and produced five shorts in a row.
8. The big misses were not index trades: VST +10.77% on 6 Oct (a process gap, never frozen), Nifty IT +11.7% on the week, and the INDmoney book's -14.7% week in positions held with no written invalidation (AAOI, IREN, RKLB).
9. Data decides scores: three of seven Ledger scores are Approximate, there are no 15-minute candles, and put-spread premiums were never found.
10. Next: candles first (Upstox read-only analytics token), a GO/SKIP log for days with no setup, and any rule variant tested forward only in its own pre-frozen row. Anything found by looking back is a hypothesis, never a sample.

## 2. Scorecard

Sources: Trading Ledger, Hypothesis Lab as read on 18 Oct, and the 17 Oct weekly review. Theoretical R is the system's own scoring, from OHLC and news prints, not candles.

### Frozen setups (Trading Ledger)

<table fit-page-width="true" header-row="true">
	<tr>
		<td>Setup</td>
		<td>Day, side, family</td>
		<td>Intended R</td>
		<td>Armed or live</td>
		<td>Valid trigger / entered</td>
		<td>Theoretical R</td>
		<td>Data</td>
	</tr>
	<tr>
		<td>0001</td>
		<td>Before 5 Oct, undated. Long, Oversold index reversal: reclaim and hold of 22,500</td>
		<td>blank</td>
		<td>Trigger invalid: opened above the 22,500 reclaim level</td>
		<td>No / No</td>
		<td>blank</td>
		<td>Reconstructed</td>
	</tr>
	<tr>
		<td>0002</td>
		<td>Fri 9 Oct. Long, Oversold index reversal: flush to 22,240, then reclaim of 22,300</td>
		<td>1.1</td>
		<td>Not armed: no flush to 22,240 (low 22,294.75)</td>
		<td>No / No</td>
		<td>0</td>
		<td>Full</td>
	</tr>
	<tr>
		<td>0003</td>
		<td>Mon 12 Oct. Short, Failed-breakout reversal: gap into 22,580-22,600 resistance fails</td>
		<td>1.2</td>
		<td>Armed (open 22,593.20); under the 22,525 floor by about 09\:50</td>
		<td>No / No</td>
		<td>0 (range 0 to +1.7R)</td>
		<td>Approximate</td>
	</tr>
	<tr>
		<td>0004</td>
		<td>Tue 13 Oct. Short, Support-breakdown ("Other"): break of the 22,180-22,305 zone continues</td>
		<td>1.5</td>
		<td>Live (flat open); low 118 pts above trigger</td>
		<td>No / No</td>
		<td>0</td>
		<td>Full</td>
	</tr>
	<tr>
		<td>0005</td>
		<td>Wed 14 Oct. Short, Failed-breakout reversal: rally to the 20-DMA zone fails</td>
		<td>1.3</td>
		<td>Not armed (needed 22,840)</td>
		<td>No / No</td>
		<td>0</td>
		<td>Approximate</td>
	</tr>
	<tr>
		<td>0006</td>
		<td>Thu 15 Oct. Short, Support-breakdown ("Other"): global risk-off pushes through 22,540</td>
		<td>1.3</td>
		<td>Live; low 97 pts above trigger</td>
		<td>No / No</td>
		<td>0</td>
		<td>Full</td>
	</tr>
	<tr>
		<td>0007</td>
		<td>Fri 16 Oct. Short, Failed-breakout reversal: gap into 23,077-23,320 supply fails</td>
		<td>1.2</td>
		<td>Armed (open 23,065.10); fade finished before 09\:45</td>
		<td>No (most likely) / No</td>
		<td>0 (range 0 to -1R)</td>
		<td>Approximate</td>
	</tr>
</table>

Totals: 7 frozen (6 in the window); 2 explicitly armed (0003, 0007); 2 live but untouched (0004, 0006); 2 never armed (0002, 0005); 0 valid triggers; 0 entered. By family: Oversold index reversal 2, Failed-breakout reversal 3, Support-breakdown 2. Win rate, payoff and expectancy are undefined. Realised P&L is nil; planned maximum risk was Rs 8,000 to 10,000 per setup on one lot (65 units).

### Rejected candidates (Hypothesis Lab, 28 rows)

<table fit-page-width="true" header-row="true">
	<tr>
		<td>Group</td>
		<td>n</td>
		<td>Probably made money</td>
		<td>Lost</td>
		<td>Never triggered, or scratch</td>
		<td>Unsettled or unpriced</td>
	</tr>
	<tr>
		<td>NIFTY intraday and hedges</td>
		<td>15</td>
		<td>1 (6 Oct long)</td>
		<td>2 (put-spread hedges of 9 and 15 Oct, size unknown)</td>
		<td>10 (nine at 0R; 16 Oct gap-and-go 0R to +0.2R)</td>
		<td>2 (8 Oct short; 6 Oct put spread)</td>
	</tr>
	<tr>
		<td>Stock swings, marked 16 Oct</td>
		<td>13</td>
		<td>2 (VST +4.9% and still open; VEDL 6 Oct +0.5%)</td>
		<td>10 (-2.0% to -28.6%)</td>
		<td>1 (Indian Bank, not triggered on day one)</td>
		<td>0</td>
	</tr>
	<tr>
		<td>All</td>
		<td>28</td>
		<td>3</td>
		<td>12</td>
		<td>11</td>
		<td>2</td>
	</tr>
</table>

- Theoretical R where recorded: 6 Oct long +0.2R to +1.1R; 8 Oct short 0R to +1.5R (the morning note's +1.7R was too generous); MU add of 12 Oct about -1.5R against 1R planned (a close-based stop gaps through); 16 Oct gap-and-go 0R to +0.2R; all else 0R. Most swing rows had no priced stop, so they are percentages.
- Sample size: far too small to judge any edge. Zero triggers in six frozen setups is consistent with a true trigger rate of up to about 39% (exact one-sided 95% bound). The 28 rejects are not 28 samples: they sit in ten days and two common factors (NIFTY direction; AI and credit).
- A win rate from 30 trades carries a 95% interval of about plus or minus 18 points; from 100 trades, about plus or minus 10. At a 20% trigger rate, 30 valid trades take about 150 sessions (seven months).

## 3. Day-by-day table

Column 5 is hindsight by construction. Times are IST. "Pts" moves are my arithmetic from recorded opens and closes, not a trade result. US lines are that date's US session.

<table fit-page-width="true" header-row="true">
	<tr>
		<td>Date</td>
		<td>Market in one line</td>
		<td>Frozen setup and verdict</td>
		<td>Rejected candidates and what they did</td>
		<td>What actually worked</td>
		<td>Why the system missed or avoided it</td>
		<td>Lesson</td>
	</tr>
	<tr>
		<td>Mon 5 Oct</td>
		<td>O not found, H 22,620.30, L 22,397.85, C 22,555.75 (+0.60%). First up day after eight weekly losses. FII -4,699 cr, DII +5,182 cr.</td>
		<td>None. No pulse or review exists.</td>
		<td>None logged.</td>
		<td>PSU Bank +0.97%, Bank +0.48%, Metal +0.30%, Pharma -0.74%. US: VST +3.48% to 144.89, AAOI +5.17%.</td>
		<td>Outside the record.</td>
		<td>Sets references only (VST 144.89).</td>
	</tr>
	<tr>
		<td>Tue 6 Oct</td>
		<td>O 22,603.25, H and L not found (early low 22,561.60), C 22,776.10 (+0.98%). Broad (Midcap +1.08%, Smallcap +1.56%). Expiry; RBI next day.</td>
		<td>None frozen.</td>
		<td>Reclaim long: probably triggered, +0.2R to +1.1R, unverified. Failed-breakout short: most likely no trigger. RBI put spread: unscorable. VEDL dividend long: +0.5% final. VST swing: +10.8% in a session, +4.9% at 16 Oct.</td>
		<td>Index up; pharma, chemicals, private banks, oil and gas led, IT weakest. VEDL +4.06%. US: VST +10.77%, CEG +12.3%, LEU +8.80%, OKLO +7.17%, MRVL +5.81%.</td>
		<td>Long rejected as the collateral bet with about 1R of room; prior-day high missing at freeze. VST rejected as chasing; plan never frozen.</td>
		<td>Find the prior-day high before freezing. A pullback zone with no frozen plan is not a plan.</td>
	</tr>
	<tr>
		<td>Wed 7 Oct</td>
		<td>O 22,690.45, H 22,717.65, L 22,546.30, C 22,603.05 (-0.76%). RBI hiked 25 bp to 5.50%, stance calibrated tightening. 9 of 50 up.</td>
		<td>None frozen.</td>
		<td>Post-RBI long: no trigger, 0R. Post-RBI failed-spike short: no spike, 0R. MRVL long: stopped -7.4% on 12 Oct. LEU long: -25.3% by 16 Oct.</td>
		<td>Straight fade from the open (-87 pts). Metal -2.31%, Auto -1.44%, IT -1.31%; PSU Bank +0.92%; INDIANB +1.88%. US: VST +3.88%, MU +4.06%.</td>
		<td>Both index ideas needed a move past 22,810; the high was 92 pts short.</td>
		<td>Right direction, wrong pattern: not evidence for the family. Index puts hedge a Vedanta-heavy book badly.</td>
	</tr>
	<tr>
		<td>Thu 8 Oct</td>
		<td>O 22,599.05 (also the high), L 22,179.90 (2026 low), C 22,231.80 (-1.64%). 47 of 50 down, 3,280 declines v 951 advances, VIX 15.33 (+10.37%), FII -12,944 cr.</td>
		<td>None. Breakdown short frozen for scoring only.</td>
		<td>Breakdown short: probably triggered, entry zone missed by about 13 pts, 0R to +1.5R. Bounce long: no reclaim, 0R. VEDL dividend long: -3.2% that day. LEU long: stopped -8.0%.</td>
		<td>Shorts only. Metal -3.55%, Midcap -2.53%. VEDL -3.18% and INDIANB -2.47%, both on their lows; Adani stocks -4% to -8%. US: AAOI -13.58%, MU -4.79%.</td>
		<td>Short rejected: zero samples, not a Playbook family, DIIs defended 22,550. No post-market run.</td>
		<td>The one clean capitulation day. Entry zones narrower than the gap between prints cannot be scored.</td>
	</tr>
	<tr>
		<td>Fri 9 Oct</td>
		<td>O 22,314.95, H 22,580.75, L 22,294.75, C 22,520.45 (+1.30%). 46 of 50 up, IT led, VIX 14.37. Stalled under the hourly 50 EMA near 22,600.</td>
		<td>0002 long. Did not pass: no flush to 22,240. 0R, Full.</td>
		<td>Put spread or breakdown short: futures leg 0R, spread lost value. MRVL, AAOI, LEU adds: +0.2%, +3.5%, +0.2% on day one; later -10.7%, -28.6%, -19.1%.</td>
		<td>Long from the open (+205 pts). IT; PSU banks (INDIANB, Canara, SBI). INDIANB +2.7%, VEDL +4.3%. US: VST +3.4%.</td>
		<td>The gap rule excludes gap-up days by design; 22,460 traded by about 10\:30.</td>
		<td>Second instance of the gap rule: one saved a false trigger, one cost a winning day.</td>
	</tr>
	<tr>
		<td>Mon 12 Oct</td>
		<td>O 22,593.20, H 22,651.10, L not found (22,304.45 per DSIJ), C 22,363.35 (-0.70%). Gap into 22,580-22,650 sold. FMCG, PSU Bank, IT weakest.</td>
		<td>0003 short. Armed, did not pass: under 22,525 by about 09\:50, before the 10\:15 earliest entry. 0R, Approximate.</td>
		<td>Gap-and-go long: no trigger. MU add: later stopped at 953.19, about -1.5R.</td>
		<td>Short from the open (+230 pts). Rupee +98 paise to 95.75; Dr Reddy's and Bajaj Auto up. US: META +3.38%; MU -3.88%, AAOI -8.17%.</td>
		<td>Thesis right; the fade finished before the confirmation rule allowed an entry.</td>
		<td>Second time (7 and 12 Oct) direction was right and timing excluded us. Faster confirmation needs its own pre-frozen row.</td>
	</tr>
	<tr>
		<td>Tue 13 Oct</td>
		<td>O 22,364.15, H and C 22,721.95, L 22,288.45 (+1.60%). FM on LTCG/STT, IMF FY27 growth 7%, HCLTech. Short covering; Nifty IT over 5%.</td>
		<td>0004 short. Did not pass: low 118 pts above the 22,170 trigger. 0R, Full.</td>
		<td>Flush-reclaim long: never armed. Small-gap fade: never armed. MU add: stopped -7.6% on 14 Oct.</td>
		<td>Long from the open (+358 pts), sharpest in the last hour. IT; Midcap +1.06%. US: MU -3.61% to 953.19 on CXMT.</td>
		<td>The short needed a break that never came; the long needed a flush that never came.</td>
		<td>Support held a fourth session. Waiting for closes kept us out of a short that would have closed about 550 pts offside.</td>
	</tr>
	<tr>
		<td>Wed 14 Oct</td>
		<td>O 22,715.75, H 22,757.95 (DSIJ, quoted 15 Oct), L 22,558.95, C 22,622.70 (-0.44%). Fade from a flat open. US CPI after the close.</td>
		<td>0005 short. Did not pass: never armed (needed 22,840). 0R, Approximate as recorded.</td>
		<td>Continuation long: no trigger. MU add near 950: closed below 900 on 16 Oct, -7.8%.</td>
		<td>Slow short from the open (+93 pts). IDBI +9% to 90.40 on CCEA approval of the Rs 81 sale. US: Nasdaq -1.88% on hot CPI; CoreWeave -15.46% (Gartner, bond yields).</td>
		<td>Arm level was 118 pts above the prior close on a flat-Gift day.</td>
		<td>A failed-breakout short needs a breakout attempt. Third right bearish read (7, 12, 14 Oct) with no entry.</td>
	</tr>
	<tr>
		<td>Thu 15 Oct</td>
		<td>O 22,671.30, H 23,056.40, L 22,637.40, C 22,997.35 (+1.66%), best since 12 Jun. Kospi -7.77%. Breadth 1,343 up, 2,218 down.</td>
		<td>0006 short. Did not pass: low 97 pts above the 22,540 trigger. 0R, Full.</td>
		<td>Flush-reclaim long: never armed. Put-spread hedge: day-one exit at a loss. Two 13 Oct rejects scored 0R.</td>
		<td>Long from the open (+326 pts). ICICI Bank, Reliance, HDFC Bank, TCS, HCLTech; Bharti Airtel +4%. PSU banks weakest; YES Bank -20%. US: RKLB -6.64%.</td>
		<td>The global risk-off premise did not transmit; decoupling was the named risk.</td>
		<td>Fourth short with no entry. The 22,180-22,640 zone gave three sharp up days (9, 13, 15 Oct).</td>
	</tr>
	<tr>
		<td>Fri 16 Oct</td>
		<td>O 23,065.10, H 23,149.85, L 22,913.80 (one source 22,942), C 23,146.15 (+0.65%). Fade inside the opening range, then Nifty IT +4%.</td>
		<td>0007 short. Armed, most likely did not pass: second close probably back above 23,040. 0R most likely, -1R worst, Approximate.</td>
		<td>Gap-and-go long: invalid on a strict reading, else 0R to +0.2R. Indian Bank add: close 853 below the 856.10 entry level.</td>
		<td>Nifty IT +4% (TechM, Wipro); Federal Bank +2.9%; INDIANB +2.46% at 10\:14 after a clean Q2. Financials -1.66% at 09\:40, then recovered.</td>
		<td>Gap failed before 09\:45, then reversed. Target 22,890 never traded.</td>
		<td>Same early fade as 12 Oct, opposite result. The window decided both days.</td>
	</tr>
</table>

Tue 20 Oct: NSE holiday (Dussehra). Mon 19 Oct is the next session.

## 4. Day by day: the reasoning

**Mon 5 Oct.** The system was being rebuilt (Playbook, collateral restated to Rs 25 lakh), so nothing was frozen or rejected. The record holds only index and flow figures quoted later. What could have worked cannot be judged from it.

**Tue 6 Oct.** The pulse saw a flat open into 22,600 resistance on expiry day, a day before a likely RBI hike. The reclaim long (a dip below 22,600, then two closes above) probably triggered between 09\:45 and 10\:15; the short (a spike above 22,650, then a close back below 22,600) most likely never formed. The 22,620.30 prior-day high sat at the level and was missing at freeze. VST was rejected after a +3.48% day, above its late-September entry zone (134-140); the framework had never been frozen with a size, which the Lab calls a process gap, not a filter result. A web search (Capital Market report on the JM Financial site, not opened) also gave India VIX 13.59 (-8.03%) and the October future at 22,799.10, 23 pts over cash.

**Wed 7 Oct.** Both post-RBI ideas needed a move beyond 22,810; the day high was 22,717.65, so the range alone settled them. The bearish read was right (a straight fade) but the frozen pattern needed a spike first. The collateral took the hit: VEDL low 258.80, VAML low 394, while PSU Banks rose. An index put spread would have hedged that book badly.

**Thu 8 Oct.** The hardest down day (lowest close since April 2025) is the day with no post-market run and no frozen trade. The breakdown short most likely met its two closes by 10\:15, but its entry zone (22,480-22,540) sat 13 pts above the only prints (22,466-22,467). Hence 0R to +1.5R. What could have worked: that short, and nothing long. Widening the zone now would be fitting to the answer.

**Fri 9 Oct.** SETUP-IN-0002 was built for the first washed-out day (RSI 27.55, 47 of 50 down, FII Rs 12,944 cr). The index gapped up 83 pts and never flushed to 22,240, though its own 22,460 target traded by about 10\:30. The put-spread rejection was right (index +289 pts, VIX about -6%). The MRVL, AAOI and LEU adds looked fine on day one and were -10.7%, -28.6% and -19.1% a week later: day-one marks mean little.

**Mon 12 Oct.** SETUP-IN-0003 had the thesis right and the timing wrong. The gap into 22,580-22,650 was sold and the index closed 230 pts under the open, but spot was under the 22,525 no-chase floor at about 09\:50 and the first valid entry was 10\:15. The verdict rests on one 09\:50 quote. If it is wrong the range is 0R to +1.7R. MU's rejected add was later stopped at 953.19 (-1.5R against 1R planned) because a close-based stop does not stop a gap.

**Tue 13 Oct.** SETUP-IN-0004 waited for closes below 22,170 after four sessions defending 22,180-22,305; the low was 118 pts away. The day then closed at the high on three unforeseen items (the FM's LTCG/STT remarks, the IMF upgrade, HCLTech). The long side also failed to arm (no flush to 22,240). Waiting for the close, not anticipating the break, is exactly what the rule is for.

**Wed 14 Oct.** SETUP-IN-0005 needed a rally to 22,840 and then a failure. The index faded from a flat open instead. A later pulse quotes the day high as 22,757.95 (DSIJ), which settles both 0005 and the rejected long on OHLC alone, though the Ledger still says Approximate. MU's add was rejected a third day as "buying at the line that would have stopped it".

**Thu 15 Oct.** Kospi -7.77% and Nikkei about -4% looked like a short setup; India rose 1.66% on IT results, heavyweight banks and relative-appeal flows. SETUP-IN-0006 was conditional on decoupling failing, which is why it never triggered. The rally was narrow and PSU banks lagged, so the pledged book did not obviously share. The put-spread hedge would have exited at a loss on day one.

**Fri 16 Oct.** SETUP-IN-0007 armed on an open about 20 pts under Gift Nifty. The gap failed to 22,913.80 inside the opening range, then IT turned the day. The 09\:45-10\:00 candle probably closed below 23,040 (23,012.75 at 09\:58), the next probably above it, so the two-close sequence most likely did not complete. Indian Bank's add did not trigger on day one: its entry needs a close above the 15 Oct high of 856.10 (weekly review) and it closed at 853 (one source).

## 5. Patterns across the two weeks

### What the rules did right

- Kept out of wrong-way index trades: shorts on 13, 15, 16 Oct (the index rose 358, 326 and 81 pts open to close); longs on 7, 8, 12, 14 Oct (it fell 87, 367, 230 and 93 pts).
- No leveraged long added in the week to 9 Oct, when Nifty Metal fell 3.69% and the collateral took the hit on 7 and 8 Oct.
- Refused adds that fell 7% to 29%: MU three times, MRVL twice, LEU three times, AAOI.
- Put-spread hedges of 9 and 15 Oct lost value.

### What they cost

- 12 Oct short (+230 pts open to close; 0R to +1.7R if the 09\:50 quote is wrong).
- 8 Oct short (0R to +1.5R), 6 Oct reclaim long (+0.2R to +1.1R), 9 Oct gap-and-go (+205 pts).
- The 13 and 15 Oct rallies, which came without a flush.
- VST on 6 Oct, and IT (Nifty IT +11.7% on the week).
- Illustration only: an always-short-the-open on the five short days would have lost 442 pts net (+230 and +93 on 12 and 14 Oct; -358, -326, -81 on the others), about Rs 28,700 on one lot of 65. It is not a result for any frozen setup.

### The examples, tested against the record

- **Confirmation windows on the wrong side.** Partly. Of the five frozen-short days, two (12 and 16 Oct) were timing cases, with opposite consequences. On 14 Oct (and the rejected 7 Oct short) there was no breakout to fail, and on 13 and 15 Oct no fade at all. The Lab's line that the window decides the outcome "more than the thesis does" describes two days.
- **A run of shorts while support held.** Supported. Of 21 NIFTY ideas in the window, 12 were bearish and 9 bullish, but of the 6 frozen as trades 5 were short, all after 9 Oct. The weekly review flagged the bias itself.
- **Longs rejected as the collateral bet.** Supported as description, rarely decisive: six of eight would not have triggered anyway. It did bind on 6 Oct. On 7 and 8 Oct it protected a book that was losing on metals.
- **AI-hardware and credit selloff.** Supported. INDmoney fell from USD 16,083 to 13,715 (-14.7%): AAOI -31.1%, RKLB -25.5%, IREN -23.3%, LPTH -21.3%, MRVL -17.2%, MU -14.6%. Hot CPI (3.7%), CoreWeave 2032 bonds at 14.5%, Gartner and Broadcom warnings, CXMT. The pulses flagged AAOI (9, 13, 14 Oct) and IREN (8, 12, 15 Oct) as having no thesis or invalidation; by 17 Oct neither had one. The filters stopped adds, not losses in holdings.
- **Names that ran without us.** VST (+10.77% on 6 Oct, +15.3% for the week to 9 Oct), CEG, Federal Bank, IDBI (+9% on 14 Oct, -7% on 15 Oct), Nifty IT. The VST miss was a process gap.
- **Correct rejections.** The MU adds (all stopped, -7.4% to -7.8%), MRVL, AAOI and LEU adds. But these are one factor, and the 10 Oct weekly review read the same filters as neutral.

The frozen entries need price in the entry zone at a second close no earlier than 10\:15, so they can only trade a day that still offers that late. Five of nine measurable days moved 200 pts or more from the open (8, 9, 12, 13, 15 Oct); none produced an entry. That describes the rules; it is not a verdict on them.

## 6. Holdings and thesis retrospective

<table fit-page-width="true" header-row="true">
	<tr>
		<td>Item</td>
		<td>Proposal or thesis</td>
		<td>What 5-16 Oct showed</td>
		<td>Read</td>
	</tr>
	<tr>
		<td>INDIANB (23.5% of Upstox book)</td>
		<td>Core (10 Oct)</td>
		<td>Q2: PAT Rs 3,462 cr (+15%), NII +17.8%, GNPA 1.61% from 2.60%, NIM 3.42%. 829.80 to 853 (9-16 Oct, one source). No falsifier hit.</td>
		<td>Supported. Size is a separate decision.</td>
	</tr>
	<tr>
		<td>Vedanta group (32.6%)</td>
		<td>Core as one position (10 Oct)</td>
		<td>Metal -2.31% on 7 Oct, -3.55% on 8 Oct. VEDL ex Rs 5 on 14 Oct, 246.40 on 16 Oct. VAML 371.50, 15 Oct low 356.00. No Q2 date.</td>
		<td>Untested; concentration risk showed as feared.</td>
	</tr>
	<tr>
		<td>ETERNAL, ICICIGI</td>
		<td>Valuation rotation (10 and 17 Oct)</td>
		<td>ETERNAL 323.45 to 325.30; Q2 on 21 Oct. ICICIGI Q2: GDPI +3% v industry +7%, combined ratio 107%; 1,690.20 to 1,680.10.</td>
		<td>ICICIGI supported by results written after the proposal. ETERNAL untested.</td>
	</tr>
	<tr>
		<td>GOOG, META, ADANIPOWER</td>
		<td>Core (10 and 17 Oct)</td>
		<td>GOOG -3.2%. META -1.3% (+6% on 12-13 Oct; Goldman cut to 762 on opex; results 21 Oct). ADANIPOWER 189.00 to 195.85; results 23 Oct.</td>
		<td>Neutral; tests are the October results.</td>
	</tr>
	<tr>
		<td>MU</td>
		<td>Core, hold only (17 Oct)</td>
		<td>1,029.00 to 878.84 (-14.6%), 7.5% below the 950.59 cost. CXMT scare; HSBC and Daiwa call it overdone.</td>
		<td>Price weakened; the supply falsifier is not confirmed in pricing.</td>
	</tr>
	<tr>
		<td>INTC, SPACEX</td>
		<td>Valuation rotation (10 and 17 Oct)</td>
		<td>INTC 104.70 to 89.85 (-14.2%; Terafab-TSMC talks, Kiryat Gat explosion). SPACEX -10.2%, still 21% above cost; lock-up about 25 Oct.</td>
		<td>Price moved the way the proposals feared. A falling price is not proof; INTC Q3 on 29 Oct is the test.</td>
	</tr>
	<tr>
		<td>IREN, AAOI, RKLB</td>
		<td>Unclassified, no invalidation</td>
		<td>IREN -23.3% (SemiAnalysis, Gartner, Morningstar cut to 37). AAOI -31.1% (CFO sale 12 Oct). RKLB -25.5% (Neutron to 2027).</td>
		<td>Weakened. RKLB's 2026 catalyst is gone.</td>
	</tr>
	<tr>
		<td>Nuclear and power watchlist</td>
		<td>Mandate: VST best risk-adjusted; LEU best asymmetric; BE do not chase</td>
		<td>Week: VST -5.9% (152.02); LEU -19.3%, OKLO -19.4%, SMR -19.0%, BE -21.1%. LEU is 25.3% below its 6 Oct close.</td>
		<td>VST ranking and BE caution supported. LEU weakened as a trade (Sept raise, warrants).</td>
	</tr>
	<tr>
		<td>HDFC Bank, IDBI, IREDA, JIOFIN</td>
		<td>Hypotheses and flagged names</td>
		<td>HDFC 707.25 to 726.45; Q2 (17 Oct) not in the records. IDBI sale at Rs 81 approved, stock 90.40 then below 84. JIOFIN Q2 PAT -51%.</td>
		<td>Open.</td>
	</tr>
</table>

Families (all sample size 0):

- Oversold index reversal (Testing): three bounces (9, 13, 15 Oct) without the flush. The 17 Oct review declined to loosen it after the fact; that reasoning stands.
- Failed-breakout reversal and Support-breakdown continuation (both Testing since 17 Oct, procedural only): 5 setups, 0 entries; support held on every test.
- Gap above a reclaim level is not a reclaim (Testing): two instances, one each way.
- Sector-wave momentum: the wave continued in leaders with contracts (VST, CEG), not sympathy names. The 12-16 Oct week agreed.
- Earnings/revision, Valuation dislocation, Event-driven: no valid test case. No probability tree was written before any event.

## 7. What we can do later

Proposal for the weekly review: use Upstox's read-only analytics token (Shashank's suggestion) to give the scheduled runs 5-minute and 15-minute NIFTY spot and October-futures candles, and put-option premiums if available. Not verified here: history depth, rate limits, terms. A token that can place orders must not be used. First use: re-score 0003, 0005, 0007 and the Approximate rejects (6, 8, 14 Oct). Scoring facts is an audit; PRE fields stay untouched.

Proposal for the weekly review: with candles, backfill 5-16 Oct as a descriptive table only (time of day high and low, whether each fell inside 09\:15-09\:45, first close beyond the opening range, close location). Write the questions down before pulling the data. Ten days support description, not inference.

Proposal for the weekly review: if a faster confirmation (for example one 15-minute close back through the level) is tested, write it as its own Hypothesis row before an open, with its stop, target and a stop-testing rule, and run it beside the original, never in place of it. State beforehand that it would have entered on 16 Oct as well as 12 Oct, and probably lost on 16 Oct (candles needed to check).

Proposal for the weekly review: score skipped days. Log a GO/SKIP verdict before every open (the Intraday Desk row already proposes this), then fill fixed fields after the close: open-to-close, range, close location, move after 09\:45. Compare against two baselines declared once: flat, and a mechanical 09\:45 entry with a stop of 100-130 pts. On 5-16 Oct the open-to-close moves ran 0.7 to 3.3 times a 110-pt stop, so this gives nine scored days instead of zero. Label days "avoided loss", "missed gain" or "neutral" by thresholds fixed in R beforehand.

Proposal for the weekly review: freeze the mirror image of every index setup as a scored-only row, even when it is the collateral bet, and define the regime label by a dated rule so it cannot outlive two up weeks.

Proposal for the weekly review: log Gift Nifty, the spot close and the actual open every day, and record each arm level as a distance from the prior close. In the pulses the open came in below the Gift reading on 7 of 9 days (by about 17 to 59 pts), above on 15 Oct (by about 64 to 72) and level on 8 Oct. Gift Nifty is a futures price, so part of this is basis (the October future was 23 pts over cash at the 6 Oct close, per the search result). Record only; nine days say nothing about bias.

Proposal for the weekly review: score swing rejects against a pre-declared factor benchmark (for example an AI-hardware basket), count correlated names as one observation, fix a gap-aware stop convention, and record the free USD balance, unknown in every US rejection.

Proposal for the weekly review: no new add idea is considered until each held position above 5% of its book has a written invalidation or an explicit "no invalidation, sized as a loss I can take" label. The week's real damage sat in holdings without one.

Proposal for the weekly review: keep a hindsight register. Every idea born from looking at 5-16 Oct (faster confirmation, a no-flush long, the Gift offset, a changed arm distance) is entered once with its date, the data it came from, and a forward test: start date, minimum armed days, one success metric, stop rule. Data from 5-16 Oct may suggest a hypothesis; it never counts toward its sample. Pre-declare the sample needed before any stage change beyond procedural. Cap concurrent variants: five independent tests at a 5% false-alarm level give a 23% chance that one looks good by luck, ten give 40%.

## 8. Where the records disagree or are approximate

- Rejected rows: the 17 Oct weekly review says 31 (16 NIFTY); the Lab holds 28 (15 NIFTY, 13 stock), matching the daily pulse headlines. Its own NIFTY breakdown sums to 17. I use the Lab.
- 14 Oct high: "not found" in the Ledger and review; the 15 Oct pulse cites 22,757.95. The Ledger puts the unseen-spike case at +0.7R to +1.3R, the review at +0.7R to +1.5R.
- Flows 12-16 Oct: the weekly says FII about -8,989 cr and DII +7,812 cr; the four daily figures recorded for 12-15 Oct sum to -10,156 cr and +11,474 cr, and 16 Oct was not found.
- Regime label: "nine-week downtrend" in pulses of 9-16 Oct, while the 10 Oct weekly says the week ended an eight-week losing run.
- 16 Oct low: 22,913.80 (Newsdrum) versus 22,942 (Free Press, PTI). Indian Bank's 15 Oct high is "not found" in the Lab row and 856.10 in the weekly.
- Still missing: 5 Oct open, 6 Oct high and low. A web search found neither, and the search budget ran out.
- Swing marks beyond the interim notes in the Lab rows exist only in the 17 Oct weekly text.

## Sources

Records read in full: [Trading Ledger](https://app.notion.com/p/9ded500c55f6484f94f28665fa59f039?v=a54f077f0ac5444685d967dd341c0c3f), [Hypothesis Lab](https://app.notion.com/p/2320731d5d6f4d92ae6c87f75430b96c?v=9a9804d2f51a4d038329db9a4d841761), [Pulse and Review Log](https://app.notion.com/p/a2e877372ad0460a887cfe9de226eaea?v=765ff8501e82456a8bd9189ba7fb9c1c) (pulses 6-9 and 12-16 Oct; post-market reviews 6, 7, 9, 12-16 Oct; weekly reviews 10 and 17 Oct), [Portfolio Book](https://app.notion.com/p/97562cfcba2f4dfe92067252a79b98db?v=a92ff4a6b36d4d79854dc1adde201a03), [Agent Mandate](https://app.notion.com/p/3f0161afda3881158f32c9ae967fbb1b), [Strategy Playbook](https://app.notion.com/p/3f0161afda3881d68e2dd1383ecfb0f5). Web: a Capital Market report on jmfinancialservices.in, seen only as a search summary (6 Oct VIX and October future); the page was not opened.
