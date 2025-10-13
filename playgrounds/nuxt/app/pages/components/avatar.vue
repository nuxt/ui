<script setup lang="ts">
import theme from '#build/ui/avatar'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
</script>

<template>
  <div class="flex flex-col gap-2 items-center">
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" src="https://github.com/benjamincanac.png" alt="Benjamin Canac" :size="size" />
    </div>
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" icon="i-lucide-image" :size="size" />
    </div>
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" alt="Benjamin Canac" :size="size" />
    </div>
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" :text="size" :size="size" />
    </div>

    <div class="flex items-center gap-1.5">
      <UAvatarGroup v-for="size in sizes" :key="size" :size="size" :max="2">
        <UChip inset text="1">
          <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
        </UChip>
        <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
        <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
      </UAvatarGroup>
    </div>
    <div class="flex items-center gap-1.5">
      <UAvatarGroup v-for="size in sizes" :key="size" :size="size" :max="4">
        <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
        <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
        <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
      </UAvatarGroup>
    </div>
  </div>
</template>
