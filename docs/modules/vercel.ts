import { defineNuxtModule } from 'nuxt/kit'
import { symlinkSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineNuxtModule({
  setup (_, nuxt) {
    nuxt.hook('nitro:build:public-assets', () => {
      const vercelDir = resolve(nuxt.options.rootDir, '.vercel')
      const workspaceVercelDir = resolve(nuxt.options.workspaceDir, '.vercel')
      try {
        symlinkSync(vercelDir, workspaceVercelDir)
      } catch (err) {
        console.error(err)
      }
    })
  }
})
