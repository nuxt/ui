<template>
  <div v-if="$route.path !== '/playground'" class="w-full h-px bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-900 px-4">
      <LogoOnly class="w-5 h-5" />
    </div>
  </div>

  <UFooter :links="[]" :ui="{ bottom: { container: 'lg:py-4' } }">
    <template #left>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Made by
        <NuxtLink to="https://nuxtlabs.com" aria-label="NuxtLabs" class="inline-block">
          <LogoLabs class="text-gray-900 dark:text-white h-4 w-auto" />
        </NuxtLink>
      </div>
    </template>

    <template #center>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Published under <NuxtLink to="https://github.com/nuxt/ui" target="_blank" class="text-gray-900 dark:text-white">
          MIT License
        </NuxtLink>
      </span>
    </template>

    <template #right>
      <UButton aria-label="Nuxt Website" icon="i-simple-icons-nuxtdotjs" to="https://nuxt.com" target="_blank" v-bind="$elements.button.secondary" />
      <UButton aria-label="Nuxt on X" icon="i-simple-icons-x" to="https://x.com/nuxt_js" target="_blank" v-bind="$elements.button.secondary" />
      <UButton aria-label="Nuxt UI on Discord" icon="i-simple-icons-discord" to="https://discord.com/channels/473401852243869706/1153996761426300948" target="_blank" v-bind="$elements.button.secondary" />
      <UButton aria-label="Nuxt UI on GitHub" icon="i-simple-icons-github" to="https://github.com/nuxt/ui" target="_blank" v-bind="$elements.button.secondary" />
    </template>
  </UFooter>
</template>
