import { defineCollection, z } from '@nuxt/content'

export const collections = {
  content: defineCollection({
    type: 'page',
    source: '**/*',
    schema: z.object({
      links: z.array(z.object({
        label: z.string(),
        icon: z.string(),
        avatar: z.object({
          src: z.string(),
          alt: z.string()
        }).optional(),
        to: z.string(),
        target: z.string().optional()
      })),
      select: z.object({
        items: z.array(z.object({
          label: z.string(),
          icon: z.string(),
          to: z.string()
        }))
      })
    })
  })
}
