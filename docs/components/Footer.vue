<template>
  <div class="w-full h-px bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
    <div v-if="!['/playground', '/roadmap'].includes($route.path)" class="bg-white dark:bg-gray-900 px-4">
      <LogoOnly class="w-5 h-5" />
    </div>
  </div>

  <UFooter :links="links">
    <template #left>
      <NuxtLink to="https://github.com/nuxt/ui" target="_blank" class="text-sm text-gray-500 dark:text-gray-400">
        Published under <span class="text-gray-900 dark:text-white">MIT License</span>
      </NuxtLink>
    </template>

    <template #right>
      <UButton aria-label="Nuxt Website" icon="i-simple-icons-nuxtdotjs" to="https://nuxt.com" target="_blank" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Nuxt on Discord" icon="i-simple-icons-discord" to="https://go.nuxt.com/discord" target="_blank" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Nuxt on X" icon="i-simple-icons-x" to="https://go.nuxt.com/x" target="_blank" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Nuxt UI on GitHub" icon="i-simple-icons-github" to="https://github.com/nuxt/ui" target="_blank" v-bind="($ui.button.secondary as any)" />
    </template>
  </UFooter>
</template>

<script setup lang="ts">
const { $ui } = useNuxtApp()

const links = [{
  icon: 'i-simple-icons-figma',
  label: 'Figma Kit',
  to: 'https://go.nuxt.com/figma-ui2',
  target: '_blank'
}, {
  label: 'Playground',
  icon: 'i-simple-icons-stackblitz',
  to: 'https://stackblitz.com/edit/nuxt-ui',
  target: '_blank'
}, {
  label: 'Roadmap',
  icon: 'i-heroicons-map',
  to: '/roadmap'
}, {
  label: 'Releases',
  icon: 'i-heroicons-rocket-launch',
  to: '/releases'
}, {
  label: 'Terms',
  to: '/pro/terms'
}]
</script>
