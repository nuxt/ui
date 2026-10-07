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
Use the `isToolStreaming` utility from `@nuxt/ui/utils/ai` to determine if a tool part is still running. It returns `false` when the tool is waiting for a user approval.
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

### With approval flow :badge{label="4.10+" class="align-text-top"}

Use the `actions` prop to build a tool approval flow with the [AI SDK](https://ai-sdk.dev/docs/agents/tool-approvals). When a tool part is in the `approval-requested` state, display the approve and deny actions and respond with `addToolApprovalResponse`.

::component-example
---
collapse: true
prettier: true
name: 'chat-tool-approval-example'
---
::

::tip
Use the `isToolApprovalPending` utility from `@nuxt/ui/utils/ai` to detect a pending approval, `isToolStreaming` returns `false` in this state.

```vue
<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'

const { messages, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses
})
</script>

<template>
  <UChatTool
    v-if="isToolUIPart(part)"
    :text="getToolName(part)"
    :streaming="isToolStreaming(part)"
    :actions="part.state === 'approval-requested' ? [
      { label: 'Approve', onClick: () => addToolApprovalResponse({ id: part.approval.id, approved: true }) },
      { label: 'Deny', color: 'neutral', variant: 'ghost', onClick: () => addToolApprovalResponse({ id: part.approval.id, approved: false }) }
    ] : undefined"
  />
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
