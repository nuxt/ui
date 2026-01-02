---
title: Build an AI Chatbot with Nuxt, Nuxt UI, and AI SDK
description: Learn how to build a full-featured AI chatbot with streaming responses, multiple models support, and a beautiful UI using Nuxt, Nuxt UI, and Vercel AI SDK.
navigation: false
image: /assets/blog/building-nuxt-ai-chatbot.png
authors:
  - name: Hugo Richard
    avatar:
      src: https://github.com/hugorcd.png
    to: https://x.com/hugorcd
  - name: Benjamin Canac
    avatar:
      src: https://github.com/benjamincanac.png
    to: https://x.com/benjamincanac
date: 2025-12-16T10:00:00.000Z
category: Tutorial
---

Building AI-powered applications has never been more accessible. This guide walks through creating a full-featured AI chatbot using Nuxt, Nuxt UI, and the Vercel AI SDK. Each step is explained in detail so you understand how every piece works together.

## What we're building

By the end of this tutorial, you'll have a fully functional AI chatbot with:

- **Streaming responses** that appear in real-time as the AI generates them
- **A beautiful chat interface** built with Nuxt UI's purpose-built chat components
- **Markdown rendering** for rich AI responses with code highlighting
- **Multi-model support** allowing users to switch between OpenAI, Anthropic, and Google models
- **Server-side AI integration** using Nitro API routes and the AI SDK

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt-ui-templates/chat" target="_blank"}
Check out the complete **AI Chat template** on GitHub for a production-ready implementation with authentication, database persistence, and more.
::

## Prerequisites

Before we start, make sure you have:

- Node.js 20+ installed
- A [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) API key (provides access to multiple AI providers through a single endpoint)

## Project setup

Start by creating a new Nuxt project:

```bash
npx nuxi@latest init nuxt-ai-chat
cd nuxt-ai-chat
```

### Installing dependencies

Install Nuxt UI and the AI-specific dependencies:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @nuxt/ui @nuxtjs/mdc @nuxthub/core drizzle-orm drizzle-kit @libsql/client ai @ai-sdk/vue zod
```

```bash [yarn]
yarn add @nuxt/ui @nuxtjs/mdc @nuxthub/core drizzle-orm drizzle-kit @libsql/client ai @ai-sdk/vue zod
```

```bash [npm]
npm install @nuxt/ui @nuxtjs/mdc @nuxthub/core drizzle-orm drizzle-kit @libsql/client ai @ai-sdk/vue zod
```

```bash [bun]
bun add @nuxt/ui @nuxtjs/mdc @nuxthub/core drizzle-orm drizzle-kit @libsql/client ai @ai-sdk/vue zod
```
::

::warning{icon="i-simple-icons-pnpm"}
If you're using **pnpm**, create a `.npmrc` file at the root of your project with `shamefully-hoist=true`:

```bash [.npmrc]
shamefully-hoist=true
```
::

### Configuration

Update your `nuxt.config.ts` to register the modules:

::code-tree-intersection
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@nuxthub/core'
  ],

  hub: {
    db: 'sqlite'
  },

  css: ['~/assets/css/main.css'],

  mdc: {
    headings: {
      anchorLinks: false // Disable anchor links in AI responses
    }
  },
})
```
::

Create the main CSS file to import Tailwind CSS and Nuxt UI:

::code-tree-intersection
```css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```
::

### Setting up the app

Nuxt UI requires wrapping your app with `UApp` for modals, toasts, and overlays to work properly:

::code-tree-intersection
```vue [app/app.vue] {2,6}
<template>
  <UApp>
    <UDashboardGroup unit="rem">
      <NuxtPage />
    </UDashboardGroup>
  </UApp>
</template>
```
::

Create a `.env` file with your AI Gateway API key:

::code-tree-intersection
```bash [.env]
AI_GATEWAY_API_KEY=your-api-key-here
```
::

