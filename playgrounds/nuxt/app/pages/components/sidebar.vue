<script setup lang="ts">
import type { UIMessage } from 'ai'
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
  messages,
  onError() {}
})

function onSubmit() {
  chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>

<template>
  <div class="flex flex-1 overflow-hidden relative">
    <div class="flex-1 flex flex-col">
      <Navbar>
        <template #trailing>
          <UButton
            icon="i-lucide-panel-right"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="open = !open"
          />
        </template>
      </Navbar>

      <div class="flex-1 p-6 mt-16">
        <USkeleton class="size-full animate-pulse" />
      </div>
    </div>

    <USidebar
      v-model:open="open"
      side="right"
      collapsible="offcanvas"
      title="AI Chat"
      close
    >
      <template #body>
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
          compact
        />
      </template>

      <template #footer>
        <UChatPrompt
          v-model="input"
          :error="chat.error"
          variant="subtle"
          @submit="onSubmit"
        >
          <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
        </UChatPrompt>
      </template>
    </USidebar>
  </div>
</template>
