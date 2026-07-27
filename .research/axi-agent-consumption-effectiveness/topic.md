# AXI effectiveness for agent consumption (July 2026)

## Question

How effective is AXI (`~/.claude/skills/axi/SKILL.md`) at improving agent consumption of CLI output,
with emphasis on (a) nested command groups — `cli group-a group-b command` — and (b) TOON vs JSON,
plain text, YAML, TOML, and lightly formatted Markdown?

## Scope

**In scope**

- AXI's 10 rules as written, and which are load-bearing.
- Measured token and accuracy effects of serialization format on LLM reading of structured data.
- Own token measurement at AXI payload sizes, since no published benchmark covers them.
- Design evidence for hierarchical/nested CLI command surfaces consumed by agents.

**Out of scope**

- Implementation mechanics of TOON encoders/SDKs.
- MCP-vs-CLI as an integration choice (touched only where it supplies analogous evidence).
- Human ergonomics of the formats.
- Any accuracy experiment of our own — recommended as follow-up, not done.

## Source angles

- Publisher primary: TOON spec (v3.3 Working Draft, 2026-07-22), TOON benchmark suite, TOON README.
- Independent benchmark: Improving Agents 11-format table study.
- Academic: ETOM (tool-orchestration depth/breadth), ONTO (columnar notation), Notation Matters.
- Practitioner design guidance: agent-first CLI writeups (keyboardsdown, Akeem Jenkins, Speakeasy,
  dev.to).
- Own measurement: `scratchpad/toon-bench/{bench,bench2}.mjs`, results in `measurement.md`.
- Critical/secondary commentary on TOON's limits.

## Findings

### TOON's measured advantage is tokens, not comprehension

TOON's own suite: 72.2% ±2.8 accuracy at 2,474 tokens vs JSON-pretty 71.4% ±2.8 at 4,308. The accuracy
intervals overlap and the publisher says overlapping intervals mean no meaningful difference. So AXI §1
should be read as a cost rule, not a quality rule. [C1, C2]

Accuracy-per-1K-tokens from that suite: TOON 29.2, JSON-compact 23.8, YAML 20.1, JSON 16.6, XML 14.4.
That ordering is the strongest single argument for §1 — but it is a ratio whose numerator is flat across
formats. [C1]

### The question types that carry TOON's lead are not the ones agents ask

Per-question-type, TOON is *last* on field retrieval (97.8%) and mid-pack on filtering (38.0% vs JSON
41.1%). Its lead comes from structure awareness (90.3% vs 79–84%) and structural validation (100% vs
JSON 50%). An agent parsing `mytool list` output does retrieval and filtering. This inverts the apparent
recommendation for AXI's primary use case. [C3]

The structural-validation result is also partly constructed: corruption was applied after encoding, so
TOON's `[N]{fields}` header still described the uncorrupted shape while the other formats carried no
length metadata at all. [C4]

That said, the underlying capability is real and AXI-relevant: an explicit row count and field count in
the header is the same guarantee §4's `count: 30 of 847 total` reaches for, and no other format provides
it natively. This — not tokens — is the defensible case for §1.

### An independent benchmark reaches the opposite ranking

Improving Agents (GPT-4.1-nano, 1,000 records, 1,000 retrieval questions) ranked Markdown-KV 60.7% top
and CSV 44.3% near bottom — per-record key repetition *helped*, precisely the redundancy TOON strips.
Markdown-Table hit JSON's accuracy at 38% of JSON's tokens. Plain natural language landed at 49.6% and
is dominated on both axes. TOML was not tested anywhere. [C5, C6, C7, C11]

### Own measurement: TOON at AXI payload sizes

No published benchmark tests the sizes a CLI actually emits, so I measured it. Full tables in
`measurement.md`; scripts in `scratchpad/toon-bench/`. Tokens only — no accuracy.

1. **The advantage does not collapse at small N.** TOON vs compact JSON: −25.8% at N=3, widening to
   −38.2% at N=1000. Vs pretty JSON −59.6% → −65.5%; YAML −40.3% → −52.4%; TOML −41.0% → −54.1%. The
   `[N]{fields}` header is a fixed 12 tokens — 26.1% of output at N=3, 6.1% at N=15, 1.0% at N=100 —
   never enough to flip any comparison. This closes the prior open question. [C17]
2. **Lightly formatted Markdown is cheaper than TOON at every size.** `- #1 Fix auth bug — open (alice)`
   beats TOON by 39.4% at N=3 and still 2.4% at N=1000, with no crossover. MD-table is within 5.5–16.4%
   while keeping field names. What MD-light drops is exactly TOON's differentiator — field names, row
   count, field count. Real tradeoff, not a free win, but it means §1's token argument as written
   overstates the case. [C18]
3. **CSV's edge is payload-shaped.** 19–31% cheaper than TOON on narrow rows; 1.4% on wide rows (8
   fields, long values). The official 5.9% sits between. [C19]
4. **TOON is the wrong format for AXI's detail view.** Single object, 7 fields, one 190-char truncated
   body — the exact shape §3 mandates: JSON compact 76 < MD-KV 78 < TOML 82 < **TOON 85** < YAML 89 <
   JSON pretty 102. TOON quotes any string containing a delimiter and the body contains `: `, so the whole
   body gets wrapped. **§1 and §3 fight each other.** [C20]
5. **TOON is worse than plain `key: value` for errors — and AXI's own examples are not TOON.** Error:
   plain/YAML 20 tok, TOON/JSON-compact 24. TOON renders `error: "--title is required"` with quoting and
   backslash-escaping; AXI §6 prints the unquoted plain-text version. Same for §3 and §5. The document
   already contradicts itself, in the direction of the cheaper option. [C21]
