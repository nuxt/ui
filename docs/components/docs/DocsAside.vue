<template>
  <aside
    class="hidden pb-8 overflow-y-auto lg:block lg:self-start lg:top-16 lg:max-h-[calc(100vh-64px)] lg:sticky lg:pr-8 lg:pl-[2px]"
  >
    <div class="relative">
      <div class="sticky top-0 pointer-events-none">
        <div class="h-8 bg-white dark:bg-gray-900" />
        <div class="bg-white dark:bg-gray-900 relative pointer-events-auto">
          <DocsSearchButton @click="isSearchModalOpen = true" />
        </div>
        <div class="h-8 bg-gradient-to-b from-white dark:from-gray-900" />
      </div>

      <DocsAsideLinks />
    </div>
  </aside>
</template>

<script setup lang="ts">
const { isSearchModalOpen } = useDocs()
</script>
