<script setup lang="ts">
import theme from '#build/ui/toaster'

const positions = Object.keys(theme.variants.position)
const appConfig = useAppConfig()
</script>

<template>
  <div>
    <UFormField
      label="toaster.position"
      size="sm"
      class="inline-flex ring ring-gray-300 dark:ring-gray-700 rounded"
      :ui="{
        wrapper: 'bg-gray-50 dark:bg-gray-800/50 rounded-l flex border-r border-gray-300 dark:border-gray-700',
        label: 'text-gray-500 dark:text-gray-400 px-2 py-1.5',
        container: 'mt-0'
      }"
    >
      <USelectMenu
        v-model="appConfig.toaster.position"
        :items="positions"
        color="gray"
        variant="soft"
        class="rounded rounded-l-none min-w-12"
        :search-input="false"
      />
    </UFormField>
  </div>
</template>
