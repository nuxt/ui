import { defineNuxtModule } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import captureWebsite from 'capture-website'

interface ContentFile {
  id?: string
  items?: {
    name: string
    url?: string
    screenshotUrl?: string
    screenshotOptions?: Record<string, any>
  }[]
}

export default defineNuxtModule((options, nuxt) => {
  nuxt.hook('content:file:afterParse', async ({ content: file }: { content: ContentFile }) => {
    // Handle individual template files
    if (file.id?.includes('showcase')) {
      for (const item of file.items!) {
        const template = item
        const url = template.screenshotUrl || template.url
        if (!url) {
          console.error(`Template ${template.name} has no "url" or "screenshotUrl" to take a screenshot from`)
          return
        }
        const name = template.name.toLowerCase().replace(/\s/g, '-')
        const filename = join(process.cwd(), 'docs/public/assets/showcase', `${name}.png`)
        if (existsSync(filename)) {
          return
        }
        console.log(`Generating screenshot for Template ${template.name} hitting ${url}...`)
        await captureWebsite.file(url, filename, {
          ...(template.screenshotOptions || {}),
          launchOptions: { headless: true }
        })
      }
    }
  })
})