6. **Session compounding, and a correction.** 40 calls (20 lists at N=15, 15 details, 5 errors): TOON
   5,215 tok vs compact JSON 7,060 vs pretty JSON 12,360 — saving 1,845 tok (−26%) and 7,145 tok (−58%)
   respectively. At a rough ~600 tok per avoided follow-up call that is ≈3 and ≈12 saved turns per
   session. My earlier framing — format is clearly second-order to turn elimination — was too strong
   against pretty JSON and only mildly right against compact JSON. [C22]

### Scoping all of this to AXI

AXI payloads are small (a list of 15 issues, not 1,000 employee records) and repeated across many turns.
Consequences:

1. Per-call absolute saving is tens-to-low-hundreds of tokens; the value compounds across a session, and
   at 40 calls it reaches ~26% of total stdout versus compact JSON.
2. Small N does *not* break TOON — measured, not assumed.
3. Only *collections* benefit. Detail views, errors, and empty states are net-negative or neutral.
4. Format-teaching cost matters more here than in bulk-data prompts because payloads are short, and
   TOON's README concedes the format must be *shown* rather than described. Markdown and JSON carry no
   such cost. [C10]

### Nested command groups

AXI addresses grouped nouns only in passing: §6 requires per-subcommand flag validation, §10 requires
per-subcommand `--help`. There is **no depth guidance and no whole-tree view** — and §6's grouped-noun
clause presumes a grouping the document never specifies.

Practitioner consensus supports two-level noun-verb: it converts discovery into deterministic tree search
instead of name-guessing. Speakeasy ships a working three-level example as progressive disclosure. [C12]

But the same literature identifies the cost: walking a nested help structure costs one turn per level,
and AXI §4 itself declares the follow-up call the most expensive thing. Deep nesting spends exactly what
AXI's other rules conserve. Two independent sources converge on the same remedy — a machine-readable
full-surface manifest (`schema` subcommand emitting every command path, flag, argument, exit code, and
example) loaded once. AXI has no such rule. [C13]

ETOM supplies the nearest measurement: accuracy declines with both namespace depth and breadth,
compounding, across five levels of tool organization, and it recommends limited hierarchy depth. MCP tool
namespaces rather than CLI subcommand trees, so an analogy. [C14]

Countervailing constraint: a full tree dumped into *every* session violates §7's token-budget rule, and
tool-definition bloat is already a documented failure mode at 50K–134K tokens. The manifest belongs
behind an explicit command, not in the session-start hook. [C15]

Drafted amendments in `proposed-axi-amendments.md`.

## Contradictions

- TOON's suite (compact wins) vs Improving Agents (redundant wins on retrieval). Reconciled by
  question-type weighting; both hold.
- AXI §1's framing (TOON is better for agents) vs TOON's own per-question-type data (worst on retrieval).
  Unresolved in AXI's favor only if the reader cares about structure-awareness questions.
- AXI §1 (TOON for all stdout) vs §3/§5/§6's own plain-text examples, and vs my measurement showing TOON
  is more expensive on those shapes. AXI is internally inconsistent here.
- Hierarchy praised for organization vs penalized for discovery turns. Reconciled: organize
  hierarchically, discover flatly.

## Open questions

1. ~~Does TOON win at N = 3–15?~~ **Closed by own measurement — yes, −25.8% vs compact JSON at N=3.**
2. Accuracy at AXI payload sizes, for any format. Entirely unmeasured, and the biggest remaining gap.
   A head-to-head TOON vs MD-table/MD-KV on CLI-shaped output would be the highest-value experiment.
3. Do frontier models (Opus/Sonnet-class, reasoning on) show any format sensitivity at all? If not, §1
   reduces to pure cost optimization.
4. Actual turn cost of 3-level vs 2-level command nesting for a real agent. No data; an ACED-style eval
   would settle it cheaply and would also validate the ~600 tok/turn estimate used here.
5. TOML accuracy: unmeasured in every benchmark found.
6. Is TOON's spec stable enough to pin to? v3.3 is a Working Draft, self-described "an idea in progress",
   and ONTO already claims to beat it.

## Sources consulted

- TOON specification v3.3 — https://toonformat.dev/reference/spec.html
- TOON benchmarks — https://toonformat.dev/guide/benchmarks
- TOON README — https://github.com/toon-format/toon
- Improving Agents, 11-format table study — https://www.improvingagents.com/blog/best-input-data-format-for-llms
- ETOM five-level tool-orchestration benchmark — https://arxiv.org/pdf/2510.19423
- ONTO columnar notation — https://arxiv.org/pdf/2604.17512
- Notation Matters — https://arxiv.org/pdf/2605.29676
- Agent-first CLIs are about reducing turns, not JSON — https://keyboardsdown.com/posts/01-agent-first-clis/
- The agent-first CLI: a design pattern — https://akeemjenkins.com/blog/agent-first-cli-a-design-pattern/
- Making your CLI agent-friendly (Speakeasy) — https://www.speakeasy.com/blog/engineering-agent-friendly-cli
- Writing CLI Tools That AI Agents Actually Want to Use — https://dev.to/uenyioha/writing-cli-tools-that-ai-agents-actually-want-to-use-39no
- JSON vs YAML vs TOON token efficiency — https://zenn.dev/hanako_tech/articles/25d05ba8f124a4?locale=en
- Tools in 2026: Why Picking the Right Action Is the New Planning Problem — https://medium.com/@Micheal-Lanham/tools-in-2026-why-picking-the-right-action-is-the-new-planning-problem-d28d8443bf3f
- AXI skill (local) — ~/.claude/skills/axi/SKILL.md
- Own measurement — `.research/axi-agent-consumption-effectiveness/measurement.md`
