import { createResolver } from '@nuxt/kit'
import pkg from '../package.json'
import yaml from '@rollup/plugin-yaml'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: [
    process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs') : process.env.NUXT_GITHUB_TOKEN && ['github:nuxt/ui-pro/docs#v3', { giget: { auth: process.env.NUXT_GITHUB_TOKEN } }]
  ],

  modules: [
    '../src/module',
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxthub/core',
    '@nuxtjs/plausible',
    '@vueuse/nuxt',
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
    head: {
      // LemonSqueezy affiliate
      script: [{
        key: 'lmsqueezy-config',
        innerHTML: 'window.lemonSqueezyAffiliateConfig = { store: "nuxt" };'
      }, {
        key: 'lmsqueezy',
        src: 'https://lmsqueezy.com/affiliate.js',
        defer: true
      }]
    },
    rootAttrs: {
      'data-vaul-drawer-wrapper': '',
      'class': 'bg-(--ui-bg)'
    }
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'ts', 'typescript', 'diff', 'vue', 'json', 'yml', 'css', 'mdc']
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
    '/getting-started/installation': { redirect: '/getting-started/installation/nuxt', prerender: false },
    '/getting-started/installation/pro': { redirect: '/getting-started/installation/pro/nuxt', prerender: false },
    '/getting-started/icons': { redirect: '/getting-started/icons/nuxt', prerender: false },
    '/getting-started/color-mode': { redirect: '/getting-started/color-mode/nuxt', prerender: false },
    '/getting-started/i18n': { redirect: '/getting-started/i18n/nuxt', prerender: false },
    '/composables': { redirect: '/composables/define-shortcuts', prerender: false },
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
    '/pro/components/landing-faq': { redirect: { to: '/components/page-accordion', statusCode: 301 }, prerender: false },
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
    '/getting-started/shortcuts': { redirect: { to: '/composables/define-shortcuts', statusCode: 301 }, prerender: false },
    '/releases': { redirect: 'https://github.com/nuxt/ui/releases', prerender: false }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-09',

  nitro: {
    prerender: {
      routes: [
        '/getting-started',
        '/api/countries.json',
        '/api/locales.json',
        // '/api/releases.json',
        // '/api/pulls.json'
        '/404.html'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: [
            '/components/*',
            '/getting-started/*',
            '/composables/*'
          ]
        }
      }
    }
  },

  vite: {
    plugins: [
      yaml()
    ],
    server: {
      fs: {
        allow: process.env.NUXT_UI_PRO_PATH ? [resolve(process.env.NUXT_UI_PRO_PATH)] : undefined
      }
    },
    optimizeDeps: {
      // prevents reloading page when navigating between components
      include: ['@internationalized/date', '@vueuse/shared', '@vueuse/integrations/useFuse', '@tanstack/vue-table', 'reka-ui', 'reka-ui/namespaced', 'embla-carousel-vue', 'embla-carousel-autoplay', 'embla-carousel-auto-scroll', 'embla-carousel-auto-height', 'embla-carousel-class-names', 'embla-carousel-fade', 'embla-carousel-wheel-gestures', 'colortranslator', 'tailwindcss/colors', 'tailwind-variants', 'ufo', 'zod', 'vaul-vue', 'scule', 'motion-v', 'json5', 'ohash', 'shiki-transformer-color-highlight']
    }
  },

  componentMeta: {
    exclude: [
      '@nuxt/content',
      '@nuxt/icon',
      '@nuxt/image',
      '@nuxtjs/color-mode',
      '@nuxtjs/mdc',
      '@nuxtjs/plausible',
      'nuxt/dist',
      'nuxt-og-image',
      resolve('./app/components'),
      process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs', 'app', 'components') : '.c12'
    ],
    metaFields: {
      type: false,
      props: true,
      slots: true,
      events: true,
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
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'content',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' }
        ]
      },
      {
        title: 'Components',
        contentCollection: 'content',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/components/%' }
        ]
      },
      {
        title: 'Composables',
        contentCollection: 'content',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/composables/%' }
        ]
      }
    ],
    notes: [
      'The documentation excludes Nuxt UI v2 content.',
      'The content is automatically generated from the same source as the official documentation.'
    ]
  },

  uiPro: {
    license: 'oss'
  }
})
