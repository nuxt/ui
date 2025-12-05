import { createResolver } from '@nuxt/kit'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/plausible',
    '@nuxtjs/mcp-toolkit',
    '@vueuse/nuxt',
    '@vercel/analytics/nuxt/module',
    '@vercel/speed-insights/nuxt/module',
    'nuxt-component-meta',
    'nuxt-og-image',
    'motion-v/nuxt',
    (_, nuxt) => {
      nuxt.hook('components:dirs', (dirs) => {
        dirs.unshift({ path: resolve('./app/components/content/examples'), pathPrefix: false, prefix: '', global: true })
      })
    },
    'nuxt-llms'
  ],
  $development: {
    site: {
      url: 'http://localhost:3000'
    }
  },
  $production: {
    site: {
      url: 'https://ui.nuxt.com'
    }
  },

  devtools: {
    enabled: true
  },

  app: {
    rootAttrs: {
      'data-vaul-drawer-wrapper': '',
      'class': 'bg-default'
    }
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'ts', 'typescript', 'diff', 'vue', 'json', 'yml', 'css', 'mdc', 'blade', 'edge']
        }
      }
    }
  },

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },

  routeRules: {
    // v4 redirects - moved to `docs/`
    '/getting-started/**': { redirect: { to: '/docs/getting-started/**', statusCode: 301 }, prerender: false },
    '/components/**': { redirect: { to: '/docs/components/**', statusCode: 301 }, prerender: false },
    '/composables/**': { redirect: { to: '/docs/composables/**', statusCode: 301 }, prerender: false },
    // v4 redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/docs/getting-started/migration': { redirect: '/docs/getting-started/migration/v4', prerender: false },
    '/docs/getting-started/theme': { redirect: '/docs/getting-started/theme/design-system', prerender: false },
    '/docs/getting-started/integrations': { redirect: '/docs/getting-started/integrations/icons', prerender: false },
    '/docs/getting-started/ai': { redirect: '/docs/getting-started/ai/mcp', prerender: false },
    '/docs/composables': { redirect: '/docs/composables/define-shortcuts', prerender: false },
    // v4 redirects - default shadow pages
    '/docs/getting-started/installation': { redirect: '/docs/getting-started/installation/nuxt', prerender: false },
    '/docs/getting-started/integrations/icons': { redirect: '/docs/getting-started/integrations/icons/nuxt', prerender: false },
    '/docs/getting-started/integrations/color-mode': { redirect: '/docs/getting-started/integrations/color-mode/nuxt', prerender: false },
    '/docs/getting-started/integrations/i18n': { redirect: '/docs/getting-started/integrations/i18n/nuxt', prerender: false },
    // v4 redirects - renamed pages
    '/docs/getting-started/typography': { redirect: { to: '/docs/typography', statusCode: 301 }, prerender: false },
    '/docs/getting-started/icons/**': { redirect: { to: '/docs/getting-started/integrations/icons/**', statusCode: 301 }, prerender: false },
    '/docs/getting-started/fonts': { redirect: { to: '/docs/getting-started/integrations/fonts', statusCode: 301 }, prerender: false },
    '/docs/getting-started/color-mode/**': { redirect: { to: '/docs/getting-started/integrations/color-mode/**', statusCode: 301 }, prerender: false },
    '/docs/getting-started/i18n/**': { redirect: { to: '/docs/getting-started/integrations/i18n/**', statusCode: 301 }, prerender: false },
    '/docs/getting-started/content': { redirect: { to: '/docs/getting-started/integrations/content', statusCode: 301 }, prerender: false },
    // v4 redirects - renamed components
    '/docs/components/button-group': { redirect: { to: '/docs/components/field-group', statusCode: 301 }, prerender: false },
    '/docs/components/page-accordion': { redirect: { to: '/docs/components/accordion', statusCode: 301 }, prerender: false },
    '/docs/components/page-marquee': { redirect: { to: '/docs/components/marquee', statusCode: 301 }, prerender: false },
    // v4 redirects - removed pro pages
    '/pro': { redirect: { to: '/docs/getting-started', statusCode: 301 }, prerender: false },
    '/pro/pricing': { redirect: { to: '/docs/getting-started', statusCode: 301 }, prerender: false },
    '/pro/purchase': { redirect: { to: '/docs/getting-started', statusCode: 301 }, prerender: false },
    '/pro/activate': { redirect: { to: '/docs/getting-started', statusCode: 301 }, prerender: false },
    '/pro/templates': { redirect: { to: '/templates', statusCode: 301 }, prerender: false },
    '/docs/getting-started/license': { redirect: { to: '/docs/getting-started', statusCode: 301 }, prerender: false },
    '/docs/getting-started/installation/pro': { redirect: '/docs/getting-started/installation/nuxt', prerender: false },
    '/docs/getting-started/installation/pro/nuxt': { redirect: { to: '/docs/getting-started/installation/nuxt', statusCode: 301 }, prerender: false },
    '/docs/getting-started/installation/pro/vue': { redirect: { to: '/docs/getting-started/installation/vue', statusCode: 301 }, prerender: false },
    // v2 redirects
    '/getting-started/theming': { redirect: { to: '/getting-started/theme', statusCode: 301 }, prerender: false },
    '/pro/getting-started/**': { redirect: { to: '/getting-started/installation/pro/nuxt', statusCode: 301 }, prerender: false },
    '/playground': { redirect: { to: '/getting-started/installation/nuxt', statusCode: 301 }, prerender: false },
    '/pro/guide/**': { redirect: { to: '/getting-started/installation/pro/nuxt', statusCode: 301 }, prerender: false },
    '/pro/prose/**': { redirect: { to: '/getting-started/typography#vue-components', statusCode: 301 }, prerender: false },
    '/components/range': { redirect: { to: '/components/slider', statusCode: 301 }, prerender: false },
    '/components/date-picker': { redirect: { to: '/components/calendar#as-a-datepicker', statusCode: 301 }, prerender: false },
    '/components/dropdown': { redirect: { to: '/components/dropdown-menu', statusCode: 301 }, prerender: false },
    '/components/notification': { redirect: { to: '/components/toast', statusCode: 301 }, prerender: false },
    '/components/vertical-navigation': { redirect: { to: '/components/navigation-menu', statusCode: 301 }, prerender: false },
    '/components/horizontal-navigation': { redirect: { to: '/components/navigation-menu', statusCode: 301 }, prerender: false },
    '/components/divider': { redirect: { to: '/components/separator', statusCode: 301 }, prerender: false },
    '/components/toggle': { redirect: { to: '/components/switch', statusCode: 301 }, prerender: false },
    '/components/form-group': { redirect: { to: '/components/form-field', statusCode: 301 }, prerender: false },
    '/pro/components': { redirect: { to: '/components', statusCode: 301 }, prerender: false },
    '/pro/components/docs/docs-search': { redirect: { to: '/components/content-search', statusCode: 301 }, prerender: false },
    '/pro/components/docs-search': { redirect: { to: '/components/content-search', statusCode: 301 }, prerender: false },
    '/pro/components/landing-hero': { redirect: { to: '/components/page-hero', statusCode: 301 }, prerender: false },
    '/pro/components/landing-cta': { redirect: { to: '/components/page-cta', statusCode: 301 }, prerender: false },
    '/pro/components/landing-card': { redirect: { to: '/components/page-card', statusCode: 301 }, prerender: false },
    '/pro/components/landing-section': { redirect: { to: '/components/page-section', statusCode: 301 }, prerender: false },
    '/pro/components/landing-faq': { redirect: { to: '/components/accordion', statusCode: 301 }, prerender: false },
    '/pro/components/landing-grid': { redirect: { to: '/components/page-grid', statusCode: 301 }, prerender: false },
    '/pro/components/landing-logos': { redirect: { to: '/components/page-logos', statusCode: 301 }, prerender: false },
    '/pro/components/landing-testimonial': { redirect: { to: '/components/page-card#as-a-testimonial', statusCode: 301 }, prerender: false },
    '/pro/components/blog-list': { redirect: { to: '/components/blog-posts', statusCode: 301 }, prerender: false },
    '/pro/components/color-mode-toggle': { redirect: { to: '/components/color-mode-switch', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-card': { redirect: { to: '/components/page-card', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-layout': { redirect: { to: '/components/dashboard-group', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-modal': { redirect: { to: '/components/modal', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-navbar-toggle': { redirect: { to: '/components/dashboard-sidebar-toggle', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-page': { redirect: { to: '/components/dashboard-panel', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-panel-content': { redirect: { to: '/components/dashboard-panel', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-panel-handle': { redirect: { to: '/components/dashboard-resize-handle', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-section': { redirect: { to: '/components/page-card', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-sidebar-links': { redirect: { to: '/components/navigation-menu', statusCode: 301 }, prerender: false },
    '/pro/components/dashboard-slideover': { redirect: { to: '/components/slideover', statusCode: 301 }, prerender: false },
    '/pro/components/navigation-accordion': { redirect: { to: '/components/content-navigation', statusCode: 301 }, prerender: false },
    '/pro/components/navigation-links': { redirect: { to: '/components/content-navigation', statusCode: 301 }, prerender: false },
    '/pro/components/navigation-tree': { redirect: { to: '/components/content-navigation', statusCode: 301 }, prerender: false },
    '/pro/components/page-error': { redirect: { to: '/components/error', statusCode: 301 }, prerender: false },
    '/pro/components/footer-links': { redirect: { to: '/components/navigation-menu', statusCode: 301 }, prerender: false },
    '/pro/components/header-links': { redirect: { to: '/components/navigation-menu', statusCode: 301 }, prerender: false },
    '/pro/components/pricing-card': { redirect: { to: '/components/pricing-plan', statusCode: 301 }, prerender: false },
    '/pro/components/pricing-grid': { redirect: { to: '/components/pricing-plans', statusCode: 301 }, prerender: false },
    '/pro/components/pricing-switch': { redirect: { to: '/components/switch', statusCode: 301 }, prerender: false },
    '/pro/components/**': { redirect: { to: '/components/**', statusCode: 301 }, prerender: false },
    '/getting-started/shortcuts': { redirect: { to: '/composables/define-shortcuts', statusCode: 301 }, prerender: false }
  },

  experimental: {
    asyncContext: true,
    defaults: {
      nuxtLink: {
        externalRelAttribute: 'noopener'
      }
    }
  },

  compatibilityDate: '2024-07-09',

  nitro: {
    prerender: {
      routes: [
        '/docs/getting-started',
        '/api/countries.json',
        '/api/locales.json',
        '/api/module.json'
        // '/api/github/pulls.json',
        // '/api/github/releases.json'
      ],
      crawlLinks: true
    }
  },

  vite: {
    optimizeDeps: {
      // prevents reloading page when navigating between components
      include: ['@ai-sdk/vue', '@internationalized/date', '@nuxt/content/utils', '@tanstack/vue-table', '@tiptap/extension-emoji', '@tiptap/extension-text-align', '@tiptap/core', '@tiptap/extension-horizontal-rule', '@tiptap/extension-image', '@tiptap/extension-mention', '@tiptap/extension-placeholder', '@tiptap/markdown', '@tiptap/starter-kit', '@tiptap/vue-3', '@floating-ui/dom', '@tiptap/extension-drag-handle-vue-3', '@tiptap/vue-3/menus', '@tiptap/suggestion', '@tiptap/pm/state', '@vercel/analytics/nuxt', '@vercel/speed-insights/nuxt', '@vue/devtools-core', '@vue/devtools-kit', '@vueuse/integrations/useFuse', '@vueuse/shared', 'ai', 'colortranslator', 'embla-carousel-auto-height', 'embla-carousel-auto-scroll', 'embla-carousel-autoplay', 'embla-carousel-class-names', 'embla-carousel-fade', 'embla-carousel-vue', 'embla-carousel-wheel-gestures', 'json5', 'motion-v', 'ohash', 'ohash/utils', 'prettier', 'prosemirror-state', 'reka-ui', 'reka-ui/namespaced', 'scule', 'shiki', 'shiki-stream/vue', 'shiki-transformer-color-highlight', 'shiki/engine-javascript.mjs', 'tailwind-variants', 'tailwindcss/colors', 'ufo', 'vaul-vue', 'zod']
    }
  },

  componentMeta: {
    transformers: [(component, code) => {
      // Simplify ui in slot prop types: `leading(props: { ui: Button['ui'] })` -> `leading(props: { ui: object })`
      code = code.replace(/ui:[^}]+(?=\})/g, 'ui: object')

      return { component, code }
    }],
    overrides: {
      UEditor: {
        props: {
          modelValue: { name: 'modelValue', type: 'null | string | JSONContent | JSONContent[]' },
          parseOptions: { name: 'parseOptions', type: 'ParseOptions' }
        }
      },
      UEditorDragHandle: { props: { editor: { name: 'editor', type: 'Editor' } } },
      UEditorToolbar: { props: { editor: { name: 'editor', type: 'Editor' } } },
      UEditorSuggestionMenu: { props: { editor: { name: 'editor', type: 'Editor' } } },
      UEditorMentionMenu: { props: { editor: { name: 'editor', type: 'Editor' } } },
      UEditorEmojiMenu: { props: { editor: { name: 'editor', type: 'Editor' } } },
      UCalendar: {
        props: {
          defaultValue: { name: 'defaultValue', type: 'CalendarDate | CalendarDateTime | ZonedDateTime | DateRange | DateValue[]' },
          modelValue: { name: 'modelValue', type: 'null | CalendarDate | CalendarDateTime | ZonedDateTime | DateRange | DateValue[]' },
          defaultPlaceholder: { name: 'defaultPlaceholder', type: 'CalendarDate | CalendarDateTime | ZonedDateTime' },
          placeholder: { name: 'placeholder', type: 'CalendarDate | CalendarDateTime | ZonedDateTime' },
          maxValue: { name: 'maxValue', type: 'CalendarDate | CalendarDateTime | ZonedDateTime' },
          minValue: { name: 'minValue', type: 'CalendarDate | CalendarDateTime | ZonedDateTime' }
        }
      },
      UInputDate: {
        props: {
          defaultValue: { name: 'defaultValue', type: 'CalendarDate | CalendarDateTime | ZonedDateTime | DateRange' },
          modelValue: { name: 'modelValue', type: 'null | CalendarDate | CalendarDateTime | ZonedDateTime | DateRange' },
          defaultPlaceholder: { name: 'defaultPlaceholder', type: 'CalendarDate | CalendarDateTime | ZonedDateTime' },
          placeholder: { name: 'placeholder', type: 'CalendarDate | CalendarDateTime | ZonedDateTime' },
          maxValue: { name: 'maxValue', type: 'CalendarDate | CalendarDateTime | ZonedDateTime' },
          minValue: { name: 'minValue', type: 'CalendarDate | CalendarDateTime | ZonedDateTime' }
        }
      },
      UInputTime: {
        props: {
          defaultValue: { name: 'defaultValue', type: 'Time | CalendarDateTime | ZonedDateTime' },
          modelValue: { name: 'modelValue', type: 'null | Time | CalendarDateTime | ZonedDateTime' },
          defaultPlaceholder: { name: 'defaultPlaceholder', type: 'Time | CalendarDateTime | ZonedDateTime' },
          placeholder: { name: 'placeholder', type: 'Time | CalendarDateTime | ZonedDateTime' },
          maxValue: { name: 'maxValue', type: 'Time | CalendarDateTime | ZonedDateTime' },
          minValue: { name: 'minValue', type: 'Time | CalendarDateTime | ZonedDateTime' }
        }
      }
    },
    exclude: [
      '@nuxt/content',
      '@nuxt/icon',
      '@nuxt/image',
      '@nuxtjs/color-mode',
      '@nuxtjs/mdc',
      '@nuxtjs/plausible',
      'nuxt/dist',
      'nuxt-og-image',
      resolve('./app/components')
    ],
    metaFields: {
      type: false,
      props: true,
      slots: 'no-schema',
      events: 'no-schema',
      exposed: false
    }
  },

  icon: {
    customCollections: [{
      prefix: 'custom',
      dir: resolve('./app/assets/icons')
    }],
    clientBundle: {
      scan: true,
      includeCustomCollections: true
    },
    provider: 'iconify'
  },

  image: {
    format: ['webp', 'jpeg', 'jpg', 'png', 'svg'],
    provider: 'ipx'
  },

  llms: {
    domain: 'https://ui.nuxt.com',
    title: 'Nuxt UI',
    description: 'A comprehensive, Nuxt-integrated UI library providing a rich set of fully-styled, accessible and highly customizable components for building modern web applications.',
    full: {
      title: 'Nuxt UI Full Documentation',
      description: 'This is the full documentation for Nuxt UI. It includes all the Markdown files written with the MDC syntax.'
    },
    sections: [{
      title: 'Getting Started',
      contentCollection: 'docs',
      contentFilters: [
        { field: 'path', operator: 'LIKE', value: '/docs/getting-started%' }
      ]
    }, {
      title: 'Components',
      contentCollection: 'docs',
      contentFilters: [
        { field: 'path', operator: 'LIKE', value: '/docs/components/%' }
      ]
    }, {
      title: 'Composables',
      contentCollection: 'docs',
      contentFilters: [
        { field: 'path', operator: 'LIKE', value: '/docs/composables/%' }
      ]
    }],
    notes: [
      'The documentation excludes Nuxt UI v2 content.',
      'The content is automatically generated from the same source as the official documentation.'
    ]
  },
  mcp: {
    name: 'Nuxt UI',
    browserRedirect: '/docs/getting-started/ai/mcp'
  }
})
