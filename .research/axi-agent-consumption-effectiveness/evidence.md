# Evidence log — AXI effectiveness for agent consumption

## C1 — TOON reduces tokens ~40% vs pretty JSON

- date: 2026-07
- status: supported
- confidence: high
- source: TOON official benchmarks
- url: https://toonformat.dev/guide/benchmarks
- type: publisher benchmark (primary, self-interested)
- notes: 2,474 tok (TOON) vs 4,308 (JSON pretty) = −42.6%. Mixed-structure track total −32.7% vs JSON,
  −15.7% vs YAML, −40.9% vs XML, **+1.6% vs JSON-compact**. o200k_base tokenizer; absolute counts are
  tokenizer-specific, relative direction holds.

## C2 — TOON does NOT meaningfully improve accuracy over JSON

- date: 2026-07
- status: refutes AXI's implicit framing
- confidence: high
- source: TOON official benchmarks
- url: https://toonformat.dev/guide/benchmarks
- type: publisher benchmark
- notes: TOON 72.2% ±2.8 vs JSON 71.4% ±2.8 — overlapping 95% Wilson intervals. Publisher explicitly
  states overlapping CIs indicate no statistically meaningful difference.

## C3 — TOON is the weakest tested format on field retrieval and filtering

- date: 2026-07
- status: supported
- confidence: moderate–high
- source: TOON official benchmarks, per-question-type table
- url: https://toonformat.dev/guide/benchmarks
- type: publisher benchmark
- notes: Field retrieval — CSV 100%, YAML 99.7%, JSON 99.2%, XML 99.2%, JSON-compact 98.9%, **TOON
  97.8%**. Filtering — JSON 41.1%, YAML 40.1%, TOON 38.0% (tied JSON-compact), XML 37.5%, CSV 33.3%.
  TOON's aggregate lead comes from structure awareness (90.3% vs 78.5–84.0%) and structural validation
  (100% vs JSON 50%). **Directly relevant**: agents reading CLI list output do retrieval and filtering,
  not structure validation.

## C4 — TOON's structural-validation win is partly a methodological artifact

- date: 2026-07
- status: caveat
- confidence: high
- source: TOON benchmarks, methodology caveats section
- url: https://toonformat.dev/guide/benchmarks
- type: publisher benchmark (self-disclosed limitation)
- notes: Corruption applied post-encoding, so TOON's `[N]`/`{fields}` still describe the pre-corruption
  shape, making truncation detectable by construction. JSON/YAML/XML/CSV carry no length metadata.

## C5 — Independent 11-format study inverts the ranking; redundancy helps retrieval

- date: 2025-10 (study), consulted 2026-07
- status: contradicts C1/C2's implied conclusion
- confidence: moderate (single model, single data shape)
- source: Improving Agents — "Which Table Format Do LLMs Understand Best?"
- url: https://www.improvingagents.com/blog/best-input-data-format-for-llms
- type: independent benchmark
- notes: GPT-4.1-nano, 1,000 synthetic employee records × 8 attributes, 1,000 field-retrieval questions.
  Markdown-KV 60.7% / 52,104 tok; XML 56.0% / 76,114; INI 55.7% / 48,100; YAML 54.7% / 55,395;
  HTML 53.6% / 75,204; JSON 52.3% / 66,396; Markdown-Table 51.9% / 25,140; Natural-Language 49.6% /
  43,411; JSONL 45.0% / 54,407; CSV 44.3% / 19,524; Pipe-delimited 41.1% / 43,098. Authors' caveats:
  one model, one pattern, flat data, simple retrieval questions. TOON not tested.

## C6 — Lightly formatted Markdown has a TOON-like accuracy-per-token profile

- date: 2026-07 (derived from C5)
- status: supported
- confidence: moderate
- source: derived from Improving Agents table
- url: https://www.improvingagents.com/blog/best-input-data-format-for-llms
- type: derivation
- notes: Markdown-Table 51.9% at 25,140 tok vs JSON 52.3% at 66,396 — same accuracy, 38% of the tokens.
  Plus zero format-teaching cost (heaviest-represented format in training data). Superseded on the token
  axis by C17, which measures the comparison directly.

## C7 — Plain text / natural language is not competitive

