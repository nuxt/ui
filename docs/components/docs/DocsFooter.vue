<template>
  <footer class="flex items-center justify-between gap-1.5">
    <div class="flex items-baseline gap-1.5 text-sm text-center text-gray-500 dark:text-gray-400">
      Made by
      <NuxtLink to="https://nuxtlabs.com" aria-label="NuxtLabs">
        <LogoLabs class="text-primary-500 w-14 h-auto dark:text-primary-400" />
      </NuxtLink>
    </div>

    <NuxtLink to="https://github.com/nuxtlabs/ui/releases" target="_blank">
      <UBadge label="v2.4.0" />
    </NuxtLink>
  </footer>
</template>
