<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div>
    <UFormField
      label="toaster.duration"
      size="sm"
      class="inline-flex ring ring-[var(--ui-border-accented)] rounded"
      :ui="{
        wrapper: 'bg-[var(--ui-bg-elevated)]/50 rounded-l flex border-r border-[var(--ui-border-accented)]',
        label: 'text-[var(--ui-text-muted)] px-2 py-1.5',
        container: 'mt-0'
      }"
    >
      <UInput
        v-model="appConfig.toaster.duration"
        color="neutral"
        variant="soft"
        class="rounded rounded-l-none min-w-12"
        :search-input="false"
      />
    </UFormField>
  </div>
</template>
