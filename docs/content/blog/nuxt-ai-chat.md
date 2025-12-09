---
title: Build an AI Chatbot with Nuxt, Nuxt UI, and AI SDK
description: Learn how to build a full-featured AI chatbot with streaming responses, multiple models support, and a beautiful UI using Nuxt, Nuxt UI, and Vercel AI SDK.
navigation: false
image: /assets/blog/building-nuxt-ai-chatbot.png
illustration: /assets/blog/building-nuxt-ai-chatbot-illustration.png
authors:
  - name: Hugo Richard
    avatar:
      src: https://github.com/hugorcd.png
    to: https://x.com/hugorcd__
date: 2025-12-09T10:00:00.000Z
category: Tutorial
---

Building AI-powered applications has never been more accessible. In this tutorial, you'll learn how to create a full-featured AI chatbot using Nuxt, Nuxt UI, and the Vercel AI SDK. We'll build everything from scratch, step by step, so you understand how each piece works together.

## What We're Building

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

- Node.js 18+ installed
- A [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) API key (provides access to multiple AI providers through a single endpoint)

## Project Setup

Let's start by creating a new Nuxt project and installing the required dependencies.

```bash
npx nuxi@latest init nuxt-ai-chat
cd nuxt-ai-chat
```

Install the dependencies:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @nuxt/ui @nuxtjs/mdc ai @ai-sdk/vue @ai-sdk/gateway zod
```

```bash [yarn]
yarn add @nuxt/ui @nuxtjs/mdc ai @ai-sdk/vue @ai-sdk/gateway zod
```

```bash [npm]
npm install @nuxt/ui @nuxtjs/mdc ai @ai-sdk/vue @ai-sdk/gateway zod
```

```bash [bun]
bun add @nuxt/ui @nuxtjs/mdc ai @ai-sdk/vue @ai-sdk/gateway zod
```
::

::warning
If you're using **pnpm**, ensure that you either set [`shamefully-hoist=true`](https://pnpm.io/npmrc#shamefully-hoist) in your `.npmrc` file or install `tailwindcss` in your project's root directory.
::

Update your `nuxt.config.ts` to include Nuxt UI and MDC:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/mdc'],

  mdc: {
    headings: {
      anchorLinks: false // Disable titles anchor links in AI responses
    }
  },

  compatibilityDate: '2025-12-09'
})
```

Create a `.env` file with your AI Gateway API key:

```bash [.env]
AI_GATEWAY_API_KEY=your-api-key-here
```

::note
With [Vercel AI Gateway](https://vercel.com/docs/ai-gateway), you don't need individual API keys for OpenAI, Anthropic, or Google. The AI Gateway provides a unified API to access hundreds of models through a single endpoint.
::

## Building the Chat UI

Nuxt UI provides purpose-built components for AI chat interfaces: `UChatPrompt` for the input area and `UChatMessages` for displaying the conversation. Let's start by setting up our app structure.

### Setting Up the App

First, wrap your application with `UApp` in `app.vue`. This is required for modals, toasts, and overlays to work properly:

```vue [app.vue]
<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' }
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

### Creating the Home Page

Now let's create the home page where users can start a new conversation. The `UChatPrompt` component provides a beautiful textarea with auto-resize, keyboard shortcuts, and a submit button:

```vue [pages/index.vue]
<script setup lang="ts">
const input = ref('')
const loading = ref(false)

async function createChat() {
  if (!input.value.trim()) return

  loading.value = true

  // Create a new chat on the server
  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: { message: input.value }
  })

  // Navigate to the chat page
  navigateTo(`/chat/${chat.id}`)
}
</script>

