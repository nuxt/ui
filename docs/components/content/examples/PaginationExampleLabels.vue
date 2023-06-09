<script setup>
const page = ref(1);
const items = ref(Array(55));
</script>

<template>
  <div>
    <UPagination
      class="mb-4"
      v-model="page"
      :page-count="5"
      :total="items.length"
      :prev-button="{ label: 'Previous', icon: 'i-heroicons-chevron-left-20-solid' }"
      :next-button="{ label: 'Next' , icon: 'i-heroicons-chevron-right-20-solid' }"
    />

    <UPagination
      v-model="page"
      :page-count="5"
      :total="items.length"
      :prev-button="{ label: 'Previous' }"
      :next-button="{ label: 'Next' }"
    />
  </div>
</template>
