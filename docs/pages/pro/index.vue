<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="relative">
    <ULandingHero v-bind="page.hero" align="center">
      <template #top>
        <ProHeroBackground />
      </template>

      <template #title>
        <span v-html="page.hero?.title" />
      </template>

      <template #description>
        <span v-html="page.hero?.description" />
      </template>
    </ULandingHero>

    <ULandingSection id="features" v-bind="page.features" align="left">
      <MDC
        :value="page.features.code"
        tag="pre"
        class="prose prose-primary dark:prose-invert max-w-none"
        :parser-options="{
          highlight: {
            theme: {
              light: 'material-theme-lighter',
              default: 'material-theme',
              dark: 'material-theme-palenight'
            }
          }
        }"
      />
    </ULandingSection>

    <div :style="{ '--y': `${y}px`, '--inc': `${inc}px` }">
      <ULandingSection class="sticky h-screen top-0 flex !pb-16" :ui="{ container: 'flex-1 sm:gap-y-12' }">
        <template #title>
          <span v-html="isAfterStep(steps.docs) ? page.docs?.title : page.landing?.title" />
        </template>

        <template #description>
          <span v-html="isAfterStep(steps.docs) ? page.docs?.description : page.landing?.description" />
        </template>

        <ProDemo ref="demoRef" :blocks="blocks">
          <template #header-left>
            <Logo class="w-auto h-6" />
          </template>

          <template #header-center>
            <UHeaderLinks :links="headerLinks" />
          </template>

          <template #header-right>
            <div class="flex items-center gap-1.5">
              <UColorModeButton />

              <UButton
                to="https://github.com/nuxt/ui"
                target="_blank"
                icon="i-simple-icons-github"
                aria-label="GitHub"
                class="hidden lg:inline-flex"
                v-bind="($ui.button.secondary as any)"
              />
            </div>
          </template>

          <template #footer-left>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Published under <NuxtLink to="https://github.com/nuxt/ui" target="_blank" class="text-gray-900 dark:text-white">
                MIT License
              </NuxtLink>
            </span>
          </template>

          <template #footer-right>
            <div class="flex items-center gap-1.5">
              <UButton aria-label="Nuxt on X" icon="i-simple-icons-x" to="https://x.com/nuxt_js" target="_blank" v-bind="($ui.button.secondary as any)" />
              <UButton aria-label="Nuxt UI on Discord" icon="i-simple-icons-discord" to="https://discord.com/channels/473401852243869706/1153996761426300948" target="_blank" v-bind="($ui.button.secondary as any)" />
              <UButton aria-label="Nuxt UI on GitHub" icon="i-simple-icons-github" to="https://github.com/nuxt/ui" target="_blank" v-bind="($ui.button.secondary as any)" />
            </div>
          </template>

          <template #aside-top>
            <UDocsSearchButton size="md" class="w-full" />
          </template>

          <template #aside-default>
            <UNavigationTree
              class="w-full h-full [&>div>div>div>nav]:border-gray-800/10 dark:[&>div>div>div>nav]:border-gray-200/10 overflow-y-auto"
              :links="navigationLinks"
            />
          </template>

          <template #page-header>
            <UPageHeader
              title="Installation"
              description="Learn how to install and configure the module in your Nuxt app."
              headline="Getting Started"
              class="!p-0 !border-0"
              :ui="{ headline: 'mb-2', title: '!text-2xl', description: 'mt-2 text-sm' }"
            />
          </template>

          <template #page-body>
            <MDC :value="md" tag="div" class="-mt-8 prose prose-primary prose-sm dark:prose-invert max-w-none" />
          </template>

          <template #docs-surround>
            <UDocsSurround
              :surround="(surround as unknown as ParsedContent[])"
              class="w-full gap-4"
              :ui="{
                link: {
                  wrapper: 'px-4 py-2.5 border-gray-800/10 dark:border-gray-200/10 cursor-pointer',
                  icon: {
                    wrapper: 'mb-2 p-1',
                    base: 'h-4 w-4',
                  },
                  title: 'text-sm',
                  description: 'text-xs'
                }
              }"
            />
          </template>

          <template #docs-toc>
            <div class="absolute top-0 left-0">
              <UDocsToc :links="toc" class="bg-transparent relative max-h-full overflow-hidden top-0" :ui="{ container: '!pt-0 !pb-4' }" />

              <UDivider dashed class="border-gray-800/10 dark:border-gray-200/10" />

              <UPageLinks title="Community" :links="communityLinks" class="mt-4" />
            </div>
          </template>

          <template #landing-hero>
            <ULandingHero class="!p-0" :ui="{ title: '!text-5xl', description: 'text-base' }">
              <template #title>
                A <span class="text-primary">UI Library</span> for<br> Modern Web Apps
              </template>

              <template #description>
                Nuxt UI simplifies the creation of stunning and responsive web applications with its<br> comprehensive collection of fully styled and customizable UI components designed for Nuxt.
              </template>

              <template #links>
                <UButton label="Get Started" icon="i-heroicons-rocket-launch" size="md" />

                <UInput
                  model-value="npm i @nuxt/ui"
                  color="gray"
                  readonly
                  autocomplete="off"
                  icon="i-heroicons-command-line"
                  input-class="select-none"
                  aria-label="Install @nuxt/ui"
                  size="md"
                  :ui="{ base: 'disabled:cursor-default', icon: { trailing: { pointer: '' } } }"
                />
              </template>
            </ULandingHero>
          </template>

          <template #landing-section>
            <ULandingSection :ui="{ title: '!text-3xl', description: 'text-base' }" class="!p-0">
              <template #title>
                Everything you expect from a<br> <span class="text-primary">UI component library</span>
              </template>
            </ULandingSection>
          </template>

          <template #landing-card-1>
            <ULandingCard icon="i-heroicons-swatch" title="Color Palette" description="Choose a primary and a gray color from your Tailwind CSS color palette." />
          </template>
          <template #landing-card-2>
            <ULandingCard icon="i-heroicons-wrench-screwdriver" title="Fully Customizable" description="Change the style of any component in your App Config or with ui prop." />
          </template>
          <template #landing-card-3>
            <ULandingCard icon="i-heroicons-face-smile" title="Icons" description="Choose any of the 100k+ icons from the most popular icon libraries." />
          </template>
          <template #landing-card-4>
            <ULandingCard icon="i-heroicons-computer-desktop" title="Keyboard Shortcuts" description="Nuxt UI comes with a set of Vue composables to easily handle shortcuts." />
          </template>

          <template #landing-cta>
            <ULandingCTA card :links="[{ label: 'Get started', color: 'black', size: 'md' }, { label: 'Learn more', color: 'black', variant: 'link', size: 'md', trailingIcon: 'i-heroicons-arrow-right-20-solid' }]" :ui="{ title: '!text-3xl', description: 'text-base' }" class="w-full h-full rounded-md">
              <template #title>
                Trusted and supported by our<br> amazing community
              </template>
            </ULandingCTA>
          </template>
        </ProDemo>

        <template #bottom>
          <div v-if="isBeforeStep(steps.docs + 14)" class="mx-auto absolute inset-x-0 bottom-4 flex justify-center">
            <UButton color="white" size="xs" label="Skip" trailing-icon="i-heroicons-arrow-right-20-solid" to="#next" />
          </div>
        </template>
      </ULandingSection>

      <div class="h-[calc(var(--inc)*42)]" />
    </div>

    <ULandingSection id="next" v-bind="page.next" />

    <ULandingSection id="pricing" :title="page.pricing.title" :description="page.pricing.description">
      <UPricingGrid v-bind="page.pricing.grid">
        <UPricingCard v-for="(plan, index) in page.pricing.plans" :key="index" v-bind="plan" />
      </UPricingGrid>
    </ULandingSection>

    <ULandingSection id="faq" :title="page.faq.title" :description="page.faq.description">
      <ULandingFAQ :items="page.faq.items" />
    </ULandingSection>
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import { useWindowScroll } from '@vueuse/core'
import { useElementSize } from '@vueuse/core'

