export default {
  declaration: true,
  entries: [
    './src/module',
    { input: 'src/runtime/', outDir: 'dist/runtime' },
    { input: 'src/css/', outDir: 'dist/css' }
  ],
  externals: ['@nuxt/kit', '@nuxt/schema', '@unocss/preset-uno']
}
