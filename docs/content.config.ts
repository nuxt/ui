import type { CollectionSource } from '@nuxt/content'
import { defineCollection, z } from '@nuxt/content'
import { resolve } from 'node:path'

const Button = z.object({
  label: z.string(),
  icon: z.string().optional(),
  trailingIcon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  id: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional()
})

const schema = z.object({
  category: z.enum(['layout', 'form', 'element', 'navigation', 'data', 'overlay']).optional(),
  framework: z.string().optional(),
  module: z.string().optional(),
  navigation: z.object({
    title: z.string().optional()
  }),
  links: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    avatar: z.object({
      src: z.string(),
      alt: z.string()
    }).optional(),
    to: z.string(),
    target: z.string().optional()
  }))
})

const pro = process.env.NUXT_UI_PRO_PATH
  ? {
      cwd: resolve(__dirname, process.env.NUXT_UI_PRO_PATH, 'docs'),
      include: 'content/**',
      prefix: '/'
    }
  : process.env.NUXT_GITHUB_TOKEN
    ? {
        repository: {
          url: 'https://github.com/nuxt/ui-pro',
          branch: 'v3',
          auth: process.env.NUXT_GITHUB_TOKEN
        },
        include: 'docs/content/**',
        prefix: '/'
      }
    : undefined

export const collections = {
  content: defineCollection({
    type: 'page',
    source: [{
      include: '**/*'
    }, pro as CollectionSource].filter(Boolean),
    schema
  }),
  showcase: defineCollection({
    type: 'page',
    source: 'showcase.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      hero: z.object({
        title: z.string(),
        description: z.string(),
        links: z.array(Button)
      }),
      items: z.array(z.object({
        name: z.string(),
        url: z.string(),
        screenshotUrl: z.string().optional(),
        screenshotOptions: z.object({
          delay: z.number()
        })
      }))
    })
  })
}
