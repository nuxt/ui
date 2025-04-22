import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // Vue support
    './src/unplugin',
    './src/vite'
  ],
  rollup: {
    replace: {
      delimiters: ['', ''],
      values: {
        // Used in development to import directly from theme
        'const isUiDev = true': 'const isUiDev = false'
      }
    }
  },
  hooks: {
    'mkdist:entry:options'(ctx, entry, options) {
      options.addRelativeDeclarationExtensions = false
    }
  },
  externals: ['#build/ui', 'vite']
})
