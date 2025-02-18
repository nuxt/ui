<script setup lang="ts">
import type { InputMenuItem } from '@nuxt/ui'

const items = ref([
  {
    label: 'benjamincanac',
    value: 'benjamincanac',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'benjamincanac'
    }
  },
  {
    label: 'romhml',
    value: 'romhml',
    avatar: {
      src: 'https://github.com/romhml.png',
      alt: 'romhml'
    }
  },
  {
    label: 'noook',
    value: 'noook',
    avatar: {
      src: 'https://github.com/noook.png',
      alt: 'noook'
    }
  }
] satisfies InputMenuItem[])
const value = ref(items.value[0])
</script>

<template>
  <UInputMenu v-model="value" :avatar="value?.avatar" :items="items" />
</template>
