<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div>
    <UFormField
      label="toaster.expand"
      size="sm"
      class="inline-flex ring ring-(--ui-border-accented) rounded-(--ui-radius)"
      :ui="{
        wrapper: 'bg-(--ui-bg-elevated)/50 rounded-l-(--ui-radius) flex border-r border-(--ui-border-accented)',
        label: 'text-(--ui-text-muted) px-2 py-1.5',
        container: 'mt-0'
      }"
    >
      <USelectMenu
        v-model="appConfig.toaster.expand"
        :items="[true, false]"
        color="neutral"
        variant="soft"
        class="rounded-(--ui-radius) rounded-l-none min-w-12"
        :search-input="false"
      />
    </UFormField>
  </div>
</template>
