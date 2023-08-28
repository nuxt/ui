<template>
  <UList>
    <div v-for="item in items" :key="item.label" class="flex flex-row gap-4 flex-nowrap items-center justify-between">
      <div class="grow flex items-center gap-2">
        <UIcon :name="item.icon" />
        {{ item.label }}
      </div>
      <div class="font-mono text-gray-500">
        {{ item.count.toLocaleString() }}
      </div>
    </div>
  </UList>
</template>

<script setup>
const items = [
  {
    label: 'Phones',
    icon: 'i-heroicons-device-phone-mobile',
    count: 17346
  },
  {
    label: 'Tablets',
    icon: 'i-heroicons-device-tablet',
    count: 6349
  },
  {
    label: 'Laptops & desktops',
    icon: 'i-heroicons-computer-desktop',
    count: 1647
  },
  {
    label: 'Servers',
    icon: 'i-heroicons-server-stack',
    count: 574
  },
]
</script>