const route = useRoute()
const { y } = useWindowScroll()

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: `${page.value.title} - Nuxt UI`,
  description: page.value.description,
  ogDescription: page.value.description
})

const demoRef = ref()
const { height } = useElementSize(demoRef)

const start = 920
const inc = computed(() => (height.value - 32 - 64 - 32 - 32) / 4)

function isBeforeStep (i = 0) {
  return y.value < (start + (i * inc.value))
}

function isAfterStep (i = 0) {
  return y.value >= (start + (i * inc.value))
}

function getStepY (step) {
  return start + (step * inc.value)
}

const steps = {
  header: 0,
  footer: 5,
  landing: 10,
  docs: 27
}

const landingBlocks = computed(() => isAfterStep(steps.landing) && isBeforeStep(steps.docs) ? [{
  class: 'inset-x-0 top-20 bottom-20 overflow-hidden',
  inactive: true,
  children: [{
    name: 'ULandingHero',
    to: '/pro/components/landing/LandingHero',
    class: [
      'inset-4',
      isAfterStep(steps.landing + 2) && '-top-[calc(var(--y)-var(--step-y)-1rem)] bottom-[calc(var(--y)-var(--step-y)+1rem)]'
    ].filter(Boolean).join(' '),
    style: {
      '--step-y': `${getStepY(steps.landing + 2)}px`
    },
    inactive: isAfterStep(steps.landing + 1),
    children: [{
      slot: 'landing-hero',
      class: 'inset-4'
    }]
  }, isAfterStep(steps.landing + 2) && {
    name: 'ULandingSection',
    to: '/pro/components/landing/LandingSection',
    class: [
      'inset-4',
      isBeforeStep(steps.landing + 6) && '-top-[calc(var(--y)-var(--prev-step-y)-var(--height)-1rem)] bottom-[calc(var(--y)-var(--prev-step-y)-var(--height)+1rem)]',
      isAfterStep(steps.landing + 10) && '-top-[calc(var(--y)-var(--step-y)-1rem)] bottom-[calc(var(--y)-var(--step-y)+1rem)]'
    ].filter(Boolean).join(' '),
    style: {
      '--height': (inc.value * 4) + 'px',
      '--step-y': `${getStepY(steps.landing + 10)}px`,
      '--prev-step-y': `${getStepY(steps.landing + 2)}px`
    },
    inactive: isAfterStep(steps.landing + 7),
    children: [{
      slot: 'landing-section',
      class: 'inset-x-4 top-16'
    }, {
      name: 'ULandingGrid',
      to: '/pro/components/landing/LandingGrid',
      class: ['inset-x-4 bottom-4 top-48', isAfterStep(steps.landing + 8) && 'grid grid-cols-4 gap-4 p-4'].filter(Boolean).join(' '),
      inactive: isAfterStep(steps.landing + 8),
      children: [isAfterStep(steps.landing + 9) ? {
        slot: 'landing-card-1',
        class: '!relative'
      } : {
        name: 'ULandingCard',
        to: '/pro/components/landing/LandingCard',
        class: '!relative h-full',
        inactive: false
      }, isAfterStep(steps.landing + 9) ? {
        slot: 'landing-card-2',
        class: '!relative h-full'
      } : {
        name: 'ULandingCard',
        to: '/pro/components/landing/LandingCard',
        class: '!relative h-full',
        inactive: false
      }, isAfterStep(steps.landing + 9) ? {
        slot: 'landing-card-3',
        class: '!relative h-full'
      } : {
        name: 'ULandingCard',
        to: '/pro/components/landing/LandingCard',
        class: '!relative h-full',
        inactive: false
      }, isAfterStep(steps.landing + 9) ? {
        slot: 'landing-card-4',
        class: '!relative h-full'
      } : {
        name: 'ULandingCard',
        to: '/pro/components/landing/LandingCard',
        class: '!relative h-full',
        inactive: false
      }]
    }]
  }, isAfterStep(steps.landing + 10) && {
    name: 'ULandingSection',
    to: '/pro/components/landing/LandingSection',
    class: [
      'inset-4',
      isBeforeStep(steps.landing + 14) && '-top-[calc(var(--y)-var(--prev-step-y)-var(--height)-1rem)] bottom-[calc(var(--y)-var(--prev-step-y)-var(--height)+1rem)]'
    ].filter(Boolean).join(' '),
    style: {
      '--height': (inc.value * 4) + 'px',
      '--step-y': `${getStepY(steps.landing + 18)}px`,
      '--prev-step-y': `${getStepY(steps.landing + 10)}px`
    },
    inactive: isAfterStep(steps.landing + 15),
    children: [{
      name: 'ULandingCTA',
      class: 'inset-4',
      inactive: isAfterStep(steps.landing + 16),
      children: [{
        slot: 'landing-cta',
        class: 'inset-0'
      }]
    }]
  }].filter(Boolean)
}] : [])

