<script setup lang="ts">
const { framework, setFramework, frameworks } = useFrameworks()

// Pages are prerendered with the cookie default (`nuxt`), so initialize with the
// same value to keep the hydration markup in sync. Reading the real cookie during
// setup would mismatch the prerendered HTML and leave the tabs unresponsive.
const value = ref('nuxt')

onMounted(() => {
  value.value = framework.value
})

watch(framework, () => {
  value.value = framework.value
})

function onFrameworkChange(newFramework: string) {
  setFramework(newFramework as 'nuxt' | 'vue', 'tabs')
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
      trigger: 'px-1 data-[state=active]:text-highlighted w-full in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-default'
    }"
    size="xs"
    @update:model-value="onFrameworkChange($event as string)"
  />
</template>
