<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div>
    <UFormField
      label="toaster.duration"
      size="sm"
      :ui="{
        wrapper: 'bg-elevated/50 rounded-l-sm flex border-r border-accented',
        label: 'text-muted px-2 py-1.5',
        container: 'mt-0'
      }"
      class="inline-flex ring ring-accented rounded-sm"
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
