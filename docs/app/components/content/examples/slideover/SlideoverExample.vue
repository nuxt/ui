<script setup lang="ts">
defineProps<{
  count: number
}>()

const emit = defineEmits(['success', 'close'])

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
        <UButton color="neutral" label="Close" @click="emit('close')" />
        <UButton label="Success" @click="onSuccess" />
      </div>
    </template>
  </USlideover>
</template>
