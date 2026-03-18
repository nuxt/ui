<script setup lang="ts">
import { Time } from '@internationalized/date'

const rangeValue = shallowRef({
  start: new Time(10, 15, 0),
  end: new Time(19, 0, 0)
})
</script>

<template>
  <UInputTime v-model="rangeValue" range>
    <template #separator>
      <span class="flex items-center gap-2 text-sm text-muted-foreground">
        <span aria-hidden="true" class="h-px flex-1 bg-border" />
        to
        <span aria-hidden="true" class="h-px flex-1 bg-border" />
      </span>
    </template>
  </UInputTime>
</template>
