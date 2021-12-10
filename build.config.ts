export default {
  entries: [
    './src/index',
    { input: './src/components/', outDir: 'dist/components' },
    { input: './src/presets/', outDir: 'dist/presets' },
    { input: './src/plugins/', outDir: 'dist/plugins' },
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
