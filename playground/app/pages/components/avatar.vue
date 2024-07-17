<script setup lang="ts">
import theme from '#build/ui/avatar'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
</script>

<template>
  <div class="flex flex-col gap-2 items-center">
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Benjamin Canac" :size="size" />
    </div>
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" icon="i-heroicons-photo" :size="size" />
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
          <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac" />
        </UChip>
        <UAvatar src="https://avatars.githubusercontent.com/u/25613751?v=4" alt="romhml" />
        <UAvatar src="https://avatars.githubusercontent.com/u/19751938?v=4" alt="noook" />
      </UAvatarGroup>
    </div>
    <div class="flex items-center gap-1.5">
      <UAvatarGroup v-for="size in sizes" :key="size" :size="size" :max="4">
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac" />
        <UAvatar src="https://avatars.githubusercontent.com/u/25613751?v=4" alt="romhml" />
        <UAvatar src="https://avatars.githubusercontent.com/u/19751938?v=4" alt="noook" />
      </UAvatarGroup>
    </div>
  </div>
</template>
