<script setup lang="ts">
const slideover = useSlideover()

defineProps<{
  count: number
}>()

const emit = defineEmits(['success'])

function onSuccess() {
  emit('success')
}
</script>

<template>
  <USlideover :description="`This slideover was opened programmatically ${count} times`">
    <template #body>
      <Placeholder class="h-full" />
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton color="neutral" label="Close" @click="slideover.close()" />
        <UButton label="Success" @click="onSuccess" />
      </div>
    </template>
  </USlideover>
</template>
