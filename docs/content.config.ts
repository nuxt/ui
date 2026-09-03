import { z } from 'zod'
import { defineCollection } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'

const Avatar = z.object({
  src: z.string(),
  alt: z.string().optional()
})

const Button = z.object({
  label: z.string(),
  icon: z.string().optional(),
  avatar: Avatar.optional(),
  leadingIcon: z.string().optional(),
  trailingIcon: z.string().optional(),
  to: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  id: z.string().optional(),
  class: z.string().optional()
})

const PageFeature = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string(),
  to: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional()
})

const PageHero = z.object({
  title: z.string(),
  description: z.string(),
  links: z.array(Button).optional()
})

const PageSection = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  links: z.array(Button).optional(),
  features: z.array(PageFeature).optional()
})

// `@nuxtjs/sitemap` only walks a collection whose schema declares this field,
// and reads its per-page options (`lastmod`, `changefreq`, `priority`) off it.
const sitemap = defineSitemapSchema({ z })

const Page = z.object({
  title: z.string(),
  description: z.string(),
  hero: PageHero,
  sitemap
})

export const collections = {
  index: defineCollection({
    type: 'page',
    source: 'index.yml',
    schema: Page.extend({
      hero: PageHero.extend({
        features: z.array(PageFeature)
      }),
      features: z.array(PageFeature),
      design_system: PageSection.extend({
        code: z.string()
      }),
      css_variables: PageSection.extend({
        code: z.string()
      }),
      components: PageSection.extend({
        code: z.string()
      }),
      templates: PageSection,
      community: PageSection
    })
  }),
  docs: defineCollection({
    type: 'page',
    source: [{
      include: 'docs/**/*'
    }],
    schema: z.object({
      category: z.enum(['layout', 'form', 'element', 'navigation', 'data', 'overlay', 'dashboard', 'page', 'chat', 'content', 'editor', 'color-mode', 'i18n']).optional(),
      keywords: z.array(z.string()).optional(),
      index: z.boolean().optional(),
      framework: z.enum(['nuxt', 'vue']).optional(),
      navigation: z.object({
        title: z.string().optional(),
        badge: z.string().optional()
      }),
      links: z.array(Button),
      // External navigation entries (e.g. the Figma page): the sidebar link
      // points at `to` instead of the page's own path.
      to: z.string().optional(),
      target: z.string().optional(),
      sitemap
    })
  }),
  showcase: defineCollection({
    type: 'page',
    source: 'showcase.yml',
    schema: Page.extend({
      items: z.array(z.object({
        name: z.string(),
        url: z.string(),
        screenshotUrl: z.string().optional(),
        screenshotOptions: z.object({
          delay: z.number().optional(),
          width: z.number().optional(),
          cookies: z.array(z.string()).optional(),
          removeElements: z.array(z.string()).optional()
        }).optional()
      }))
    })
  }),
  templates: defineCollection({
    type: 'page',
    source: 'templates.yml',
    schema: Page.extend({
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        framework: z.enum(['nuxt', 'vue']),
        features: z.array(PageFeature).optional(),
        links: z.array(Button).optional(),
        open_links: z.array(Button).optional(),
        deploy_links: z.array(Button).optional()
      }))
    })
  }),
  community: defineCollection({
    type: 'page',
    source: 'community.yml',
    schema: Page.extend({
      items: z.array(z.object({
        label: z.string(),
        description: z.string(),
        avatar: Avatar,
        user: z.object({
          name: z.string(),
          avatar: Avatar,
          to: z.string()
        }),
        to: z.string()
      }))
    })
  }),
  team: defineCollection({
    type: 'page',
    source: 'team.yml',
    schema: Page
  }),
  blog: defineCollection({
    type: 'page',
    source: 'blog.yml',
    schema: Page
  }),
  posts: defineCollection({
    type: 'page',
    source: [{
      include: 'blog/**/*'
    }],
    schema: z.object({
      image: z.string(),
      date: z.string(),
      authors: z.array(z.object({
        name: z.string(),
        avatar: Avatar.optional(),
        to: z.string().optional()
      })).optional(),
      sitemap
    })
  }),
  releases: defineCollection({
    type: 'page',
    source: 'releases.yml',
    schema: Page
  })
}
