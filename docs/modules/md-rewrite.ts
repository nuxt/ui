import { defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule((_options, nuxt) => {
  nuxt.hooks.hook('nitro:init', (nitro) => {
    if (nitro.options.dev || !nitro.options.preset.includes('vercel')) {
      return
    }
    nitro.hooks.hook('compiled', async () => {
      const { resolve } = process.getBuiltinModule('node:path')
      const { readFile, writeFile }
        = process.getBuiltinModule('node:fs/promises')
      const vcJSON = resolve(nitro.options.output.dir, 'config.json')
      const vcConfig = JSON.parse(await readFile(vcJSON, 'utf8'))
      vcConfig.routes.unshift(
        // Rewrite /docs/*.md URLs to the raw markdown handler
        {
          src: '^/docs/(.*)\\.md$',
          dest: '/raw/docs/$1.md',
          check: true
        },
        // Serve markdown when Accept: text/markdown is requested
        {
          src: '^/docs/(.*)$',
          dest: '/raw/docs/$1.md',
          has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
          check: true
        },
        // Serve markdown to known AI agent user agents
        {
          src: '^/docs/(.*)$',
          dest: '/raw/docs/$1.md',
          has: [{ type: 'header', key: 'user-agent', value: '.*(GPTBot|ChatGPT-User|ClaudeBot|Claude-Web|CCBot|Google-Extended|PerplexityBot|Amazonbot|cohere-ai|AI2Bot|AnthropicBot).*' }],
          check: true
        }
      )
      await writeFile(vcJSON, JSON.stringify(vcConfig, null, 2), 'utf8')
    })
  })
})
