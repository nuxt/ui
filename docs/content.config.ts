import { defineCollection, z } from '@nuxt/content'
import { resolve } from 'node:path'

const schema = z.object({
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
        repository: 'https://github.com/nuxt/ui-pro/tree/v3',
        include: 'docs/content/**',
        prefix: '/',
        authToken: process.env.NUXT_GITHUB_TOKEN
      }
    : undefined

export const collections = {
  content: defineCollection({
    type: 'page',
    source: [{
      include: '**/*'
    }, pro!].filter(Boolean),
    schema
  })
}
