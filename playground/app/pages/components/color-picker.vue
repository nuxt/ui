<script setup lang="ts">
const colorHex = ref('#9C27B0')

function handleColorChange(event: Event) {
  colorHex.value = (event.target as HTMLInputElement).value
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center gap-2">
      <span :style="{ backgroundColor: colorHex }" class="inline-flex w-5 h-5 rounded" />
      <UInput :model-value="colorHex" @change="handleColorChange" />
    </div>
    <USeparator />
    <div class="flex justify-between gap-2">
      <UButton @click="colorHex = '#9C27B0'">
        Purple
      </UButton>
      <UButton @click="colorHex = '#8BC34A'">
        Lime
      </UButton>
      <UButton @click="colorHex = '#FF6347'">
        Tomato
      </UButton>
    </div>
    <USeparator />
    <UColorPicker v-model="colorHex" />
  </div>
</template>
