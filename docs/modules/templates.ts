import { defineNuxtModule } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import captureWebsite from 'capture-website'
import type { Nuxt } from '@nuxt/schema'

interface ContentFile {
  id?: string
  body?: {
    templates: TemplateItem[]
  }
}

interface TemplateItem {
  title: string
  framework: 'nuxt' | 'vue'
  links: { to: string }[]
}

async function captureTemplate(nuxt: Nuxt, url: string, filename: string, darkMode: boolean) {
  if (existsSync(filename)) {
    return
  }

  await captureWebsite.file(url, filename, {
    darkMode,
    width: 1280,
    height: 720,
    launchOptions: { headless: true }
  })
}

export default defineNuxtModule((_, nuxt) => {
  nuxt.hook('content:file:afterParse', async ({ content: file }: { content: ContentFile }) => {
    if (!file.id?.includes('templates')) {
      return
    }
    if (!file.body?.templates?.length) {
      return
    }
    for (const template of file.body.templates) {
      const url = template.links?.[0]?.to
      if (!url) {
        console.error(`Template ${template.title} has no "to" to take a screenshot from`)
        continue
      }

      const name = template.title.toLowerCase()
      console.log(`Generating screenshots for Template ${template.title} hitting ${url}...`)
      try {
        await Promise.all([
          captureTemplate(nuxt, url, join(nuxt.options.rootDir, `public/assets/templates/${template.framework}`, `${name}-dark.png`), true),
          captureTemplate(nuxt, url, join(nuxt.options.rootDir, `public/assets/templates/${template.framework}`, `${name}-light.png`), false)
        ])
        console.log(`Screenshots for ${template.title} generated successfully`)
      } catch (error) {
        console.error(`Error generating screenshots for ${template.title}:`, error)
      }
    }
  })
})
