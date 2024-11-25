import { defineCollection, z } from '@nuxt/content'

export const collections = {
  content: defineCollection({
    type: 'page',
    source: '**/*',
    schema: z.object({
      navigation: z.object({
        title: z.string().optional(),
        framework: z.string().optional()
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
  })
}
