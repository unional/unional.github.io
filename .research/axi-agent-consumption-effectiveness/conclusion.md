# AXI effectiveness for agent consumption — conclusion

## Last updated

July 2026

## Question

How effective is AXI (Agent eXperience Interface, `~/.claude/skills/axi/SKILL.md`) at improving agent
consumption of CLI output? Two emphases:

1. Nested command groups (`cli group-a group-b command`) — "common subgroups".
2. TOON vs JSON, plain text, YAML, TOML, and lightly formatted Markdown.

## Verdict

**AXI is effective. Its §1 TOON mandate is right for collections, wrong for every other output shape,
and its biggest gap is the command surface rather than the output format.**

Three findings, ordered by how much they should change what you do:

1. **§1 is correct for lists and net-negative elsewhere.** Own measurement (`measurement.md`): TOON runs
   −25.8% to −38.2% vs compact JSON on list output across N = 3…1000 — the advantage does *not* collapse
   at CLI payload sizes. But on a detail view TOON costs 85 tok vs compact JSON's 76 (+12%), and on a
   structured error 24 tok vs plain `key: value`'s 20 (+20%), because TOON quotes and backslash-escapes
   strings containing delimiters — and §3 *mandates* a prose body in detail views. AXI's own §3/§5/§6
   examples print unquoted plain `key: value`, which is not what a TOON encoder emits. The document
   already contradicts itself, in the direction of the cheaper option.
2. **The token argument for TOON is weaker than the metadata argument.** Lightly formatted Markdown
   (`- #1 Fix auth bug — open (alice)`) is cheaper than TOON at *every* size tested (TOON +39.4% at N=3,
   +2.4% at N=1000), and MD-table is within 5.5–16.4% of TOON while keeping field names. TOON's real,
   unique contribution is the `[N]{fields}` header — the only native way to make truncation and field
   loss detectable, and the only category where published benchmarks put TOON clearly ahead.
3. **The largest unfilled gap is nested command groups.** AXI sets no depth guidance and offers no way to
   see the whole command tree in one call, so an agent that does not already know the CLI pays one
   round-trip per hierarchy level — the exact cost §4 exists to eliminate. Drafted fix in
   `proposed-axi-amendments.md`.

Accuracy is *not* where §1 pays off. TOON 72.2% ±2.8 vs JSON 71.4% ±2.8 is a statistical tie by the
publisher's own reckoning, and TOON ranks *last* on field retrieval and mid-pack on filtering — the two
operations agents actually perform on CLI output.

### On TOON vs the alternatives

- **Token efficiency: the claim holds, and holds at small N.** TOON's own suite measures −42.6% vs pretty
  JSON and −15.7% vs YAML across 13 datasets. My own run at CLI sizes: −25.8% vs compact JSON at N=3,
  widening to −38.2% at N=1000; −59.6% to −65.5% vs pretty JSON. The `[N]{fields}` header is a fixed 12
  tokens — 26.1% of output at N=3, 6.1% at N=15, 1.0% at N=100 — never enough to flip the comparison
  against any JSON/YAML/TOML variant. High confidence.
- **Accuracy: the claim does not hold.** Overlapping 95% Wilson intervals; the publisher says so itself.
  Treat TOON as a compression codec, not a comprehension improvement.
- **On the two question types agents actually run against CLI output, TOON is the worst tested format.**
  Field retrieval: CSV 100%, YAML 99.7%, JSON 99.2%, XML 99.2%, JSON-compact 98.9%, **TOON 97.8%**.
  Filtering: JSON 41.1%, YAML 40.1%, **TOON 38.0%**. TOON's aggregate lead comes from *structure
  awareness* (90.3% vs 79–84%) and *structural validation* (100% vs JSON 50%) — question types an agent
  reading `mytool list` rarely asks. Not visible from the headline numbers.
- **A second, independent benchmark inverts the ranking.** improvingagents (GPT-4.1-nano, 1,000 flat
  records, 1,000 field-retrieval questions): Markdown-KV 60.7% > XML 56.0% > INI 55.7% > YAML 54.7% >
  JSON 52.3% > Markdown-Table 51.9% > natural language 49.6% > JSONL 45.0% > CSV 44.3% > pipe 41.1%.
  Per-record key *repetition* helped retrieval — the exact redundancy TOON removes. TOON was not tested.
