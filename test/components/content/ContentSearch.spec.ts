import { describe, it, expect } from 'vitest'
import ContentSearch from '../../../src/runtime/components/content/ContentSearch.vue'
import type { ContentSearchProps } from '../../../src/runtime/components/content/ContentSearch.vue'
import ComponentRender from '../../component-render'

describe('ContentSearch', () => {
  const links = [{
    label: 'Docs',
    to: '/pro/getting-started',
    icon: 'i-lucide-book-open'
  }, {
    label: 'Pricing',
    icon: 'i-lucide-credit-card',
    to: '/pro/pricing'
  }, {
    label: 'Templates',
    icon: 'i-lucide-monitor',
    to: '/pro/templates'
  }, {
    label: 'Activate',
    icon: 'i-lucide-activity',
    to: '/pro/activate'
  }]

  const navigation = [{
    title: 'Getting Started',
    path: '/pro/getting-started',
    children: [{
      title: 'Introduction',
      path: '/pro/getting-started'
    }, {
      title: 'Installation',
      path: '/pro/getting-started/installation'
    }, {
      title: 'Theming',
      path: '/pro/getting-started/theming'
    }, {
      title: 'Structure',
      path: '/pro/getting-started/structure'
    }, {
      title: 'Content',
      path: '/pro/getting-started/content'
    }]
  }]

  const files = [{
    id: '/pro/getting-started',
    title: 'Nuxt UI Pro',
    titles: [],
    content: 'Nuxt UI Pro is a collection of Vue components, composables and utils built on top of Nuxt UI , oriented on structure and layout and designed to be used as building blocks for your app .It includes ready to use templates: Dashboard , SaaS , Docs and Landing .Nuxt UI Pro is already used in production on many apps so we\'re confident that it will help you build your app faster and better, with 10x less code.While Nuxt UI is free and open source, Pro is a premium product that helps sustain Nuxt OSS development.',
    level: 1
  }, {
    id: '/pro/getting-started#templates',
    title: 'Templates',
    titles: [],
    content: 'You can get started with our minimal starter , one of our official templates or follow the Installation guide to install Nuxt UI Pro in your existing project.A dashboard with multi-column layout. A template with landing, pricing, docs and blog. A documentation with @nuxt/content . A landing page you can use as starting point.You can use the Use this template button on GitHub to create a new repository or use the CLI:Explore the community templates on GitHub. nuxi init supports any GitHub repository.',
    level: 2
  }, {
    id: '/pro/getting-started#components',
    title: 'Components',
    titles: [],
    content: 'Nuxt UI Pro is a collection of 50+ components that can be used in various ways. This section will help you understand how the components are organized and where to use them. Feel free to dive into each component\'s documentation for examples and API documentation.It does not inject any pages or layouts , you have to create them yourself. This provides more flexibility and allows you to build your app the way you want.The code examples on this page are simplified for the sake of clarity and demonstrates only the structure.',
    level: 2
  }, {
    id: '/pro/getting-started#layout',
    title: 'Layout',
    titles: [
      'Components'
    ],
    content: 'Let\'s start with the layout components, they are used to create the structure of your app with a Header , Main and Footer . Most of the time, you will use those in your app.vue :',
    level: 3
  }, {
    id: '/pro/getting-started#landing',
    title: 'Landing',
    titles: [
      'Components'
    ],
    content: 'When building a landing page or any marketing page, you will most likely need a LandingHero and some LandingSection to define the structure.The ULandingSection component is enough in most cases with a title , a description , some links and features and an image in the default slot for example with its align prop set to left , center or right .But sometimes, you might want to add some LandingLogos , a LandingGrid with some LandingCard , some LandingTestimonial , a LandingCTA or even a LandingFAQ :Take a look at the Landing template to see what you can do!',
    level: 3
  }, {
    id: '/pro/getting-started#pricing',
    title: 'Pricing',
    titles: [
      'Components'
    ],
    content: 'When building pricing pages, you will most likely need some PricingCard inside a PricingGrid to display your plans and maybe a PricingToggle to switch between monthly and yearly plans:',
    level: 3
  }, {
    id: '/pro/getting-started#blog',
    title: 'Blog',
    titles: [
      'Components'
    ],
    content: 'When building a blog, you will most likely need a BlogList and some BlogPost to display your articles:',
    level: 3
  }, {
    id: '/pro/getting-started#page',
    title: 'Page',
    titles: [
      'Components'
    ],
    content: 'This category contains components to build the structure of your pages. For example, the Page component will create a grid of 10 columns with a 2 columns left and/or right slots. You will also find a PageHero , a PageHeader and a PageBody with prose support.You might also want to add a PageGrid or a PageColumns with some PageCard or add some PageLinks to display a list of links next to your content.And if you need to display an error page, you can use the PageError component:',
    level: 3
  }, {
    id: '/pro/getting-started#aside',
    title: 'Aside',
    titles: [
      'Components'
    ],
    content: 'When you need to display a sticky sidebar, you can use the Aside component inside the left or right slot of the Page component:',
    level: 3
  }, {
    id: '/pro/getting-started#navigation',
    title: 'Navigation',
    titles: [
      'Components'
    ],
    content: 'When you need to display a list of links in a sidebar, you can use the NavigationTree component inside the default slot of the Aside component:',
    level: 3
  }, {
    id: '/pro/getting-started#auth',
    title: 'Auth',
    titles: [
      'Components'
    ],
    content: 'The only component in this category is the AuthForm , you can use it to build your login, register, forgot password and reset password pages.Take a look at the SaaS template to see an example of all those components!',
    level: 3
  }, {
    id: '/pro/getting-started#dashboard',
    title: 'Dashboard',
    titles: [
      'Components'
    ],
    content: 'This category contains 15+ components to build your own dashboard, designed specifically to create a consistent look and feel.Wrap your layout with the DashboardLayout component and your pages with the DashboardPage component. Use the DashboardPanel component to create a multi-column layout with some DashboardNavbar , DashboardToolbar , DashboardSidebar inside, the responsive will be handled automatically.Take a look at the Dashboard template to see what you can do!',
    level: 3
  }, {
    id: '/pro/getting-started#content',
    title: 'Content',
    titles: [
      'Components'
    ],
    content: 'As mentioned in the Content guide, if you choose to go with @nuxt/content to build your app, @nuxt/ui-pro will provide you with a set of fully-compatible components like the ContentSearch , ContentToc and ContentSurround components.You\'ll also find some Prose components to use in your .md files using the MDC syntax like the Callout , Card , CodeGroup , Tabs , etc. You can find the full list in the Prose category.Take a look at the Docs template to see what you can do!',
    level: 3
  }, {
    id: '/pro/getting-started#color-mode',
    title: 'Color Mode',
    titles: [
      'Components'
    ],
    content: 'The color mode category contains components to switch between light and dark mode in different ways such as ColorModeButton , ColorModeToggle and ColorModeSelect .Those components will be automatically hidden if you\'ve forced the color mode in your page with:There are also components to easily display an avatar or image with a different src for light and dark mode such as ColorModeAvatar and ColorModeImage .',
    level: 3
  }, {
    id: '/pro/getting-started/installation#setup',
    title: 'Setup',
    titles: [],
    content: '',
    level: 2
  }, {
    id: '/pro/getting-started/installation',
    title: 'Installation',
    titles: [],
    content: 'Add @nuxt/ui-pro dependency to your project:No need to install @nuxt/ui yourself as it\'s already a dependency of @nuxt/ui-pro .Extend @nuxt/ui-pro layer and register @nuxt/ui module in your nuxt.config :Start your development server, you should now be able to use all the components, composables and utils from Nuxt UI Pro 🚀',
    level: 1
  }, {
    id: '/pro/getting-started/installation#license',
    title: 'License',
    titles: [],
    content: 'Nuxt UI Pro is free in development, but you need a license to use it in production. You can choose between Solo and Team , both will give you access to the same features and give you a license key required to build your apps. The main difference is the number of developers that can be invited to the private GitHub repository.Purchase a license for Nuxt UI Pro.Once purchased, you will receive an email with a license key to activate. Visit https://ui.nuxt.com/pro/activate to activate your license with your GitHub username and license key, you will be invited to the private GitHub repository.Then, use your license key in your .env file:If you have multiple projects on your machine, you can also add it to your ~/.nuxtrc :',
    level: 2
  }, {
    id: '/pro/getting-started/installation#typescript',
    title: 'TypeScript',
    titles: [],
    content: 'This Nuxt layer is written in TypeScript and provides typings for all its components and composables.You can first read the TypeScript section of Nuxt UI.Like Nuxt UI, you can import the Nuxt UI Pro types from #ui-pro/types , it can be useful when defining wrapper components:',
    level: 2
  }, {
    id: '/pro/getting-started/installation#edge',
    title: 'Edge',
    titles: [],
    content: 'To use the latest updates pushed on the dev branch, you can use @nuxt/ui-pro-edge .Update your package.json to the following:Then run pnpm install , yarn install or npm install .',
    level: 2
  }, {
    id: '/pro/getting-started/theming',
    title: 'Theming',
    titles: [],
    content: 'As Nuxt UI Pro is built on top of Nuxt UI, you should check out the Nuxt UI Theming page first. This is where you\'ll learn how to choose the primary and gray colors or the icons collections to use for example.',
    level: 1
  }, {
    id: '/pro/getting-started/theming#components',
    title: 'Components',
    titles: [],
    content: 'Like in Nuxt UI, every component is prefixed with a U to avoid conflicts with other components. For example, the Header component is named UHeader .You can customize components the same way as @nuxt/ui , through the App Config or ui prop , both of which are smartly merged thanks to tailwind-merge . In the same way, when using the class prop on any component, it will also automatically be merged with the wrapper .For example, if you use the LandingGrid component which has this config:If you use a class as such: < ULandingGrid class = " lg:grid-cols-10 " /> , it will be merged with the wrapper class and the grid will have 10 columns instead of 12.You can achieve the same thing using the app.config.ts in the ui object:',
    level: 2
  }, {
    id: '/pro/getting-started/theming#variables',
    title: 'Variables',
    titles: [],
    content: 'A new variables key is available in the ui object to override some variables used in Nuxt UI Pro. By default, the following variables are used:The background and foreground variables are transformed into colors and used in some components. They are also automatically applied to the body element so you don\'t have to:The header.height variable is used to set the height of the Header component. Some other components like Aside , Main , ContentToc , etc. also use it to position themselves accordingly.New variables might be added in the future! Feel free to submit an issue if you feel like something is missing.',
    level: 2
  }, {
    id: '/pro/getting-started/theming#icons',
    title: 'Icons',
    titles: [],
    content: 'A new icons key is available in the ui object to override some icons used in Nuxt UI Pro. By default, the following icons are used:Those are only shortcuts, you can still override them specifically:Note that those shortcuts are used for icons that are repeated across components, like the dark and light icons used in ColorModeButton , ColorModeToggle and ContentSearch components for example. Other icons like the ui.header.button shown above need to be overridden specifically.Take a look at nuxt.com app.config.ts to see how to override all the icons.',
    level: 2
  }, {
    id: '/pro/getting-started/structure',
    title: 'Structure',
    titles: [],
    content: 'We\'ll only provide examples for the most common use cases, but keep in mind that you can do whatever you want. Let\'s start by configuring our app, then we\'ll see how to build a simple landing page and then how to integrate with the @nuxt/content module.',
    level: 1
  }, {
    id: '/pro/getting-started/structure#nuxtconfigts',
    title: 'nuxt.config.ts',
    titles: [],
    content: 'If you\'ve followed the installation guide , you should already have a nuxt.config.ts file with the @nuxt/ui-pro layer and the @nuxt/ui module registered. We\'ll also configure @nuxt/ui module with some icons collections and take advantage of @nuxt/fonts to choose our font.You can use any icon (100,000+) from Iconify , learn more in the Theming documentation.',
    level: 2
  }, {
    id: '/pro/getting-started/structure#appconfigts',
    title: 'app.config.ts',
    titles: [],
    content: 'We\'ll now create an app.config.ts file to configure the primary and gray colors. We\'ll also change the header height, default background and override some icons.Like in Nuxt UI, you\'ll configure components through the ui prop. The key to override a component will be its path, for example ui.landing.hero will override the LandingHero component. The only difference with Nuxt UI is that the config lives inside each component instead of a global ui.config.ts file.You can use any color from Tailwind CSS , learn more in the Theming documentation.',
    level: 2
  }, {
    id: '/pro/getting-started/structure#tailwindconfigts',
    title: 'tailwind.config.ts',
    titles: [],
    content: 'Let\'s say we want to override the green color to use the one from Nuxt, we can create a tailwind.config.ts file to do so. Like any other app using Tailwind CSS, you can override any Tailwind config here. We\'ll also override the fontFamily to use DM Sans as our default font.',
    level: 2
  }, {
    id: '/pro/getting-started/structure#appvue',
    title: 'app.vue',
    titles: [],
    content: 'Let\'s add an app.vue file which will be the root component of our app. We can use the Header , Main and Footer components to build the layout of our app.This example is quite long but demonstrates some props and slots available to customize your app.',
    level: 2
  }, {
    id: '/pro/getting-started/structure#pagesindexvue',
    title: 'pages/index.vue',
    titles: [],
    content: 'Now, we can create our first page. We\'ll use the LandingHero and LandingSection components to build a simple landing page.This is a very simple example as it\'s way easier to demonstrate with @nuxt/content rather than hard-coding the content.',
    level: 2
  }, {
    id: '/pro/getting-started/content',
    title: 'Nuxt Content',
    titles: [],
    content: 'When building a landing page, a documentation, a blog or even a changelog you will need to manage content. You can do it manually by creating a new page for each content, fetch it from a CMS, store in your own database, etc. or use the @nuxt/content module to manage your content with Git.Take a look at Nuxt Studio , the Pro version of @nuxt/content which is fully compatible with @nuxt/ui-pro .',
    level: 1
  }, {
    id: '/pro/getting-started/content#installation',
    title: 'Installation',
    titles: [],
    content: 'To get started, you can follow the official guide or in summary:Then add the module to your nuxt.config.ts :You need to register @nuxt/content before @nuxt/ui otherwise Tailwind CSS classes won\'t be parsed in your .md and .yml files.Now that @nuxt/content module is installed, the layer will automatically configure the syntax highlight theme with material-theme and preload some languages so you don\'t have to.',
    level: 2
  }, {
    id: '/pro/getting-started/content#components',
    title: 'Components',
    titles: [],
    content: 'You might be using @nuxt/content to build a documentation. To help you with that, we\'ve built some components that you can use in your pages:a full-text search command palette out of the box with the ContentSearch component. No need to setup Algolia DocSearch anymore. a sticky Table of Contents with the ContentToc component a prev / next navigation with the ContentSurround component',
    level: 2
  }, {
    id: '/pro/getting-started/content#typography',
    title: 'Typography',
    titles: [],
    content: 'To make the most out of @nuxt/content , we use the @tailwindcss/typography plugin to style your content. The defaults of the plugin have been overriden to use the primary and gray colors from your App Config alongside many other customizations so it matches the design system of Nuxt UI.You will be able to wrap your < ContentSlot /> or < ContentRenderer /> with the PageBody component and its prose class to apply the prose prose-primary dark:prose-invert max-w-none classes automatically to your content and make it look great.To help you when writing content, we\'ve also added some components to use in your .md files using the MDC syntax like a Callout , Card , CodeGroup , Tabs , etc.',
    level: 2
  }, {
    id: '/pro/getting-started/content#utils',
    title: 'Utils',
    titles: [],
    content: 'Some utils will be auto-imported to make the bridge between @nuxt/content and @nuxt/ui-pro :',
    level: 2
  }, {
    id: '/pro/getting-started/content#mapcontentnavigation',
    title: 'mapContentNavigation',
    titles: [
      'Utils'
    ],
    content: 'This util will map the navigation from fetchContentNavigation that you\'ll usually fetch in your app.vue file and transform it recursively into an array of objects expected by components like NavigationTree .',
    level: 3
  }, {
    id: '/pro/getting-started/content#findpageheadline',
    title: 'findPageHeadline',
    titles: [
      'Utils'
    ],
    content: 'This util will allow you to bind an headline in the PageHeader based on the page _dir .',
    level: 3
  }, {
    id: '/pro/getting-started/content#findpagebreadcrumb',
    title: 'findPageBreadcrumb',
    titles: [
      'Utils'
    ],
    content: 'This util will recursively find the breadcrumb of a page based on the navigation so you can use it in the PageHeader #headline slot.You should have all the informations to start building your app with @nuxt/ui-pro , you can now explore all the available components 🚀',
    level: 3
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
    ['with ui', { props: { ...props, ui: { input: '[&>input]:text-lg' } } }],
    ['with class', { props: { ...props, class: 'sm:max-w-5xl' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ContentSearchProps }) => {
    const html = await ComponentRender(nameOrHtml, options, ContentSearch)
    expect(html).toMatchSnapshot()
  })
})
