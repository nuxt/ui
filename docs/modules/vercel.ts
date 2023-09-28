import { defineNuxtModule } from 'nuxt/kit'
import { symlinkSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

export default defineNuxtModule({
  setup (_, nuxt) {
    nuxt.hook('nitro:build:public-assets', () => {
      const vercelConfig = resolve(nuxt.options.rootDir, '.vercel/output/config.json')
      const workspaceVercelConfig = resolve(nuxt.options.workspaceDir, '.vercel/output/config.json')
      try {
        mkdirSync(dirname(vercelConfig), { recursive: true })
        mkdirSync(dirname(workspaceVercelConfig), { recursive: true })
        symlinkSync(vercelConfig, workspaceVercelConfig)
      } catch (err) {
        console.error(err)
      }
    })
  }
})
