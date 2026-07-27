# Own measurement — TOON at AXI payload sizes (July 2026)

Run to close open question 1 ("does TOON still win at N=3–15 rows?"), which no published benchmark covers.

## Method

- Tokenizer: `gpt-tokenizer` @ `o200k_base` / gpt-4o — same encoding family TOON's official suite uses.
  **Not** a Claude tokenizer; absolute counts are tokenizer-specific, relative ordering is what transfers.
- TOON encoder: `@toon-format/toon` (official). YAML: `yaml`. TOML: `smol-toml`.
- Payload: a realistic `tasks list` shape — `{number, title, state, assignee}` — at N = 3, 5, 10, 15,
  30, 100, 1000. Plus a wide variant (8 fields, long values) at N = 15.
- Also measured the three non-collection AXI shapes: detail view (7 fields incl. one long prose body),
  structured error, definitive empty state.
- Scripts: `scratchpad/toon-bench/bench.mjs`, `bench2.mjs`.
- **Tokens only. No accuracy measured.** Accuracy claims stay sourced from the published benchmarks.

## Result 1 — TOON's advantage does not collapse at small N

Tokens, narrow 4-field rows:

| format | N=3 | N=5 | N=10 | N=15 | N=30 | N=100 | N=1000 |
|---|---|---|---|---|---|---|---|
| **TOON** | **46** | **71** | **135** | **198** | **384** | **1256** | **12463** |
| JSON compact | 62 | 102 | 206 | 307 | 609 | 2022 | 20173 |
| JSON pretty | 114 | 186 | 370 | 551 | 1093 | 3626 | 36177 |
| YAML | 77 | 129 | 263 | 394 | 786 | 2619 | 26170 |
| TOML | 78 | 132 | 271 | 407 | 814 | 2717 | 27168 |
| MD table | 55 | 81 | 150 | 216 | 413 | 1336 | 13187 |
| MD light (`- #1 … — open (alice)`) | 33 | 57 | 121 | 182 | 364 | 1217 | 12168 |
| MD KV | 71 | 121 | 250 | 376 | 753 | 2516 | 25168 |
| CSV | 35 | 56 | 110 | 163 | 319 | 1051 | 10457 |
| Plain prose | 63 | 107 | 221 | 332 | 664 | 2217 | 22168 |

TOON vs baseline (negative = TOON cheaper):

| vs | N=3 | N=5 | N=15 | N=100 | N=1000 |
|---|---|---|---|---|---|
| JSON compact | −25.8% | −30.4% | −35.5% | −37.9% | −38.2% |
| JSON pretty | −59.6% | −61.8% | −64.1% | −65.4% | −65.5% |
| YAML | −40.3% | −45.0% | −49.7% | −52.0% | −52.4% |
| TOML | −41.0% | −46.2% | −51.4% | −53.8% | −54.1% |
| MD KV | −35.2% | −41.3% | −47.3% | −50.1% | −50.5% |
| Plain prose | −27.0% | −33.6% | −40.4% | −43.3% | −43.8% |
| MD table | −16.4% | −12.3% | −8.3% | −6.0% | −5.5% |
| **MD light** | **+39.4%** | **+24.6%** | **+8.8%** | **+3.2%** | **+2.4%** |
| **CSV** | **+31.4%** | **+26.8%** | **+21.5%** | **+19.5%** | **+19.2%** |

**Open question 1 answered: no collapse.** The advantage shrinks smoothly with N and is still −25.8%
vs compact JSON at N=3. TOON's header is a fixed 12 tokens — 26.1% of total output at N=3, 6.1% at
N=15, 1.0% at N=100 — but never enough to flip the comparison against any JSON/YAML/TOML variant.

## Result 2 — lightly formatted Markdown beats TOON at every N

`- #1 Fix auth bug — open (alice)` is cheaper than TOON at all seven sizes, by 39% at N=3 and still
2.4% at N=1000. There is no crossover in the tested range.

What it gives up: field names, the row count, and the field count — i.e. everything TOON's
`tasks[3]{number,title,state,assignee}:` header buys, which is also the only thing TOON measurably
does better than JSON in the published benchmark (structure awareness, structural validation). So
this is a real tradeoff, not a free win: MD-light is cheaper *because* it drops the metadata AXI §4
independently wants.