- **Lightly formatted Markdown is the strongest rival for AXI list output.** Cheaper than TOON at every
  size I measured, and in the published study Markdown-Table matched JSON's accuracy at 38% of JSON's
  tokens. Zero format-teaching cost, being the format models are trained on most heavily. What it gives
  up is exactly TOON's differentiator: field names, row count, field count.
- **Plain text / natural language is dominated on both axes** (49.6% accuracy; more tokens than
  MD-table). Rule it out.
- **YAML** costs TOON −40.3% to −52.4% more tokens than TOON, but wins field retrieval and filtering. And
  AXI's own detail-view and error examples already *are* YAML-shaped indented `key: value`.
- **TOML has no LLM-consumption benchmark anywhere found.** My token run puts it a hair above YAML
  (−41.0% to −54.1% vs TOON) and it has no tabular factoring and no top-level arrays — structurally
  unfit for list output. Low confidence on accuracy; treat as unmeasured.
- **Where TOON loses on tokens:** CSV is cheaper, but by a payload-dependent margin — 19–31% on narrow
  rows, only **1.4%** on wide rows (8 fields, long values), with the official suite's 5.9% in between.
  Compact JSON ties or beats TOON when tabular eligibility is low (+1.6% overall on the mixed track,
  +19.9% on semi-uniform event logs).
- **Model-dependence is real.** gpt-5.4-nano ranked XML > JSON > TOON. All four benchmarked models were
  small/cheap tiers with reasoning disabled; grok-4.5 scored 94.5–97.1% on *every* format including CSV
  — i.e. format sensitivity collapses as capability rises. For a frontier-class agent, expect the
  accuracy delta between formats to be ≈0, leaving cost as the only lever.

**Session compounding, and the corrected turn comparison.** Over 40 CLI calls (20 lists at N=15, 15
detail views, 5 errors): TOON 5,215 tok, compact JSON 7,060, pretty JSON 12,360. TOON saves 1,845 tok
(−26%) vs compact JSON and 7,145 tok (−58%) vs pretty. At a rough ~600 tok per avoided follow-up call,
that is worth about **three** saved turns per session versus compact JSON and about **twelve** versus
pretty JSON. **This corrects an earlier draft claim of mine** that format is clearly second-order to turn
elimination — against pretty JSON that is wrong, and against compact JSON it is modest rather than
negligible. The 600-token turn figure is an unvalidated estimate; treat the ratio as an order of
magnitude.

### On nested command groups

- **AXI under-specifies this.** It addresses grouped nouns only glancingly: §6 requires per-subcommand
  flag validation ("only the subcommand layer knows which is in play"), §10 requires per-subcommand
  `--help`. It sets **no depth guidance and provides no way to see the whole command tree at once.** §6's
  grouped-noun clause presumes grouping the document never specifies.
- **Two levels (noun-verb) is well-supported.** Convergent practitioner consensus: `noun verb`
  hierarchies turn discovery into deterministic tree search rather than name-guessing, and
  `myctl --help` → `myctl user --help` is a natural progressive-disclosure ladder.
- **Three or more levels fights AXI's own §4.** AXI states the expensive cost is the follow-up call.
  Every hierarchy level an agent must discover *is* a follow-up call. Deep nesting spends the exact
  resource AXI's other nine rules are built to conserve.
- **The nearest measurement points the same way.** ETOM (five-level MCP tool-orchestration benchmark)
  finds accuracy declines with both namespace *depth* and *breadth*, compounding, and recommends limited
  hierarchy depth. This is MCP tool namespaces, not CLI subcommand trees — analogy, not direct evidence.
- **The fix AXI is missing is convergently recommended elsewhere:** a machine-readable full-surface
  manifest (a `schema` subcommand emitting every command path, flag, argument, exit code, and example) so
  the agent loads the whole tree in one call instead of walking it. Two independent practitioner sources
  recommend exactly this; AXI has no equivalent rule. §8 (content-first home view) and §9 (contextual
  disclosure) partially substitute at depth 1–2 but cannot cover a deep tree inside §7's token budget —
  and tool-definition bloat is already a documented failure mode at 50K–134K tokens, so the manifest
  belongs behind an explicit command, not in the session-start hook.

