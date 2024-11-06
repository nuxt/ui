<script setup lang="ts">
import { useAppConfig } from '#imports'

const appConfig = useAppConfig()
</script>

<template>
  <div class="flex-1">
    <UCollapsible class="flex flex-col gap-2 w-48">
      <UButton
        class="group"
        icon="i-lucide-lightbulb"
        :trailing-icon="appConfig.ui.icons.chevronDown"
        color="neutral"
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
