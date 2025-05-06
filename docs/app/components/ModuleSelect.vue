<script setup lang="ts">
const { module, modules } = useSharedData()

const value = ref<string | undefined>(undefined)

onMounted(() => {
  value.value = module.value
})

watch(module, () => {
  value.value = module.value
})
</script>

<template>
  <UTabs
    v-model="value"
    :items="modules"
    :content="false"
    color="neutral"
    :ui="{
      indicator: 'bg-default',
      trigger: 'px-1 data-[state=active]:text-highlighted'
    }"
    size="xs"
    @update:model-value="(module = $event as string)"
  />
</template>
