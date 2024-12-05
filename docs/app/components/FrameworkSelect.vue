<script setup lang="ts">
const { framework, frameworks } = useSharedData()

const value = computed({
  get() {
    return import.meta.prerender ? undefined : framework.value
  },
  set(value: string) {
    framework.value = value
  }
})
</script>

<template>
  <UTabs
    v-model="value"
    :items="frameworks"
    :content="false"
    color="neutral"
    :ui="{ leadingIcon: 'group-data-[state=inactive]:grayscale' }"
  />
</template>
