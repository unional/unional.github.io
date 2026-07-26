# Proposed AXI amendments

Two drafted amendments, both aimed at the nested-command-group gap. Written to drop into
`~/.claude/skills/axi/SKILL.md` as-is.

Rationale for both: AXI §4 already establishes that the most expensive cost is the follow-up call.
Nested command groups are the one place AXI currently *forces* follow-up calls — an agent that does not
know your tree must spend one round-trip per level to find a command. Neither amendment adds a new
principle; both apply §4 to the command surface, which the document currently only applies to output.

Evidence: ETOM finds tool-selection accuracy declines with both namespace depth and breadth,
compounding (`arxiv.org/pdf/2510.19423`) — MCP namespaces, so analogous rather than direct. Two
independent agent-first-CLI writeups converge on a one-shot machine-readable surface manifest as the
fix (`keyboardsdown.com/posts/01-agent-first-clis/`, `akeemjenkins.com/blog/agent-first-cli-a-design-pattern/`).
Neither offers measurements; confidence is moderate for the 2-level rule, low-moderate for the depth
penalty.

---

## Amendment 1 — new section: command groups and depth

Insert as **§11**, or fold into §10 (which already owns help). Recommended as its own section, since it
is about the command surface rather than about help text.

````markdown
## 11. Shallow command groups

Group commands as `noun verb` (`tasks list`, `tasks create`). This is the one structure an agent can
navigate deterministically: the top level enumerates nouns, each noun enumerates its verbs, so discovery
is a tree walk rather than a guess at a name.

**Two levels is the target. Three is the ceiling.**

Every level an agent has not already seen costs a round-trip to discover — and per §4 the follow-up call
is the most expensive thing your CLI can charge for. A third level must earn itself by removing genuine
ambiguity, not by mirroring your internal module layout.

```
tasks list                     # good — noun verb
tasks list --state open        # good — depth stays at 2, flags carry the variation
repo tasks list                # acceptable at 3 if `tasks` is genuinely ambiguous across scopes
admin billing invoices list    # too deep — flatten or split into a separate binary
```

- **Prefer flags over levels.** If a third level only ever selects among variants of one action, it is a
  flag. `tasks list --archived` beats `tasks archived list`.
- **Consistent verbs across nouns.** The same operation carries the same verb everywhere — `list`,
  `view`, `create`, `close`. An agent that has learned `tasks list` should be able to guess
  `labels list` and be right. Inconsistent verbs turn every noun into a fresh discovery cost.
- **Groups are not free.** A group node that dispatches to subcommands and does nothing itself still
  costs a discovery turn. Introduce one only when it collapses several commands that genuinely share a
  subject.
- **Breadth counts too.** Accuracy degrades with the number of sibling commands as well as with depth.
  If one noun has grown past roughly a dozen verbs, it is two nouns.
- **Group nodes show content, not just a menu.** Per §8, `mytool tasks` with no verb should print live
  task state plus its verbs — not a usage block. A menu-only group node is a wasted turn.
- **Validate flags at the level that owns them.** Per §6, an unknown flag is rejected by the subcommand
  in play, since only that layer knows its own flag set.
````

**Note on §6.** §6 already says "For grouped nouns where one command dispatches to subcommands … validate
against the _subcommand's_ flags." That line presumes grouping without ever specifying it. Amendment 1
supplies the missing premise, so §6 should stay as written.

---

## Amendment 2 — new subsection under §10: the surface manifest

Insert at the end of **§10 (Consistent way to get help)**, after the `--help` paragraph.

````markdown
### One-shot surface manifest

`--help` is a per-command lookup. An agent that does not yet know your CLI needs the *whole* surface, and
walking it one `--help` at a time costs one turn per node — the exact cost §4 exists to eliminate.

Ship a `mytool schema` command that prints the entire command surface in one call:

```
$ mytool schema
bin: ~/.local/bin/tasks
commands[6]{path,summary,args,flags,exit}:
  tasks list,List tasks,,--state --assignee --limit --fields,0|2
  tasks view,Show one task,<id>,--full --fields,0|1|2
  tasks create,Create a task,,--title* --body --assignee,0|2
  tasks close,Close a task,<id>,,0|2
  labels list,List labels,,--limit,0|2
  labels create,Create a label,,--name* --color,0|2
help[1]: Run `tasks <command> --help` for flag defaults and examples
```

- **One call, whole tree.** Every command path, its required arguments, its flags, and its exit codes.
  Mark required flags (`--title*`); the agent should never have to discover requiredness by failing.
- **Same format as everything else.** Per §1 this is a collection, so it is tabular TOON like any other
  list.
- **Summaries, not manuals.** One line per command. Defaults and examples stay in `--help`; the manifest
  exists so the agent knows *which* `--help` to read, or more often to skip it entirely.
- **Generate it from the parser.** Hand-maintained manifests drift. Derive it from the same command
  definitions the CLI dispatches on, so it cannot disagree with reality.
- **Not in the session hook.** Per §7 the ambient context loads on every session and must stay minimal;
  a full manifest does not belong there. Mention `mytool schema` in the home view's `help[]` hints
  instead, so the agent can pull it when it needs it.
- **Deep trees need this most.** If Amendment 11 pushed you to three levels, the manifest is what keeps
  that third level affordable.
