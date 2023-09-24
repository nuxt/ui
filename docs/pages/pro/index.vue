<template>
  <div class="relative">
    <ULandingHero v-bind="page" align="center" />

    <!-- TODO -->
    <div class="fixed top-20 inset-x-0 text-center text-xl text-primary">
      Y: {{ y }} Step: {{ getStep() }}
    </div>

    <div>
      <ULandingSection title="Build a documentation" class="sticky h-screen top-0 flex !pb-16" :ui="{ container: 'flex-1' }">
        <ProTemplate :components="components">
          <template #header-left>
            <Logo class="w-auto h-6" />
          </template>

          <template #header-center>
            <UHeaderLinks :links="[{ label: 'Documentation', active: true }, { label: 'Playground' }, { label: 'Roadmap' }, { label: 'Pro' }]" />
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
            <UDocsSearchButton size="lg" class="w-full" />
          </template>

          <template #aside-default>
            <UNavigationTree
              class="w-full h-full [&>div>div>div>nav]:border-gray-800/10 dark:[&>div>div>div>nav]:border-gray-200/10"
              :links="[{
                label: 'Getting Started',
                children: [{
                  label: 'Introduction'
                }, {
                  label: 'Installation'
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
              }]"
            />
          </template>
        </ProTemplate>
      </ULandingSection>

      <div class="h-[calc(100vh*5)]" />
    </div>

    <ULandingSection title="Features" class="relative" />

    <ULandingSection class="!pt-0">
      <ULandingCTA title="CTA" card />
    </ULandingSection>

    <ULandingSection title="FAQ" />
  </div>
</template>


<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const route = useRoute()
const { y } = useWindowScroll()

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())

useContentHead(page)

const start = 588
const inc = 128

function scrolledStep (i = 0) {
  return y.value >= (start + (i * inc))
}

function getStep () {
  return Math.floor((y.value - start) / inc)
}

const steps = {
  UHeader: 0,
  UFooter: 5,
  UPage: 10,
  UAside: 12
}

function trimArray <T> (array: Array<T | false | null | undefined>, { deep = false } = {}): Array<T> {
  return (deep
    ? array.map((item) => {
      if (Array.isArray(item)) {
        return trimArray(item, { deep })
      } else {
        return item
      }
    })
    : array).filter(item => !!item && (!Array.isArray(item) || item.length)) as Array<T>
}

const components = computed(() => trimArray([scrolledStep(steps.UHeader) && {
  name: 'UHeader',
  class: 'h-16 inset-x-0 top-0',
  inactive: scrolledStep(steps.UHeader + 1),
  children: [scrolledStep(steps.UHeader + 2) ? {
    slot: 'header-left',
    class: 'left-4 top-5'
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
  class: 'inset-x-0 top-20 bottom-20',
  inactive: scrolledStep(steps.UPage + 1),
  children: [scrolledStep(steps.UAside) ? {
    name: 'UAside',
    class: 'left-4 inset-y-4 w-64',
    inactive: scrolledStep(steps.UAside + 1),
    children: [scrolledStep(steps.UAside + 2) ? {
      slot: 'aside-top',
      class: 'inset-x-4 top-4'
    } : {
      name: '#top',
      class: 'inset-x-4 top-4 h-10'
    }, scrolledStep(steps.UAside + 3) ? {
      name: 'UNavigationTree',
      class: ['inset-x-4 top-20 bottom-4', scrolledStep(steps.UAside + 4) && '!bg-transparent !border-0'].join(' '),
      inactive: scrolledStep(steps.UAside + 4),
      children: [{
        slot: 'aside-default',
        class: 'top-0 left-2 right-0'
      }]
    } : {
      name: '#default',
      class: 'inset-x-4 top-20 bottom-4'
    }]
  } : {
    name: '#left',
    class: 'left-4 inset-y-4 w-64'
  }, scrolledStep(steps.UAside + 5) ? {
    name: 'UPage',
    class: 'left-72 right-4 inset-y-4',
    inactive: scrolledStep(steps.UAside + 6),
    children: [{
      name: '#default',
      class: 'left-4 right-72 inset-y-4'
    }, {
      name: '#right',
      class: 'right-4 inset-y-4 w-64'
    }]
  } : {
    name: '#default',
    class: 'left-72 right-4 inset-y-4'
  }]
}], { deep: true }))
</script>
