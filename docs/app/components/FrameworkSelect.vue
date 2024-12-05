<script setup lang="ts">
const { framework, frameworks } = useSharedData()
</script>

<template>
  <UTabs
    v-model="framework"
    :items="frameworks"
    :content="false"
    color="neutral"
    :ui="{ leadingIcon: 'group-data-[state=inactive]:grayscale' }"
  />
</template>
