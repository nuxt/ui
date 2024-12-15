<script setup lang="ts">
import theme from '#build/ui/chip'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const positions = Object.keys(theme.variants.position) as Array<keyof typeof theme.variants.position>

const items = [{
  name: 'messages',
  icon: 'i-lucide-message-circle',
  count: 3
}, {
  name: 'notifications',
  icon: 'i-lucide-bell',
  count: 0
}]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <UChip v-for="position in positions" :key="position" :position="position">
        <UButton icon="i-lucide-inbox" color="neutral" variant="subtle" />
      </UChip>
    </div>

    <div class="flex items-center gap-2">
      <UChip v-for="{ name, icon, count } in items" :key="name" :text="count" :show="count > 0" size="lg">
        <UButton :icon="icon" color="neutral" variant="subtle" />
      </UChip>
    </div>

    <div class="flex items-center gap-2">
      <UChip v-for="size in sizes" :key="size" :size="size" inset text="1">
        <UAvatar src="https://github.com/benjamincanac.png" />
      </UChip>
    </div>
  </div>
</template>
