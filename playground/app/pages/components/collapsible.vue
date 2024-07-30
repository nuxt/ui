<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div class="flex-1">
    <UCollapsible class="w-48">
      <UButton
        class="group"
        icon="i-heroicons-light-bulb"
        :trailing-icon="appConfig.ui.icons.chevronDown"
        color="gray"
        variant="outline"
        label="Open"
        block
        :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      />

      <template #content>
        <Placeholder class="h-96 w-full" />
      </template>
    </UCollapsible>
  </div>
</template>
