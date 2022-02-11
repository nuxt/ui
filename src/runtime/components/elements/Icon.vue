<template>
  <Icon :icon="name" />
</template>

<script setup>
import { Icon, addCollection } from '@iconify/vue/dist/offline'
import outline from '@iconify-json/heroicons-outline/icons.json'
import solid from '@iconify-json/heroicons-solid/icons.json'

addCollection(outline)
addCollection(solid)

defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>
