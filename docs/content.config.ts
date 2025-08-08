import { defineCollection, z } from '@nuxt/content'

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

export const collections = {
  docs: defineCollection({
    type: 'page',
    source: [{
      include: 'docs/**/*'
    }],
    schema: z.object({
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
  }),
  index: defineCollection({
    type: 'page',
    source: 'index.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      links: z.array(Button)
    })
  }),
  figma: defineCollection({
    type: 'page',
    source: 'figma.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      links: z.array(Button)
    })
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
  }),
  templates: defineCollection({
    type: 'page',
    source: 'templates.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      links: z.array(Button),
      hero: z.object({
        title: z.string(),
        description: z.string()
      })
    })
  })
}
