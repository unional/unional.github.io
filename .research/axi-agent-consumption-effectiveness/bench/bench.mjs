import { encode } from '@toon-format/toon'
import { encode as tokenize } from 'gpt-tokenizer/model/gpt-4o'
import { stringify as tomlStringify } from 'smol-toml'
import YAML from 'yaml'

const tok = (s) => tokenize(s).length

// ---- realistic AXI list payload: `tasks list` output ------------------------
const TITLES = [
	'Fix auth bug',
	'Add pagination',
	'Update docs',
	'Refactor token cache',
	'Handle rate limits',
	'Migrate to ESM',
	'Drop node 18 support',
	'Add --json flag',
	'Fix flaky test',
	'Bump dependencies',
	'Improve error messages',
	'Add retry logic',
	'Cache repo metadata',
	'Support monorepos',
	'Validate unknown flags',
]
const STATES = ['open', 'closed', 'in-progress']
const USERS = ['alice', 'bob', 'carol', 'dave']

const rows = (n) =>
	Array.from({ length: n }, (_, i) => ({
		number: i + 1,
		title: TITLES[i % TITLES.length],
		state: STATES[i % STATES.length],
		assignee: USERS[i % USERS.length],
	}))

// ---- encoders ---------------------------------------------------------------
const csv = (rs) => {
	const keys = Object.keys(rs[0])
	return [keys.join(','), ...rs.map((r) => keys.map((k) => r[k]).join(','))].join('\n')
}

const mdTable = (rs) => {
	const keys = Object.keys(rs[0])
	return [
		`| ${keys.join(' | ')} |`,
		`| ${keys.map(() => '---').join(' | ')} |`,
		...rs.map((r) => `| ${keys.map((k) => r[k]).join(' | ')} |`),
	].join('\n')
}

// "lightly formatted markdown" — the shape a CLI would plausibly print
const mdLight = (rs) => rs.map((r) => `- #${r.number} ${r.title} — ${r.state} (${r.assignee})`).join('\n')

const mdKV = (rs) =>
	rs.map((r) => [`## ${r.number}`, ...Object.entries(r).map(([k, v]) => `${k}: ${v}`)].join('\n')).join('\n\n')

const plain = (rs) =>
	rs
		.map((r) => `Task ${r.number} is titled "${r.title}". Its state is ${r.state} and it is assigned to ${r.assignee}.`)
		.join(' ')

const FORMATS = {
	TOON: (rs) => encode({ tasks: rs }),
	'JSON compact': (rs) => JSON.stringify({ tasks: rs }),
	'JSON pretty': (rs) => JSON.stringify({ tasks: rs }, null, 2),
	YAML: (rs) => YAML.stringify({ tasks: rs }),
	TOML: (rs) => tomlStringify({ tasks: rs }),
	'MD table': mdTable,
	'MD light': mdLight,
	'MD KV': mdKV,
	CSV: csv,
	'Plain text': plain,
}

const Ns = [3, 5, 10, 15, 30, 100, 1000]

console.log('\n=== LIST OUTPUT: tokens by row count (o200k_base / gpt-4o) ===\n')
const names = Object.keys(FORMATS)
console.log(['format'.padEnd(13), ...Ns.map((n) => `N=${n}`.padStart(8))].join(''))
const results = {}
for (const name of names) {
	const line = [name.padEnd(13)]
	results[name] = {}
	for (const n of Ns) {
		const t = tok(FORMATS[name](rows(n)))
		results[name][n] = t
		line.push(String(t).padStart(8))
	}
	console.log(line.join(''))
}

console.log('\n=== SAVINGS vs each baseline (negative = TOON cheaper) ===\n')
console.log(['vs'.padEnd(13), ...Ns.map((n) => `N=${n}`.padStart(8))].join(''))
for (const name of names) {
	if (name === 'TOON') continue
	const line = [name.padEnd(13)]
	for (const n of Ns) {
		const pct = ((results['TOON'][n] - results[name][n]) / results[name][n]) * 100
		line.push(`${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`.padStart(8))
	}
	console.log(line.join(''))
}

// ---- detail view (single object, the other AXI shape) -----------------------
const detail = {
	task: {
		number: 42,
		title: 'Fix auth bug',
		state: 'open',
		assignee: 'alice',
		checks: '3/3 passed',
		comments: 7,
		body: 'Users report intermittent 401s after token refresh. Repro: log in, wait 15 minutes, hit any authenticated endpoint. Suspect the refresh token is not being persisted before the retry fires.',
	},
}

console.log('\n=== DETAIL VIEW: single object, 7 fields incl. one long body ===\n')
const detailFormats = {
	TOON: () => encode(detail),
	'JSON compact': () => JSON.stringify(detail),
	'JSON pretty': () => JSON.stringify(detail, null, 2),
	YAML: () => YAML.stringify(detail),
	TOML: () => tomlStringify(detail),
	'MD KV': () => ['## task', ...Object.entries(detail.task).map(([k, v]) => `${k}: ${v}`)].join('\n'),
}
for (const [name, fn] of Object.entries(detailFormats)) {
	console.log(`${name.padEnd(13)}${String(tok(fn())).padStart(8)}`)
}

// ---- header overhead isolation ---------------------------------------------
console.log('\n=== TOON header cost as share of total list output ===\n')
for (const n of [3, 5, 10, 15, 30, 100]) {
	const out = encode({ tasks: rows(n) })
	const header = out.split('\n')[0]
	const h = tok(header + '\n')
	const total = results['TOON'][n]
	console.log(
		`N=${String(n).padEnd(5)} header=${String(h).padStart(3)} tok  total=${String(total).padStart(5)} tok  header share=${((h / total) * 100).toFixed(1)}%`,
	)
}

console.log('\n=== sample output at N=3 ===\n')
for (const name of ['TOON', 'MD light', 'MD table', 'YAML', 'CSV']) {
	console.log(`--- ${name} ---`)
	console.log(FORMATS[name](rows(3)))
	console.log()
}
