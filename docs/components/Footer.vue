<template>
  <footer class="flex items-center gap-1.5 mt-12">
    <div class="flex-1 flex items-baseline gap-1.5 text-sm text-gray-600 dark:text-gray-300 leading-6">
      Made by
      <NuxtLink to="https://nuxtlabs.com" aria-label="NuxtLabs">
        <LogoLabs class="text-gray-900 dark:text-white w-14 h-auto" />
      </NuxtLink>
    </div>

    <NuxtLink :to="`https://github.com/nuxtlabs/ui/releases/tag/v${config.version}`" target="_blank" class="inline-flex">
      <UBadge :label="`v${config.version}`" />
    </NuxtLink>

    <div class="flex-1 flex items-center justify-end gap-1.5 -my-1 lg:hidden">
      <USocialButton to="https://twitter.com/nuxtlabs" icon="i-simple-icons-twitter" />
      <USocialButton to="https://github.com/nuxtlabs/ui" icon="i-simple-icons-github" />
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig().public
</script>
