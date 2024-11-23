<script setup lang="ts">
const color = ref('#00C16A')
const iconStyle = computed(() => ({ backgroundColor: color.value }))
</script>

<template>
  <UPopover>
    <UButton label="Choose color" color="neutral" variant="subtle">
      <template #leading>
        <span :style="iconStyle" class="w-3 h-3 rounded-full" />
      </template>
    </UButton>

    <template #content>
      <UColorPicker v-model="color" class="p-2" />
    </template>
  </UPopover>
</template>
