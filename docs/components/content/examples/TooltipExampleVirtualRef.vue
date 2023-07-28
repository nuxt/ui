<script lang="ts" setup>
import { UButton } from '#components'
const button = ref<InstanceType<typeof UButton>>()
</script>

<template>
  <UButtonGroup size="sm">
    <UButton label="Action" color="white" />
    <UButton ref="button" icon="i-heroicons-chevron-down-20-solid" color="gray" />
  </UButtonGroup>
  <UTooltip text="Tooltip example" :shortcuts="['⌘', 'O']" :virtual-ref="button" />
</template>
