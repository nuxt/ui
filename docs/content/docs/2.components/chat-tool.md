---
title: ChatTool
description: Display a collapsible AI tool invocation status.
category: chat
links:
  - label: Collapsible
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/collapsible
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ChatTool.vue
---

## Usage

The ChatTool component renders a collapsible block that displays AI tool invocation status, such as "Searching components" or "Reading documentation". When a default slot is provided, it becomes collapsible to reveal tool output.

::component-example
---
collapse: true
prettier: true
name: 'chat-tool-example'
---
::

::tip
When the output arrives later, put the `v-if` on the slot itself rather than on its content. A slot that renders nothing still makes the block collapsible, with an empty panel.

```vue
<template>
  <UChatTool :text="getToolName(part)" :streaming="isToolStreaming(part)">
    <template v-if="part.state === 'output-available'" #default>
      <pre>{{ part.output }}</pre>
    </template>
  </UChatTool>
</template>
```
::

### Text

Use the `text` prop to set the tool status text.

::component-code
---
hide:
  - class
props:
  text: 'Searched components'
  class: 'w-60'
---
::

### Suffix

Use the `suffix` prop to display secondary text after the main label.

::component-code
---
hide:
  - class
ignore:
  - text
props:
  text: 'Reading component'
  suffix: 'Button'
  class: 'w-60'
---
::

### Streaming

Use the `streaming` prop to indicate the tool is actively running. The text displays a shimmer animation.

::component-code
---
hide:
  - class
ignore:
  - text
props:
  streaming: true
  text: 'Searching components...'
  class: 'w-60'
---
::

