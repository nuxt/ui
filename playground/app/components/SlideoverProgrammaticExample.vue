<script lang="ts" setup>
const slideover = useSlideover()

defineProps<{
  count: number
}>()
</script>

<template>
  <USlideover title="This slideover was opened programmatically">
    <template #footer>
      <div class="flex w-full justify-between">
        <p>Count: {{ count }}</p>
        <UButton color="gray" label="Close" @click="slideover.close()" />
      </div>
    </template>
  </USlideover>
</template>
