import { defineCollection, z } from '@nuxt/content'

export const collections = {
  content: defineCollection({
    type: 'page',
    source: '**/*',
    schema: z.object({
      links: z.array(z.object({
        label: z.string(),
        icon: z.string(),
        to: z.string(),
        target: z.string().optional()
      }))
    })
  })
}
