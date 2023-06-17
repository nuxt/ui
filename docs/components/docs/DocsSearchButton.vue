<template>
  <UButton
    color="white"
    variant="outline"
    icon="i-heroicons-magnifying-glass-20-solid"
    label="Search..."
    truncate
    :ui="{
      color: {
        white: {
          outline: 'ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-300 dark:hover:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
        }
      }
    }"
    @click="isSearchModalOpen = true"
  >
    <template #trailing>
      <div class="hidden lg:flex items-center gap-0.5 ml-auto -my-1 flex-shrink-0">
        <UKbd class="!text-inherit">
          {{ metaSymbol }}
        </UKbd>
        <UKbd class="!text-inherit">
          K
        </UKbd>
      </div>
    </template>
  </UButton>
</template>

<script setup lang="ts">
const { isSearchModalOpen } = useDocs()
const { metaSymbol } = useShortcuts()
</script>