::note
With [Vercel AI Gateway](https://vercel.com/docs/ai-gateway), you don't need individual API keys for OpenAI, Anthropic, or Google. The AI Gateway provides a unified API to access hundreds of models through a single endpoint.
::

### Setting up the database

[NuxtHub](https://hub.nuxt.com) provides a zero-config database powered by [Drizzle ORM](https://orm.drizzle.team). Here is the schema for the chat application:

::code-tree-intersection
:::code-collapse

```ts [server/db/schema.ts]
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const chats = sqliteTable('chats', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text(),
  createdAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages)
}))

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  parts: text('parts', { mode: 'json' }),
  createdAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, table => [
  index('messages_chat_id_idx').on(table.chatId)
])

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  })
}))
```

:::
::

Generate the database migrations from your schema:

```bash
npx nuxt db generate
```

::tip
Migrations are automatically applied when you start the development server with `npx nuxt dev`. NuxtHub uses SQLite locally, so no external database is required during development.
::

## Building the backend

This section covers integrating AI on the server. The following API endpoints handle chat creation, AI streaming, and data persistence using [Nitro](https://nitro.build).

### Creating a chat

First, create the endpoint that initializes a new chat and saves the first message to the database. This uses the [`UIMessage`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/ui-message) type from the AI SDK:

::code-tree-intersection
```ts [server/api/chats.post.ts]
import { defineEventHandler, readValidatedBody } from 'h3'
import type { UIMessage } from 'ai'
import { db, schema } from 'hub:db'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { message } = await readValidatedBody(event, z.object({
    message: z.custom<UIMessage>()
  }).parse)

  // Create a new chat
  const [chat] = await db.insert(schema.chats).values({}).returning()

  // Save the first user message
  await db.insert(schema.messages).values({
    chatId: chat.id,
    role: 'user',
    parts: message.parts
  })

  return chat
})
```
::

### Streaming AI responses

Next, create the endpoint that handles the AI conversation. This endpoint uses [`streamText`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text), [`createUIMessageStream`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/create-ui-message-stream), and [`createUIMessageStreamResponse`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/create-ui-message-stream-response) from the AI SDK:

::code-tree-intersection
:::code-collapse

```ts [server/api/chats/[id].post.ts]
import { createError, defineEventHandler, getValidatedRouterParams, readValidatedBody } from 'h3'
import { eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'
import { z } from 'zod'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText
} from 'ai'
import type { UIMessage } from 'ai'

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  const { model, messages } = await readValidatedBody(event, z.object({
    model: z.string().default('openai/gpt-4o-mini'),
    messages: z.array(z.custom<UIMessage>())
  }).parse)

  // Fetch the chat from the database
  const chat = await db.query.chats.findFirst({
    where: (chat, { eq }) => eq(chat.id, id as string)
  })

  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  // Generate a title for the chat if it doesn't have one
  if (!chat.title) {
    const { text: title } = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `Generate a short title (max 30 characters) based on the user's message. No quotes or punctuation.`,
      prompt: JSON.stringify(messages[0])
    })

    await db.update(schema.chats).set({ title }).where(eq(schema.chats.id, id))
  }

  // Save the user message if it's a follow-up
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await db.insert(schema.messages).values({
      chatId: id,
      role: 'user',
      parts: lastMessage.parts
    })
  }

  // Create the streaming response
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = streamText({
        model,
        system: `You are a helpful AI assistant. Be concise and friendly.`,
        messages: await convertToModelMessages(messages)
      })

      // Notify the client that a title was generated
      if (!chat.title) {
        writer.write({
          type: 'data-chat-title',
          data: { message: 'Title generated' },
          transient: true
        })
      }

      writer.merge(result.toUIMessageStream())
    },
    onFinish: async ({ messages }) => {
      // Save the assistant's response to the database
      await db.insert(schema.messages).values(messages.map(message => ({
        chatId: chat.id,
        role: message.role as 'user' | 'assistant',
        parts: message.parts
      })))
    }
  })

  return createUIMessageStreamResponse({ stream })
})
```

:::
::

Here's what each part does:

**AI Gateway**

Thanks to [Vercel AI Gateway](https://vercel.com/docs/ai-gateway), we can use any AI model supported by the gateway just by specifying the model name.

**Automatic Title Generation**

When a chat doesn't have a title yet, we use [`generateText`](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text#generatetext) to create one based on the first message. This provides a better UX by showing meaningful titles in the chat history instead of "Untitled".

**Streaming with streamText**

The [`streamText`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text) function generates a streaming response from the AI model. Key options include:
- `model`: The AI model to use
- `system`: Instructions that guide the AI's behavior
- `messages`: The conversation history

**UIMessageStream**

The [`createUIMessageStream`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/create-ui-message-stream#createuimessagestream) and [`createUIMessageStreamResponse`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/create-ui-message-stream-response#createuimessagestreamresponse) functions create a stream that the AI SDK client can consume. The response streams chunks as they're generated, creating the real-time typing effect.

The `writer.write()` method allows sending custom data events to the client (like `data-chat-title`), while `onFinish` is called when streaming completes, perfect for persisting the assistant's response.

### Fetching a chat

Add an endpoint to fetch existing chat data from your database:

::code-tree-intersection
```ts [server/api/chats/[id].get.ts]
import { createError, defineEventHandler, getValidatedRouterParams } from 'h3'
import { asc, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  const chat = await db.query.chats.findFirst({
    where: (eq(schema.chats.id, id)),
    with: {
      messages: {
        orderBy: () => asc(schema.messages.createdAt)
      }
    }
  })

  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  return chat
})
```
::

## Wire up the UI

Nuxt UI provides purpose-built components for AI chat interfaces: [`UChatPrompt`](/docs/components/chat-prompt) for the input area and [`UChatMessages`](/docs/components/chat-messages) for displaying the conversation.

### Creating the home page

The home page is where users start a new conversation. The [`UChatPrompt`](/docs/components/chat-prompt) component provides a textarea with auto-resize, keyboard shortcuts, and a submit button:

::code-tree-intersection
```vue [app/pages/index.vue] {34-42}
<script setup lang="ts">
const input = ref('')
const loading = ref(false)