````

---

## Amendment 3 — replace §9 with state-conditional, typed affordances

Rewrites **§9 Contextual disclosure**. Keeps its three best rules (parameterized values, omit when
self-contained, resolve errors) and changes the framing from *relevance* to *validity*.

Rationale: HATEOAS's actual constraint was never "include links" — it was that a representation
advertises only the state transitions legal from the current state. A closed task's representation omits
its `close` link. §9 currently ranks suggestions by relevance ("after an open item → suggest closing"),
which saves the agent a `--help` lookup. Pruning by validity saves an entire *failed mutation* — command
run, error returned, error parsed, retry. Per §4 that failed attempt is the expensive unit.

Second change: typed relations. §9's `help[]` is prose the agent must read and interpret. A fixed `rel`
vocabulary is something it can match deterministically — the same argument §6 already makes for
self-correcting errors, extended to the happy path.

Confidence: **reasoning only, unmeasured.** HATEOAS has a poor track record with hand-written clients,
for reasons that do not transfer to an LLM (see the blog post for the argument). The pruning claim is
testable by counting failed-mutation attempts with and without state-conditional `next[]`.

````markdown
## 9. State-conditional affordances

Each response advertises the commands that are valid **from the state it just reported** — not the
tool's whole surface, and not what was valid a moment ago.

Omission carries information. If a task is closed, `close` does not appear. The agent cannot form an
invalid intent because the invalid intent was never offered, and you have saved a whole failed
mutation — which per §4 is the expensive unit, not the longer response.

```
$ tasks view 42
task:
  number: 42
  title: Fix auth bug
  state: open
  checks: 3/3 passed
next[3]{rel,cmd}:
  close,tasks close 42
  comment,tasks comment 42 --body "<text>"
  collection,tasks list --state open
```

```
$ tasks close 42
task: #42 closed
next[2]{rel,cmd}:
  reopen,tasks reopen 42
  collection,tasks list --state open
```

`close` is gone from the second response. That is the point.

Rules:

- **Typed relations, not prose.** Use a small fixed `rel` vocabulary — `self`, `item`, `collection`,
  `next`, `create`, `edit`, `retry`, plus your domain's verbs. An agent matches `rel=retry` deterministically;
  it has to interpret "you might want to try again". Keep the vocabulary stable across commands: the
  same relation means the same thing everywhere.
- **Two columns, no link objects.** `rel` and `cmd`. Resist the HAL/JSON:API habit of `href` + `method` +
  `templated` + `title` — this envelope re-enters the agent's context on *every* call and there is no
  HTTP cache to amortize it. Per §7, weight is the thing that kills ambient structure.
- **Reflect state, not schema.** The list comes from the entity you just returned, not from a static table
  of what the command *can* emit. If a mutation changed what is possible, the mutation's own response is
  where the agent should learn that.
- **Parameterize dynamic values.** Use `<id>`, `"<title>"`, `<branch>` rather than guessing a concrete
  value that may mislead. Carry forward any disambiguating flags from the current invocation (`--repo`,
  `--source`).
- **Omit when self-contained.** A detail view that fully answers the question, a count, a confirmation
  that ends the workflow — suggestions there are noise. An agent that already knows what it wants must
  never be nudged into an extra step.
- **Resolve errors.** On failure, name the command that fixes the problem, not `--help`. A `rel=retry`
  affordance on a transient failure is unambiguous in a way an English hint is not.
- **Never let pruning hide a valid action.** Agents read a complete-looking list as *the* action space
  and may stop looking. If you are not certain a transition is illegal, list it — a wrong omission is a
  worse failure than a redundant hint. When in doubt, include.
- **Affordances are for exploring, not executing.** An agent that pulled `mytool schema` (§10) already
  knows your surface and will ignore `next[]`. That is correct: hypermedia optimizes discovery, the
  manifest optimizes execution. Ship both.
````

**Interaction with §6.** §6's idempotent-mutation rule (closing a closed task exits 0 with a no-op)
currently *absorbs* the failure this amendment *prevents*. Both should stay — §9 stops the well-informed
agent from trying, §6 keeps the uninformed one from derailing.

---

## Fourth amendment, not requested — flagged for a separate decision

My own measurement (see `measurement.md`) found §1's TOON mandate is net-negative on two of the four
output shapes AXI itself describes:

- Detail view (7 fields, one truncated prose body): TOON 85 tok vs compact JSON 76, MD-KV 78, TOML 82.
  TOON quotes any string containing a delimiter, and §3 mandates a prose body — so §3 and §1 fight.
- Structured error: TOON 24 tok vs plain `key: value` 20, because TOON quotes and backslash-escapes the
  `help` string.

And AXI's own §3/§5/§6 examples are unquoted plain `key: value` — i.e. not what a real TOON encoder
emits. The document already contradicts itself here, in the direction of the cheaper option.

Suggested wording, if you want it: scope §1 to collections explicitly — "Use TOON's tabular form for
collections. For single objects, errors, and empty states, plain `key: value` lines are cheaper and are
what the examples in this document show." That makes §1 internally consistent and costs nothing.

Left out of the two amendments above because it changes AXI's headline rule rather than filling a gap.
