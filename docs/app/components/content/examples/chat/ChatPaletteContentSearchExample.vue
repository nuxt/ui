<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

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
        setMessages([{
          id: '1',
          role: 'user',
          content: searchTerm.value
        }])

        reload()
      }
    }
  }]
}])

const ai = ref(false)
const searchTerm = ref('')

const { messages, input, handleSubmit, status, error, reload, setMessages } = useChat()

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
            :messages="messages"
            :status="status"
            :user="{ side: 'left', variant: 'naked', avatar: { src: 'https://github.com/benjamincanac.png' } }"
            :assistant="{ icon: 'i-lucide-bot' }"
          >
            <template #content="{ message }">
              <MDC :value="message.content" :cache-key="message.id" unwrap="p" />
            </template>
          </UChatMessages>

          <template #prompt>
            <UChatPrompt
              v-model="input"
              icon="i-lucide-search"
              variant="naked"
              :error="error"
              @submit="handleSubmit"
              @close="onClose"
            />
          </template>
        </UChatPalette>
      </template>
    </LazyUContentSearch>
  </ClientOnly>
</template>
