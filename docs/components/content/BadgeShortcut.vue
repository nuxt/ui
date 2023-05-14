<template>
  <UKbd class="!my-0 align-text-top">
    {{ shortcut }}
  </UKbd>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    required: true
  }
})

const { metaSymbol } = useShortcuts()

const shortcut = computed(() => props.value === 'meta' ? metaSymbol.value : props.value)
</script>