- date: 2025-10
- status: supported
- confidence: moderate
- source: Improving Agents
- url: https://www.improvingagents.com/blog/best-input-data-format-for-llms
- type: independent benchmark
- notes: Natural-Language 49.6% at 43,411 tok — worse accuracy than YAML/JSON and worse tokens than
  Markdown-Table. Dominated on both axes. C17 confirms the token half at CLI sizes (TOON −27% to −44%
  vs prose).

## C8 — TOON loses to CSV on flat tables and to compact JSON on deep nesting

- date: 2026-07
- status: supported
- confidence: high
- source: TOON README + benchmarks ("when NOT to use TOON")
- url: https://github.com/toon-format/toon
- type: publisher docs
- notes: CSV smaller by 5.9% on the flat-only track (64,247 vs 68,030). JSON-compact wins when tabular
  eligibility ≈0%; semi-uniform event logs TOON +19.9% vs JSON-compact. Savings diminish at 40–60%
  tabular eligibility. Also: local/quantized deployments may process compact JSON *faster* despite more
  tokens. Refined by C19 — the CSV margin is payload-shaped, 1.4% to 31%.

## C9 — Format sensitivity is model-dependent and shrinks with capability

- date: 2026-07
- status: supported
- confidence: moderate
- source: TOON benchmarks, per-model table
- url: https://toonformat.dev/guide/benchmarks
- type: publisher benchmark
- notes: gpt-5.4-nano ranks XML 59.4% > JSON 57.4% > TOON 57.0% — TOON not first. grok-4.5 scores
  94.5–97.1% on *every* format including CSV, i.e. near-ceiling and format-insensitive. All four models
  are small/cheap tiers with reasoning disabled. Implication: for frontier agents, TOON's value is cost,
  not comprehension.

## C10 — TOON needs to be shown, not explained; teaching cost can erase savings on short outputs

- date: 2026-07
- status: supported (weak quantification)
- confidence: low–moderate
- source: TOON README; secondary commentary
- url: https://github.com/toon-format/toon
- type: publisher docs + secondary
- notes: README: "TOON works best when you show the format instead of describing it." Secondary sources
  note the prompt overhead of teaching TOON syntax can wipe out per-token savings on short outputs —
  directly relevant to AXI, whose payloads are short. Not measured anywhere found. Note the asymmetry:
  Markdown and JSON carry no teaching cost at all.

## C11 — TOML has no LLM-consumption accuracy benchmark

- date: 2026-07
- status: unmeasured
- confidence: low
- source: multiple secondary comparisons
- url: https://zenn.dev/hanako_tech/articles/25d05ba8f124a4?locale=en
- type: secondary
- notes: Consistent secondary claim that TOML ≈ YAML with a few more tokens, and that TOML has no
  top-level list support. YAML itself measured at +6–10% tokens over JSON. C17 confirms the token
  relationship directly (TOML consistently ~1% above YAML at every N). No accuracy measurement for TOML
  found in any benchmark consulted.

## C12 — Two-level noun-verb hierarchy is agent-friendly

- date: 2026-07
- status: supported
- confidence: moderate (consensus, no controlled data)
- source: "Writing CLI Tools That AI Agents Actually Want to Use"; Speakeasy
- url: https://dev.to/uenyioha/writing-cli-tools-that-ai-agents-actually-want-to-use-39no
- url2: https://www.speakeasy.com/blog/engineering-agent-friendly-cli
- type: practitioner guidance
- notes: `noun verb` "turns exploration into a deterministic tree search, rather than a guessing game";
  `myctl --help` lists nouns, `myctl user --help` lists verbs. Speakeasy ships a real 3-level example
  (`speakeasy agent workflows sdk-generation`) as progressive disclosure. Neither source gives depth
  guidance or measurements.

## C13 — Discovery turns are the cost of depth; a full-surface manifest is the fix

- date: 2026-07
- status: supported
- confidence: moderate
- source: "Agent-first CLIs are about reducing turns, not JSON"; Akeem Jenkins "The agent-first CLI"
- url: https://keyboardsdown.com/posts/01-agent-first-clis/
- url2: https://akeemjenkins.com/blog/agent-first-cli-a-design-pattern/
- type: practitioner guidance (two independent sources, convergent)
- notes: "Instead of agents navigating through nested help structures across multiple turns … give them
  the complete structure up front." Both independently recommend a `schema` subcommand emitting a JSON
  manifest of every subcommand, flag, argument, stdout format, exit code, and example — loaded once.
  Jenkins: "the CLI is the source of truth and tool definitions get generated from it." Neither gives
  measurements. **AXI has no equivalent rule.**

