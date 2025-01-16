<script setup lang="ts">
const page = ref(1)
const items = ref(Array(55))
</script>

<template>
  <UPagination v-model="page" :total="items.length" :ui="{ rounded: 'first-of-type:rounded-s-md last-of-type:rounded-e-md' }">
    <template #prev="{ onClick, canGoPrev }">
      <UTooltip text="Previous page">
        <UButton
          icon="i-heroicons-arrow-small-left-20-solid"
          color="primary"
          :ui="{ rounded: 'rounded-full' }"
          class="rtl:[&_span:first-child]:rotate-180 me-2"
          :disabled="!canGoPrev"
          @click="onClick"
        />
      </UTooltip>
    </template>

    <template #next="{ onClick, canGoNext }">
      <UTooltip text="Next page">
        <UButton
          icon="i-heroicons-arrow-small-right-20-solid"
          color="primary"
          :ui="{ rounded: 'rounded-full' }"
          class="rtl:[&_span:last-child]:rotate-180 ms-2"
          :disabled="!canGoNext"
          @click="onClick"
        />
      </UTooltip>
    </template>
  </UPagination>
</template>
