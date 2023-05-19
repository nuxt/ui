<template>
  <div class="flex items-center justify-between gap-1.5">
    <UButton
      v-if="page"
      :to="`https://github.com/nuxtlabs/ui/edit/dev/docs/content/${page._file}`"
      label="Edit this page on GitHub"
      color="primary"
      variant="link"
      :padded="false"
      icon="i-heroicons-arrow-top-right-on-square-20-solid"
    />
  </div>
</template>

<script setup lang="ts">
const { page } = useContent()
</script>
