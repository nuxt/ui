<script setup>
const page = ref(1)
const items = ref(Array(55))
</script>

<template>
  <div class="w-full gap-3">
    <div class="flex justify-between w-full mb-2 border-b pb-4">
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

    <div class="flex justify-between w-full mt-4">
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
