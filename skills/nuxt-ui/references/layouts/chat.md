# Chat Layout

Build AI chat interfaces with message streams, reasoning, tool calling, and Vercel AI SDK integration.

## When to use

- AI chatbot interfaces
- Customer support chat
- Any conversational UI with streaming responses

## Setup

### Install dependencies

**Nuxt:**

```bash
pnpm add ai @ai-sdk/gateway @ai-sdk/vue @comark/nuxt
```

**Vue (Vite):**

```bash
pnpm add ai @ai-sdk/gateway @ai-sdk/vue @comark/vue
```

### Register Comark module

**Nuxt:**

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@comark/nuxt'
  ]
})
```

**Vue (Vite):** No module registration needed, import directly from `@comark/vue`.

> `@comark/nuxt` (or `@comark/vue` for Vue projects) provides the `Comark` component used to render AI responses as streaming Markdown, it incrementally renders tokens as they arrive and automatically enables Nuxt UI's prose components.

### Dark mode for syntax highlighting

When using the `highlight` plugin, add the following CSS to your stylesheet:

```css [main.css]
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

### Server endpoint

Using [Vercel AI Gateway](https://vercel.com/ai-gateway) (recommended):

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

Or with a direct provider (e.g., `pnpm add @ai-sdk/openai`):

```ts [server/api/chat.post.ts]
import { streamText, convertToModelMessages } from 'ai'
import { openai } from '@ai-sdk/openai'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: openai('gpt-5-nano'),
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages)
  }).toUIMessageStreamResponse()
})
```

## Component tree

```
UDashboardPanel
├── #header → UDashboardNavbar
├── #body → UContainer → UChatMessages
│                         ├── #content → UChatReasoning, UChatTool, Comark
│                         └── #indicator (loading)
└── #footer → UContainer → UChatPrompt
                            └── UChatPromptSubmit
```

## Full page chat

```vue [pages/chat/[id].vue]
<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import highlight from '@comark/nuxt/plugins/highlight'

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
                :streaming="isPartStreaming(part)"
              >
                <Comark
                  :markdown="part.text"
                  :streaming="isPartStreaming(part)"
                  :plugins="[highlight()]"
                  class="*:first:mt-0 *:last:mb-0"
                />
              </UChatReasoning>

              <UChatTool
                v-else-if="isToolUIPart(part)"
                :text="getToolName(part)"
                :streaming="isToolStreaming(part)"
              />

              <template v-else-if="isTextUIPart(part)">
                <Comark
                  v-if="message.role === 'assistant'"
                  :markdown="part.text"
                  :streaming="isPartStreaming(part)"
                  :plugins="[highlight()]"
                  class="*:first:mt-0 *:last:mb-0"
                />
                <p v-else-if="message.role === 'user'" class="whitespace-pre-wrap">
                  {{ part.text }}
                </p>
              </template>
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

- `UChatMessages` — scrollable message list with auto-scroll. Props: `messages`, `status`. Slots: `#content` (per message), `#actions`, `#indicator`.
- `UChatMessage` — individual bubble. Props: `message`, `side` (`'left'`/`'right'`).
- `UChatReasoning` — collapsible reasoning block. Auto-opens during streaming, auto-closes when done. Use `isPartStreaming(part)` from `@nuxt/ui/utils/ai`.
- `UChatTool` — tool invocation status. Use `isToolStreaming(part)`. Variants: `'inline'` (default), `'card'`.
- `UChatPrompt` — enhanced textarea. Accepts all Textarea props + `error` prop.
- `UChatPromptSubmit` — submit button with automatic status handling (send/stop/reload).
- `UChatPalette` — layout wrapper for chat inside overlays.

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
      :icon="models.find(m => m.value === model)?.icon"
      placeholder="Select a model"
      variant="ghost"
      :items="models"
    />
  </template>
</UChatPrompt>
```

## Conversation sidebar

Combine with dashboard layout for a ChatGPT-like interface:

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
