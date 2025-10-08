import { defineNuxtModule } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import captureWebsite from 'capture-website'

interface ContentFile {
  id?: string
  body?: {
    items: TemplateItem[]
  }
}

interface TemplateItem {
  title: string
  framework: 'nuxt' | 'vue'
  links: { to: string }[]
}

async function captureTemplate(url: string, path: string, darkMode: boolean) {
  if (existsSync(path)) {
    return
  }

  await captureWebsite.file(url, path, {
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
    if (!file.body?.items?.length) {
      return
    }
    for (const template of file.body.items) {
      const url = template.links?.[0]?.to
      if (!url) {
        console.error(`Template ${template.title} has no "to" to take a screenshot from`)
        continue
      }

      const darkPath = join(nuxt.options.rootDir, `public/assets/templates/${template.framework}`, `${template.title.toLowerCase()}-dark.png`)
      const lightPath = join(nuxt.options.rootDir, `public/assets/templates/${template.framework}`, `${template.title.toLowerCase()}-light.png`)

      if (existsSync(darkPath) && existsSync(lightPath)) {
        continue
      }

      console.log(`Generating screenshots for Template ${template.title} hitting ${url}...`)
      try {
        await Promise.all([
          captureTemplate(url, darkPath, true),
          captureTemplate(url, lightPath, false)
        ])
        console.log(`Screenshots for ${template.title} generated successfully`)
      } catch (error) {
        console.error(`Error generating screenshots for ${template.title}:`, error)
      }
    }
  })
})
