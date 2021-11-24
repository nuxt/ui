export default {
  entries: [
    './src/index',
    { input: './src/components/', outDir: 'dist/components', ext: 'js' },
    { input: './src/runtime/', outDir: 'dist/runtime', ext: 'js' },
    { input: './src/utils/', outDir: 'dist/utils', ext: 'js' }
  ],
  declaration: true,
  externals: [
    '@nuxt/kit',
    '@nuxt/schema',
    '@unocss/preset-uno'
  ]
}
