import { execFile } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { parseArgs, promisify } from 'node:util'
import { gzipSync } from 'node:zlib'
import { join } from 'pathe'
import { glob } from 'tinyglobby'

// Client output directory of each fixture
const fixtures = {
  'nuxt': '.output/public',
  'nuxt-detection': '.output/public',
  'nuxt-full': '.output/public',
  'vue': 'dist',
  'vue-detection': 'dist'
}

const { values: args } = parseArgs({ options: { json: { type: 'string' } } })

const build = fileURLToPath(new URL('./build.mjs', import.meta.url))
const env = { ...process.env, NODE_ENV: 'production' }

await Promise.all(Object.keys(fixtures).map(name => promisify(execFile)(process.execPath, [build], { cwd: getFixtureDir(name), env })))

const sizes = {}

for (const [name, output] of Object.entries(fixtures)) {
  const dir = join(getFixtureDir(name), output)

  sizes[name] = {
    js: await analyzeSizes(dir, 'js'),
    css: await analyzeSizes(dir, 'css')
  }
}

console.log([
  '| Fixture | JS | JS (gzip) | CSS | CSS (gzip) |',
  '| --- | --: | --: | --: | --: |',
  ...Object.entries(sizes).map(([name, { js, css }]) => `| \`${name}\` | ${formatSize(js.raw)} | ${formatSize(js.gzip)} | ${formatSize(css.raw)} | ${formatSize(css.gzip)} |`)
].join('\n'))

if (args.json) {
  await writeFile(args.json, JSON.stringify({ fixtures: sizes }, null, 2))
}

function getFixtureDir(name) {
  return fileURLToPath(new URL(`./${name}`, import.meta.url))
}

async function analyzeSizes(dir, ext) {
  const files = await glob(`**/*.${ext}`, { cwd: dir })
  let raw = 0
  let gzip = 0

  for (const file of files) {
    const contents = await readFile(join(dir, file))
    raw += contents.byteLength
    gzip += gzipSync(contents).byteLength
  }

  return { raw, gzip }
}

function formatSize(bytes) {
  return `${(bytes / 1000).toFixed(1)} kB`
}
