<script setup lang="ts">
import type { ChatStatus } from 'ai'
import type { ChatPromptQueueItem } from '@nuxt/ui'
import theme from '#build/ui/chat-prompt'

const variants = Object.keys(theme.variants.variant)
const colors = Object.keys(theme.variants.color)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant]
})

const input = ref('')
const files = ref<File[]>([])
const queue = ref<ChatPromptQueueItem[]>([])
// Starts busy so submits queue, stopping lets the next submit go through `onSubmit`
const status = ref<ChatStatus>('streaming')

// The queue room is measured on the client, filling it after mount avoids a jump on hydration
onMounted(() => {
  queue.value = [
    { text: 'Can you also add a dark mode toggle?' },
    { text: 'And write the tests for it' }
  ]
})

function onSubmit() {
  console.log('submit', input.value, files.value)
  input.value = ''
  files.value = []
}
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="w-80 gap-8">
    <UChatPrompt
      v-model="input"
      v-model:queue="queue"
      v-model:files="files"
      :attachment="{ variant: 'thumbnail' }"
      :status="status"
      placeholder="Send a message while it answers..."
      v-bind="props"
      @submit="onSubmit"
    >
      <template #footer="{ open }">
        <UButton
          icon="i-lucide-paperclip"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Attach files"
          @click="open"
        />

        <UChatPromptSubmit :status="status" :color="props?.color" size="sm" @stop="status = 'ready'" />
      </template>
    </UChatPrompt>
  </Matrix>
</template>
