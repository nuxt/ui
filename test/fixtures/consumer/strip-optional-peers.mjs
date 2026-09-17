// Removes the optional peer dependencies of `@nuxt/ui` from the `package.json` in the current directory.
// Used by the `consumer` CI job to check that a missing peer fails the build with the install message.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = JSON.parse(readFileSync(fileURLToPath(new URL('../../../package.json', import.meta.url)), 'utf8'))
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))

for (const [name, meta] of Object.entries(root.peerDependenciesMeta)) {
  if (meta.optional) {
    delete pkg.dependencies[name]
  }
}

writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
