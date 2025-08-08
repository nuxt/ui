<script setup lang="ts">
const { framework, frameworks } = useSharedData()

const frameworkIcon = computed(() => frameworks.value.find(f => f.value === framework.value)?.icon)
</script>

<template>
  <USelect
    v-model="framework"
    :items="frameworks"
    :icon="frameworkIcon"
    color="neutral"
    variant="subtle"
    class="w-26"
  />
</template>
