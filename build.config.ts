export default {
  entries: [
    './src/module',
    { input: './src/components/', outDir: 'dist/components' },
    { input: './src/composables/', outDir: 'dist/composables' },
    { input: './src/presets/', outDir: 'dist/presets' },
    { input: './src/plugins/', outDir: 'dist/plugins' },
    { input: './src/types/', outDir: 'dist/types' },
    { input: './src/utils/', outDir: 'dist/utils' },
    { input: './src/css/', outDir: 'dist/css' }
  ],
  declaration: true,
  externals: [
    '@nuxt/kit',
    '@nuxt/schema',
    '@unocss/preset-uno'
  ]
}
