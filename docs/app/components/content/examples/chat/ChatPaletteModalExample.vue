<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

const { messages, input, handleSubmit, status, error } = useChat()
</script>

<template>
  <UModal open :ui="{ content: 'sm:h-[28rem]' }">
    <template #content>
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
          />
        </template>
      </UChatPalette>
    </template>
  </UModal>
</template>
