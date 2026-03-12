---
title: Chat
description: Build AI chat interfaces with streaming, reasoning, and tool calling.
category: chat
index: true
links:
  - label: AI SDK
    icon: i-simple-icons-vercel
    to: https://ai-sdk.dev/
    target: _blank
---

Nuxt UI provides a set of components designed to build AI-powered chat interfaces. They integrate seamlessly with the [Vercel AI SDK](https://ai-sdk.dev/) for streaming responses, reasoning, tool calling, and more.

::callout{icon="i-simple-icons-github"}
Check out the [`Nuxt`](https://github.com/nuxt-ui-templates/chat){target="_blank"} and [`Vue`](https://github.com/nuxt-ui-templates/chat-vue){target="_blank"} AI Chat templates on GitHub for production-ready implementations.
::

## Components

| Component | Description |
| --- | --- |
| [ChatMessages](/docs/components/chat-messages) | Scrollable message list with auto-scroll and loading indicator. |
| [ChatMessage](/docs/components/chat-message) | Individual message bubble with avatar, actions, and slots. |
| [ChatPrompt](/docs/components/chat-prompt) | Enhanced textarea for submitting prompts. |
| [ChatPromptSubmit](/docs/components/chat-prompt-submit) | Submit button with automatic status handling. |
| [ChatReasoning](/docs/components/chat-reasoning) | Collapsible block for AI reasoning / thinking process. |
| [ChatTool](/docs/components/chat-tool) | Collapsible block for AI tool invocation status. |
| [ChatShimmer](/docs/components/chat-shimmer) | Text shimmer animation for streaming states. |
| [ChatPalette](/docs/components/chat-palette) | Layout wrapper for embedding chat in modals or drawers. |

## Installation

The Chat components are designed to be used with the [Vercel AI SDK](https://ai-sdk.dev/), specifically the [`Chat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) class for managing chat state and streaming responses.

Install the required dependencies:

::code-group{sync="pm"}

```bash [pnpm]
pnpm add ai @ai-sdk/gateway @ai-sdk/vue
```

```bash [yarn]
yarn add ai @ai-sdk/gateway @ai-sdk/vue
```

```bash [npm]
npm install ai @ai-sdk/gateway @ai-sdk/vue
```

```bash [bun]
bun add ai @ai-sdk/gateway @ai-sdk/vue
```

::

## Server Setup

Create a server API endpoint to handle chat requests using [`streamText`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text). You can use the [Vercel AI Gateway](https://vercel.com/ai-gateway) to access AI models through a centralized endpoint:

```ts [server/api/chat.post.ts]
import { streamText, convertToModelMessages } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    maxOutputTokens: 10000,
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages)
  }).toUIMessageStreamResponse()
})
```

### Reasoning

To enable [reasoning](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot#reasoning), configure `providerOptions` for your provider ([Anthropic](https://ai-sdk.dev/docs/guides/providers/anthropic#reasoning), [Google](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai#thinking), [OpenAI](https://ai-sdk.dev/docs/guides/providers/openai#reasoning)):

```ts [server/api/chat.post.ts]
import { streamText, convertToModelMessages } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    maxOutputTokens: 10000,
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    providerOptions: {
      anthropic: {
        thinking: {
          type: 'adaptive'
        },
        effort: 'low'
      },
      google: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingLevel: 'low'
        }
      },
      openai: {
        reasoningEffort: 'low',
        reasoningSummary: 'detailed'
      }
    }
  }).toUIMessageStreamResponse()
})
```

### Web Search

Some providers offer built-in web search tools: [Anthropic](https://ai-sdk.dev/docs/guides/providers/anthropic#web-search-tool), [Google](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai#google-search), [OpenAI](https://ai-sdk.dev/providers/ai-sdk-providers/openai#web-search-tool).

::code-group

```ts [Anthropic]
import { streamText, convertToModelMessages } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    tools: {
      web_search: anthropic.tools.webSearch_20250305({})
    }
  }).toUIMessageStreamResponse()
})
```

```ts [Google]
import { streamText, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('google/gemini-3-flash'),
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    tools: {
      google_search: google.tools.googleSearch({})
    }
  }).toUIMessageStreamResponse()
})
```

```ts [OpenAI]
import { streamText, convertToModelMessages } from 'ai'
import { openai } from '@ai-sdk/openai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('openai/gpt-5-nano'),
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    tools: {
      web_search: openai.tools.webSearch({})
    }
  }).toUIMessageStreamResponse()
})
```

::

### Tool Calling (MCP)

You can enhance your chatbot with tool calling capabilities using the [Model Context Protocol](https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools) (`@ai-sdk/mcp`). This allows the AI to search your documentation or perform other actions:

```ts [server/api/chat.post.ts]
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import { experimental_createMCPClient } from '@ai-sdk/mcp'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const httpTransport = new StreamableHTTPClientTransport(
    new URL('https://your-app.com/mcp')
  )
  const httpClient = await experimental_createMCPClient({
    transport: httpTransport
  })
  const tools = await httpClient.tools()

  return streamText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    maxOutputTokens: 10000,
    system: 'You are a helpful assistant. Use your tools to search for relevant information before answering questions.',
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(6),
    tools,
    onFinish: async () => {
      await httpClient.close()
    },
    onError: async (error) => {
      console.error(error)
      await httpClient.close()
    }
  }).toUIMessageStreamResponse()
})
```

## Client Setup

Use the `Chat` class from `@ai-sdk/vue` to manage chat state and connect to your server endpoint:

```vue
<script setup lang="ts">
import type { UIMessage } from 'ai'
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { isReasoningStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'

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
  <UChatMessages
    :messages="chat.messages"
    :status="chat.status"
  >
    <template #content="{ message }">
      <template
        v-for="(part, index) in message.parts"
        :key="`${message.id}-${part.type}-${index}`"
      >
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

  <UChatPrompt
    v-model="input"
    :error="chat.error"
    @submit="onSubmit"
  >
    <UChatPromptSubmit
      :status="chat.status"
      @stop="chat.stop()"
      @reload="chat.regenerate()"
    />
  </UChatPrompt>
</template>
```

::note
In this example, we use the `MDC` component from [`@nuxtjs/mdc`](https://github.com/nuxt-modules/mdc) to render messages as Markdown. As Nuxt UI provides pre-styled prose components, your content will be automatically styled.
::

::tip{to="/blog/how-to-build-an-ai-chat"}
Read the full **Build an AI Chatbot** tutorial for a step-by-step guide.
::
