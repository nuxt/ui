<script setup lang="ts">
const { module, modules } = useSharedData()

const value = ref<string | undefined>(undefined)

onMounted(() => {
  value.value = module.value
})
</script>

<template>
  <UTabs
    v-model="value"
    :items="modules"
    :content="false"
    color="neutral"
    :ui="{ indicator: 'bg-[var(--ui-bg)]', trigger: 'px-1 data-[state=active]:text-[var(--ui-text-highlighted)]' }"
    @update:model-value="(module = $event as string)"
  />
</template>
