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
      class="inline-flex ring ring-[--ui-border-accented] rounded"
      :ui="{
        wrapper: 'bg-[--ui-bg-elevated]/50 rounded-l flex border-r border-[--ui-border-accented]',
        label: 'text-[--ui-text-muted] px-2 py-1.5',
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
