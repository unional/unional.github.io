import { encode } from '@toon-format/toon'
import { encode as tokenize } from 'gpt-tokenizer/model/gpt-4o'
import { stringify as tomlStringify } from 'smol-toml'
import YAML from 'yaml'

const tok = (s) => tokenize(s).length

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

console.log('=== DETAIL VIEW rendered ===\n')
console.log('--- TOON ---')
console.log(encode(detail))
console.log('\n--- TOML ---')
console.log(tomlStringify(detail))
console.log('\n--- MD KV ---')
console.log(['## task', ...Object.entries(detail.task).map(([k, v]) => `${k}: ${v}`)].join('\n'))

// ---- error + empty state: the other two AXI shapes --------------------------
console.log('\n=== ERROR / EMPTY STATE shapes ===\n')
const err = { error: '--title is required', help: 'tasks create --title "..." [--body "..."]' }
const empty = { tasks: '0 closed tasks found in this repository' }
const shapes = { error: err, empty }
for (const [label, obj] of Object.entries(shapes)) {
	const variants = {
		TOON: encode(obj),
		'JSON compact': JSON.stringify(obj),
		YAML: YAML.stringify(obj),
		'plain key: value': Object.entries(obj)
			.map(([k, v]) => `${k}: ${v}`)
			.join('\n'),
	}
	console.log(`[${label}]`)
	for (const [n, s] of Object.entries(variants)) {
		console.log(`  ${n.padEnd(18)}${String(tok(s)).padStart(4)} tok`)
	}
	console.log(
		`  --- TOON renders as ---\n${variants.TOON.split('\n')
			.map((l) => '  ' + l)
			.join('\n')}`,
	)
	console.log()
}

// ---- wider rows: does the CSV gap hold with longer field values? ------------
console.log('=== WIDER ROWS (8 fields, longer values), N=15 ===\n')
const wide = Array.from({ length: 15 }, (_, i) => ({
	number: 1000 + i,
	title: `Refactor the ${['token cache', 'retry middleware', 'config loader'][i % 3]} to drop the legacy adapter`,
	state: ['open', 'closed', 'in-progress'][i % 3],
	assignee: ['alice@example.com', 'bob@example.com'][i % 2],
	labels: ['bug,p1', 'chore', 'feat,needs-review'][i % 3],
	updated: `2026-07-${String((i % 28) + 1).padStart(2, '0')}`,
	branch: `feat/refactor-${i}`,
	checks: ['3/3 passed', '1/3 failed', 'pending'][i % 3],
}))
const csv = (rs) => {
	const keys = Object.keys(rs[0])
	return [keys.join(','), ...rs.map((r) => keys.map((k) => `"${r[k]}"`).join(','))].join('\n')
}
const mdTable = (rs) => {
	const keys = Object.keys(rs[0])
	return [
		`| ${keys.join(' | ')} |`,
		`| ${keys.map(() => '---').join(' | ')} |`,
		...rs.map((r) => `| ${keys.map((k) => r[k]).join(' | ')} |`),
	].join('\n')
}
const wideFmt = {
	TOON: encode({ tasks: wide }),
	'JSON compact': JSON.stringify({ tasks: wide }),
	'JSON pretty': JSON.stringify({ tasks: wide }, null, 2),
	YAML: YAML.stringify({ tasks: wide }),
	TOML: tomlStringify({ tasks: wide }),
	'MD table': mdTable(wide),
	CSV: csv(wide),
}
const base = tok(wideFmt.TOON)
for (const [n, s] of Object.entries(wideFmt)) {
	const t = tok(s)
	const d = n === 'TOON' ? '' : `  (TOON ${(((base - t) / t) * 100).toFixed(1)}%)`
	console.log(`${n.padEnd(14)}${String(t).padStart(6)} tok${d}`)
}

// ---- session compounding ----------------------------------------------------
console.log('\n=== SESSION COMPOUNDING: 40 CLI calls in one agent session ===\n')
console.log('mix: 20 list calls (N=15), 15 detail views, 5 errors/empty states\n')
const listN15 = (f) => tok(f)
const mk = {
	TOON: {
		list: tok(
			encode({
				tasks: Array.from({ length: 15 }, (_, i) => ({
					number: i + 1,
					title: 'Fix auth bug',
					state: 'open',
					assignee: 'alice',
				})),
			}),
		),
		detail: tok(encode(detail)),
		err: tok(encode(err)),
	},
	'JSON compact': {
		list: tok(
			JSON.stringify({
				tasks: Array.from({ length: 15 }, (_, i) => ({
					number: i + 1,
					title: 'Fix auth bug',
					state: 'open',
					assignee: 'alice',
				})),
			}),
		),
		detail: tok(JSON.stringify(detail)),
		err: tok(JSON.stringify(err)),
	},
	'JSON pretty': {
		list: tok(
			JSON.stringify(
				{
					tasks: Array.from({ length: 15 }, (_, i) => ({
						number: i + 1,
						title: 'Fix auth bug',
						state: 'open',
						assignee: 'alice',
					})),
				},
				null,
				2,
			),
		),
		detail: tok(JSON.stringify(detail, null, 2)),
		err: tok(JSON.stringify(err, null, 2)),
	},
}
for (const [n, v] of Object.entries(mk)) {
	const total = 20 * v.list + 15 * v.detail + 5 * v.err
	console.log(`${n.padEnd(14)}${String(total).padStart(6)} tok across the session`)
}
const t = 20 * mk.TOON.list + 15 * mk.TOON.detail + 5 * mk.TOON.err
const jc = 20 * mk['JSON compact'].list + 15 * mk['JSON compact'].detail + 5 * mk['JSON compact'].err
const jp = 20 * mk['JSON pretty'].list + 15 * mk['JSON pretty'].detail + 5 * mk['JSON pretty'].err
console.log(`\nTOON saves ${jc - t} tok vs compact JSON, ${jp - t} tok vs pretty JSON`)
console.log(
	`One avoided follow-up CLI call (~600 tok of turn overhead + re-read output) ≈ ${(600 / Math.max(1, jc - t)).toFixed(1)}x the entire session's format saving vs compact JSON`,
)
