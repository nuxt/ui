<template>
  <footer class="flex items-center justify-between gap-1.5">
    <div class="flex items-baseline gap-1.5 text-sm text-center text-gray-500 dark:text-gray-400">
      Made by
      <NuxtLink to="https://nuxtlabs.com" aria-label="NuxtLabs">
        <LogoLabs class="text-primary-500 w-14 h-auto dark:text-primary-400" />
      </NuxtLink>
    </div>

    <div class="flex items-center gap-3 -my-1">
      <div class="flex lg:hidden items-center gap-1.5">
        <UButton
          to="https://twitter.com/nuxtlabs"
          target="_blank"
          color="gray"
          size="2xs"
          variant="ghost"
          icon="i-simple-icons-twitter"
        />

        <UButton
          to="https://github.com/nuxtlabs/ui"
          target="_blank"
          color="gray"
          size="2xs"
          variant="ghost"
          icon="i-simple-icons-github"
        />
      </div>

      <NuxtLink :to="`https://github.com/nuxtlabs/ui/releases/tag/v${config.version}`" target="_blank">
        <UBadge :label="`v${config.version}`" />
      </NuxtLink>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig().public
</script>
