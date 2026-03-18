<script setup lang="ts">
import { Time } from '@internationalized/date'

const rangeValue = shallowRef({
  start: new Time(9, 0, 0),
  end: new Time(17, 30, 0)
})

const variants = [
  { label: 'Outline', value: 'outline' },
  { label: 'Soft', value: 'soft' },
  { label: 'Subtle', value: 'subtle' }
] as const
</script>

<template>
  <div class="grid gap-6 md:grid-cols-3">
    <div v-for="variant in variants" :key="variant.value" class="space-y-2">
      <p class="text-sm font-medium text-muted-foreground">
        {{ variant.label }}
      </p>
      <UInputTime v-model="rangeValue" range :variant="variant.value" />
    </div>
  </div>
</template>
