<template>
  <div class="mb-3 lg:mb-6">
    <label for="branch" class="block mb-1.5 font-semibold text-sm/6">Version</label>

    <USelectMenu
      id="branch"
      :model-value="branch"
      name="branch"
      :options="branches"
      color="gray"
      :ui="{ icon: { trailing: { padding: { sm: 'pe-1.5' } } } }"
      :ui-menu="{ option: { container: 'gap-1.5' } }"
      @update:model-value="select"
    >
      <template #label>
        <UIcon v-if="branch.icon" :name="branch.icon" class="w-4 h-4 flex-shrink-0 text-gray-600 dark:text-gray-300" />

        <span class="font-medium">{{ branch.label }}</span>

        <span class="truncate text-gray-400 dark:text-gray-500">{{ branch.suffix }}</span>
      </template>

      <template #option="{ option }">
        <UIcon v-if="option.icon" :name="option.icon" class="w-4 h-4 flex-shrink-0 text-gray-600 dark:text-gray-300" />

        <span class="font-medium">{{ option.label }}</span>

        <span class="truncate text-gray-400 dark:text-gray-500">{{ option.suffix }}</span>
      </template>
    </USelectMenu>
  </div>
</template>

<script setup lang="ts">
const { branches, branch, select } = useContentSource()
</script>