::tip
Use the `isToolStreaming` utility from `@nuxt/ui/utils/ai` to determine if a tool part is still running. It returns `false` when the tool is waiting for a user approval. Pass it the `streaming` slot prop of [ChatMessages](/docs/components/chat-messages#slots) so it stops when the chat is stopped.
::

### Shimmer

When streaming, the trigger label uses the [`ChatShimmer`](/docs/components/chat-shimmer) component. Use the `shimmer` prop to customize its `duration` and `spread`.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
props:
  streaming: true
  text: 'Searching components...'
  shimmer:
    duration: 2
    spread: 2
  class: 'w-60'
---
::

### Icon

Use the `icon` prop to display an [Icon](/docs/components/icon) component next to the trigger.

::component-code
---
hide:
  - class
ignore:
  - text
props:
  icon: i-lucide-search
  text: 'Searched components'
  class: 'w-60'
---
::

### Loading

Use the `loading` prop to show a loading indicator. Use the `loading-icon` prop to customize the loading icon.

::component-code
---
hide:
  - class
ignore:
  - text
props:
  loading: true
  text: 'Searching components...'
  class: 'w-60'
---
::

### Loading Icon

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-lucide-loader-circle`.

::component-code
---
hide:
  - class
ignore:
  - text
props:
  loading: true
  loadingIcon: 'i-lucide-loader'
  text: 'Searching components...'
  class: 'w-60'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.loading` key.
:::
::

### Error :badge{label="Soon" class="align-text-top"}

Use the `error` prop to show that the tool call failed, for example when the part state is `output-error`. Use the `error-icon` prop to customize the error icon.

::component-code
---
hide:
  - class
ignore:
  - text
props:
  error: true
  text: 'Failed to search components'
  class: 'w-60'
---
::

### Error Icon :badge{label="Soon" class="align-text-top"}

Use the `error-icon` prop to customize the error icon. Defaults to `i-lucide-circle-x`.

::component-code
---
hide:
  - class
ignore:
  - text
props:
  error: true
  errorIcon: 'i-lucide-circle-alert'
  text: 'Failed to search components'
  class: 'w-60'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.error` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.error` key.
:::
::

### Chevron

Use the `chevron` prop to change the position of the chevron icon.

::note
When `chevron` is set to `leading` with an `icon`, the icon swaps with the chevron on hover and when open.
::

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
props:
  chevron: leading
  icon: i-lucide-search
  text: 'Searched components'
  class: 'w-60'
slots:
  default: |

    Tool output content
---
::

### Chevron Icon

Use the `chevron-icon` prop to customize the chevron [Icon](/docs/components/icon). Defaults to `i-lucide-chevron-down`.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
props:
  chevronIcon: 'i-lucide-arrow-down'
  text: 'Searched components'
  class: 'w-60'
slots:
  default: |

    Tool output content
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronDown` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.chevronDown` key.
:::
::

### Variant

Use the `variant` prop to change the visual style. Defaults to `inline`.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
  - icon
props:
  variant: card
  text: 'Searched components'
  icon: i-lucide-search
  chevron: trailing
  class: 'w-60'
slots:
  default: |

    Tool output content
---
::

### Actions :badge{label="4.10+" class="align-text-top"}

Use the `actions` prop to display a list of [Button](/docs/components/button) below the trigger, useful for tools that require a user confirmation before running.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
  - icon
  - variant
  - actions
props:
  actions:
    - label: 'Approve'
    - label: 'Deny'
      color: neutral
      variant: soft
  text: 'Run terminal command'
  variant: card
  icon: i-lucide-terminal
  class: 'w-60'
slots:
  default: |

    $ pnpm run lint
---
::

## Examples

::tip{to="/docs/components/chat"}
Check the **Chat** overview page for installation instructions, server setup and usage examples.
::

### With web search

Some providers offer built-in web search tools: [Anthropic](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic#web-search-tool), [Google](https://ai-sdk.dev/providers/ai-sdk-providers/google#google-search), [OpenAI](https://ai-sdk.dev/providers/ai-sdk-providers/openai#web-search-tool). Their calls reach the client as tool parts, so you render them with the ChatTool component like any other tool.

Each tool comes from its provider package, so install the one you use: `@ai-sdk/anthropic`, `@ai-sdk/google` or `@ai-sdk/openai`.

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

### With MCP tools

Give your chatbot tools from a [Model Context Protocol (MCP)](https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools) server with `@ai-sdk/mcp`, for example to search your documentation or run custom tasks before answering.

Install the MCP package:

::code-group{sync="pm"}

```bash [pnpm]
pnpm add @ai-sdk/mcp
```

```bash [yarn]
yarn add @ai-sdk/mcp
```

```bash [npm]
npm install @ai-sdk/mcp
```

```bash [bun]
bun add @ai-sdk/mcp
```

::

Then pass the MCP tools to `streamText` in your server endpoint:

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

### With approval flow :badge{label="4.10+" class="align-text-top"}

Use the `actions` prop to build a tool approval flow with the [AI SDK](https://ai-sdk.dev/docs/agents/tool-approvals). When a tool part is in the `approval-requested` state, display the approve and deny actions and respond with `addToolApprovalResponse`.

::component-example
---
collapse: true
prettier: true
name: 'chat-tool-approval-example'
---
::

On the server, require the approval with the [`toolApproval`](https://ai-sdk.dev/docs/agents/tool-approvals) option. The tool part pauses in the `approval-requested` state until the user responds:

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

::tip
Use the `isToolApprovalPending` utility from `@nuxt/ui/utils/ai` to detect a pending approval, `isToolStreaming` returns `false` in this state.

```vue
<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { isToolUIPart, getToolName, lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { isToolStreaming } from '@nuxt/ui/utils/ai'

const { messages, status, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses
})
</script>

<template>
  <UChatMessages :messages="messages" :status="status">
    <template #part="{ part, streaming }">
      <UChatTool
        v-if="isToolUIPart(part)"
        :text="getToolName(part)"
        :streaming="isToolStreaming(part, streaming)"
        :actions="part.state === 'approval-requested' ? [
          { label: 'Approve', onClick: () => addToolApprovalResponse({ id: part.approval.id, approved: true }) },
          { label: 'Deny', color: 'neutral', variant: 'ghost', onClick: () => addToolApprovalResponse({ id: part.approval.id, approved: false }) }
        ] : undefined"
      />
    </template>
  </UChatMessages>
</template>
```
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme

## Changelog

:component-changelog