<template>
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
```

The `UChatPrompt` component automatically handles:
- Form submission when pressing `Enter`
- Auto-resizing as you type
- A loading state when `status` is set to `streaming`
- Focus management and keyboard shortcuts

## Creating the Chat Page

Now let's build the chat page where the actual conversation happens. This is where we'll integrate the AI SDK's `Chat` class for real-time streaming.

```vue [pages/chat/[id].vue]
<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

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
```

Let's break down the key parts:

**The Chat Class**

The `Chat` class from `@ai-sdk/vue` manages the entire conversation state. It handles:
- Message history with `chat.messages`
- Connection status with `chat.status` (`ready`, `submitted`, `streaming`, `error`)
- Sending messages with `chat.sendMessage()`
- Stopping generation with `chat.stop()`
- Regenerating responses with `chat.regenerate()`

The `onData` callback receives custom data events from the server (like `data-chat-title`), allowing you to react to server-side events during streaming.

**UChatMessages Component**

The `UChatMessages` component is purpose-built for AI chatbots with:
- Auto-scroll to bottom on load
- Continuous scrolling as messages stream in
- A loading indicator while the assistant processes
- An "Auto scroll" button when scrolled up

**Rendering Markdown with MDC**

AI models often respond with markdown formatting (code blocks, lists, bold text, etc.). We use the `MDC` component from `@nuxtjs/mdc` to render this content beautifully. The `getTextFromMessage` utility from `@nuxt/ui/utils/ai` extracts the text content from AI SDK v5 message parts.

::note
Nuxt UI provides pre-styled prose components, so your markdown content will be automatically styled to match your theme.
::

**UChatPromptSubmit Component**

This component adapts based on the chat status:
- Shows a send button when ready
- Shows a stop button while streaming
- Shows a reload button after an error

## Building the Server API

Now for the exciting part: integrating AI on the server. We'll create two API endpoints using Nitro.

### Creating a Chat

First, let's create the endpoint that initializes a new chat and saves the first message to the database:

```ts [server/api/chats.post.ts]
export default defineEventHandler(async (event) => {
  const { message } = await readBody(event)

  const db = useDrizzle()

  // Create a new chat
  const [chat] = await db.insert(tables.chats).values({}).returning()

  // Save the first user message
  await db.insert(tables.messages).values({
    chatId: chat.id,
    role: 'user',
    parts: [{ type: 'text', text: message }]
  })

  return chat
})
```

### Streaming AI Responses

Now let's create the endpoint that handles the AI conversation. This is where the magic happens:

```ts [server/api/chats/[id].post.ts]
import { createGateway } from '@ai-sdk/gateway'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText
} from 'ai'
import type { UIMessage } from 'ai'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  const { model, messages } = await readValidatedBody(event, z.object({
    model: z.string().default('openai/gpt-4o-mini'),
    messages: z.array(z.custom<UIMessage>())
  }).parse)

  const db = useDrizzle()

  // Fetch the chat from the database
  const chat = await db.query.chats.findFirst({
    where: (chat, { eq }) => eq(chat.id, id as string)
  })

  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  // Initialize the AI Gateway
  const gateway = createGateway({
    apiKey: process.env.AI_GATEWAY_API_KEY
  })

  // Generate a title for the chat if it doesn't have one
  if (!chat.title) {
    const { text: title } = await generateText({
      model: gateway('openai/gpt-4o-mini'),
      system: `Generate a short title (max 30 characters) based on the user's message. No quotes or punctuation.`,
      prompt: JSON.stringify(messages[0])
    })

    await db.update(tables.chats).set({ title }).where(eq(tables.chats.id, id))
  }

  // Save the user message if it's a follow-up
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await db.insert(tables.messages).values({
      chatId: id,
      role: 'user',
      parts: lastMessage.parts
    })
  }

  // Create the streaming response
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const result = streamText({
        model: gateway(model),
        system: `You are a helpful AI assistant. Be concise and friendly.`,
        messages: convertToModelMessages(messages)
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
      await db.insert(tables.messages).values(messages.map(message => ({
        chatId: chat.id,
        role: message.role as 'user' | 'assistant',
        parts: message.parts
      })))
    }
  })

  return createUIMessageStreamResponse({ stream })
})
```

Let's understand what's happening:

**AI Gateway**

The `createGateway` function creates a unified interface to access any AI model. You specify the model using the format `provider/model-name`:
- `openai/gpt-4o-mini`
- `anthropic/claude-3-5-sonnet-latest`
- `google/gemini-2.0-flash`

**Automatic Title Generation**

When a chat doesn't have a title yet, we use `generateText` to create one based on the first message. This provides a better UX by showing meaningful titles in the chat history instead of "Untitled".

**Streaming with streamText**

The `streamText` function generates a streaming response from the AI model. Key options include:
- `model`: The AI model to use
- `system`: Instructions that guide the AI's behavior
- `messages`: The conversation history

**UIMessageStream**

The `createUIMessageStream` and `createUIMessageStreamResponse` functions create a stream that the AI SDK client can consume. The response streams chunks as they're generated, creating the real-time typing effect.

The `writer.write()` method allows sending custom data events to the client (like `data-chat-title`), while `onFinish` is called when streaming completes, perfect for persisting the assistant's response.

### Fetching a Chat

Add an endpoint to fetch existing chat data from your database:

```ts [server/api/chats/[id].get.ts]
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const db = useDrizzle()

  const chat = await db.query.chats.findFirst({
    where: (chat, { eq }) => eq(chat.id, id as string),
    with: {
      messages: {
        orderBy: (message, { asc }) => asc(message.createdAt)
      }
    }
  })

  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  return chat
})
```

::note
This example uses [Drizzle ORM](https://orm.drizzle.team) with a `chats` and `messages` schema. Check the [AI Chat template](https://github.com/nuxt-ui-templates/chat) for a complete database setup with PostgreSQL.
::

## Switching Between AI Models

One of the benefits of using AI Gateway is the ability to switch between models seamlessly. Let's add a model selector to our chat.

### Creating a Models Composable

```ts [composables/useModels.ts]
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

