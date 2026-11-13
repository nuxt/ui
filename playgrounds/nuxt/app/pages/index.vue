<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const items = [{ label: 'Account', icon: 'i-lucide-user' }, { label: 'Password', icon: 'i-lucide-lock' }]
const iconItems = [{ label: 'System', icon: 'i-lucide-monitor' }, { label: 'Light', icon: 'i-lucide-sun' }, { label: 'Dark', icon: 'i-lucide-moon' }]
</script>

<template>
  <UDashboardNavbar class="absolute top-0 inset-x-0 lg:border-b-0" />

  <div class="flex flex-col gap-6 p-8">
    <div v-for="size in sizes" :key="size" class="flex items-start gap-2">
      <span class="w-6 text-xs/8 text-muted ">{{ size }}</span>

      <UButton :size="size" label="Button" variant="soft" color="neutral" icon="i-lucide-plus" />
      <UTabs :size="size" :items="items" :content="false" />
      <UButton :size="size" icon="i-lucide-plus" square color="neutral" variant="outline" />
      <UTabs :size="size" :items="iconItems" :content="false" square :ui="{ label: 'sr-only' }" />
      <UColorModeTabs :size="size" />
      <UTabs :size="size" :items="items" :content="false" variant="link" />
    </div>
  </div>
</template>
