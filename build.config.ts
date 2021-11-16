export default {
  entries: [
    './src/index',
    { input: './src/components/', outDir: 'dist/components', ext: 'js' }
  ],
  declaration: true,
  externals: [
    '@nuxt/kit'
  ]
}
