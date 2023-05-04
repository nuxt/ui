<template>
  <kbd class="inline-flex items-center justify-center font-sans font-semibold px-1 h-5 min-w-[20px] text-[11px] rounded !my-0 align-text-top ring-1 ring-gray-300 dark:ring-gray-700">
    <ClientOnly>
      {{ shortcut }}
    </ClientOnly>
  </kbd>
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
