export default {
  entries: [
    './src/index',
    { input: './src/components/', outDir: 'dist/components', ext: 'js' },
    { input: './src/utils/', outDir: 'dist/utils', ext: 'js' }
  ],
  declaration: true,
  externals: [
    '@nuxt/kit',
    '@unocss/preset-uno'
  ]
}
