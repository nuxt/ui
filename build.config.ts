export default {
  declaration: true,
  rollup: { cjsBridge: true },
  entries: [
    './src/module',
    { input: 'src/runtime/', outDir: 'dist/runtime' },
    { input: 'src/presets/', outDir: 'dist/presets' },
    { input: 'src/css/', outDir: 'dist/css' }
  ],
  externals: ['@nuxt/kit', '@nuxt/schema', '@unocss/preset-uno']
}
