import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // Vue support
    './src/unplugin',
    './src/vite'
  ],
  rollup: {
    emitCJS: true
  },
  replace: {
    'process.env.DEV': 'false'
  },
  hooks: {
    'mkdist:entry:options'(ctx, entry, options) {
      options.addRelativeDeclarationExtensions = false
    }
  },
  externals: ['#build/ui', 'vite']
})
