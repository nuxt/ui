<template>
  <footer class="flex items-center justify-between gap-1.5">
    <UButton
      :to="`https://github.com/nuxtlabs/ui/edit/dev/docs/content/${page._file}`"
      label="Edit on GitHub"
      color="gray"
      variant="link"
      :padded="false"
      trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid"
    />

    <div class="flex items-baseline gap-1.5 text-sm text-center text-gray-500 dark:text-gray-400">
      Made by
      <NuxtLink to="https://nuxtlabs.com" aria-label="NuxtLabs">
        <LogoLabs class="text-white w-14 h-auto" />
      </NuxtLink>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { page } = useContent()
</script>
