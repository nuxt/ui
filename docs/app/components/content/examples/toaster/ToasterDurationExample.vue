<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div>
    <UFormField
      label="toaster.duration"
      size="sm"
      class="inline-flex ring ring-(--ui-border-accented) rounded-sm"
      :ui="{
        wrapper: 'bg-(--ui-bg-elevated)/50 rounded-l-sm flex border-r border-(--ui-border-accented)',
        label: 'text-(--ui-text-muted) px-2 py-1.5',
        container: 'mt-0'
      }"
    >
      <UInput
        v-model="appConfig.toaster.duration"
        color="neutral"
        variant="soft"
        :ui="{ base: 'rounded-sm rounded-l-none min-w-12' }"
      />
    </UFormField>
  </div>
</template>
