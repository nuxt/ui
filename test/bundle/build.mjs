import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'mlly'

// Builds the fixture in the working directory with its own `nuxt` or `vite`, this script lives outside of it
const importFromFixture = async id => import(await resolve(id, { url: pathToFileURL(`${process.cwd()}/`) }))

if (existsSync('nuxt.config.ts')) {
  const { buildNuxt, loadNuxt } = await importFromFixture('nuxt/kit')

  // Same as `nuxt build`, without the `.nuxtrc` files outside the fixture: the repo one adds `@nuxt/content` to every app in the workspace
  const nuxt = await loadNuxt({ cwd: process.cwd(), globalRc: false, overrides: { telemetry: false } })

  // Stale chunks in the build dir would end up in `.output`
  await rm(nuxt.options.buildDir, { recursive: true, force: true })

  await buildNuxt(nuxt)
  await nuxt.close()
} else {
  const { build } = await importFromFixture('vite')

  await build()
}
