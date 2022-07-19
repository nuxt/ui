import { defineTheme } from '@nuxt-themes/config'

export default defineTheme({
  title: '@nuxthq/ui',
  description: 'Toolkit for authoring Nuxt Themes.',
  url: 'https://nuxt-themes.netlify.app',
  debug: false,
  socials: {
    twitter: '@nuxt_js',
    github: 'nuxtlabs/ui'
  },
  github: {
    root: 'docs/content',
    edit: true,
    releases: true
  },
  aside: {
    level: 0
  },
  header: {
    title: '@nuxthq/ui',
    logo: false
  },
  footer: {
    credits: {
      icon: 'IconDocus',
      text: 'Powered by Docus',
      href: 'https://docus.com'
    },
    icons: [
      {
        label: 'NuxtJS',
        href: 'https://nuxtjs.org',
        component: 'IconNuxt'
      },
      {
        label: 'Vue Telescope',
        href: 'https://vuetelescope.com',
        component: 'IconVueTelescope'
      }
    ]
  }
})
