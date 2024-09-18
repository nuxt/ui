<script setup lang="ts">
const labels = [{
  label: 'bug',
  chip: {
    color: 'red' as const
  }
}, {
  label: 'feature',
  chip: {
    color: 'green' as const
  }
}, {
  label: 'enhancement',
  chip: {
    color: 'blue' as const
  }
}]
const label = ref([])
</script>

<template>
  <UPopover :content="{ side: 'right', align: 'start' }">
    <UButton
      icon="i-heroicons-tag"
      label="Select labels"
      color="gray"
      variant="subtle"
    />

    <template #content>
      <UCommandPalette
        v-model="label"
        multiple
        placeholder="Search labels..."
        :groups="[{ id: 'labels', items: labels }]"
        :ui="{ input: '[&>input]:h-8' }"
      />
    </template>
  </UPopover>
</template>