const docsBlocks = computed(() => [isAfterStep(steps.docs) && {
  name: 'UPage',
  to: '/pro/components/page/Page',
  class: 'inset-x-0 top-20 bottom-20',
  inactive: isAfterStep(steps.docs + 1),
  children: [isAfterStep(steps.docs + 2) ? {
    name: 'UAside',
    to: '/pro/components/aside/Aside',
    class: 'left-4 inset-y-4 w-64',
    inactive: isAfterStep(steps.docs + 3),
    children: [isAfterStep(steps.docs + 4) ? {
      slot: 'aside-top',
      class: 'inset-x-4 top-4'
    } : {
      name: '#top',
      class: 'inset-x-4 top-4 h-9'
    }, isAfterStep(steps.docs + 5) ? {
      name: 'UNavigationTree',
      to: '/pro/components/navigation/NavigationTree',
      class: ['inset-x-4 top-[4.25rem] bottom-4', isAfterStep(steps.docs + 6) && '!bg-transparent !border-0'].join(' '),
      inactive: isAfterStep(steps.docs + 6),
      children: [{
        slot: 'aside-default',
        class: 'inset-0'
      }]
    } : {
      name: '#default',
      class: 'inset-x-4 top-[4.25rem] bottom-4'
    }]
  } : {
    name: '#left',
    class: 'left-4 inset-y-4 w-64'
  }, isAfterStep(steps.docs + 7) ? {
    name: 'UPage',
    to: '/pro/components/page/Page',
    class: 'left-72 right-4 inset-y-4',
    inactive: isAfterStep(steps.docs + 8),
    children: [...(isAfterStep(steps.docs + 9) ? [{
      name: 'UPageHeader',
      to: '/pro/components/page/PageHeader',
      class: 'top-4 left-4 right-72 h-32',
      inactive: isAfterStep(steps.docs + 10),
      children: [{
        slot: 'page-header',
        class: 'inset-4 justify-start'
      }]
    }, {
      name: 'UPageBody',
      to: '/pro/components/page/PageBody',
      class: 'top-40 left-4 right-72 bottom-4 overflow-y-auto',
      inactive: isAfterStep(steps.docs + 11),
      children: [{
        slot: 'page-body',
        class: 'inset-x-4 top-4 justify-start'
      }, isAfterStep(steps.docs + 12) ? {
        slot: 'docs-surround',
        class: 'bottom-4 inset-x-4 h-28'
      } : {
        name: 'UDocsSurround',
        to: '/pro/components/docs/DocsSurround',
        class: 'bottom-4 inset-x-4 h-28',
        inactive: false
      }]
    }] : [{
      name: '#default',
      class: 'left-4 right-72 inset-y-4'
    }]), isAfterStep(steps.docs + 13) ? {
      name: 'UDocsToc',
      to: '/pro/components/docs/DocsToc',
      class: 'right-4 inset-y-4 w-64',
      inactive: isAfterStep(steps.docs + 14),
      children: [{
        slot: 'docs-toc',
        class: 'inset-4 overflow-y-auto'
      }]
    } : {
      name: '#right',
      class: 'right-4 inset-y-4 w-64'
    }]
  } : {
    name: '#default',
    class: 'left-72 right-4 inset-y-4'
  }]
}].filter(Boolean))

