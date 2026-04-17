<script setup lang="ts">
const { icon, icons } = useTheme()
</script>

<template>
  <UFormField label="Icons preset">
    <USelect
      v-model="icon"
      color="neutral"
      :icon="icons.find(i => i.value === icon)?.icon"
      :items="icons"
      class="w-50"
    />
  </UFormField>
</template>
