<script setup lang="ts">
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

const toast = useToast()
const appConfig = useAppConfig()

const mode = ref<'live' | 'mock'>('mock')

const initialMockMessages: UIMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    parts: [{ type: 'text', text: 'Can you explain how neural networks work?' }]
  },
  {
    id: 'msg-2',
    role: 'assistant',
    parts: [
      {
        type: 'reasoning',
        text: 'The user is asking about neural networks. Let me break this down:\n\n1. **Start with basics** - neurons, layers, weights\n2. **Use analogies** - compare to biological neurons\n3. **Provide examples** - show practical applications\n\nI should keep it accessible while being technically accurate.',
        state: 'done'
      },
      {
        type: 'text',
        text: 'Neural networks are computing systems inspired by biological neural networks in the brain.\n\n**Key concepts:**\n\n1. **Neurons** - Basic units that receive inputs and produce outputs\n2. **Layers** - Groups of neurons (input, hidden, output)\n3. **Weights** - Connection strengths between neurons\n4. **Activation functions** - Determine if a neuron should fire'
      }
    ]
  }
]

const mockChat = shallowRef(createMockChat())
const liveChat = shallowRef(createLiveChat())

function createMockChat(messages: UIMessage[] = initialMockMessages) {
  return new Chat({
    id: `mock-${Date.now()}`,
    messages,
    transport: new DefaultChatTransport({
      api: '/api/chat-mock'
    }),
    onError(error) {
      console.error('Mock chat error:', error)
    }
  })
}

function createLiveChat() {
  return new Chat({
    id: `live-${Date.now()}`,
    onFinish() {
      console.log('Live chat finished')
      console.log(liveChat.value.messages)
    },
    onError(error) {
      const { message: description } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error
      toast.add({
        description,
        icon: appConfig.ui.icons.error,
        color: 'error',
        duration: 0
      })
    }
  })
}

const input = ref('')

const chat = computed(() => mode.value === 'live' ? liveChat.value : mockChat.value)
const messages = computed(() => chat.value.messages)
const status = computed(() => chat.value.status)

function onSubmit() {
  if (!input.value.trim()) return
  chat.value.sendMessage({ text: input.value })
  input.value = ''
}

function handleStop() {
  chat.value.stop()
}

function handleReload() {
  chat.value.regenerate()
}

function clearMessages() {
  if (mode.value === 'mock') {
    mockChat.value = createMockChat([])
  } else {
    liveChat.value = createLiveChat()
  }
}

function addUserMessage() {
  mockChat.value = createMockChat([
    ...mockChat.value.messages,
    {
      id: `msg-${Date.now()}`,
      role: 'user',
      parts: [{ type: 'text', text: 'This is a test user message.' }]
    }
  ])
}

function addAssistantMessage() {
  mockChat.value = createMockChat([
    ...mockChat.value.messages,
    {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      parts: [
        {
          type: 'reasoning',
          text: 'Processing the request...\n\n- Analyzing the context\n- Formulating a response\n- Checking for accuracy',
          state: 'done'
        },
        {
          type: 'text',
          text: 'This is a test assistant response with **markdown** support.'
        }
      ]
    }
  ])
}

const mockActions = [
  { label: 'Simulate Stream', icon: 'i-lucide-play', onClick: () => chat.value.sendMessage({ text: 'Test streaming' }) },
  { label: 'Add User Message', icon: 'i-lucide-user', onClick: addUserMessage },
  { label: 'Add Assistant Message', icon: 'i-lucide-bot', onClick: addAssistantMessage },
  { type: 'separator' as const },
  { label: 'Clear All', icon: 'i-lucide-trash-2', onClick: clearMessages }
]

const messageActions = [
  { icon: 'i-lucide-copy', label: 'Copy', onClick: () => toast.add({ title: 'Copied!' }) },
  { icon: 'i-lucide-thumbs-up', label: 'Like' },
  { icon: 'i-lucide-thumbs-down', label: 'Dislike' },
  { icon: 'i-lucide-rotate-ccw', label: 'Regenerate' }
]
</script>

<template>
  <UDashboardNavbar class="absolute top-0 inset-x-0 z-10 bg-default">
    <template #toggle>
      <UDashboardSidebarToggle size="sm" variant="outline" class="ring-default" />
      <UDashboardSidebarCollapse size="sm" variant="outline" class="ring-default" />
    </template>

    <template #title>
      Chat
    </template>

    <template #right>
      <UFieldGroup size="sm">
        <UButton
          label="Mock"
          :color="mode === 'mock' ? 'primary' : 'neutral'"
          :variant="mode === 'mock' ? 'solid' : 'outline'"
          @click="mode = 'mock'"
        />
        <UButton
          label="Live"
          :color="mode === 'live' ? 'primary' : 'neutral'"
          :variant="mode === 'live' ? 'solid' : 'outline'"
          @click="mode = 'live'"
        />
      </UFieldGroup>

      <USeparator orientation="vertical" class="h-5" />

      <template v-if="mode === 'mock'">
        <UDropdownMenu :items="mockActions">
          <UButton
            icon="i-lucide-flask-conical"
            color="neutral"
            variant="ghost"
            size="sm"
          />
        </UDropdownMenu>
      </template>

      <template v-else>
        <UTooltip text="Clear messages">
          <UButton
            icon="i-lucide-trash-2"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="clearMessages"
          />
        </UTooltip>
      </template>

      <USeparator orientation="vertical" class="h-5" />

      <UBadge
        :color="status === 'ready' ? 'success' : status === 'error' ? 'error' : 'warning'"
        variant="subtle"
        size="sm"
      >
        {{ status }}
      </UBadge>
    </template>
  </UDashboardNavbar>

  <div class="flex-1 flex flex-col min-h-0 w-full pt-20">
    <UChatMessages
      should-auto-scroll
      :messages="messages"
      :status="status"
      :user="{ avatar: { src: 'https://github.com/benjamincanac.png' } }"
      :assistant="{ avatar: { src: 'https://github.com/nuxt.png' }, actions: status !== 'streaming' ? messageActions : [] }"
      :spacing-offset="160"
      class="max-w-4xl w-full mx-auto px-4 sm:px-6"
    >
      <template #content="{ message }">
        <template
          v-for="(part, index) in message.parts"
          :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`"
        >
          <UReasoning
            v-if="part.type === 'reasoning'"
            :text="part.text"
            :is-streaming="status === 'streaming' && index === message.parts.length - 1 && message.id === messages[messages.length - 1]?.id"
            :unmount-on-hide="false"
            class="mb-4"
          >
            <template #body>
              <MDC
                :value="part.text"
                :cache-key="`${message.id}-reasoning-${index}-${part.text.length}`"
                class="*:first:mt-0 *:last:mb-0"
              />
            </template>
          </UReasoning>

          <MDC
            v-else-if="part.type === 'text'"
            :value="part.text"
            :cache-key="`${message.id}-${index}-${part.text.length}`"
            class="*:first:mt-0 *:last:mb-0"
          />
        </template>
      </template>
    </UChatMessages>

    <UChatPrompt
      v-model="input"
      :error="chat.error"
      variant="subtle"
      class="sticky bottom-0 z-10 max-w-4xl w-full mx-auto"
      @submit="onSubmit"
    >
      <UChatPromptSubmit :status="status" @stop="handleStop" @reload="handleReload" />
    </UChatPrompt>
  </div>
</template>
