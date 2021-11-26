export default {
  entries: [
    './src/index',
    { input: './src/components/', outDir: 'dist/components' },
    { input: './src/presets/', outDir: 'dist/presets' },
    { input: './src/utils/', outDir: 'dist/utils' }
  ],
  declaration: true,
  externals: [
    '@nuxt/kit',
    '@nuxt/schema',
    '@unocss/preset-uno'
  ]
}