## C14 — Namespace depth and breadth both degrade tool-selection accuracy

- date: 2026-07
- status: supported by analogy
- confidence: low–moderate for CLIs
- source: ETOM: A Five-Level Benchmark for Evaluating Tool Orchestration within the MCP Ecosystem
- url: https://arxiv.org/pdf/2510.19423
- type: academic benchmark
- notes: Five levels from single tool → flat namespace → single-level categories → multi-level nested
  hierarchies → multi-server cross-namespace. Accuracy declines with depth ("agents struggle with
  recursive namespace exploration") and with breadth (information overload), compounding. Recommends
  limited hierarchy depth and clear organizational logic. **Caveat: MCP tool namespaces ≠ CLI
  subcommand trees.** Analogy, not direct evidence.

## C15 — Tool-definition token overhead is the dominant cost at scale

- date: 2026-07
- status: supported (context)
- confidence: moderate
- source: secondary survey of 2026 tool-selection literature
- url: https://medium.com/@Micheal-Lanham/tools-in-2026-why-picking-the-right-action-is-the-new-planning-problem-d28d8443bf3f
- type: secondary
- notes: Tool definitions can consume 50,000+ tokens before an agent reads the user request; some cases
  exceed 134K. Supports AXI §7's "token-budget-aware" rule for ambient session context, and argues
  against dumping a full deep command tree into every session — hence the manifest belongs behind an
  explicit command.

## C16 — ONTO: a further columnar format claims to beat TOON

- date: 2026-04
- status: noted, not verified
- confidence: low
- source: "ONTO: A Token-Efficient Columnar Notation for LLM Input Optimization"
- url: https://arxiv.org/pdf/2604.17512
- type: academic preprint
- notes: Compares against JSON, CSV, YAML, Markdown, TOON; claims further token reduction at comparable
  accuracy. Numbers not extracted; treat as a signal that the token-efficient-notation space is not
  settled and AXI's §1 may be pinning to a moving target.

## C17 — Own measurement: TOON's token advantage survives small N

- date: 2026-07-26
- status: supported; closes prior open question 1
- confidence: high (tokens only)
- source: own run — `scratchpad/toon-bench/bench.mjs`; results in `measurement.md`
- type: own measurement
- notes: `@toon-format/toon` encoder, `gpt-tokenizer` o200k_base/gpt-4o, realistic `tasks list` payload
  `{number,title,state,assignee}` at N = 3/5/10/15/30/100/1000. TOON vs compact JSON: −25.8% at N=3 →
  −38.2% at N=1000. Vs pretty JSON −59.6% → −65.5%. Vs YAML −40.3% → −52.4%. Vs TOML −41.0% → −54.1%.
  Vs MD-KV −35.2% → −50.5%. Vs prose −27.0% → −43.8%. **No collapse at small N.** TOON's header is a
  fixed 12 tokens: 26.1% of output at N=3, 6.1% at N=15, 1.0% at N=100 — never enough to flip any of
  the above. Caveat: o200k_base, not a Claude tokenizer; ordering transfers, absolute counts do not.

## C18 — Own measurement: lightly formatted Markdown is cheaper than TOON at every size

- date: 2026-07-26
- status: supported; weakens AXI §1's token argument
- confidence: high (tokens only)
- source: own run — `measurement.md`
- type: own measurement
- notes: `- #1 Fix auth bug — open (alice)` beats TOON at all seven sizes: TOON +39.4% at N=3, +24.6% at
  N=5, +8.8% at N=15, +3.2% at N=100, +2.4% at N=1000. No crossover in range. MD-table is within
  5.5–16.4% of TOON while *keeping* field names. What MD-light gives up is exactly TOON's differentiator:
  field names, row count, field count — i.e. the `[N]{fields}` metadata AXI §4 independently wants. So
  this is a genuine tradeoff, not a free win, but it means §1 must be justified on metadata grounds
  rather than on tokens alone.

## C19 — Own measurement: CSV's edge over TOON is payload-shaped

- date: 2026-07-26
- status: refines C8
- confidence: high (tokens only)
- source: own run — `measurement.md`
- type: own measurement
- notes: Narrow 4-field rows: CSV is 19.2–31.4% cheaper than TOON. Wide rows (8 fields, long quoted
  values, N=15): CSV 650 vs TOON 659 — a 1.4% gap, effectively a tie. The official suite's 5.9% figure
  sits between. "CSV beats TOON on flat tables" is true but the margin depends on how much of each row
  is structural punctuation versus payload.

## C20 — Own measurement: TOON is the wrong format for AXI's detail view

- date: 2026-07-26
- status: contradicts AXI §1 for non-collection output
- confidence: high (tokens only)
- source: own run — `scratchpad/toon-bench/bench2.mjs`; `measurement.md`
- type: own measurement
- notes: Single object, 7 fields, one 190-char truncated prose body — the exact shape AXI §3 mandates.
  JSON compact 76 tok < MD-KV 78 < TOML 82 < **TOON 85** < YAML 89 < JSON pretty 102. TOON is 4th of 6
  and 12% more expensive than compact JSON. Cause is visible in the rendered output: TOON quotes any
  string containing a delimiter, and the body contains `: `, so the entire body is wrapped in quotes.
  **§1 and §3 fight each other.**

## C21 — Own measurement: TOON is worse than plain `key: value` for errors, and AXI's own examples are not TOON

- date: 2026-07-26
- status: contradicts AXI §1; identifies internal inconsistency in the skill
- confidence: high (tokens only)
- source: own run — `measurement.md`
- type: own measurement
- notes: Structured error — YAML 20, plain `key: value` 20, TOON 24, JSON compact 24. Definitive empty
  state — TOON 10, plain 10, JSON compact 11, YAML 11 (tie). TOON renders the error as
  `error: "--title is required"` / `help: "tasks create --title \"...\" [--body \"...\"]"` — quoted and
  backslash-escaped. **AXI §6's printed example is the unquoted plain-text version**, which is not what a
  TOON encoder emits. Same for §3's and §5's examples. The document already contradicts itself, in the
  direction of the cheaper option.

## C22 — Own measurement: session compounding, and the corrected turn comparison

- date: 2026-07-26
- status: corrects an earlier draft claim of mine
- confidence: low–moderate (turn-cost estimate is unvalidated)
- source: own run — `measurement.md`
- type: own measurement + estimate
- notes: 40 CLI calls (20 lists at N=15, 15 detail views, 5 errors): TOON 5,215 tok, compact JSON 7,060,
  pretty JSON 12,360. TOON saves 1,845 tok (−26%) vs compact and 7,145 tok (−58%) vs pretty. At a rough
  ~600 tok per avoided follow-up call, the session's format saving is worth ≈3 saved turns vs compact
  JSON and ≈12 vs pretty JSON. **Earlier draft framing — "format saves hundreds, turns save thousands" —
  was too strong.** Against pretty JSON the format lever is large; against compact JSON it is modest but
  not negligible. The 600-token figure is my own estimate, not measured.

## Contradictions

1. **C2/C3 vs AXI §1's framing.** AXI implies TOON is both cheaper and fine to read. Cheaper: yes, for
   collections. "Fine to read": yes but *not better*, and specifically worse on the two operations agents
   perform most on CLI output.
2. **C20/C21 vs AXI §1's scope.** §1 mandates TOON for all stdout, but TOON is more expensive than
   compact JSON on detail views and than plain text on errors — and AXI's own examples for those shapes
   are plain text, not TOON.
3. **C1 vs C5.** TOON's suite says compact-and-factored wins; Improving Agents says
   redundant-and-verbose (Markdown-KV, XML, YAML) wins on retrieval. Reconciliation: the two suites
   weight question types differently — TOON's aggregate is carried by structure-awareness questions,
   Improving Agents tested retrieval only. Both can be true.
4. **C12 vs C13/C14.** Practitioners praise hierarchical noun-verb discovery *and* warn that walking the
   hierarchy costs turns. Reconciliation: hierarchy is good for *organizing*, bad as the *only* discovery
   mechanism. Hence C13's manifest.
5. **C17/C18 vs C6.** The published study suggested Markdown-Table was TOON-adjacent on accuracy-per-
   token; my direct measurement shows MD-light is strictly cheaper than TOON and MD-table nearly so. The
   remaining case for TOON is metadata, not tokens.