const blocks = computed(() => [isAfterStep(steps.header) && {
  name: 'UHeader',
  to: '/pro/components/header/Header',
  class: 'h-16 inset-x-0 top-0',
  inactive: isAfterStep(steps.header + 1),
  children: [isAfterStep(steps.header + 2) ? {
    slot: 'header-left',
    class: 'left-4 top-4'
  } : {
    name: '#left',
    class: 'left-4 inset-y-4 w-64'
  }, isAfterStep(steps.header + 3) ? {
    slot: 'header-center',
    class: 'inset-x-72 top-5'
  } : {
    name: '#center',
    class: 'inset-x-72 inset-y-4'
  }, isAfterStep(steps.header + 4) ? {
    slot: 'header-right',
    class: 'right-4 top-4'
  } : {
    name: '#right',
    class: 'right-4 inset-y-4 w-64'
  }]
}, isAfterStep(steps.footer) && {
  name: 'UFooter',
  to: '/pro/components/footer/Footer',
  class: 'h-16 inset-x-0 bottom-0',
  inactive: isAfterStep(steps.footer + 1),
  children: [isAfterStep(steps.footer + 2) ? {
    slot: 'footer-left',
    class: 'left-4 bottom-5'
  } : {
    name: '#left',
    class: 'left-4 inset-y-4 w-64'
  }, isAfterStep(steps.footer + 3) ? {
    slot: 'footer-center',
    class: 'inset-x-72 bottom-5'
  } : {
    name: '#center',
    class: 'inset-x-72 inset-y-4'
  }, isAfterStep(steps.footer + 4) ? {
    slot: 'footer-right',
    class: 'right-4 bottom-4'
  } : {
    name: '#right',
    class: 'right-4 inset-y-4 w-64'
  }]
}, ...landingBlocks.value, ...docsBlocks.value].filter(Boolean))

