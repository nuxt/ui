<script setup lang="ts">
import type { ChatPromptQueueItem } from '@nuxt/ui'

const input = ref('')
const queue = ref<ChatPromptQueueItem[]>([
  { text: 'Can you also add a dark mode toggle?' },
  { text: 'And write the tests for it' }
])
</script>

<template>
  <UChatPrompt
    v-model="input"
    v-model:queue="queue"
    status="streaming"
    placeholder="Send a message while it answers..."
    :autofocus="false"
    class="w-full"
  >
    <UChatPromptSubmit status="streaming" />
  </UChatPrompt>
</template>
