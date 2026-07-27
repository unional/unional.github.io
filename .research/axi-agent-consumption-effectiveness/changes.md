# Change log — AXI effectiveness for agent consumption

## 2026-07-26 — initial research, then corrected by own measurement

**What changed:** Topic created. Initial conclusion drawn from published sources only, then revised after
running an own token measurement at AXI payload sizes.

**Why:** No published benchmark measures serialization formats at the sizes a CLI actually emits (a
15-row list, a single detail object, a two-line error). Every accuracy source measures single-turn Q&A
over one large blob, so the published numbers could not answer whether AXI §1 is right for AXI's own
payloads.

**Did the conclusion change materially:** Yes, three times.

1. **Open question closed.** The draft flagged "does TOON still win at N = 3–15?" as the most
   decision-relevant unknown. Measured: yes — −25.8% vs compact JSON at N=3, widening to −38.2% at
   N=1000. The 12-token `[N]{fields}` header is 26.1% of output at N=3 but never enough to flip a
   comparison. [C17]
2. **New contradiction found in AXI itself.** The draft said §1 was merely "neutral" for detail views and
   errors. Measurement shows it is net-negative: TOON 85 tok vs compact JSON 76 on a detail view (§3's
   mandated prose body triggers TOON's delimiter-quoting), and 24 vs 20 vs plain `key: value` on an error.
   AXI's own §3/§5/§6 examples print unquoted plain text, which is not valid TOON output — the skill
   already contradicts its own §1. Prompted a third, unrequested amendment proposal. [C20, C21]
3. **An earlier claim of mine was too strong and is retracted.** The draft framed format choice as clearly
   second-order to turn elimination ("format saves hundreds, turns save thousands"). Measured over a
   40-call session: TOON saves 1,845 tok vs compact JSON and 7,145 tok vs pretty JSON — roughly 3 and 12
   avoided follow-up calls' worth. Against pretty JSON the format lever is large. Against compact JSON it
   is modest but not negligible. [C22]

Also revised: the case for §1 now rests on the `[N]{fields}` metadata rather than on tokens alone,
because lightly formatted Markdown measured *cheaper* than TOON at every size tested. [C18]

**Which evidence triggered it:** C17–C22, all own measurement (`measurement.md`; scripts in the session
scratchpad, `toon-bench/bench.mjs` and `bench2.mjs`). Tokenizer was o200k_base via `gpt-tokenizer`, not a
Claude tokenizer — relative ordering transfers, absolute counts do not.

**Deliverable added:** `proposed-axi-amendments.md` — two drafted AXI sections (shallow command groups;
one-shot surface manifest) closing the nested-command-group gap, plus a third flagged separately for
scoping §1 to collections.
