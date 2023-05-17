<template>
  <iframe :src="src" class="w-full min-h-[calc(100vh/1.5)] border border-gray-200 dark:border-gray-800 rounded-md" />
</template>

<script setup lang="ts">
const props = defineProps({
  token: {
    type: String,
    required: true
  }
})

const appConfig = useAppConfig()

const src = computed(() => `https://volta.net/embed/${props.token}?gray=${appConfig.ui.gray}&primary=${appConfig.ui.primary}`)
</script>
