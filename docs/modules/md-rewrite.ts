import { defineNuxtModule } from 'nuxt/kit'

function mdRewrite(nitro) {
  if (nitro.options.dev || !nitro.options.preset.includes('vercel')) {
    return
  }
  nitro.hooks.hook('compiled', async () => {
    const { resolve } = process.getBuiltinModule('node:path')
    const { readFile, writeFile }
      = process.getBuiltinModule('node:fs/promises')
    const vcJSON = resolve(nitro.options.output.dir, 'config.json')
    const vcConfig = JSON.parse(await readFile(vcJSON, 'utf8'))
    vcConfig.routes.unshift({
      src: '^/docs/(.*)$',
      dest: '/raw/docs/$1.md',
      has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
      check: true
    })
    await writeFile(vcJSON, JSON.stringify(vcConfig, null, 2), 'utf8')
  })
}

export default defineNuxtModule((_options, nuxt) => {
  nuxt.hooks.hook('nitro:init', (nitro) => {
    mdRewrite(nitro)
  })
})
