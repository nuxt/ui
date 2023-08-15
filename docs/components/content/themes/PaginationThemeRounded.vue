<script setup>
const page = ref(1)
const items = ref(Array(55))
</script>

<template>
  <UPagination
    v-model="page"
    :total="items.length"
    :ui="{
      wrapper: 'flex items-center gap-1',
      rounded: '!rounded-full min-w-[32px] justify-center'
    }"
    :prev-button="null"
    :next-button="{
      icon: 'i-heroicons-arrow-small-right-20-solid',
      color: 'primary',
      variant: 'outline'
    }"
  />
</template>