// Slots Data

const headerLinks = [{
  label: 'Documentation',
  active: true
}, {
  label: 'Playground'
}, {
  label: 'Roadmap'
}, {
  label: 'Pro'
}]

const navigationLinks = [{
  label: 'Getting Started',
  children: [{
    label: 'Introduction'
  }, {
    label: 'Installation',
    active: true
  }, {
    label: 'Theming'
  }, {
    label: 'Shortcuts'
  }, {
    label: 'Examples'
  }, {
    label: 'Roadmap'
  }]
}, {
  label: 'Elements',
  children: [{
    label: 'Alert'
  }, {
    label: 'Avatar'
  }, {
    label: 'Badge'
  }, {
    label: 'Button'
  }]
}]

const surround = [{
  title: 'Introduction',
  description: 'Fully styled and customizable components for Nuxt.'
}, {
  title: 'Theming',
  description: 'Learn how to customize the look and feel of the components.'
}]

const md = `
## Edge

To use the latest updates pushed on the [\`dev\`](https://github.com/nuxt/ui/tree/dev) branch, you can use \`@nuxt/ui-edge\`.
`

const toc = [{
  id: 'quick-start',
  depth: 2,
  text: 'Quick Start'
}, {
  id: 'intellisense',
  depth: 2,
  text: 'IntelliSense'
}, {
  id: 'options',
  depth: 2,
  text: 'Options'
}, {
  id: 'edge',
  depth: 2,
  text: 'Edge'
}]

const communityLinks = [{
  icon: 'i-heroicons-pencil-square',
  label: 'Edit this page'
}, {
  icon: 'i-heroicons-star',
  label: 'Star on GitHub',
  to: 'https://github.com/nuxt/ui',
  target: '_blank'
}, {
  icon: 'i-heroicons-book-open',
  label: 'Nuxt documentation',
  to: 'https://nuxt.com',
  target: '_blank'
}]
</script>
