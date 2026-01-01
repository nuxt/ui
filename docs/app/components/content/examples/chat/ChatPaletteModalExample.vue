<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import type { UIMessage } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

const messages: UIMessage[] = []
const input = ref('')

const chat = new Chat({
  messages
})

function onSubmit() {
  chat.sendMessage({ text: input.value })

  input.value = ''
}
</script>

<template>
  <UModal open :ui="{ content: 'sm:max-w-3xl sm:h-[28rem]' }">
    <template #content>
      <UChatPalette>
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
          :user="{ side: 'left', variant: 'naked', avatar: { src: 'https://github.com/benjamincanac.png' } }"
          :assistant="{ icon: 'i-lucide-bot' }"
        >
          <template #content="{ message }">
            <MDC
              :value="getTextFromMessage(message)"
              :cache-key="message.id"
              class="[&_.my-5]:my-2.5 *:first:!mt-0 *:last:!mb-0 [&_.leading-7]:!leading-6"
            />
          </template>
        </UChatMessages>

        <template #prompt>
          <UChatPrompt
            v-model="input"
            icon="i-lucide-search"
            variant="naked"
            :error="chat.error"
            @submit="onSubmit"
          />
        </template>
      </UChatPalette>
    </template>
  </UModal>
</template>
