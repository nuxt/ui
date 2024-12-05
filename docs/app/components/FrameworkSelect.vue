<script setup lang="ts">
const { framework, frameworks } = useSharedData()

const value = ref<string | undefined>(undefined)

onMounted(() => {
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
      indicator: 'bg-[var(--ui-bg)]',
      trigger: 'px-1 data-[state=active]:text-[var(--ui-text-highlighted)]'
    }"
    @update:model-value="(framework = $event as string)"
  />
</template>
