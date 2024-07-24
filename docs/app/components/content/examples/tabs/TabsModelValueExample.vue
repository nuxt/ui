<script setup lang="ts">
const items = [
  {
    label: 'Account'
  },
  {
    label: 'Password'
  }
]

const active = ref('1')

// Note: This is for demonstration purposes only.
onMounted(() => {
  setInterval(() => {
    active.value = active.value === '0' ? '1' : '0'
  }, 2000)
})
</script>

<template>
  <UTabs v-model="active" :content="false" :items="items" />
</template>
