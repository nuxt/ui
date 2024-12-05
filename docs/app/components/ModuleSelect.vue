<script setup lang="ts">
const { module, modules } = useSharedData()

const value = computed({
  get() {
    return import.meta.prerender ? undefined : module.value
  },
  set(value: string) {
    module.value = value
  }
})
</script>

<template>
  <UTabs
    v-model="value"
    :items="modules"
    :content="false"
    color="neutral"
  />
</template>
