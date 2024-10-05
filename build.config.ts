import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  replace: {
    'process.env.DEV': 'false'
  },
  hooks: {
    'mkdist:entry:options'(ctx, entry, options) {
      options.addRelativeDeclarationExtensions = false
    }
  }
})
