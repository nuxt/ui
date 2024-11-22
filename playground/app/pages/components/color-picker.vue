<script setup lang="ts">
const colorHex = ref('9C27B0')
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center gap-2">
      Color: #{{ colorHex }}
      <span :style="{ backgroundColor: `#${colorHex}` }" class="inline-flex w-5 h-5 rounded" />
    </div>
    <USeparator />
    <div class="flex justify-between gap-2">
      <UButton @click="colorHex = '9C27B0'">
        Purple
      </UButton>
      <UButton @click="colorHex = 'FF0000'">
        Red
      </UButton>
      <UButton @click="colorHex = '87CEEB'">
        Sky
      </UButton>
    </div>
    <USeparator />
    <UColorPicker v-model="colorHex" @update:model-value="() => console.log('model update')" />
  </div>
</template>
