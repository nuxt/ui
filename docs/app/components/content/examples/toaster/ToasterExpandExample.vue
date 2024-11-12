<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div>
    <UFormField
      label="toaster.expand"
      size="sm"
      class="inline-flex ring ring-[var(--ui-border-accented)] rounded-[var(--ui-radius)]"
      :ui="{
        wrapper: 'bg-[var(--ui-bg-elevated)]/50 rounded-l-[var(--ui-radius)] flex border-r border-[var(--ui-border-accented)]',
        label: 'text-[var(--ui-text-muted)] px-2 py-1.5',
        container: 'mt-0'
      }"
    >
      <USelectMenu
        v-model="appConfig.toaster.expand"
        :items="[true, false]"
        color="neutral"
        variant="soft"
        class="rounded-[var(--ui-radius)] rounded-l-none min-w-12"
        :search-input="false"
      />
    </UFormField>
  </div>
</template>
