<script setup lang="ts">
const { framework, frameworks } = useSharedData()

const value = ref<string | undefined>(undefined)

onMounted(() => {
  value.value = framework.value
})

watch(framework, () => {
  value.value = framework.value
})
</script>

<template>
  <UTabs
    v-model="value"
    :items="frameworks"
    :content="false"
    color="neutral"
    :ui="{
      indicator: 'bg-default',
      trigger: 'px-1 data-[state=active]:text-highlighted'
    }"
    size="xs"
    @update:model-value="(framework = $event as string)"
  />
</template>
