import { defineNuxtModule } from 'nuxt/kit'
import { symlinkSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

export default defineNuxtModule({
  setup (_, nuxt) {
    nuxt.hook('nitro:build:public-assets', () => {
      const vercelDir = resolve(nuxt.options.rootDir, '.vercel/output')
      const workspaceVercelDir = resolve(nuxt.options.workspaceDir, '.vercel/output')
      try {
        mkdirSync(dirname(workspaceVercelDir), { recursive: true })
        mkdirSync(dirname(vercelDir), { recursive: true })
        symlinkSync(vercelDir, workspaceVercelDir, 'junction')
      } catch (err) {
        console.error(err)
      }
    })
  }
})
