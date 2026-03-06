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
      <UHeader>
        <template #toggle>
          <UButton
            icon="i-lucide-panel-right"
            color="neutral"
            variant="ghost"
            @click="open = !open"
          />
        </template>
      </UHeader>

      <div class="flex-1 p-4 sm:p-6 lg:p-8">
        <USkeleton class="size-full animate-pulse" />
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
      <UChatMessages
        :messages="chat.messages"
        :status="chat.status"
        compact
        class="px-0"
      />

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
          <UChatPromptSubmit size="sm" :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
        </UChatPrompt>
      </template>
    </USidebar>
  </div>
</template>
