<script setup lang="ts">
const { framework, frameworks } = useFrameworks()
const { track } = useAnalytics()

const value = ref<string | undefined>(undefined)

onMounted(() => {
  value.value = framework.value
})
watch(framework, () => {
  value.value = framework.value
})

function onFrameworkChange(newFramework: string) {
  framework.value = newFramework
  track('Framework Tab Switched', { framework: newFramework })
}
</script>

<template>
  <UTabs
    v-model="value"
    :items="frameworks"
    :content="false"
    color="neutral"
    :ui="{
      indicator: 'bg-default',
      trigger: 'px-1 data-[state=active]:text-highlighted w-full'
    }"
    size="xs"
    @update:model-value="onFrameworkChange($event as string)"
  />
</template>
