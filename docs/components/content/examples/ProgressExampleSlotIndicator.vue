<script setup lang="ts">
const temp = ref(35)

const color = computed(() => {
  switch (true) {
    case temp.value < 10: return 'blue'
    case temp.value < 20: return 'amber'
    case temp.value < 30: return 'orange'
    default: return 'red'
  }
})
</script>

<template>
  <UProgress :value="temp" :max="40" :color="color">
    <template #indicator="{ percent }">
      <div class="text-right" :style="{ width: `${percent}%` }">
        <span v-if="temp < 10" class="text-blue-500">Too cold!</span>
        <span v-else-if="temp < 20" class="text-amber-500">Warm</span>
        <span v-else-if="temp < 30" class="text-orange-500">Hot</span>
        <span v-else class="text-red-500 font-bold">🔥 Too hot!</span>
      </div>
    </template>
  </UProgress>
</template>
