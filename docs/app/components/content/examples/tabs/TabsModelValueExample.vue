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
</script>

<template>
  <UTabs v-model="selected" :content="false" :items="items" />
</template>
