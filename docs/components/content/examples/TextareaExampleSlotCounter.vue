<script setup>
const input = ref('I love NuxtUI!')

const badgeColor = (remaining)=>{
  switch (true) {
    case remaining < 5: return 'red';
    case remaining < 10: return 'amber';
    case remaining < 15: return 'orange';
    default: return 'green';
  }
}
</script>

<template>
  <UTextarea v-model="input" :counter="15">
    <template #counter="{focused, letterCount, maxValue}">
      <UBadge :color="badgeColor(maxValue - letterCount)">
      {{ maxValue - letterCount  }} Characters remaining!
      
      <UIcon class="ml-1" v-if="focused" name="i-heroicons-eye" />
      </UBadge>
    </template>
  </UTextarea>
</template>
