<script setup lang="ts">
const colorHex = ref('9c27b0')
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center gap-2">
      Color: <code>#{{ colorHex }}</code>
      <span :style="{ backgroundColor: `#${colorHex}` }" class="inline-flex w-5 h-5 rounded" />
    </div>
    <USeparator />
    <div class="flex justify-between gap-2">
      <UButton @click="colorHex = '9c27B0'">
        Purple
      </UButton>
      <UButton @click="colorHex = '8bc34a'">
        Lime
      </UButton>
      <UButton @click="colorHex = 'ff6347'">
        Tomato
      </UButton>
    </div>
    <USeparator />
    <UColorPicker v-model="colorHex" @update:model-value="() => console.log('model update')" />
  </div>
</template>
