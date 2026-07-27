import { encode } from '@toon-format/toon'
import { encode as tokenize } from 'gpt-tokenizer/model/gpt-4o'
const tok = (s) => tokenize(s).length

// live data for `mytool pane` — rule 8: bare node shows state
const panes = { panes: [
  { id: 1, title: 'editor', cmd: 'nvim', active: true },
  { id: 2, title: 'server', cmd: 'pnpm dev', active: false },
  { id: 3, title: 'tests', cmd: 'vitest --watch', active: false },
  { id: 4, title: 'shell', cmd: 'zsh', active: false },
]}
const data = encode(panes)

// affordance block, three levels of detail
const namesOnly = 'commands[5]: pane-view, pane-send-keys, pane-kill, pane-resize, pane-split'
const namesArgs = `commands[5]{name,args}:
  pane-view,<id>
  pane-send-keys,<id> <keys>
  pane-kill,<id>
  pane-resize,<id> <cols> <rows>
  pane-split,<id> --horizontal|--vertical`
const full = `commands[5]{name,summary,args,flags,exit}:
  pane-view,Show one pane,<id>,--full --fields,0|1|2
  pane-send-keys,Send keys to a pane,<id> <keys>,--literal,0|1|2
  pane-kill,Kill a pane,<id>,--force,0|1|2
  pane-resize,Resize a pane,<id> <cols> <rows>,,0|1|2
  pane-split,Split a pane,<id>,--horizontal --vertical,0|1|2`

const rows = [
  ['live data only (no affordances)', data],
  ['+ names only', data + '\n' + namesOnly],
  ['+ names & required args', data + '\n' + namesArgs],
  ['+ full signatures (= --help inline)', data + '\n' + full],
]
const base = tok(data)
for (const [label, s] of rows) {
  const t = tok(s)
  console.log(`${label.padEnd(38)}${String(t).padStart(5)} tok   +${String(t - base).padStart(3)}`)
}
console.log('\nseparate `pane --help` call, full signatures:', tok(full), 'tok (plus a round trip)')
