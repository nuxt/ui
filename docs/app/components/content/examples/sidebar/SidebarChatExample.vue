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
  <div class="flex flex-1">
    <div class="flex-1 flex flex-col">
      <div class="h-(--ui-header-height) shrink-0 flex items-center justify-end gap-2 px-4 border-b border-default">
        <span class="font-semibold text-sm me-auto">Dashboard</span>

        <UButton
          icon="i-lucide-panel-right"
          color="neutral"
          variant="ghost"
          @click="open = !open"
        />
      </div>

      <div class="flex-1" />
    </div>

    <USidebar
      v-model:open="open"
      side="right"
      collapsible="offcanvas"
      title="AI Chat"
      close
      :style="{ '--sidebar-width': '20rem' }"
      :ui="{ footer: 'p-0' }"
    >
      <template #body>
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
          compact
          class="px-0"
        />
      </template>

      <template #footer>
        <UChatPrompt
          v-model="input"
          :error="chat.error"
          variant="naked"
          :ui="{ base: 'px-0' }"
          class="px-4"
          @submit="onSubmit"
        >
          <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
        </UChatPrompt>
      </template>
    </USidebar>
  </div>
</template>
