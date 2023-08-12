<template>
  <div class="mb-3 lg:mb-6">
    <label for="version" class="block mb-1.5 font-semibold text-sm/6">Version</label>

    <USelectMenu
      id="version"
      v-model="branch"
      name="version"
      :options="branches"
      value-attribute="name"
      color="gray"
      :ui="{ icon: { trailing: { padding: { sm: 'pe-1.5' } } } }"
      :ui-menu="{ option: { container: 'gap-1.5' } }"
    >
      <template #label>
        <UIcon v-if="current.icon" :name="current.icon" class="w-4 h-4 flex-shrink-0 text-gray-600 dark:text-gray-300" />

        <span class="font-medium">{{ current.label }}</span>

        <span class="truncate text-gray-400 dark:text-gray-500">{{ current.suffix }}</span>
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
const { branches, branch } = useContentSource()

const current = computed(() => branches.find(b => b.name === branch.value))
</script>
