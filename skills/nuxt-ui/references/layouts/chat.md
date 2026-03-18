# Chat Layout

Build AI chat interfaces with message streams, reasoning, tool calling, and Vercel AI SDK integration.

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
                │                         ├── #content → UChatReasoning, UChatTool, MDC
                │                         └── #indicator (loading)
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
    model: gateway('anthropic/claude-sonnet-4.6'),
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages)
  }).toUIMessageStreamResponse()
})
```

## Full page chat

```vue [pages/chat/[id].vue]
<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { isReasoningStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'

definePageMeta({ layout: 'dashboard' })

const input = ref('')

const chat = new Chat({
  onError(error) {
    console.error(error)
  }
})

function onSubmit() {
  if (!input.value.trim()) return

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
              <UChatReasoning
                v-if="isReasoningUIPart(part)"
                :text="part.text"
                :streaming="isReasoningStreaming(message, index, chat)"
              >
                <MDC
                  :value="part.text"
                  :cache-key="`reasoning-${message.id}-${index}`"
                  class="*:first:mt-0 *:last:mb-0"
                />
              </UChatReasoning>

              <UChatTool
                v-else-if="isToolUIPart(part)"
                :text="getToolName(part)"
                :streaming="isToolStreaming(part)"
              />

              <MDC
                v-else-if="isTextUIPart(part)"
                :value="part.text"
                :cache-key="`${message.id}-${index}`"
                class="*:first:mt-0 *:last:mb-0"
              />
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

### ChatMessage

Individual message bubble with avatar, actions, and slots.

| Prop | Description |
|---|---|
| `message` | AI SDK UIMessage object |
| `side` | `'left'` (default), `'right'` |

### ChatReasoning

Collapsible block for AI reasoning / thinking process. Auto-opens during streaming, auto-closes when done.

| Prop | Description |
|---|---|
| `text` | Reasoning text (displayed inside collapsible content) |
| `streaming` | Whether reasoning is actively streaming |
| `open` | Controlled open state |

Use `isReasoningStreaming(message, index, chat)` from `@nuxt/ui/utils/ai` to determine streaming state.

### ChatTool

Collapsible block for AI tool invocation status.

| Prop | Description |
|---|---|
| `text` | Tool status text (displayed in trigger) |
| `icon` | Icon name |
| `loading` | Show loading spinner on icon |
| `streaming` | Whether tool is actively running |
| `suffix` | Secondary text after label |
| `variant` | `'inline'` (default), `'card'` |
| `chevron` | `'trailing'` (default), `'leading'` |

Use `isToolStreaming(part)` from `@nuxt/ui/utils/ai` to determine if a tool is still running.

### ChatShimmer

Text shimmer animation for streaming states. Automatically used by ChatReasoning and ChatTool when streaming.

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
<script setup lang="ts">
const input = ref('')
const model = ref('claude-opus-4.6')
const models = [
  { label: 'Claude Opus 4.6', value: 'claude-opus-4.6', icon: 'i-simple-icons-anthropic' },
  { label: 'Gemini 3 Pro', value: 'gemini-3-pro', icon: 'i-simple-icons-googlegemini' },
  { label: 'GPT-5', value: 'gpt-5', icon: 'i-simple-icons-openai' }
]
</script>

<template>
  <UChatPrompt v-model="input" @submit="onSubmit">
    <UChatPromptSubmit :status="chat.status" />

    <template #footer>
      <USelect
        v-model="model"
        :icon="models.find(m => m.value === model)?.icon"
        placeholder="Select a model"
        variant="ghost"
        :items="models"
      />
    </template>
  </UChatPrompt>
</template>
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
