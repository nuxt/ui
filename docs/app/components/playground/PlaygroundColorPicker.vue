<script setup lang="ts">
const color = ref('#00C16A')

const chip = computed(() => ({ backgroundColor: color.value }))
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-4">
    <UColorPicker v-model="color" />

    <UBadge color="neutral" variant="outline" size="lg" class="font-mono">
      <template #leading>
        <span :style="chip" class="size-3 rounded-full" />
      </template>
      {{ color }}
    </UBadge>
  </div>
</template>
