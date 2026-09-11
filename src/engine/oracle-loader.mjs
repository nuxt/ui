import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

export async function createOracleContext({ appRoot, cssPath, cssSource } = {}) {
  const require = createRequire(createRequire(path.join(appRoot, 'package.json')).resolve('tailwindcss/package.json'))
  const pkg = require('tailwindcss/package.json')
  if (pkg.version !== '4.3.3') throw new Error(`Expected exact Tailwind 4.3.3 oracle, found ${pkg.version}`)
  const postcss = require('postcss')
  const { ResolverFactory, CachedInputFileSystem } = require('enhanced-resolve')
  const resolver = ResolverFactory.createResolver({ fileSystem: new CachedInputFileSystem(fs, 4000), useSyncFileSystemCalls: true, conditionNames: ['style'], extensions: ['.css'], mainFields: ['style'], mainFiles: ['index'] })
  const resolveCss = (id, base) => resolver.resolveSync({}, base, id)
  const source = cssSource ?? fs.readFileSync(cssPath, 'utf8')
  const base = path.dirname(cssPath)
  const { __unstable__loadDesignSystem } = require('tailwindcss')
  const designSystem = await __unstable__loadDesignSystem(source, {
    base,
    loadStylesheet: async (id, parent) => {
      const file = resolveCss(id, parent)
      if (!file) throw new Error(`Cannot resolve oracle stylesheet ${id} from ${parent}`)
      return { path: file, base: path.dirname(file), content: fs.readFileSync(file, 'utf8') }
    }
  })
  const { compile } = require('@tailwindcss/node')
  return {
    appRoot,
    source,
    cssPath,
    base,
    postcss,
    require,
    designSystem,
    async compile(extraCss) {
      const compiler = await compile(`${source}\n${extraCss}`, { base, onDependency() {}, customCssResolver: async (id, parent) => resolveCss(id, parent) })
      return compiler.build([])
    }
  }
}
