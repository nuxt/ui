<script setup lang="ts">
import { isTextUIPart } from 'ai'
import type { UIMessage } from 'ai'
import { useChat } from '@ai-sdk/vue'
import { isPartStreaming } from '@nuxt/ui/utils/ai'
import { Markdown } from '@comark/vue'
import highlight from '@comark/vue/plugins/highlight'

const initialMessages: UIMessage[] = [{
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'What is Nuxt UI?' }]
}, {
  id: '2',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Nuxt UI is a Vue component library built on Reka UI, Tailwind CSS, and Tailwind Variants. It provides 125+ accessible components for building modern web apps.' }]
}]
const input = ref('')

const { messages, status, error, sendMessage } = useChat({
  messages: initialMessages
})

function onSubmit() {
  if (!input.value.trim()) return

  sendMessage({ text: input.value })

  input.value = ''
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
  <UModal open :ui="{ content: 'sm:max-w-3xl sm:h-[28rem]' }">
    <template #content>
      <UTheme :ui="ui">
        <UChatPalette>
          <UChatMessages
            :messages="messages"
            :status="status"
            :user="{ side: 'left', variant: 'naked', avatar: { src: 'https://github.com/benjamincanac.png', loading: 'lazy' as const } }"
            :assistant="{ icon: 'i-lucide-bot' }"
          >
            <template #content="{ message }">
              <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
                <template v-if="isTextUIPart(part)">
                  <Markdown
                    v-if="message.role === 'assistant'"
                    :value="part.text"
                    :streaming="isPartStreaming(part)"
                    :plugins="[highlight()]"
                    class="*:first:mt-0 *:last:mb-0"
                  />
                  <p v-else-if="message.role === 'user'" class="whitespace-pre-wrap leading-6">
                    {{ part.text }}
                  </p>
                </template>
              </template>
            </template>
          </UChatMessages>

          <template #prompt>
            <UChatPrompt
              v-model="input"
              icon="i-lucide-search"
              variant="naked"
              :error="error"
              @submit="onSubmit"
            />
          </template>
        </UChatPalette>
      </UTheme>
    </template>
  </UModal>
</template>