async function createChat() {
  if (!input.value.trim()) return

  loading.value = true

  // Create a new chat on the server
  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: {
      message: {
        role: 'user',
        parts: [{ type: 'text', text: input.value }]
      }
    }
  })

  // Navigate to the chat page
  navigateTo(`/chat/${chat.id}`)
}
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0' }">
    <template #body>
      <UContainer class="min-h-dvh flex flex-col justify-center gap-6 py-8">
        <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
          How can I help you today?
        </h1>

        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          variant="subtle"
          placeholder="Ask me anything..."
          @submit="createChat"
        >
          <UChatPromptSubmit color="neutral" />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```
::

The [`UChatPrompt`](/docs/components/chat-prompt) component automatically handles:
- Form submission when pressing :kbd{value="enter"}
- Auto-resizing as you type
- A loading state when `status` is set to `streaming`
- Focus management and keyboard shortcuts

## Creating the chat page

The chat page is where the actual conversation happens. It integrates the AI SDK's [`Chat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/chat) class and [`DefaultChatTransport`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/default-chat-transport) for real-time streaming.

::code-tree-intersection
:::code-collapse

```vue [app/pages/chat/[id].vue] {2-4,19-38}
<script setup lang="ts">
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'

const route = useRoute()
const toast = useToast()

// Fetch existing chat data
const { data: chatData } = await useFetch(`/api/chats/${route.params.id}`)

if (!chatData.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found', fatal: true })
}

const input = ref('')

// Initialize the Chat class from AI SDK
const chat = new Chat({
  id: chatData.value.id,
  messages: chatData.value.messages,
  transport: new DefaultChatTransport({
    api: `/api/chats/${chatData.value.id}`
  }),
  onData(dataPart) {
    // Refresh the chat list when a title is generated
    if (dataPart.type === 'data-chat-title') {
      refreshNuxtData('chats')
    }
  },
  onError(error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error'
    })
  }
})

function handleSubmit(e: Event) {
  e.preventDefault()
  if (input.value.trim()) {
    chat.sendMessage({ text: input.value })
    input.value = ''
  }
}

// Auto-generate response for first message
onMounted(() => {
  if (chatData.value?.messages.length === 1) {
    chat.regenerate()
  }
})
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0' }">
    <template #body>
      <UContainer class="min-h-dvh flex flex-col py-4 sm:py-6">
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
          should-auto-scroll
          class="flex-1"
        >
          <template #content="{ message }">
            <MDC
              :value="getTextFromMessage(message)"
              :cache-key="message.id"
              class="*:first:mt-0 *:last:mb-0"
            />
          </template>
        </UChatMessages>

        <UChatPrompt
          v-model="input"
          :error="chat.error"
          variant="subtle"
          class="sticky bottom-0"
          @submit="handleSubmit"
        >
          <UChatPromptSubmit
            :status="chat.status"
            color="neutral"
            @stop="chat.stop()"
            @reload="chat.regenerate()"
          />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

:::
::

Here's a breakdown of the key parts:

**The Chat Class**

The [`Chat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/chat) class from `@ai-sdk/vue` manages the entire conversation state. It handles:
- Message history with `chat.messages`
- Connection status with `chat.status` (`ready`, `submitted`, `streaming`, `error`)
- Sending messages with `chat.sendMessage()`
- Stopping generation with `chat.stop()`
- Regenerating responses with `chat.regenerate()`

