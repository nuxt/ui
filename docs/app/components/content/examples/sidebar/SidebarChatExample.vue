<script setup lang="ts">
import type { UIMessage } from 'ai'
import { isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'

const open = ref(true)
const input = ref('')

const messages: UIMessage[] = [{
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'What is Nuxt UI?' }]
}, {
  id: '2',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Nuxt UI is a Vue component library built on Reka UI, Tailwind CSS, and Tailwind Variants. It provides 125+ accessible components for building modern web apps.' }]
}]

const chat = new Chat({
  messages
})

function onSubmit() {
  if (!input.value.trim()) return

  chat.sendMessage({ text: input.value })

  input.value = ''
}

const ui = {
  prose: {
    p: { base: 'my-2 text-sm/6' },
    li: { base: 'my-0.5 text-sm/6' },
    ul: { base: 'my-2' },
    ol: { base: 'my-2' },
    h1: { base: 'text-xl mb-4' },
    h2: { base: 'text-lg mt-6 mb-3' },
    h3: { base: 'text-base mt-4 mb-2' },
    h4: { base: 'text-sm mt-3 mb-1.5' },
    code: { base: 'text-xs' },
    pre: { root: 'my-2', base: 'text-xs/5' },
    table: { root: 'my-2' },
    hr: { base: 'my-4' }
  }
}
</script>

<template>
  <div class="flex flex-1">
    <div class="flex-1 flex flex-col">
      <div class="h-(--ui-header-height) shrink-0 flex items-center justify-end px-4 border-b border-default">
        <UButton
          icon="i-lucide-panel-right"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </div>

      <div class="flex-1 p-4">
        <Placeholder class="size-full" />
      </div>
    </div>

    <USidebar
      v-model:open="open"
      side="right"
      title="AI Chat"
      close
      :style="{ '--sidebar-width': '20rem' }"
      :ui="{ container: 'h-full' }"
    >
      <UTheme :ui="ui">
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
          compact
          class="px-0"
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
      </UTheme>

      <template #footer>
        <UChatPrompt
          v-model="input"
          :error="chat.error"
          :autofocus="false"
          variant="subtle"
          size="sm"
          :ui="{ base: 'px-0' }"
          @submit="onSubmit"
        >
          <UChatPromptSubmit
            size="sm"
            :status="chat.status"
            @stop="chat.stop()"
            @reload="chat.regenerate()"
          />
        </UChatPrompt>
      </template>
    </USidebar>
  </div>
</template>
