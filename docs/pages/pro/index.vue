<template>
  <div class="relative">
    <ULandingHero v-bind="page.hero" align="center">
      <template #top>
        <svg class="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern
              id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
              width="200"
              height="200"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" class="overflow-visible fill-gray-800/20">
            <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0" />
          </svg>
          <rect width="100%" height="100%" stroke-width="0" fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
        </svg>

        <div class="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]" aria-hidden="true">
          <div class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20" style="clip-path: polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)" />
        </div>
      </template>

      <template #title>
        <span v-html="page.hero?.title" />
      </template>

      <template #description>
        <span v-html="page.hero?.description" />
      </template>
    </ULandingHero>

    <ULandingSection id="features" v-bind="page.features" />

    <!-- TODO -->
    <div class="fixed bottom-4 right-4 text-center text-xl text-primary">
      Y: {{ y }} Step: {{ getStep() }}
    </div>

    <div>
      <ULandingSection class="sticky h-screen top-0 flex !pb-16" :ui="{ container: 'flex-1 sm:gap-y-16' }">
        <template #title>
          <span v-html="isPast ? page.docs?.title : page.landing?.title" />
        </template>

        <template #description>
          <span v-html="isPast ? page.docs?.description : page.landing?.description" />
        </template>

        <ProDemo :blocks="blocks">
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
        </ProDemo>

        <template #bottom>
          <div v-if="!isPast" class="mx-auto absolute inset-x-0 bottom-4 flex justify-center">
            <UButton color="white" size="xs" label="Skip" trailing-icon="i-heroicons-arrow-right-20-solid" to="#features" />
          </div>
        </template>
      </ULandingSection>

      <div class="h-[6400px]" />
    </div>

    <ULandingSection v-bind="page.next" />

    <ULandingSection id="pricing" class="!pt-0">
      <ULandingCTA v-bind="page.pricing" card />
    </ULandingSection>

    <ULandingSection v-bind="page.faq" />
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import { useWindowScroll } from '@vueuse/core'

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

const start = 920
const inc = 40

function scrolledStep (i = 0) {
  return y.value >= (start + (i * inc))
}

function getStep () {
  return Math.floor((y.value - start) / inc)
}

const steps = {
  UHeader: 0,
  UFooter: 5,
  UPage: 10
}

const isPast = computed(() => y.value > (start + (25 * inc)))

const blocks = computed(() => trimArray([scrolledStep(steps.UHeader) && {
  name: 'UHeader',
  to: '/pro/components/header/Header',
  class: 'h-16 inset-x-0 top-0',
  inactive: scrolledStep(steps.UHeader + 1),
  children: [scrolledStep(steps.UHeader + 2) ? {
    slot: 'header-left',
    class: 'left-4 top-4'
  } : {
    name: '#left',
    class: 'left-4 inset-y-4 w-64'
  }, scrolledStep(steps.UHeader + 3) ? {
    slot: 'header-center',
    class: 'inset-x-72 top-5'
  } : {
    name: '#center',
    class: 'inset-x-72 inset-y-4'
  }, scrolledStep(steps.UHeader + 4) ? {
    slot: 'header-right',
    class: 'right-4 top-4'
  } : {
    name: '#right',
    class: 'right-4 inset-y-4 w-64'
  }]
}, scrolledStep(steps.UFooter) && {
  name: 'UFooter',
  to: '/pro/components/footer/Footer',
  class: 'h-16 inset-x-0 bottom-0',
  inactive: scrolledStep(steps.UFooter + 1),
  children: [scrolledStep(steps.UFooter + 2) ? {
    slot: 'footer-left',
    class: 'left-4 bottom-5'
  } : {
    name: '#left',
    class: 'left-4 inset-y-4 w-64'
  }, scrolledStep(steps.UFooter + 3) ? {
    slot: 'footer-center',
    class: 'inset-x-72 bottom-5'
  } : {
    name: '#center',
    class: 'inset-x-72 inset-y-4'
  }, scrolledStep(steps.UFooter + 4) ? {
    slot: 'footer-right',
    class: 'right-4 bottom-4'
  } : {
    name: '#right',
    class: 'right-4 inset-y-4 w-64'
  }]
}, scrolledStep(steps.UPage) && {
  name: 'UPage',
  to: '/pro/components/page/Page',
  class: 'inset-x-0 top-20 bottom-20',
  inactive: scrolledStep(steps.UPage + 1),
  children: [scrolledStep(steps.UPage + 2) ? {
    name: 'UAside',
    to: '/pro/components/aside/Aside',
    class: 'left-4 inset-y-4 w-64',
    inactive: scrolledStep(steps.UPage + 3),
    children: [scrolledStep(steps.UPage + 4) ? {
      slot: 'aside-top',
      class: 'inset-x-4 top-4'
    } : {
      name: '#top',
      class: 'inset-x-4 top-4 h-9'
    }, scrolledStep(steps.UPage + 5) ? {
      name: 'UNavigationTree',
      to: '/pro/components/navigation/NavigationTree',
      class: ['inset-x-4 top-[4.25rem] bottom-4', scrolledStep(steps.UPage + 6) && '!bg-transparent !border-0'].join(' '),
      inactive: scrolledStep(steps.UPage + 6),
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
  }, scrolledStep(steps.UPage + 7) ? {
    name: 'UPage',
    to: '/pro/components/page/Page',
    class: 'left-72 right-4 inset-y-4',
    inactive: scrolledStep(steps.UPage + 8),
    children: [...(scrolledStep(steps.UPage + 9) ? [{
      name: 'UPageHeader',
      to: '/pro/components/page/PageHeader',
      class: 'top-4 left-4 right-72 h-32',
      inactive: scrolledStep(steps.UPage + 10),
      children: [{
        slot: 'page-header',
        class: 'inset-4 justify-start'
      }]
    }, {
      name: 'UPageBody',
      to: '/pro/components/page/PageBody',
      class: 'top-40 left-4 right-72 bottom-4 overflow-y-auto',
      inactive: scrolledStep(steps.UPage + 11),
      children: [{
        slot: 'page-body',
        class: 'inset-x-4 top-4 justify-start'
      }, scrolledStep(steps.UPage + 12) ? {
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
    }]), scrolledStep(steps.UPage + 13) ? {
      name: 'UDocsToc',
      to: '/pro/components/docs/DocsToc',
      class: 'right-4 inset-y-4 w-64',
      inactive: scrolledStep(steps.UPage + 14),
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
}], { deep: true }))

// Slots Data

const headerLinks = [{ label: 'Documentation', active: true }, { label: 'Playground' }, { label: 'Roadmap' }, { label: 'Pro' }]

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

const surround = [{ title: 'Introduction', description: 'Fully styled and customizable components for Nuxt.' }, { title: 'Theming', description: 'Learn how to customize the look and feel of the components.' }]

const md = `
## Edge

To use the latest updates pushed on the [\`dev\`](https://github.com/nuxt/ui/tree/dev) branch, you can use \`@nuxt/ui-edge\`.
`

const toc = [{
  'id': 'quick-start',
  'depth': 2,
  'text': 'Quick Start'
}, {
  'id': 'intellisense',
  'depth': 2,
  'text': 'IntelliSense'
}, {
  'id': 'options',
  'depth': 2,
  'text': 'Options'
}, {
  'id': 'edge',
  'depth': 2,
  'text': 'Edge'
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
