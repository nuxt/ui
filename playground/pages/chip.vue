<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <UChip v-for="position in positions" :key="position" :position="(position as any)">
        <UButton icon="i-heroicons-inbox" color="gray" />
      </UChip>
    </div>

    <div class="flex items-center gap-2">
      <UChip v-for="{ name, icon, count } in items" :key="name" :text="count" :show="count > 0" size="lg">
        <UButton :icon="icon" color="gray" />
      </UChip>
    </div>

    <div class="flex items-center gap-2 -ml-[84px]">
      <UChip v-for="size in sizes" :key="size" :size="(size as any)" inset text="1">
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" :size="(size as any)" />
      </UChip>
    </div>
  </div>
</template>

<script setup lang="ts">
import chip from '#build/ui/chip'

const sizes = Object.keys(chip.variants.size)
const positions = Object.keys(chip.variants.position)

const items = [{
  name: 'messages',
  icon: 'i-heroicons-chat-bubble-oval-left',
  count: 3
}, {
  name: 'notifications',
  icon: 'i-heroicons-bell',
  count: 0
}]
</script>