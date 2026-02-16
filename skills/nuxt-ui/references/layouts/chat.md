# Chat Layout

Build AI chat interfaces with message streams, prompts, and Vercel AI SDK integration.

## Component tree

```
UApp
└── NuxtLayout (dashboard)
    └── UDashboardGroup
        ├── UDashboardSidebar (conversations)
        └── NuxtPage
            └── UDashboardPanel
                ├── #header → UDashboardNavbar
                ├── #body → UContainer → UChatMessages
                └── #footer → UContainer → UChatPrompt
                                              └── UChatPromptSubmit
```

## Setup

### Install AI SDK

```bash
pnpm add ai @ai-sdk/gateway @ai-sdk/vue
```

### Server endpoint

```ts [server/api/chat.post.ts]
import { streamText, convertToModelMessages } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('openai/gpt-4o-mini'),
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages)
  }).toUIMessageStreamResponse()
})
```

## Full page chat

```vue [pages/chat/[id].vue]
<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'

definePageMeta({ layout: 'dashboard' })

const input = ref('')

const chat = new Chat({
  onError(error) {
    console.error(error)
  }
})

function onSubmit() {
  chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Chat" />
    </template>

    <template #body>
      <UContainer>
        <UChatMessages :messages="chat.messages" :status="chat.status">
          <template #content="{ message }">
            <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
              <MDC
                v-if="part.type === 'text' && message.role === 'assistant'"
                :value="part.text"
                :cache-key="`${message.id}-${index}`"
                class="*:first:mt-0 *:last:mb-0"
              />
              <p v-else-if="part.type === 'text' && message.role === 'user'" class="whitespace-pre-wrap">
                {{ part.text }}
              </p>
            </template>
          </template>
        </UChatMessages>
      </UContainer>
    </template>

    <template #footer>
      <UContainer class="pb-4 sm:pb-6">
        <UChatPrompt v-model="input" :error="chat.error" @submit="onSubmit">
          <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

## Key components

### ChatMessages

Scrollable message list with auto-scroll and loading indicator.

| Prop | Description |
|---|---|
| `messages` | Array of AI SDK messages |
| `status` | `'submitted'`, `'streaming'`, `'ready'`, `'error'` |

Slots: `#content` (receives `{ message }`), `#actions` (per-message), `#indicator` (loading)

### ChatPrompt

Enhanced textarea form for prompts. Accepts all Textarea props.

| Prop | Description |
|---|---|
| `v-model` | Input text binding |
| `error` | Error from chat instance |
| `variant` | `'outline'` (default), `'subtle'`, `'soft'`, `'ghost'`, `'none'` |

Slots: `#default` (submit button), `#footer` (below input, e.g. model selector)

### ChatPromptSubmit

Submit button with automatic status handling (send/stop/reload).

### ChatPalette

Layout wrapper for chat inside overlays (Modal, Slideover, Drawer).

## Chat in a modal

```vue
<UModal v-model:open="isOpen">
  <template #content>
    <UChatPalette>
      <UChatMessages :messages="chat.messages" :status="chat.status" />

      <template #prompt>
        <UChatPrompt v-model="input" @submit="onSubmit">
          <UChatPromptSubmit :status="chat.status" />
        </UChatPrompt>
      </template>
    </UChatPalette>
  </template>
</UModal>
```

## With model selector

```vue
<UChatPrompt v-model="input" @submit="onSubmit">
  <UChatPromptSubmit :status="chat.status" />

  <template #footer>
    <USelect
      v-model="model"
      placeholder="Select a model"
      variant="ghost"
      icon="i-simple-icons-openai"
      :items="[
        { label: 'GPT-4o', value: 'gpt-4o' },
        { label: 'Claude 3.5 Sonnet', value: 'claude-3.5-sonnet' },
        { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' }
      ]"
    />
  </template>
</UChatPrompt>
```

## Conversation sidebar

```vue [layouts/dashboard.vue]
<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <template #header>
        <UButton icon="i-lucide-plus" label="New chat" block />
      </template>

      <template #default>
        <UNavigationMenu :items="conversations" orientation="vertical" />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
```
