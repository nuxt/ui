<script setup>
const page = ref(1)
const items = ref(Array(55))
</script>

<template>
  <UPagination v-model="page" :total="items.length" :ui="{ rounded: 'first-of-type:rounded-l-md last-of-type:rounded-r-md' }">
    <template #prev="{ onClick }">
      <UTooltip text="Previous page">
        <UButton icon="i-heroicons-arrow-small-left-20-solid" color="primary" :ui="{ rounded: 'rounded-full' }" class="mr-2" @click="onClick" />
      </UTooltip>
    </template>

    <template #next="{ onClick }">
      <UTooltip text="Next page">
        <UButton icon="i-heroicons-arrow-small-right-20-solid" color="primary" :ui="{ rounded: 'rounded-full' }" class="ml-2" @click="onClick" />
      </UTooltip>
    </template>
  </UPagination>
</template>
