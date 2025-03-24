import { defineNuxtModule } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import captureWebsite from 'capture-website'

interface ContentFile {
  id?: string
  items?: any
}

interface TemplateItem {
  name: string
  url?: string
  screenshotUrl?: string
  screenshotOptions?: Record<string, any>
}

export default defineNuxtModule((options, nuxt) => {
  nuxt.hook('content:file:afterParse', async ({ content: file }: { content: ContentFile }) => {
    if (file.id?.includes('showcase') && file.items) {
      const itemsArray: TemplateItem[] = Array.isArray(file.items)
        ? file.items
        : Object.values(file.items)
      if (itemsArray.length === 0) {
        console.log('No items to process')
        return
      }
      console.log(`Processing ${itemsArray.length} template items`)
      for (const template of itemsArray) {
        const url = template.screenshotUrl || template.url
        if (!url) {
          console.error(`Template ${template.name} has no "url" or "screenshotUrl" to take a screenshot from`)
          continue
        }
        const name = template.name.toLowerCase().replace(/\s/g, '-')
        const filename = join(process.cwd(), 'docs/public/assets/showcase', `${name}.png`)
        if (existsSync(filename)) {
          console.log(`Screenshot for ${template.name} already exists, skipping`)
          continue
        }
        console.log(`Generating screenshot for Template ${template.name} hitting ${url}...`)
        try {
          await captureWebsite.file(url, filename, {
            ...(template.screenshotOptions || {}),
            launchOptions: { headless: true }
          })
          console.log(`Screenshot for ${template.name} generated successfully`)
        } catch (error) {
          console.error(`Error generating screenshot for ${template.name}:`, error)
        }
      }
    }
  })
})
