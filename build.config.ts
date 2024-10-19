import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // Include devtools runtime files
    { input: './src/devtools/runtime', builder: 'mkdist', outDir: 'dist/devtools/runtime' }
  ],
  replace: {
    'process.env.DEV': 'false',
    'process.env.NUXT_UI_DEVTOOLS_LOCAL': 'false'
  },
  hooks: {
    'mkdist:entry:options'(ctx, entry, options) {
      options.addRelativeDeclarationExtensions = false
    }
  }
})
