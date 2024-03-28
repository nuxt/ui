<script setup lang="ts">
import { format } from 'date-fns'

const date = ref(new Date())
</script>

<template>
  <UAlert title="Customize Alert Content" description="Insert custom content into the default slot!" icon="i-heroicons-command-line">
    <div class="mt-4">
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" />

        <template #panel="{ close }">
          <DatePicker v-model="date" @close="close" />
        </template>
      </UPopover>
    </div>
  </UAlert>
</template>
