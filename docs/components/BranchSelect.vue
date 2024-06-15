<template>
  <div class="mb-3 lg:mb-6">
    <UDropdown
      class="w-full"
      :items="[branches]"
      color="gray"
      mode="hover"
      :ui="{ width: 'w-full' }"
      :popper="{ strategy: 'absolute', placement: 'bottom' }"
    >
      <UButton color="gray" class="w-full">
        <UIcon v-if="branch.icon" :name="branch.icon" class="w-4 h-4 flex-shrink-0 text-gray-600 dark:text-gray-300" />

        <span class="text-gray-900 dark:text-white">{{ branch.label }}</span>

        <span class="text-gray-400 dark:text-gray-500">{{ branch.suffix }}</span>

        <UIcon name="i-heroicons-chevron-down-20-solid" class="w-5 h-5 text-gray-400 dark:text-gray-500 ml-auto -mr-1" />
      </UButton>

      <template #item="{ item }">
        <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4 flex-shrink-0 text-gray-600 dark:text-gray-300" />

        <span>{{ item.label }}</span>

        <span class="truncate text-gray-400 dark:text-gray-500">{{ item.suffix }}</span>
      </template>
    </UDropdown>
  </div>
</template>

<script setup lang="ts">
const { branches, branch } = useContentSource()
</script>
