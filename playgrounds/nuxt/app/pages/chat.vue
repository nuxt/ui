<script setup lang="ts">
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'

const toast = useToast()

const messages: UIMessage[] = [{
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello, how are you?' }]
}, {
  id: '2',
  role: 'assistant',
  parts: [{ type: 'text', text: 'I\'m good, thank you! How can I help you today?' }]
}]
const input = ref('')

const chat = new Chat({
  messages,
  onError(error) {
    const { message: description } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error

    toast.add({
      description,
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
  }
})

function onSubmit() {
  chat.sendMessage({ text: input.value })

  input.value = ''
}
</script>

<template>
  <UDashboardNavbar class="absolute top-0 inset-x-0 z-5 border-b-0 lg:pointer-events-none" />

  <div class="flex-1 flex flex-col gap-4 sm:gap-6 max-w-xl w-full mx-auto min-h-0">
    <UChatMessages
      :messages="chat.messages"
      :status="chat.status"
      :user="{ avatar: { src: 'https://github.com/benjamincanac.png' } }"
      :spacing-offset="48"
    >
      <template #content="{ message }">
        <template
          v-for="(part, index) in message.parts"
          :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`"
        >
          <MDC
            v-if="part.type === 'text' && message.role === 'assistant'"
            :value="part.text"
            :cache-key="`${message.id}-${index}`"
            class="*:first:mt-0 *:last:mb-0"
          />
          <p v-else-if="part.type === 'text' && message.role === 'user'" class="whitespace-pre-wrap">
            {{ part.text }}
          </p>
          <p
            v-else-if="part.type === 'reasoning'"
            class="text-sm text-muted my-5"
          >
            {{ part.state === 'done' ? 'Thoughts' : 'Thinking...' }}
          </p>
        </template>
      </template>
    </UChatMessages>

    <UChatPrompt
      v-model="input"
      :error="chat.error"
      variant="subtle"
      class="sticky bottom-0"
      @submit="onSubmit"
    >
      <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
    </UChatPrompt>
  </div>
</template>
