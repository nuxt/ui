<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import type { UIMessage } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

const messages: UIMessage[] = []
const input = ref('')

const groups = computed(() => [{
  id: 'ai',
  ignoreFilter: true,
  items: [{
    label: searchTerm.value ? `Ask AI for “${searchTerm.value}”` : 'Ask AI',
    icon: 'i-lucide-bot',
    onSelect: (e: any) => {
      e.preventDefault()

      ai.value = true

      if (searchTerm.value) {
        messages.push({
          id: '1',
          role: 'user',
          parts: [{ type: 'text', text: searchTerm.value }]
        })

        chat.regenerate()
      }
    }
  }]
}])

const ai = ref(false)
const searchTerm = ref('')

const chat = new Chat({
  messages
})

function handleSubmit(e: Event) {
  e.preventDefault()
  chat.sendMessage({ text: input.value })
  input.value = ''
}

function onClose(e: Event) {
  e.preventDefault()

  ai.value = false
}
</script>

<template>
  <ClientOnly>
    <LazyUContentSearch v-model:search-term="searchTerm" open :groups="groups">
      <template v-if="ai" #content>
        <UChatPalette>
          <UChatMessages
            :messages="chat.messages"
            :status="chat.status"
            :user="{ side: 'left', variant: 'naked', avatar: { src: 'https://github.com/benjamincanac.png' } }"
            :assistant="{ icon: 'i-lucide-bot' }"
          >
            <template #content="{ message }">
              <MDC :value="getTextFromMessage(message)" :cache-key="message.id" unwrap="p" />
            </template>
          </UChatMessages>

          <template #prompt>
            <UChatPrompt
              v-model="input"
              icon="i-lucide-search"
              variant="naked"
              :error="chat.error"
              @submit="handleSubmit"
              @close="onClose"
            />
          </template>
        </UChatPalette>
      </template>
    </LazyUContentSearch>
  </ClientOnly>
</template>
