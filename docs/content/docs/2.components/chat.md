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
Check out the [`Nuxt`](https://github.com/nuxt-ui-templates/chat) and [`Vue`](https://github.com/nuxt-ui-templates/chat-vue) AI Chat templates on GitHub for production-ready implementations.
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

::framework-only
#nuxt
:::div

::::code-group{sync="pm"}

```bash [pnpm]
pnpm add ai @ai-sdk/gateway @ai-sdk/vue @comark/nuxt
```

```bash [yarn]
yarn add ai @ai-sdk/gateway @ai-sdk/vue @comark/nuxt
```

```bash [npm]
npm install ai @ai-sdk/gateway @ai-sdk/vue @comark/nuxt
```

```bash [bun]
bun add ai @ai-sdk/gateway @ai-sdk/vue @comark/nuxt
```

::::

Add `@comark/nuxt` to your modules:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@comark/nuxt'
  ]
})
```

::::note
[`@comark/nuxt`](https://comark.dev/rendering/nuxt) provides the `Comark` component used to render AI responses as streaming Markdown, it incrementally renders tokens as they arrive, avoiding the flicker and re-parsing that traditional Markdown renderers cause. It also automatically enables Nuxt UI's [prose components](/docs/typography) so your content is styled to match your theme.
::::

:::

#vue
:::div

::::code-group{sync="pm"}

```bash [pnpm]
pnpm add ai @ai-sdk/gateway @ai-sdk/vue @comark/vue
```

```bash [yarn]
yarn add ai @ai-sdk/gateway @ai-sdk/vue @comark/vue
```

```bash [npm]
npm install ai @ai-sdk/gateway @ai-sdk/vue @comark/vue
```

```bash [bun]
bun add ai @ai-sdk/gateway @ai-sdk/vue @comark/vue
```

::::

::::note
[`@comark/vue`](https://comark.dev/rendering/vue) provides the `Comark` component used to render AI responses as streaming Markdown, it incrementally renders tokens as they arrive, avoiding the flicker and re-parsing that traditional Markdown renderers cause.
<br><br>To use Nuxt UI's [prose components](/docs/typography) with Comark, enable the `prose` option in your `vite.config.ts`:

```ts [vite.config.ts] {9}
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      prose: true
    })
  ]
})
```
::::

:::

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

### MCP Client

Empower your chatbot with advanced tool-calling features using the [Model Context Protocol (MCP)](https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools) from `@ai-sdk/mcp`. MCP enables your AI to perform dynamic actions, such as searching your documentation or executing custom tasks, to provide more relevant and accurate responses.

To get started, install the MCP package:

:::code-group

```bash [npm]
npm install @ai-sdk/mcp
```

```bash [pnpm]
pnpm add @ai-sdk/mcp
```

```bash [yarn]
yarn add @ai-sdk/mcp
```

:::

Then, configure your server endpoint to use MCP tools:

```ts [server/api/chat.post.ts]
import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import { createMCPClient } from '@ai-sdk/mcp'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const httpClient = await createMCPClient({
    transport: { type: 'http', url: 'https://your-app.com/mcp' }
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

::framework-only
#nuxt
```vue
<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import highlight from '@comark/nuxt/plugins/highlight'

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

#vue
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import { Comark } from '@comark/vue'
import highlight from '@comark/vue/plugins/highlight'

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

::

::tip
For reusable Comark configuration (plugins, class, etc.), use [`defineComarkComponent`](https://comark.dev/rendering/vue#code-definecomarkcomponent) to create a custom component instead of passing props inline each time.

::framework-only
#nuxt
:::div{class="*:my-0"}
```ts [components/chat/Comark.ts]
import highlight from '@comark/nuxt/plugins/highlight'

export default defineComarkComponent({
  name: 'ChatComark',
  plugins: [highlight()],
  class: '*:first:mt-0 *:last:mb-0'
})
```
:::

#vue
:::div{class="*:my-0"}
```ts [components/chat/Comark.ts]
import { defineComarkComponent } from '@comark/vue'
import highlight from '@comark/vue/plugins/highlight'

export default defineComarkComponent({
  name: 'ChatComark',
  plugins: [highlight()],
  class: '*:first:mt-0 *:last:mb-0'
})
```
:::
::

::

::note
When using the `highlight` plugin, add the following CSS to your stylesheet to support dark mode:

```css [main.css]
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```
::

::note{to="/blog/how-to-build-an-ai-chat"}
Read the full **Build an AI Chatbot** tutorial for a step-by-step guide.
::