The `onData` callback receives [custom data events](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data) from the server (like `data-chat-title`), allowing you to react to server-side events during streaming.

**UChatMessages Component**

The [`UChatMessages`](/docs/components/chat-messages) component is purpose-built for AI chatbots with:
- Auto-scroll to bottom on load
- Continuous scrolling as messages stream in
- A loading indicator while the assistant processes
- An "Auto scroll" button when scrolled up

**Rendering Markdown with MDC**

AI models often respond with markdown formatting (code blocks, lists, bold text, etc.). We use the [`MDC`](https://github.com/nuxt-content/mdc#mdc) component from [`@nuxtjs/mdc`](https://github.com/nuxt-content/mdc) to render this content beautifully. The `getTextFromMessage` utility extracts the text content from AI SDK v5 message parts.

::note{to="/docs/typography"}
Nuxt UI provides pre-styled prose components, so your markdown content will be automatically styled to match your theme.
::

**UChatPromptSubmit Component**

The [`UChatPromptSubmit`](/docs/components/chat-prompt-submit) component adapts based on the chat status:
- Shows a send button when ready
- Shows a stop button while streaming
- Shows a reload button after an error

## Adding chat history

This section adds a dropdown menu to list previous chats and navigate between them.

### Listing chats API

First, create an endpoint to fetch all chats:

::code-tree-intersection
```ts [server/api/chats.get.ts]
import { defineEventHandler } from 'h3'
import { db, schema } from 'hub:db'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  return await db.query.chats.findMany({
    orderBy: () => desc(schema.chats.createdAt)
  })
})
```
::

### Building the chats history dropdown

The component uses [`UDropdownMenu`](/docs/components/dropdown-menu) with a [`UButton`](/docs/components/button) as trigger. Use [`useFetch`](https://nuxt.com/docs/api/composables/use-fetch) with a `key` to fetch and cache the chat list:

::code-tree-intersection
```vue [app/components/ChatsHistory.vue]
<script setup lang="ts">
const route = useRoute()

const { data: chats } = useFetch('/api/chats', {
  key: 'chats',
  default: () => []
})

const items = computed(() => [
  {
    label: 'New chat',
    to: '/',
    icon: 'i-lucide-plus-square',
    active: route.name === 'index'
  },
  ...chats.value.map(chat => ({
    label: chat.title || 'Untitled',
    to: `/chat/${chat.id}`,
    active: route.params.id === chat.id
  }))
])
</script>

<template>
  <UDropdownMenu :items="items" class="m-2">
    <UButton
      icon="i-lucide-messages-square"
      variant="ghost"
      label="Chats History"
      color="neutral"
      class="w-fit"
    />
  </UDropdownMenu>
</template>
```
::

## Integrating history in the home page

::code-tree-intersection
:::code-collapse

```vue [app/pages/index.vue] {28-30}
<script setup lang="ts">
const input = ref('')
const loading = ref(false)

async function createChat() {
  if (!input.value.trim()) return

  loading.value = true

  // Create a new chat on the server
  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: {
      message: {
        role: 'user',
        parts: [{ type: 'text', text: input.value }]
      }
    }
  })

  // Navigate to the chat page
  navigateTo(`/chat/${chat.id}`)
}
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <ChatsHistory />
    </template>
    <template #body>
      <UContainer class="min-h-dvh flex flex-col justify-center gap-6 py-8">
        <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
          How can I help you today?
        </h1>

        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          variant="subtle"
          placeholder="Ask me anything..."
          @submit="createChat"
        >
          <UChatPromptSubmit color="neutral" />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

:::
::

## Integrating history in the chat page

::code-tree-intersection
:::code-collapse

```vue [app/pages/chat/[id].vue] {58-60}
<script setup lang="ts">
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'

const route = useRoute()
const toast = useToast()

// Fetch existing chat data
const { data: chatData } = await useFetch(`/api/chats/${route.params.id}`)

if (!chatData.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found', fatal: true })
}

const input = ref('')

// Initialize the Chat class from AI SDK
const chat = new Chat({
  id: chatData.value.id,
  messages: chatData.value.messages,
  transport: new DefaultChatTransport({
    api: `/api/chats/${chatData.value.id}`
  }),
  onData(dataPart) {
    // Refresh the chat list when a title is generated
    if (dataPart.type === 'data-chat-title') {
      refreshNuxtData('chats')
    }
  },
  onError(error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error'
    })
  }
})

