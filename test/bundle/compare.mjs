import { appendFile, lstat, readFile, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'

// Renders the pull request comment from the sizes of `size.mjs --json`. It runs with write access on sizes measured
// from untrusted code, so it only relies on Node built-ins and validates everything it reads.

const { values: args } = parseArgs({
  options: {
    base: { type: 'string' },
    head: { type: 'string' },
    output: { type: 'string' }
  }
})

const base = await readSizes(args.base)
const head = await readSizes(args.head)

const changed = JSON.stringify(base) !== JSON.stringify(head)

const lines = [
  '### Bundle size',
  '',
  changed ? 'Client output of the apps in `test/bundle`, compared to the base branch.' : 'No change to the client output of the apps in `test/bundle`.',
  '',
  '| Fixture | JS (gzip) | CSS (gzip) |',
  '| --- | --: | --: |',
  ...Object.keys(head).map(name => `| \`${name}\` | ${formatCell(base[name]?.js.gzip, head[name].js.gzip)} | ${formatCell(base[name]?.css.gzip, head[name].css.gzip)} |`),
  '',
  '<details>',
  '<summary>Raw sizes</summary>',
  '',
  '| Fixture | JS | CSS |',
  '| --- | --: | --: |',
  ...Object.keys(head).map(name => `| \`${name}\` | ${formatCell(base[name]?.js.raw, head[name].js.raw)} | ${formatCell(base[name]?.css.raw, head[name].css.raw)} |`),
  '',
  '</details>'
]

await writeFile(args.output, `${lines.join('\n')}\n`)

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`)
}

async function readSizes(path) {
  const stats = await lstat(path)
  if (!stats.isFile() || stats.size > 64 * 1024) {
    throw new Error(`${path} must be a regular file under 64 KB`)
  }

  const sizes = JSON.parse(await readFile(path, 'utf8'))
  assertKeys(sizes, ['fixtures'])

  const names = Object.keys(sizes.fixtures)
  if (names.length > 20 || names.some(name => !/^[a-z0-9-]{1,40}$/.test(name))) {
    throw new Error(`${path} has invalid fixture names`)
  }

  for (const fixture of Object.values(sizes.fixtures)) {
    assertKeys(fixture, ['css', 'js'])

    for (const size of Object.values(fixture)) {
      assertKeys(size, ['gzip', 'raw'])

      if (!Object.values(size).every(bytes => Number.isSafeInteger(bytes) && bytes >= 0)) {
        throw new Error(`${path} has invalid sizes`)
      }
    }
  }

  return sizes.fixtures
}

function assertKeys(value, keys) {
  if (typeof value !== 'object' || value === null || Array.isArray(value) || Object.keys(value).sort().join() !== keys.join()) {
    throw new Error(`Expected an object with the keys ${keys.join(', ')}`)
  }
}

function formatCell(base, head) {
  if (base === undefined) {
    return `${formatSize(head)} (new)`
  }

  const delta = head - base
  if (!delta) {
    return formatSize(head)
  }

  const sign = delta > 0 ? '+' : '-'
  const percentage = base ? `, ${sign}${(Math.abs(delta) / base * 100).toFixed(1)}%` : ''

  return `${formatSize(head)} (${sign}${formatSize(Math.abs(delta))}${percentage})`
}

function formatSize(bytes) {
  return bytes < 100 ? `${bytes} B` : `${(bytes / 1000).toFixed(1)} kB`
}
