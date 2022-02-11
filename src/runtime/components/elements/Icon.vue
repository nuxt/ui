<template>
  <Icon :icon="icon" />
</template>

<script setup>
import { Icon } from '@iconify/vue/dist/offline'
import { loadIcon } from '@iconify/vue'

const props = defineProps({
  name: {
    type: [String, Object],
    required: true
  }
})

const icon = await loadIcon(props.name)
</script>
