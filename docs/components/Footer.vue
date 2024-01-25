<template>
  <div class="w-full h-px bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
    <div v-if="!['/playground', '/roadmap'].includes($route.path)" class="bg-white dark:bg-gray-900 px-4">
      <LogoOnly class="w-5 h-5" />
    </div>
  </div>

  <UFooter>
    <template #left>
      <NuxtLink v-if="$route.path.startsWith('/pro')" to="https://ui.nuxt.com/pro/purchase" target="_blank" class="text-sm text-gray-500 dark:text-gray-400">
        Purchase <span class="text-gray-900 dark:text-white">Nuxt UI Pro</span>
      </NuxtLink>
      <NuxtLink v-else to="https://github.com/nuxt/ui" target="_blank" class="text-sm text-gray-500 dark:text-gray-400">
        Published under <span class="text-gray-900 dark:text-white">MIT License</span>
      </NuxtLink>
    </template>

    <template #right>
      <UButton aria-label="Nuxt Website" icon="i-simple-icons-nuxtdotjs" to="https://nuxt.com" target="_blank" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Nuxt UI on Discord" icon="i-simple-icons-discord" to="https://discord.com/invite/ps2h6QT" target="_blank" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Nuxt on X" icon="i-simple-icons-x" to="https://x.com/nuxt_js" target="_blank" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Nuxt UI on GitHub" icon="i-simple-icons-github" to="https://github.com/nuxt/ui" target="_blank" v-bind="($ui.button.secondary as any)" />
    </template>
  </UFooter>
</template>

<script setup lang="ts">
// force typescript
</script>
