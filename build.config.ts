import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // Vue support
    './src/unplugin',
    './src/vite'
  ],
  hooks: {
    'mkdist:entry:options'(ctx, entry, options) {
      options.addRelativeDeclarationExtensions = false
      // Tailwind scans the built themes, so a class keeps its characters as
      // written: `content-['·']` rather than esbuild's `content-['\xB7']`
      options.esbuild = { ...options.esbuild, charset: 'utf8' }
    }
  },
  externals: ['#build/ui', 'vite']
})
