import { cpSync, mkdirSync } from 'node:fs'
import { defineBuildConfig } from 'unbuild'

function copyEngineFiles() {
  mkdirSync('dist/engine', { recursive: true })
  for (const file of ['convert.mjs', 'oracle-loader.mjs', 'oracle.css']) {
    cpSync(`src/engine/${file}`, `dist/engine/${file}`)
  }
}

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
        'process.argv.includes(\'--uiDev\')': 'false'
      }
    }
  },
  hooks: {
    'mkdist:entry:options'(ctx, entry, options) {
      options.addRelativeDeclarationExtensions = false
    },
    'build:done'() {
      copyEngineFiles()
    }
  },
  externals: [
    '#build/ui',
    'vite',
    '@babel/core',
    '@stylexjs/babel-plugin',
    '@stylexjs/stylex',
    'jiti'
  ]
})
