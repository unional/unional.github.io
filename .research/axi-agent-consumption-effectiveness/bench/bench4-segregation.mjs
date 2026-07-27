import { encode as tokenize } from 'gpt-tokenizer/model/gpt-4o'

const tok = (s) => tokenize(s).length

// a tmux-shaped surface: 12 resources, ~10 verbs each
const NOUNS = {
	session: ['list', 'view', 'new', 'kill', 'rename', 'attach', 'detach', 'switch'],
	window: ['list', 'view', 'new', 'kill', 'rename', 'move', 'select', 'swap', 'link'],
	pane: ['list', 'view', 'split', 'kill', 'resize', 'select', 'swap', 'send-keys', 'capture', 'respawn'],
	layout: ['list', 'apply', 'save', 'next', 'previous'],
	buffer: ['list', 'view', 'set', 'delete', 'paste', 'save'],
	key: ['list', 'bind', 'unbind', 'send'],
	option: ['list', 'get', 'set', 'unset'],
	hook: ['list', 'set', 'unset', 'run'],
	client: ['list', 'view', 'detach', 'refresh', 'suspend'],
	server: ['info', 'kill', 'start', 'sources'],
	command: ['list', 'run', 'alias'],
	plugin: ['list', 'install', 'remove', 'update'],
}

const row = (noun, verb) => `  ${noun} ${verb},${verb} a ${noun},<id>,--format --quiet --limit,0|1|2`

const slice = (noun) => {
	const verbs = NOUNS[noun]
	return `commands[${verbs.length}]{path,summary,args,flags,exit}:\n` + verbs.map((v) => row(noun, v)).join('\n')
}

const all = Object.entries(NOUNS).flatMap(([n, vs]) => vs.map((v) => row(n, v)))
const full = `commands[${all.length}]{path,summary,args,flags,exit}:\n${all.join('\n')}`

const fullTok = tok(full)
const sliceToks = Object.keys(NOUNS).map((n) => [n, tok(slice(n))])
const avgSlice = sliceToks.reduce((a, [, t]) => a + t, 0) / sliceToks.length

console.log(`surface: ${Object.keys(NOUNS).length} nouns, ${all.length} commands\n`)
console.log(`full schema              ${String(fullTok).padStart(5)} tok`)
console.log(
	`one noun slice (avg)     ${String(Math.round(avgSlice)).padStart(5)} tok   ${(fullTok / avgSlice).toFixed(1)}x smaller`,
)
console.log(`  largest (pane)         ${String(tok(slice('pane'))).padStart(5)} tok`)
console.log(`  smallest (command)     ${String(tok(slice('command'))).padStart(5)} tok`)
console.log(`\nevery slice pulled       ${String(sliceToks.reduce((a, [, t]) => a + t, 0)).padStart(5)} tok`)
console.log(
	`break-even vs full       ${(fullTok / avgSlice).toFixed(1)} slices (of ${Object.keys(NOUNS).length} that exist)`,
)
