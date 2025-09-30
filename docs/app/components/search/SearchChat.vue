<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import type { UIMessage } from 'ai'
import { DefaultChatTransport } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import ProseStreamPre from '../prose/PreStream.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

const props = defineProps<{
  messages?: UIMessage[]
}>()

const emits = defineEmits<{
  close: []
}>()

const input = ref('')

const chat = new Chat({
  messages: props.messages,
  transport: new DefaultChatTransport({
    api: '/api/search'
  }),
  onError: (error) => {
    console.error('onError', error)
  }
})

function handleSubmit(event: Event) {
  event.preventDefault()

  if (!input.value.trim()) {
    return
  }

  chat.sendMessage({
    text: input.value
  })

  input.value = ''
}

function handleClose(e: Event) {
  e.preventDefault()

  emits('close')
}

onMounted(() => {
  if (props.messages?.length) {
    chat.regenerate()
  }
})
</script>

<template>
  <UChatPalette>
    <UChatMessages
      should-auto-scroll
      :messages="chat.messages"
      :status="chat.status"
      :user="{ side: 'left', variant: 'naked', avatar: { icon: 'i-lucide-user' } }"
      :assistant="{ avatar: { icon: 'i-lucide-bot' } }"
    >
      <template #content="{ message }">
        <MDCCached
          :value="getTextFromMessage(message)"
          :cache-key="message.id"
          unwrap="p"
          :components="components"
          :parser-options="{ highlight: false }"
        />
      </template>
    </UChatMessages>

    <template #prompt>
      <UChatPrompt
        v-model="input"
        icon="i-lucide-search"
        variant="naked"
        :error="chat.error"
        @submit="handleSubmit"
        @close="handleClose"
      />
    </template>
  </UChatPalette>
</template>
