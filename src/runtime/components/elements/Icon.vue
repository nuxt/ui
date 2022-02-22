<template>
  <Icon :icon="icon" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue/dist/offline'
import { loadIcon } from '@iconify/vue'

const props = defineProps({
  name: {
    type: [String, Object],
    required: true
  }
})

const icon = ref(null)
icon.value = await loadIcon(props.name)

watch(() => props.name, async () => {
  icon.value = await loadIcon(props.name)
})
</script>
