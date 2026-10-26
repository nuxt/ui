---
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

The Chat components are designed to be used with the [Vercel AI SDK](https://ai-sdk.dev/), specifically the [`Chat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) class for managing chat state and streaming responses. The examples on this page target AI SDK v7.

Install the required dependencies:

::framework-only
#nuxt
:::div

::::code-group{sync="pm"}

```bash [pnpm]
pnpm add ai @ai-sdk/vue @comark/nuxt
```

```bash [yarn]
yarn add ai @ai-sdk/vue @comark/nuxt
```

```bash [npm]
npm install ai @ai-sdk/vue @comark/nuxt
```

```bash [bun]
bun add ai @ai-sdk/vue @comark/nuxt
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
[`@comark/nuxt`](https://comark.dev/rendering/nuxt) provides the `Markdown` component used to render AI responses as streaming Markdown, it incrementally renders tokens as they arrive, avoiding the flicker and re-parsing that traditional Markdown renderers cause. It also automatically enables Nuxt UI's [prose components](/docs/typography) so your content is styled to match your theme.
::::

:::

#vue
:::div

::::code-group{sync="pm"}

```bash [pnpm]
pnpm add ai @ai-sdk/vue @comark/vue
```

```bash [yarn]
yarn add ai @ai-sdk/vue @comark/vue
```

```bash [npm]
npm install ai @ai-sdk/vue @comark/vue
```

```bash [bun]
bun add ai @ai-sdk/vue @comark/vue
```

::::

::::note
[`@comark/vue`](https://comark.dev/rendering/vue) provides the `Markdown` component used to render AI responses as streaming Markdown, it incrementally renders tokens as they arrive, avoiding the flicker and re-parsing that traditional Markdown renderers cause.
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
import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse } from 'ai'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: 'anthropic/claude-sonnet-5.5',
    maxOutputTokens: 10000,
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages)
  })

  const stream = toUIMessageStream({ stream: result.stream })
  return createUIMessageStreamResponse({ stream })
})
```

### Reasoning

To enable [reasoning](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot#reasoning), configure `providerOptions` for your provider ([Anthropic](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic#reasoning), [Google](https://ai-sdk.dev/providers/ai-sdk-providers/google#thinking), [OpenAI](https://ai-sdk.dev/providers/ai-sdk-providers/openai#reasoning)):

```ts [server/api/chat.post.ts]
import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse } from 'ai'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: 'anthropic/claude-sonnet-5.5',
    maxOutputTokens: 10000,
    instructions: 'You are a helpful assistant.',
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
  })

  const stream = toUIMessageStream({ stream: result.stream })
  return createUIMessageStreamResponse({ stream })
})
```

### Web Search

Some providers offer built-in web search tools: [Anthropic](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic#web-search-tool), [Google](https://ai-sdk.dev/providers/ai-sdk-providers/google#google-search), [OpenAI](https://ai-sdk.dev/providers/ai-sdk-providers/openai#web-search-tool).

::code-group

```ts [Anthropic]
import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: 'anthropic/claude-sonnet-5.5',
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    tools: {
      web_search: anthropic.tools.webSearch_20260209({})
    }
  })

  const stream = toUIMessageStream({ stream: result.stream })
  return createUIMessageStreamResponse({ stream })
})
```

```ts [Google]
import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { google } from '@ai-sdk/google'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: 'google/gemini-3-flash',
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    tools: {
      google_search: google.tools.googleSearch({})
    }
  })

  const stream = toUIMessageStream({ stream: result.stream })
  return createUIMessageStreamResponse({ stream })
})
```

```ts [OpenAI]
import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { openai } from '@ai-sdk/openai'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: 'openai/gpt-5-nano',
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    tools: {
      web_search: openai.tools.webSearch({})
    }
  })

  const stream = toUIMessageStream({ stream: result.stream })
  return createUIMessageStreamResponse({ stream })
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
import { streamText, convertToModelMessages, isStepCount, toUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { createMCPClient } from '@ai-sdk/mcp'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const httpClient = await createMCPClient({
    transport: { type: 'http', url: 'https://your-app.com/mcp' }
  })
  try {
    const tools = await httpClient.tools()

    const result = streamText({
      model: 'anthropic/claude-sonnet-5.5',
      maxOutputTokens: 10000,
      instructions: 'You are a helpful assistant. Use your tools to search for relevant information before answering questions.',
      messages: await convertToModelMessages(messages),
      stopWhen: isStepCount(6),
      tools,
      onEnd: async () => {
        await httpClient.close()
      },
      onError: async (error) => {
        console.error(error)
        await httpClient.close()
      }
    })

    const stream = toUIMessageStream({ stream: result.stream })
    return createUIMessageStreamResponse({ stream })
  } catch (error) {
    // Close the MCP client if setup fails before streaming starts
    await httpClient.close()
    throw error
  }
})
```

### Tool Approval

Require a user confirmation before a tool runs with the [`toolApproval`](https://ai-sdk.dev/docs/agents/tool-approvals) option. The tool part pauses in the `approval-requested` state until the user responds:

```ts [server/api/chat.post.ts]
import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse, tool } from 'ai'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: 'anthropic/claude-sonnet-5.5',
    maxOutputTokens: 10000,
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    tools: {
      deleteFile: tool({
        description: 'Delete a file from the project',
        inputSchema: z.object({ path: z.string() }),
        execute: async ({ path }) => ({ deleted: path })
      })
    },
    toolApproval: {
      deleteFile: 'user-approval'
    }
  })

  const stream = toUIMessageStream({ stream: result.stream })
  return createUIMessageStreamResponse({ stream })
})
```

## Client Setup

Use the `useChat` composable from `@ai-sdk/vue` to manage chat state and connect to your server endpoint:

::framework-only
#nuxt
```vue
<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName, lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { useChat } from '@ai-sdk/vue'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import shiki from '@comark/nuxt/plugins/shiki'

const plugins = [shiki()]

const input = ref('')

const { messages, status, error, sendMessage, regenerate, stop, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  onError(error) {
    console.error(error)
  }
})

function onSubmit() {
  sendMessage({ text: input.value })

  input.value = ''
}
</script>

<template>
  <UChatMessages
    :messages="messages"
    :status="status"
  >
    <template #part="{ part, message, streaming }">
      <UChatReasoning
        v-if="isReasoningUIPart(part)"
        :text="part.text"
        :streaming="isPartStreaming(part, streaming)"
      >
        <Markdown
          :value="part.text"
          :streaming="isPartStreaming(part, streaming)"
          :plugins="plugins"
          class="*:first:mt-0 *:last:mb-0"
        />
      </UChatReasoning>

      <UChatTool
        v-else-if="isToolUIPart(part)"
        :text="getToolName(part)"
        :streaming="isToolStreaming(part, streaming)"
        :error="part.state === 'output-error'"
        :actions="part.state === 'approval-requested' ? [
          { label: 'Approve', onClick: () => addToolApprovalResponse({ id: part.approval.id, approved: true }) },
          { label: 'Deny', color: 'neutral', variant: 'ghost', onClick: () => addToolApprovalResponse({ id: part.approval.id, approved: false }) }
        ] : undefined"
      />

      <Markdown
        v-else-if="isTextUIPart(part) && message.role === 'assistant'"
        :value="part.text"
        :streaming="isPartStreaming(part, streaming)"
        :plugins="plugins"
        class="*:first:mt-0 *:last:mb-0"
      />
    </template>
  </UChatMessages>

  <UChatPrompt
    v-model="input"
    :status="status"
    :error="error"
    @submit="onSubmit"
  >
    <UChatPromptSubmit
      :status="status"
      @stop="stop()"
      @reload="regenerate()"
    />
  </UChatPrompt>
</template>
```

#vue
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName, lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { useChat } from '@ai-sdk/vue'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import { Markdown } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'

const plugins = [shiki()]

const input = ref('')

const { messages, status, error, sendMessage, regenerate, stop, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  onError(error) {
    console.error(error)
  }
})

function onSubmit() {
  sendMessage({ text: input.value })

  input.value = ''
}
</script>

<template>
  <UChatMessages
    :messages="messages"
    :status="status"
  >
    <template #part="{ part, message, streaming }">
      <UChatReasoning
        v-if="isReasoningUIPart(part)"
        :text="part.text"
        :streaming="isPartStreaming(part, streaming)"
      >
        <Markdown
          :value="part.text"
          :streaming="isPartStreaming(part, streaming)"
          :plugins="plugins"
          class="*:first:mt-0 *:last:mb-0"
        />
      </UChatReasoning>

      <UChatTool
        v-else-if="isToolUIPart(part)"
        :text="getToolName(part)"
        :streaming="isToolStreaming(part, streaming)"
        :error="part.state === 'output-error'"
        :actions="part.state === 'approval-requested' ? [
          { label: 'Approve', onClick: () => addToolApprovalResponse({ id: part.approval.id, approved: true }) },
          { label: 'Deny', color: 'neutral', variant: 'ghost', onClick: () => addToolApprovalResponse({ id: part.approval.id, approved: false }) }
        ] : undefined"
      />

      <Markdown
        v-else-if="isTextUIPart(part) && message.role === 'assistant'"
        :value="part.text"
        :streaming="isPartStreaming(part, streaming)"
        :plugins="plugins"
        class="*:first:mt-0 *:last:mb-0"
      />
    </template>
  </UChatMessages>

  <UChatPrompt
    v-model="input"
    :status="status"
    :error="error"
    @submit="onSubmit"
  >
    <UChatPromptSubmit
      :status="status"
      @stop="stop()"
      @reload="regenerate()"
    />
  </UChatPrompt>
</template>
```

::

::note
The `#part` slot is called once for each part of a message, with the `part`, its `index` and the `message`. A part the slot doesn't render, like the user's text above, falls back to the default output. Use the `#content` slot instead to render the whole message yourself.
::

::tip
For reusable Comark configuration (plugins, class, etc.), use [`defineMarkdownComponent`](https://comark.dev/rendering/vue#code-markdown-code-definemarkdowncomponent-code) to create a custom component instead of passing props inline each time.

::framework-only
#nuxt
:::div{class="*:my-0"}
```ts [components/chat/Markdown.ts]
import shiki from '@comark/nuxt/plugins/shiki'

export default defineMarkdownComponent({
  name: 'ChatMarkdown',
  plugins: [shiki()],
  class: '*:first:mt-0 *:last:mb-0'
})
```
:::

#vue
:::div{class="*:my-0"}
```ts [components/chat/Markdown.ts]
import { defineMarkdownComponent } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'

export default defineMarkdownComponent({
  name: 'ChatMarkdown',
  plugins: [shiki()],
  class: '*:first:mt-0 *:last:mb-0'
})
```
:::
::

::

::note
When using the `shiki` plugin, add the following CSS to your stylesheet to support dark mode:

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

### Queued messages :badge{label="Soon" class="align-text-top"}

The AI SDK doesn't queue messages: calling `sendMessage` during a response starts a second request next to the current one. With `status`, `UChatPrompt` ignores submits while the chat is `submitted` or `streaming`. To let users send their next message anyway, leave it off, keep the text in a queue and send it once the chat is `ready` again:

::framework-only
#nuxt
```vue
<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

const input = ref('')
const queue = ref<string[]>([])

const { status, error, sendMessage, regenerate, stop } = useChat()

function sendNext() {
  const text = queue.value.shift()
  if (text) {
    sendMessage({ text })
  }
}

function onSubmit() {
  queue.value.push(input.value)
  input.value = ''

  if (status.value !== 'submitted' && status.value !== 'streaming') {
    sendNext()
  }
}

watch(status, (value) => {
  if (value === 'ready') {
    sendNext()
  }
})
</script>

<template>
  <UChatPrompt v-model="input" :error="error" @submit="onSubmit">
    <template v-if="queue.length" #header>
      <ul class="flex flex-col gap-1 w-full">
        <li v-for="(text, index) in queue" :key="index" class="flex items-center gap-2 text-sm text-muted">
          <span class="truncate flex-1">{{ text }}</span>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="`Remove ${text} from queue`"
            @click="queue.splice(index, 1)"
          />
        </li>
      </ul>
    </template>

    <UChatPromptSubmit :status="status" @stop="stop()" @reload="regenerate()" />
  </UChatPrompt>
</template>
```

#vue
```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useChat } from '@ai-sdk/vue'

const input = ref('')
const queue = ref<string[]>([])

const { status, error, sendMessage, regenerate, stop } = useChat()

function sendNext() {
  const text = queue.value.shift()
  if (text) {
    sendMessage({ text })
  }
}

function onSubmit() {
  queue.value.push(input.value)
  input.value = ''

  if (status.value !== 'submitted' && status.value !== 'streaming') {
    sendNext()
  }
}

watch(status, (value) => {
  if (value === 'ready') {
    sendNext()
  }
})
</script>

<template>
  <UChatPrompt v-model="input" :error="error" @submit="onSubmit">
    <template v-if="queue.length" #header>
      <ul class="flex flex-col gap-1 w-full">
        <li v-for="(text, index) in queue" :key="index" class="flex items-center gap-2 text-sm text-muted">
          <span class="truncate flex-1">{{ text }}</span>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="`Remove ${text} from queue`"
            @click="queue.splice(index, 1)"
          />
        </li>
      </ul>
    </template>

    <UChatPromptSubmit :status="status" @stop="stop()" @reload="regenerate()" />
  </UChatPrompt>
</template>
```
::

After an `error`, the prompt is disabled and the queue waits until the user reloads the failed response. Stopping the response sends the next queued message right away.