## Confidence

| Claim | Confidence |
|-------|-----------|
| TOON saves 25–38% tokens vs compact JSON on CLI-sized list output, N=3…1000 | High (own measurement) |
| TOON's advantage survives small N | High (own measurement; closes prior open question) |
| TOON costs more than compact JSON / MD-KV / TOML on detail views | High (own measurement) |
| TOON costs more than plain `key: value` on errors | High (own measurement) |
| Lightly formatted Markdown is cheaper than TOON at every size | High (own measurement) |
| TOON improves agent accuracy over JSON | Low — refuted; CIs overlap |
| TOON is *worse* than JSON/YAML/CSV on field retrieval and filtering | Moderate–high (publisher's own data, single suite) |
| Format choice is worth ~3 saved turns/session vs compact JSON | Low–moderate (rough turn-cost estimate) |
| 2-level noun-verb nesting is agent-friendly | Moderate (consensus, no controlled data) |
| ≥3-level nesting degrades agent performance | Low–moderate (ETOM analogy only) |
| TOML is unsuitable for AXI list output | Moderate on tokens, low on accuracy (unmeasured) |

## Strongest supporting evidence

- Own token measurement at AXI payload sizes across ten formats and seven row counts, plus the three
  non-collection output shapes AXI describes (`measurement.md`; scripts in
  `scratchpad/toon-bench/`). Closes the one gap no published benchmark covers.
- TOON official benchmark suite: 13 datasets, 244 generated questions, 4 models, o200k_base, reasoning
  disabled, 95% Wilson intervals. Token deltas are robust and the publisher is candid about accuracy
  overlap and about where TOON loses.
- improvingagents 11-format study: independent, differently-designed, reaches an incompatible ranking —
  which is what makes the pair informative.

## Strongest weakening / contradictory evidence

- **No benchmark, mine included, tests the AXI setting for accuracy.** Every accuracy source measures
  single-turn Q&A over one large blob. AXI output is small, repeated across many turns, and consumed by
  an agent that must then *emit a command*. This external-validity gap is the biggest weakness here.
- My measurement is tokens only, and uses o200k_base rather than a Claude tokenizer. Relative ordering
  should transfer; absolute counts will not.
- TOON's structural-validation 100% result is partly a methodological artifact: corruption was applied
  *after* encoding, leaving TOON's `[N]{fields}` metadata describing the original shape while
  JSON/YAML/XML/CSV carry no length metadata to contradict. Real truncation would truncate the header too.
- Benchmarked models are all small/cheap tiers. grok-4.5's near-ceiling scores on every format suggest
  format choice matters progressively less for frontier agents.

## What is not supported

- "TOON improves agent accuracy" — not supported.
- "~40% savings" as a blanket figure for all AXI output — supported for collections only; TOON is
  *more* expensive than compact JSON on detail views and than plain text on errors.
- Any claim that nested command groups help or hurt agents by a measured amount — no data exists.
- TOON as a general replacement for JSON in agent pipelines — the format's own docs scope it to
  prompt-boundary serialization with JSON retained internally, matching AXI §1's "convert at the output
  boundary".

## Where evidence is thin

- Accuracy at AXI payload sizes, for any format. Entirely unmeasured.
- TOML in any LLM-consumption benchmark — absent.
- Nested command-group depth for CLIs specifically — absent; an ACED-style eval would settle it cheaply.
- Multi-turn / agentic (as opposed to single-turn retrieval) format effects — absent.
- The ~600-token cost of an avoided follow-up call — my own rough estimate, unvalidated.

## What to check again later

- Whether TOON publishes a small-payload or multi-turn benchmark, and whether frontier models enter the
  model set.
- Whether the TOON spec (v3.3 Working Draft, 2026-07-22) stabilizes; the format self-describes as "an
  idea in progress", and ONTO already claims to beat it.
- Whether a CLI-subcommand-depth eval appears; until then that remains the weakest-evidenced half of the
  question.
