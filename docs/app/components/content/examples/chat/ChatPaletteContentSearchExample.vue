<script setup lang="ts">
import { isTextUIPart } from 'ai'
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'

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

function onSubmit() {
  if (!input.value.trim()) return

  chat.sendMessage({ text: input.value })

  input.value = ''
}

function onClose(e: Event) {
  e.preventDefault()

  ai.value = false
}

const ui = {
  prose: {
    p: { base: 'my-2 leading-6' },
    li: { base: 'my-0.5 leading-6' },
    ul: { base: 'my-2' },
    ol: { base: 'my-2' },
    h1: { base: 'text-xl my-2' },
    h2: { base: 'text-lg my-2' },
    h3: { base: 'text-base my-2' },
    h4: { base: 'text-sm my-2' },
    pre: { root: 'my-2' },
    table: { root: 'my-2' },
    hr: { base: 'my-2' }
  }
}
</script>

<template>
  <UContentSearch v-model:search-term="searchTerm" open :groups="groups">
    <template v-if="ai" #content>
      <UTheme :ui="ui">
        <UChatPalette>
          <UChatMessages
            :messages="chat.messages"
            :status="chat.status"
            :user="{ side: 'left', variant: 'naked', avatar: { src: 'https://github.com/benjamincanac.png', loading: 'lazy' as const } }"
            :assistant="{ icon: 'i-lucide-bot' }"
          >
            <template #content="{ message }">
              <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
                <MDC
                  v-if="isTextUIPart(part)"
                  :value="part.text"
                  :cache-key="`${message.id}-${index}`"
                  class="*:first:mt-0 *:last:mb-0"
                />
              </template>
            </template>
          </UChatMessages>

          <template #prompt>
            <UChatPrompt
              v-model="input"
              icon="i-lucide-search"
              variant="naked"
              :error="chat.error"
              @submit="onSubmit"
              @close="onClose"
            />
          </template>
        </UChatPalette>
      </UTheme>
    </template>
  </UContentSearch>
</template>
