<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  {
    label: 'benjamincanac',
    value: 'benjamincanac',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'benjamincanac',
      loading: 'lazy' as const
    }
  },
  {
    label: 'HugoRCD',
    value: 'HugoRCD',
    avatar: {
      src: 'https://github.com/HugoRCD.png',
      alt: 'HugoRCD',
      loading: 'lazy' as const
    }
  },
  {
    label: 'atinux',
    value: 'atinux',
    avatar: {
      src: 'https://github.com/atinux.png',
      alt: 'atinux',
      loading: 'lazy' as const
    }
  },
  {
    label: 'romhml',
    value: 'romhml',
    avatar: {
      src: 'https://github.com/romhml.png',
      alt: 'romhml',
      loading: 'lazy' as const
    }
  }
] satisfies SelectMenuItem[])

const value = ref(items.value[0])
</script>

<template>
  <USelectMenu v-model="value" :avatar="value?.avatar" :items="items" class="w-48" />
</template>
