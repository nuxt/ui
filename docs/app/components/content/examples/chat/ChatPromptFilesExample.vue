<script setup lang="ts">
const input = ref('')
const files = ref<File[]>([])

function onSubmit() {
  input.value = ''
  files.value = []
}
</script>

<template>
  <UChatPrompt
    v-model="input"
    v-model:files="files"
    accept="image/*,application/pdf"
    placeholder="Paste or drop files here..."
    :autofocus="false"
    class="w-full"
    @submit="onSubmit"
  >
    <template #footer="{ open }">
      <UButton
        icon="i-lucide-paperclip"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Attach files"
        @click="open"
      />

      <UChatPromptSubmit size="sm" />
    </template>
  </UChatPrompt>
</template>