### Building the Model Selector

```vue [components/ModelSelect.vue]
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

### Integrating with the Chat

Update the chat page to include the model selector and pass the selected model to the server:

```vue [pages/chat/[id].vue]
<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

const route = useRoute()
const { model } = useModels()

const { data: chatData } = await useFetch(`/api/chats/${route.params.id}`)

const input = ref('')

const chat = new Chat({
  id: chatData.value.id,
  messages: chatData.value.messages,
  transport: new DefaultChatTransport({
    api: `/api/chats/${chatData.value.id}`,
    body: {
      model: model.value // Pass the selected model
    }
  })
})

// ... rest of the component
</script>

<template>
  <UContainer class="min-h-dvh flex flex-col py-4 sm:py-6">
    <UChatMessages :messages="chat.messages" :status="chat.status" should-auto-scroll class="flex-1">
      <template #content="{ message }">
        <MDC :value="getTextFromMessage(message)" :cache-key="message.id" class="*:first:mt-0 *:last:mb-0" />
      </template>
    </UChatMessages>

    <UChatPrompt v-model="input" :error="chat.error" variant="subtle" @submit="handleSubmit">
      <template #footer>
        <ModelSelect v-model="model" />
      </template>

      <UChatPromptSubmit :status="chat.status" color="neutral" @stop="chat.stop()" @reload="chat.regenerate()" />
    </UChatPrompt>
  </UContainer>
</template>
```

## Going Further

You now have a working AI chatbot! For production applications, you'll want to add:

**Chat History Persistence**

Store conversations in a database using [Drizzle ORM](https://orm.drizzle.team) with PostgreSQL or SQLite.

**User Authentication**

Add authentication with [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) to let users access their chat history across devices.

**AI Tools**

Extend your chatbot with tools that can fetch real-time data, generate charts, or interact with external APIs:

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
npx vercel
```

Make sure to add your environment variables in the Vercel dashboard:
- `AI_GATEWAY_API_KEY`: Your Vercel AI Gateway API key

::note{to="https://vercel.com/docs/ai-gateway" target="_blank"}
Learn more about setting up AI Gateway in the **Vercel AI Gateway documentation**.
::

## Conclusion

You've built a complete AI chatbot with:

- **A beautiful chat interface** using Nuxt UI components
- **Real-time streaming responses** with the AI SDK
- **Markdown rendering** with MDC for rich content display
- **Multi-model support** via AI Gateway
- **Server-side AI integration** with Nitro

The combination of Nuxt's full-stack capabilities, Nuxt UI's purpose-built chat components, and the AI SDK's streaming infrastructure makes building AI applications straightforward and enjoyable.

**Resources:**

- [Nuxt UI Chat Components](https://ui.nuxt.com/components/chat-messages)
- [AI SDK Documentation](https://ai-sdk.dev)
- [AI Gateway Documentation](https://vercel.com/docs/ai-gateway)
- [AI Chat Template](https://github.com/nuxt-ui-templates/chat)

We're excited to see what you'll build!
