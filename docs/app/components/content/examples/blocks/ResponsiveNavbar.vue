<script setup lang="ts">
const scrollY = ref(0)
const windowHeight = ref(0)

const scrollPercent = computed(() => {
  if (windowHeight.value === 0) return 0
  return Math.min(scrollY.value / (windowHeight.value * 0.3), 1)
})

const updateScroll = () => {
  scrollY.value = window.scrollY
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  updateScroll()
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('resize', updateScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('resize', updateScroll)
})

const items = [
  {
    label: 'Blog',
    to: '#'
  },
  {
    label: 'Features',
    slot: 'features',
    children: [
      {
        label: 'Components',
        description: 'Ready-to-use Vue components',
        icon: 'i-lucide-component',
        to: '#'
      },
      {
        label: 'Templates',
        description: 'Beautiful page templates',
        icon: 'i-lucide-layout-template',
        to: '#'
      },
      {
        label: 'Roadmap',
        icon: 'i-lucide-map',
        description: 'See what\'s coming next',
        to: '#'
      }
    ]
  },
  {
    label: 'Docs',
    to: '#',
    children: [
      {
        label: 'Getting Started',
        icon: 'i-lucide-book-open',
        description: 'Learn how to use Nuxt UI',
        to: '#'
      },
      {
        label: 'Installation',
        icon: 'i-lucide-download',
        description: 'Install Nuxt UI in your project',
        to: '#'
      },
      {
        label: 'Components',
        icon: 'i-lucide-layers',
        description: 'Explore all available components',
        to: '#'
      },
      {
        label: 'Theming',
        icon: 'i-lucide-palette',
        description: 'Customize your design system',
        to: '#'
      }
    ]
  },
  {
    label: 'Community',
    children: [
      {
        label: 'About',
        icon: 'i-lucide-users',
        description: 'Meet the team behind Nuxt UI',
        to: '#'
      },
      {
        label: 'Brand',
        icon: 'i-lucide-image',
        description: 'Assets and guidelines',
        to: '#'
      },
      {
        label: 'Contact',
        icon: 'i-lucide-mail',
        description: 'Get in touch with us',
        to: '#'
      }
    ]
  }
]

const headerUi = computed(() => ({
  root: [
    '@container h-fit fixed mt-2 px-0 rounded-xl py-2 transition-all duration-500 left-1/2 -translate-x-1/2',
    scrollPercent.value > 0.02 ? 'bg-default/80 backdrop-blur-lg' : 'bg-transparent backdrop-blur-none',
    scrollPercent.value > 0.02 ? 'border border-default' : 'border border-transparent',
    scrollPercent.value > 0.005 ? 'w-[90%] sm:w-[65%]' : 'w-[95%] sm:w-[70%]'
  ].join(' '),
  container: '',
  center: '@min-[620px]:flex',
  toggle: '@min-[620px]:hidden',
  body: 'py-0'
}))

const navigationUi = computed(() => ({
  item: 'py-0',
  linkTrailingIcon: 'hidden',
  viewport: 'bg-default rounded-lg',
  viewportWrapper: 'w-[600px] transition-all duration-500 left-1/2 -translate-x-1/2'
}))
</script>

<template>
  <div class="relative">
    <div class="z-99 flex justify-center w-full">
      <UHeader mode="drawer" :ui="headerUi">
        <template #left>
          <Logo class="w-auto h-5 shrink-0" />
        </template>

        <UNavigationMenu variant="link" color="neutral" :items="items" :ui="navigationUi">
          <template #features-content="{ item }">
            <div class="flex flex-row p-2 gap-2">
              <div class="flex-1">
                <UCard class="h-full rounded-sm p-6 bg-elevated/50" />
              </div>
              <ul class="flex-1 flex-col gap-1">
                <li v-for="child in item.children" :key="child.label">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    class="text-sm w-full text-left justify-start p-3 h-auto"
                  >
                    <template #leading>
                      <UIcon :name="child.icon" class="w-4 h-4" />
                    </template>
                    <div class="text-left">
                      <p class="font-medium text-highlighted">
                        {{ child.label }}
                      </p>
                      <p class="text-muted text-xs line-clamp-2">
                        {{ child.description }}
                      </p>
                    </div>
                  </UButton>
                </li>
              </ul>
            </div>
          </template>
        </UNavigationMenu>

        <template #right>
          <div class="flex items-center gap-2">
            <UButton size="xs" label="Open App" />
          </div>
        </template>

        <template #body>
          <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
        </template>
      </UHeader>
    </div>

    <UPageHero
      headline="Build faster"
      title="Welcome to Nuxt UI"
      description="Build beautiful, responsive applications with our comprehensive component library. Built by developers, for developers."
      :links="[
        {
          label: 'Get Started',
          size: 'xl',
          color: 'primary'
        },
        {
          label: 'View Docs',
          variant: 'outline',
          size: 'xl'
        }
      ]"
    />

    <UPageSection
      headline="Features"
      title="Everything you need to build modern web applications"
      description="Nuxt UI provides a comprehensive set of components and utilities to help you build beautiful, responsive applications."
      :features="[
        {
          title: 'Ready-to-use Components',
          description: 'Over 50+ components built with accessibility and performance in mind.',
          icon: 'i-lucide-component'
        },
        {
          title: 'Built-in Dark Mode',
          description: 'Seamless dark mode support with automatic color scheme detection.',
          icon: 'i-lucide-moon'
        },
        {
          title: 'Fully Customizable',
          description: 'Tailwind CSS classes and design tokens for complete customization.',
          icon: 'i-lucide-palette'
        },
        {
          title: 'TypeScript Support',
          description: 'Full TypeScript support with comprehensive type definitions.',
          icon: 'i-lucide-code'
        },
        {
          title: 'Accessible by Default',
          description: 'Built with accessibility in mind, WCAG 2.1 compliant components.',
          icon: 'i-lucide-accessibility'
        },
        {
          title: 'Developer Experience',
          description: 'Great DX with auto-imports, IntelliSense, and hot reload.',
          icon: 'i-lucide-zap'
        }
      ]"
    />

    <UPageHero
      title="Ready to get started?"
      description="Join thousands of developers already building with Nuxt UI."
      :links="[
        {
          label: 'Start Building',
          size: 'xl',
          color: 'primary'
        }
      ]"
    />
  </div>
</template>
