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
              <ColorPicker />

              <UDocsSearchButton :label="null" />

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
  UPage: 10
}

const components = computed(() => [{
  name: 'UHeader',
  class: 'h-16 inset-x-0 top-0',
  visible: scrolledStep(steps.UHeader),
  inactive: scrolledStep(steps.UHeader + 1),
  children: [{
    name: '#left',
    class: 'left-4 inset-y-4 w-64',
    inactive: scrolledStep(steps.UHeader + 2)
  }, {
    name: '#center',
    class: 'inset-x-72 inset-y-4',
    inactive: scrolledStep(steps.UHeader + 3)
  }, {
    name: '#right',
    class: 'right-4 inset-y-4 w-64',
    inactive: scrolledStep(steps.UHeader + 4)
  }]
}, {
  visible: scrolledStep(steps.UHeader + 2),
  slot: 'header-left',
  transparent: true,
  class: 'left-4 top-5'
}, {
  visible: scrolledStep(steps.UHeader + 3),
  slot: 'header-center',
  transparent: true,
  class: 'inset-x-72 top-5'
}, {
  visible: scrolledStep(steps.UHeader + 4),
  slot: 'header-right',
  transparent: true,
  class: 'right-4 top-4'
}, {
  name: 'UFooter',
  class: 'h-16 inset-x-0 bottom-0',
  visible: scrolledStep(steps.UFooter),
  inactive: scrolledStep(steps.UFooter + 1),
  children: [{
    name: '#left',
    class: 'left-4 inset-y-4 w-64',
    inactive: scrolledStep(steps.UFooter + 2)
  }, {
    name: '#center',
    class: 'inset-x-72 inset-y-4',
    inactive: scrolledStep(steps.UFooter + 3)
  }, {
    name: '#right',
    class: 'right-4 inset-y-4 w-64',
    inactive: scrolledStep(steps.UFooter + 4)
  }]
}, {
  visible: scrolledStep(steps.UFooter + 2),
  slot: 'footer-left',
  transparent: true,
  class: 'left-4 bottom-5'
}, {
  visible: scrolledStep(steps.UFooter + 3),
  slot: 'footer-center',
  transparent: true,
  class: 'inset-x-72 bottom-5'
}, {
  visible: scrolledStep(steps.UFooter + 4),
  slot: 'footer-right',
  transparent: true,
  class: 'right-4 bottom-4'
}, {
  name: 'UPage',
  class: 'inset-x-0 top-20 bottom-20',
  visible: scrolledStep(steps.UPage),
  inactive: scrolledStep(steps.UPage + 1),
  children: [{
    name: '#left',
    class: 'left-4 inset-y-4 w-64',
    inactive: scrolledStep(steps.UPage + 3)
  }, {
    name: '#default',
    class: 'left-72 right-4 inset-y-4'
  }]
}, {
  name: 'UAside',
  class: 'left-4 inset-y-24 w-64',
  visible: scrolledStep(steps.UPage + 2),
  inactive: scrolledStep(steps.UPage + 3),
  children: [{
    name: '#top',
    class: 'inset-x-4 top-4 h-12'
  }, {
    name: '#default',
    class: 'inset-x-4 inset-y-20'
  }, {
    name: '#bottom',
    class: 'inset-x-4 bottom-4 h-12'
  }]
}].filter(c => c.visible))
</script>

<style scoped lang="postcss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
