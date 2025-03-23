<script setup lang="ts">
defineProps<{
  name: string
  url: string
}>()
</script>

<template>
  <UPageCard
    :to="url"
    target="_blank"
    :title="name"
    :ui="{
      container: 'p-4 sm:p-4 gap-y-2'
    }"
    class="group"
  >
    <template #header>
      <NuxtImg
        :src="`/assets/showcase/${name.toLowerCase().replace(/\s/g, '-')}.png`"
        :alt="name"
        class="object-cover w-full rounded-(--ui-radius)"
      />
    </template>
  </UPageCard>
</template>
