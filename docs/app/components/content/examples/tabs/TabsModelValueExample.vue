<script setup lang="ts">
const items = [
  {
    label: 'Account'
  },
  {
    label: 'Password'
  }
]

const active = ref('0')

// Note: This is for demonstration purposes only.
onMounted(() => {
  setInterval(() => {
    active.value = String((Number(active.value) + 1) % items.length)
  }, 2000)
})
</script>

<template>
  <UTabs v-model="active" :content="false" :items="items" />
</template>
