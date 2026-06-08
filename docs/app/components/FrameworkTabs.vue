<script setup lang="ts">
const { framework, setFramework, frameworks } = useFrameworks()

const value = ref(framework.value)

onMounted(() => {
  // On prerendered pages `useCookie` keeps the SSR/payload value during hydration,
  // so re-read the actual cookie to reflect the visitor's chosen framework.
  refreshCookie('nuxt-ui-framework')
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
