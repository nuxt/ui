<template>
  <div class="relative group/ad border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 p-2 w-full transition-colors">
    <NuxtLink to="/pro" class="focus:outline-none" tabindex="-1">
      <span class="absolute inset-0" aria-hidden="true" />
    </NuxtLink>

    <UColorModeImage
      light="/illustrations/pro-light.svg"
      dark="/illustrations/pro-dark.svg"
      alt="Nuxt UI Pro"
      loading="lazy"
      class="w-full"
    />

    <div class="flex flex-col items-center mt-2 text-center">
      <div class="inline-flex gap-1.5">
        <Logo class="h-4 w-auto" />

        <UBadge variant="subtle" size="xs" label="Pro" class="font-semibold rounded" />
      </div>

      <p class="text-sm text-gray-500 dark:text-gray-400 group-hover/ad:text-gray-700 dark:group-hover/ad:text-gray-200 mt-1 transition-colors">
        The Building Blocks for Modern Web Apps.
      </p>
    </div>
  </div>
</template>
