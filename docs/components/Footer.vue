<script setup lang="ts">
const links = [{
  icon: 'i-simple-icons-figma',
  label: 'Figma Kit',
  to: 'https://www.figma.com/community/file/1288455405058138934',
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
}]
</script>

<template>
  <USeparator icon="i-simple-icons-nuxtdotjs" class="h-px" />

  <UFooter :links="links">
    <template #left>
      <NuxtLink v-if="$route.path.startsWith('/pro')" to="https://ui.nuxt.com/pro/purchase" target="_blank" class="text-sm text-gray-500 dark:text-gray-400">
        Purchase <span class="text-gray-900 dark:text-white">Nuxt UI Pro</span>
      </NuxtLink>
      <NuxtLink v-else to="https://github.com/nuxt/ui" target="_blank" class="text-sm text-gray-500 dark:text-gray-400">
        Published under <span class="text-gray-900 dark:text-white">MIT License</span>
      </NuxtLink>
    </template>

    <template #right>
      <UButton aria-label="Nuxt Website" icon="i-simple-icons-nuxtdotjs" to="https://nuxt.com" target="_blank" color="gray" variant="ghost" />
      <UButton aria-label="Nuxt UI on Discord" icon="i-simple-icons-discord" to="https://chat.nuxt.dev" target="_blank" color="gray" variant="ghost" />
      <UButton aria-label="Nuxt on X" icon="i-simple-icons-x" to="https://x.com/nuxt_js" target="_blank" color="gray" variant="ghost" />
      <UButton aria-label="Nuxt UI on GitHub" icon="i-simple-icons-github" to="https://github.com/nuxt/ui" target="_blank" color="gray" variant="ghost" />
    </template>
  </UFooter>
</template>