function handleSubmit(e: Event) {
  e.preventDefault()
  if (input.value.trim()) {
    chat.sendMessage({ text: input.value })
    input.value = ''
  }
}

// Auto-generate response for first message
onMounted(() => {
  if (chatData.value?.messages.length === 1) {
    chat.regenerate()
  }
})
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <ChatsHistory />
    </template>
    <template #body>
      <UContainer class="min-h-dvh flex flex-col py-4 sm:py-6">
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
          should-auto-scroll
          class="flex-1"
        >
          <template #content="{ message }">
            <MDC
              :value="getTextFromMessage(message)"
              :cache-key="message.id"
              class="*:first:mt-0 *:last:mb-0"
            />
          </template>
        </UChatMessages>

        <UChatPrompt
          v-model="input"
          :error="chat.error"
          variant="subtle"
          class="sticky bottom-0"
          @submit="handleSubmit"
        >
          <UChatPromptSubmit
            :status="chat.status"
            color="neutral"
            @stop="chat.stop()"
            @reload="chat.regenerate()"
          />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

:::
::

The `refreshNuxtData('chats')` call in the chat page's `onData` callback (as shown earlier) ensures the chat list updates automatically when a new title is generated.

## Adding multi-model support

One of the benefits of using [AI Gateway](https://vercel.com/docs/ai-gateway) is the ability to switch between models seamlessly. This section adds a model selector to the chat.

### Creating a models composable

Define the available models and persist the user's selection using [`useCookie`](https://nuxt.com/docs/api/composables/use-cookie):

::code-tree-intersection
```ts [app/composables/useModels.ts]
export function useModels() {
  const models = [
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', icon: 'i-simple-icons-openai' },
    { value: 'anthropic/claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku', icon: 'i-simple-icons-anthropic' },
    { value: 'google/gemini-2.0-flash', label: 'Gemini 2.0 Flash', icon: 'i-simple-icons-google' }
  ]

  const model = useCookie<string>('ai-model', {
    default: () => 'openai/gpt-4o-mini'
  })

  return {
    models,
    model
  }
}
```
::

### Building the model selector

Create a [`USelectMenu`](/docs/components/select-menu) component that displays the available models:

::code-tree-intersection
```vue [app/components/ModelSelect.vue]
<script setup lang="ts">
const model = defineModel<string>({ required: true })

const { models } = useModels()

const selectedModel = computed(() =>
  models.find(m => m.value === model.value)
)
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="models"
    :icon="selectedModel?.icon"
    variant="ghost"
    value-key="value"
  />
</template>
```
::

### Integrating with the chat

Update the chat page to include the model selector and pass the selected model to the server:

::code-tree-intersection
:::code-collapse

```vue [app/pages/chat/[id].vue] {8,23-25,85-87}
<script setup lang="ts">
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'

const route = useRoute()
const toast = useToast()
const { model } = useModels()

const { data: chatData } = await useFetch(`/api/chats/${route.params.id}`)

if (!chatData.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found', fatal: true })
}

const input = ref('')

const chat = new Chat({
  id: chatData.value.id,
  messages: chatData.value.messages,
  transport: new DefaultChatTransport({
    api: `/api/chats/${chatData.value.id}`,
    body: {
      model: model.value // Pass the selected model
    }
  }),
  onData(dataPart) {
    if (dataPart.type === 'data-chat-title') {
      refreshNuxtData('chats')
    }
  },
  onError(error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error'
    })
  }
})

function handleSubmit(e: Event) {
  e.preventDefault()
  if (input.value.trim()) {
    chat.sendMessage({ text: input.value })
    input.value = ''
  }
}

onMounted(() => {
  if (chatData.value?.messages.length === 1) {
    chat.regenerate()
  }
})
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <ChatsHistory />
    </template>
    <template #body>
      <UContainer class="min-h-dvh flex flex-col py-4 sm:py-6">
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
          should-auto-scroll
          class="flex-1"
        >
          <template #content="{ message }">
            <MDC
              :value="getTextFromMessage(message)"
              :cache-key="message.id"
              class="*:first:mt-0 *:last:mb-0"
            />
          </template>
        </UChatMessages>

        <UChatPrompt
          v-model="input"
          :error="chat.error"
          variant="subtle"
          class="sticky bottom-0"
          @submit="handleSubmit"
        >
          <template #footer>
            <ModelSelect v-model="model" />
          </template>

          <UChatPromptSubmit
            :status="chat.status"
            color="neutral"
            @stop="chat.stop()"
            @reload="chat.regenerate()"
          />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

:::
::

## Going further

You now have a working AI chatbot with database persistence! To take it further, consider adding:

**User Authentication**

Add authentication with [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) to let users access their chat history across devices and keep conversations private.

**AI Tools**

Extend your chatbot with [AI SDK tools](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling) that can fetch real-time data, generate charts, or interact with external APIs:

```ts
import { tool } from 'ai'
import { z } from 'zod'

const weatherTool = tool({
  description: 'Get the current weather for a location',
  parameters: z.object({
    location: z.string().describe('The city name')
  }),
  execute: async ({ location }) => {
    // Fetch weather data from an API
    return { location, temperature: 22, condition: 'Sunny' }
  }
})
```

::callout{icon="i-lucide-rocket" to="https://github.com/nuxt-ui-templates/chat" target="_blank"}
The official **AI Chat template** includes all these features and more. Get started instantly with `npx nuxi@latest init -t ui/chat my-chat-app`.
::

## Deploying to Vercel

Deploy your chatbot to Vercel with zero configuration:

```bash
npx vercel deploy
```

Then, in the Vercel dashboard:

- Enable **AI Gateway** and add credits so requests can be processed.
- Add a **Turso** database from the Vercel Marketplace and connect it to your project (it will provision the database and add the required environment variables automatically).

> Note: On Vercel, you **don’t need to manually add `AI_GATEWAY_API_KEY`** — Vercel handles the gateway configuration for deployments. Keep using `.env` locally for development.

::note{to="https://vercel.com/docs/ai-gateway" target="_blank"}
Learn more about setting up AI Gateway in the **Vercel AI Gateway documentation**.
::

## Conclusion

You've built a complete AI chatbot with:

- **A complete chat interface** using Nuxt UI components
- **Real-time streaming responses** with the AI SDK
- **Markdown rendering** with MDC for rich content display
- **Multi-model support** via AI Gateway
- **Database persistence** with SQLite (local) / Turso (production) and Drizzle ORM

The combination of Nuxt's full-stack capabilities, Nuxt UI's purpose-built chat components, a local SQLite dev database with a production Turso database, and the AI SDK's streaming infrastructure makes building AI applications straightforward and enjoyable.

**Resources:**

- [Nuxt UI Chat Components](https://ui.nuxt.com/components/chat-messages)
- [NuxtHub Database](https://hub.nuxt.com/docs/features/database)
- [AI SDK Documentation](https://ai-sdk.dev)
- [AI Gateway Documentation](https://vercel.com/docs/ai-gateway)
- [AI Chat Template](https://github.com/nuxt-ui-templates/chat)

We're excited to see what you'll build!
