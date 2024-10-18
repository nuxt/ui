import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/unplugin'
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
  }
})
