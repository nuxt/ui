<script setup lang="ts">
const items = [
  {
    label: 'Account'
  },
  {
    label: 'Password'
  }
]

const selected = ref('1')

// Note: This is for demonstration purposes only.
onMounted(() => {
  setInterval(() => {
    selected.value = selected.value === '0' ? '1' : '0'
  }, 1000)
})
</script>

<template>
  <UTabs v-model="selected" :content="false" :items="items" />
</template>
