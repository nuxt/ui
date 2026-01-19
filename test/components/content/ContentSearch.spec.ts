import { describe, it, expect } from 'vitest'
import ContentSearch from '../../../src/runtime/components/content/ContentSearch.vue'
import type { ContentSearchProps } from '../../../src/runtime/components/content/ContentSearch.vue'
import ComponentRender from '../../component-render'
import theme from '#build/ui/content/content-search'

describe('ContentSearch', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const links = [{
    label: 'Docs',
    to: '/getting-started',
    icon: 'i-lucide-square-play'
  }, {
    label: 'Components',
    icon: 'i-lucide-square-code',
    to: '/components'
  }, {
    label: 'Templates',
    icon: 'i-lucide-monitor',
    to: '/templates'
  }, {
    label: 'Showcase',
    icon: 'i-lucide-presentation',
    to: '/showcase'
  }]

  const navigation = [{
    title: 'Getting Started',
    path: '/getting-started',
    stem: '1.getting-started/1.index',
    children: [{
      title: 'Introduction',
      path: '/getting-started',
      stem: '1.getting-started/1.index',
      icon: 'i-lucide-house'
    }, {
      title: 'Installation',
      path: '/getting-started/installation',
      stem: '1.getting-started/2.installation',
      icon: 'i-lucide-square-play'
    }, {
      title: 'Theme',
      path: '/getting-started/theme',
      stem: '1.getting-started/3.theme',
      icon: 'i-lucide-swatch-book'
    }]
  }]

  const files = [{
    id: '/getting-started',
    title: 'Introduction',
    titles: [],
    content: 'Nuxt UI harnesses the combined strengths of Reka UI, Tailwind CSS, and Tailwind Variants to offer developers an unparalleled set of tools for creating sophisticated, accessible, and highly performant user interfaces.',
    level: 1
  }, {
    id: '/getting-started#reka-ui',
    title: 'Reka UI',
    titles: [
      'Introduction'
    ],
    content: 'We\'ve transitioned from Headless UI to Reka UI as our core component foundation. This shift brings several key advantages: Extensive Component Library: With 55+ primitives, Reka UI significantly expands our component offerings.Active Development: Reka UI\'s growing popularity ensures ongoing improvements and updates.Enhanced Accessibility: Built-in accessibility features align with our commitment to inclusive design.Vue 3 Optimization: Seamless integration with Vue 3 and the Composition API. This transition empowers Nuxt UI to become a more comprehensive and flexible UI library, offering developers greater power and customization options.',
    level: 2
  }, {
    id: '/getting-started#tailwind-css',
    title: 'Tailwind CSS',
    titles: [
      'Introduction'
    ],
    content: 'Nuxt UI integrates the latest Tailwind CSS, bringing significant improvements: Built for performance: Full builds in the new engine are up to 5x faster, and incremental builds are over 100x faster — and measured in microseconds.Unified toolchain: Built-in import handling, vendor prefixing, and syntax transforms, with no additional tooling required.CSS-first configuration: A reimagined developer experience where you customize and extend the framework directly in CSS instead of a JavaScript configuration file.Designed for the modern web: Built on native cascade layers, wide-gamut colors, and including first-class support for modern CSS features like container queries, @starting-style, popovers, and more. Learn about all the breaking changes in Tailwind CSS.',
    level: 2
  }, {
    id: '/getting-started#tailwind-variants',
    title: 'Tailwind Variants',
    titles: [
      'Introduction'
    ],
    content: 'We\'ve adopted Tailwind Variants to manage our design system, offering: Dynamic Styling: Flexible component variants with a powerful APIType Safety: Full TypeScript support with auto-completionConflict Resolution: Efficient merging of conflicting styles This integration unifies the styling of components, ensuring consistency and code maintainability.',
    level: 2
  }, {
    id: '/getting-started#typescript-integration',
    title: 'TypeScript Integration',
    titles: [
      'Introduction'
    ],
    content: 'Nuxt UI offers significantly improved TypeScript integration, providing a superior developer experience: Enhanced Auto-completion:Full auto-completion for component props based on your themeIntelligent suggestions for app.config.ts theme configurationGeneric-based Components:Built using Vue 3 GenericsImproved type inference for slots and eventsType-safe Theming:Leveraging Tailwind Variants for type-safe styling optionsCustomizable types for extended theme configurations Check out an example of the Accordion component with auto-completion for props and slots.',
    level: 2
  }, {
    id: '/getting-started#vue-compatibility',
    title: 'Vue compatibility',
    titles: [
      'Introduction'
    ],
    content: 'You can now use Nuxt UI in any Vue project without Nuxt by adding the Vite and Vue plugins to your configuration. This provides: Auto-imports: Components and composables are automatically imported and available globallyTheming System: Full theming support with customizable colors, sizes, variants and moreDeveloper Experience: Complete TypeScript support with IntelliSense and auto-completion Learn how to install and configure Nuxt UI in a Vue project in the Vue installation guide.',
    level: 2
  }, {
    id: '/getting-started#nuxt-devtools-integration',
    title: 'Nuxt DevTools Integration',
    titles: [
      'Introduction'
    ],
    content: 'You can play with Nuxt UI components as well as your app components directly from Nuxt Devtools with the compodium module, providing a powerful development experience: Component Inspector: Inspect and analyze Nuxt UI components in real-timeLive Preview: Modify component props and see changes instantlyCode Generation: Get the corresponding code for your component configurations Install the module to your Nuxt application with one command:npx nuxt module add compodium',
    level: 2
  }, {
    id: '/getting-started#migration',
    title: 'Migration',
    titles: [
      'Introduction'
    ],
    content: 'We want to be transparent: migrating from Nuxt UI v2 to v3 will require significant effort. While we\'ve maintained core concepts and components, Nuxt UI v3 has been rebuilt from the ground up, resulting in a new library with enhanced capabilities. Key points to consider: Read our migration guide to upgrade your project from v2 to v3.Review the new documentation and components carefully before attempting to upgrade.If you encounter any issues, please report them on our GitHub repository.',
    level: 2
  }, {
    id: '/getting-started#faq',
    title: 'FAQ',
    titles: [
      'Introduction'
    ],
    content: 'Nuxt UI is now compatible with Vue! You can follow the installation guide to get started.Nuxt UI is currently designed to work exclusively with Tailwind CSS. While there\'s interest in UnoCSS support, implementing it would require significant changes to the theme structure due to differences in class naming conventions. As a result, we don\'t have plans to add UnoCSS support.Nuxt UI enhances accessibility through Reka UI integration. This provides automatic ARIA attributes, keyboard navigation support, intelligent focus management, and screen reader announcements. While offering a strong foundation, proper implementation and testing in your specific use case remains crucial for full accessibility compliance. For more detailed information, refer to Reka UI\'s accessibility documentation.Nuxt UI ensures reliability with 1000+ Vitest tests, covering core functionality and accessibility. This robust testing suite supports the library\'s stability and serves as a reference for developers. We\'re excited about the possibilities Nuxt UI v3 brings to your projects. Explore our documentation to learn more about new features, components, and best practices for building powerful, accessible user interfaces. html pre.shiki code .sBMFI, html code.shiki .sBMFI{--shiki-light:#E2931D;--shiki-default:#FFCB6B;--shiki-dark:#FFCB6B}html pre.shiki code .sfazB, html code.shiki .sfazB{--shiki-light:#91B859;--shiki-default:#C3E88D;--shiki-dark:#C3E88D}html .light .shiki span {color: var(--shiki-light);background: var(--shiki-light-bg);font-style: var(--shiki-light-font-style);font-weight: var(--shiki-light-font-weight);text-decoration: var(--shiki-light-text-decoration);}html.light .shiki span {color: var(--shiki-light);background: var(--shiki-light-bg);font-style: var(--shiki-light-font-style);font-weight: var(--shiki-light-font-weight);text-decoration: var(--shiki-light-text-decoration);}html .default .shiki span {color: var(--shiki-default);background: var(--shiki-default-bg);font-style: var(--shiki-default-font-style);font-weight: var(--shiki-default-font-weight);text-decoration: var(--shiki-default-text-decoration);}html .shiki span {color: var(--shiki-default);background: var(--shiki-default-bg);font-style: var(--shiki-default-font-style);font-weight: var(--shiki-default-font-weight);text-decoration: var(--shiki-default-text-decoration);}html .dark .shiki span {color: var(--shiki-dark);background: var(--shiki-dark-bg);font-style: var(--shiki-dark-font-style);font-weight: var(--shiki-dark-font-weight);text-decoration: var(--shiki-dark-text-decoration);}html.dark .shiki span {color: var(--shiki-dark);background: var(--shiki-dark-bg);font-style: var(--shiki-dark-font-style);font-weight: var(--shiki-dark-font-weight);text-decoration: var(--shiki-dark-text-decoration);}',
    level: 2
  }]

  const props = { links, navigation, files, open: true, portal: false }

  it.each([
    // Props
    ['with links', { props }],
    ['with icon', { props: { ...props, icon: 'i-lucide-home' } }],
    ['with placeholder', { props: { ...props, placeholder: 'Search' } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loadingIcon', { props: { ...props, loading: true, loadingIcon: 'i-lucide-loading' } }],
    ['without colorMode', { props: { ...props, colorMode: false } }],
    ['with fullscreen', { props: { ...props, fullscreen: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with ui', { props: { ...props, ui: { input: '[&>input]:text-lg' } } }],
    ['with class', { props: { ...props, class: 'sm:max-w-5xl' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ContentSearchProps }) => {
    const html = await ComponentRender(nameOrHtml, options, ContentSearch)
    expect(html).toMatchSnapshot()
  })
})
