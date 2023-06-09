<script setup>
const page = ref(1);
const items = ref(Array(55));
</script>

<template>
  <UPagination
    v-model="page"
    :page-count="5"
    class="flex justify-center items-center shadow-none"
    :total="items.length"
  >
    <template #prev="{ onClick }">
      <UTooltip text="previous" @click="onClick">
        <UButton
          icon="i-heroicons-arrow-left-20-solid"
          color="gray"
          class="mr-2 rounded-none"
        />
      </UTooltip>
    </template>

    <template #next="{ onClick }">
      <UTooltip text="next" @click="onClick">
        <UButton
          icon="i-heroicons-arrow-right-20-solid"
          color="gray"
          class="ml-2 rounded-none"
        />
      </UTooltip>
    </template>
  </UPagination>
</template>
