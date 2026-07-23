import { execFile as execFileCallback } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const execFile = promisify(execFileCallback)
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const rootDir = new URL('../..', import.meta.url)
const consumers = [
  { nuxt: '4.4.8', unheadMajor: 2 },
  { nuxt: '4.5.0', unheadMajor: 3 }
]

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function findUnheadVersions(lockfile) {
  return Object.entries(lockfile.packages)
    .filter(([path]) => /(?:^|\/)node_modules\/@unhead\/vue$/.test(path))
    .map(([, pkg]) => pkg.version)
}

function assertUiPeer(lockfile) {
  const ui = lockfile.packages['node_modules/@nuxt/ui']

  invariant(ui, 'The packed @nuxt/ui package is missing from the consumer lockfile')
  invariant(
    ui.peerDependencies?.['@unhead/vue'] === '^2.1.15 || ^3.0.0',
    `Unexpected @unhead/vue peer range: ${ui.peerDependencies?.['@unhead/vue']}`
  )
  invariant(
    ui.peerDependenciesMeta?.['@unhead/vue']?.optional === true,
    'The @unhead/vue peer must remain optional for existing Nuxt consumers'
  )
}

async function packUi(workDir) {
  const { stdout } = await execFile(npm, [
    'pack',
    '--ignore-scripts',
    '--json',
    '--pack-destination',
    workDir
  ], { cwd: rootDir, maxBuffer: 10 * 1024 * 1024 })
  const [pack] = JSON.parse(stdout)

  invariant(pack?.filename, 'npm pack did not return a tarball filename')
  return join(workDir, pack.filename)
}

async function resolveConsumer(workDir, tarball, consumer) {
  const directory = join(workDir, `nuxt-${consumer.nuxt}`)
  await mkdir(directory)
  await writeFile(join(directory, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@nuxt/ui': pathToFileURL(tarball).href,
      'nuxt': consumer.nuxt
    }
  }))

  await execFile(npm, [
    'install',
    '--package-lock-only',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund'
  ], { cwd: directory, maxBuffer: 10 * 1024 * 1024 })

  const lockfile = JSON.parse(await readFile(join(directory, 'package-lock.json'), 'utf8'))
  const versions = findUnheadVersions(lockfile)

  assertUiPeer(lockfile)
  invariant(
    versions.length === 1,
    `Nuxt ${consumer.nuxt} resolved ${versions.length} @unhead/vue copies: ${versions.join(', ')}`
  )
  invariant(
    Number.parseInt(versions[0], 10) === consumer.unheadMajor,
    `Nuxt ${consumer.nuxt} resolved @unhead/vue ${versions[0]}, expected major ${consumer.unheadMajor}`
  )

  process.stdout.write(`Nuxt ${consumer.nuxt}: @unhead/vue ${versions[0]}\n`)
}

const workDir = await mkdtemp(join(tmpdir(), 'nuxt-ui-unhead-'))

await packUi(workDir)
  .then(tarball => Promise.all(consumers.map(consumer => resolveConsumer(workDir, tarball, consumer))))
  .finally(() => rm(workDir, { recursive: true, force: true }))
