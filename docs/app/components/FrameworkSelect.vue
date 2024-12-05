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
    :ui="{ leadingIcon: 'group-data-[state=inactive]:grayscale' }"
    @update:model-value="(framework = $event as string)"
  />
</template>
