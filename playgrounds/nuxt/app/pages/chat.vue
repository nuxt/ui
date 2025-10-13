<script setup lang="ts">
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

const toast = useToast()

const messages: UIMessage[] = []
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

function handleSubmit(e: Event) {
  e.preventDefault()
  chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>

<template>
  <UDashboardNavbar class="absolute top-0 inset-x-0 z-5 border-b-0" />

  <div class="flex-1 flex flex-col gap-4 sm:gap-6 max-w-xl w-full mx-auto min-h-0">
    <UChatMessages :messages="chat.messages" :status="chat.status" :user="{ avatar: { src: 'https://github.com/benjamincanac.png' } }">
      <template #content="{ message }">
        <MDC :value="getTextFromMessage(message)" :cache-key="message.id" unwrap="p" />
      </template>
    </UChatMessages>

    <UChatPrompt v-model="input" variant="subtle" class="sticky bottom-0" :error="chat.error" @submit="handleSubmit">
      <UChatPromptSubmit :status="chat.status" @stop="chat.stop" @reload="chat.regenerate" />
    </UChatPrompt>
  </div>
</template>