MD table is within 5.5–16.4% of TOON and carries the field names — the closest genuine rival, with
zero format-teaching cost.

## Result 3 — CSV's edge over TOON is payload-shaped, not fixed

Narrow rows: CSV is 19–31% cheaper than TOON. Wide rows (8 fields, long quoted values, N=15): CSV 650
vs TOON 659 — a **1.4%** gap, essentially a tie. The official suite's 5.9% figure sits between the two.
So "CSV beats TOON on flat tables" is true but the margin depends entirely on how much of each row is
structural punctuation versus payload.

## Result 4 — TOON is the *wrong* choice for AXI's detail view

Single object, 7 fields, one long prose body:

| format | tokens |
|---|---|
| JSON compact | **76** |
| MD KV | 78 |
| TOML | 82 |
| **TOON** | **85** |
| YAML | 89 |
| JSON pretty | 102 |

TOON is 4th of 6 and **12% more expensive than compact JSON.** Cause is visible in the output: TOON
quotes any string containing a delimiter, and the body contains `: `, so the whole 190-character body
gets wrapped in quotes. AXI §3 *mandates* a truncated prose body in detail views — which is precisely
TOON's worst-case field type.

## Result 5 — TOON is worse than plain `key: value` for errors

| shape | TOON | JSON compact | YAML | plain `key: value` |
|---|---|---|---|---|
| structured error | 24 | 24 | **20** | **20** |
| definitive empty state | **10** | 11 | 11 | **10** |

TOON renders the error as:

```
error: "--title is required"
help: "tasks create --title \"...\" [--body \"...\"]"
```

The quoting and backslash-escaping cost 4 tokens over plain text and hurt readability.

**AXI's §6 example is not valid TOON.** The skill prints:

```
error: --title is required
help: tasks create --title "..." [--body "..."]
```

A real TOON encoder produces the quoted/escaped version. So AXI's own error, empty-state, and detail
examples are unquoted plain `key: value` — not the format §1 mandates. The document is already
inconsistent with itself, and the plain version it shows is the cheaper one.

## Result 6 — session compounding, and how it compares to a saved turn

40 CLI calls in one agent session: 20 list calls (N=15), 15 detail views, 5 errors/empty states.

| format | session total |
|---|---|
| TOON | 5,215 tok |
| JSON compact | 7,060 tok |
| JSON pretty | 12,360 tok |

TOON saves **1,845 tok (−26%)** vs compact JSON and **7,145 tok (−58%)** vs pretty JSON.

Rough turn comparison: one avoided follow-up CLI call costs on the order of ~600 tokens (the tool-use
block, the tool result, and the model re-reading it). So the whole session's format saving vs compact
JSON is worth roughly **three** avoided follow-up calls; vs pretty JSON, roughly **twelve**.

**This corrects the earlier draft conclusion.** I had called format a clearly second-order lever
against turn elimination. Against *pretty* JSON that is wrong — the format saving is large. Against
*compact* JSON it is real but modest, and roughly three turns' worth over a whole session. The 600-token
turn estimate is rough and unvalidated; treat the ratio as an order of magnitude, not a figure.

## What this changes

1. Open question 1 is closed: small-N does not break TOON. §1 is safe for collections at CLI sizes.
2. §1 should be **scoped to collections**. On detail views TOON costs 12% more than compact JSON, and on
   errors it costs 20% more than the plain `key: value` AXI already prints in its own examples.
3. Lightly formatted Markdown is cheaper than TOON at every size, and MD table is within ~6% while
   keeping field names — so §1's format choice is defensible on metadata grounds (`[N]{fields}`), not
   on token grounds alone. AXI should say so, because the token argument as written overstates the case.

## What this does not measure

- Accuracy. Nothing here tests whether an agent reads any of these formats more correctly.
- Claude tokenization. o200k_base ordering should transfer, but absolute counts will not.
- Multi-turn agent behavior, command emission, or error recovery — the actual AXI use case.
