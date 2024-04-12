import { promises as fsp } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

async function loadPackage(dir: string) {
  const pkgPath = resolve(dir, 'package.json')

  const data = JSON.parse(await fsp.readFile(pkgPath, 'utf-8').catch(() => '{}'))

  const save = () => fsp.writeFile(pkgPath, JSON.stringify(data, null, 2) + '\n')

  return {
    dir,
    data,
    save
  }
}

async function main() {
  const pkg = await loadPackage(process.cwd())

  const commit = execSync('git rev-parse --short HEAD').toString('utf-8').trim()

  const date = Math.round(Date.now() / (1000 * 60))

  pkg.data.name = `${pkg.data.name}-edge`

  pkg.data.version = `${pkg.data.version}-${date}.${commit}`

  pkg.save()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
