<script setup>
const page = ref(1)
const items = ref(Array(55))
</script>

<template>
  <div class="w-full divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
    <div class="flex flex-wrap gap-1 justify-between w-full">
      <div dir="ltr">
        <UInput
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          placeholder="Search..."
          :trailing="false"
        />
      </div>

      <div dir="rtl">
        <UInput
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          placeholder="ابحث..."
          :trailing="false"
        />
      </div>
    </div>

    <div class="flex flex-wrap gap-1 justify-between w-full pt-4">
      <div dir="ltr">
        <UPagination
          v-model="page"
          :total="items.length"
          :prev-button="{
            icon: 'i-heroicons-arrow-small-left-20-solid',
            label: 'Prev',
            color: 'gray'
          }"
          :next-button="{
            icon: 'i-heroicons-arrow-small-right-20-solid',
            trailing: true,
            label: 'Next',
            color: 'gray'
          }"
        />
      </div>

      <div dir="rtl">
        <UPagination
          v-model="page"
          :total="items.length"
          :prev-button="{
            icon: 'i-heroicons-arrow-small-left-20-solid',
            label: 'السابق',
            color: 'gray'
          }"
          :next-button="{
            icon: 'i-heroicons-arrow-small-right-20-solid',
            trailing: true,
            label: 'التالي',
            color: 'gray'
          }"
        />
      </div>
    </div>
  </div>
</template>
