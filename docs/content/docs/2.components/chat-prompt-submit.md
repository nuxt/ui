---
title: ChatPromptSubmit
description: 'A Button for submitting chat prompts with automatic status handling.'
category: chat
links:
  - label: Button
    to: /docs/components/button
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ChatPromptSubmit.vue
---

## Usage

The ChatPromptSubmit component is used inside the [ChatPrompt](/docs/components/chat-prompt) component to submit the prompt. It automatically handles the different `status` values to control the chat.

It extends the [Button](/docs/components/button) component, so you can pass any property such as `color`, `variant`, `size`, etc.

::code-preview

#default
:u-chat-prompt-submit

#code
```vue
<template>
  <UChatPrompt>
    <UChatPromptSubmit />
  </UChatPrompt>
</template>
```
::

::note
You can also use it inside the `footer` slot of the [`ChatPrompt`](/docs/components/chat-prompt) component.
::

### Ready

When its status is `ready`{lang="ts-type"}, use the `color`, `variant` and `icon` props to customize the Button. Defaults to:

- `color="primary"`{lang="ts-type"}
- `variant="solid"`{lang="ts-type"}
- `icon="i-lucide-arrow-up"`{lang="ts-type"}

::component-code
---
prettier: true
items:
  color:
    - primary
    - secondary
    - success
    - warning
    - error
    - neutral
  variant:
    - solid
    - outline
    - soft
    - subtle
    - ghost
props:
  color: 'primary'
  variant: 'solid'
  icon: 'i-lucide-arrow-up'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.arrowUp` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.arrowUp` key.
:::
::

### Submitted

When its status is `submitted`{lang="ts-type"}, use the `submitted-color`, `submitted-variant` and `submitted-icon` props to customize the Button. Defaults to:

- `submittedColor="neutral"`{lang="ts-type"}
- `submittedVariant="subtle"`{lang="ts-type"}
- `submittedIcon="i-lucide-square"`{lang="ts-type"}

::note
The `stop` event is emitted when the user clicks on the Button.
::

::component-code
---
prettier: true
ignore:
  - status
items:
  submittedColor:
    - primary
    - secondary
    - success
    - warning
    - error
    - neutral
  submittedVariant:
    - solid
    - outline
    - soft
    - subtle
    - ghost
props:
  submittedColor: 'neutral'
  submittedVariant: 'subtle'
  submittedIcon: 'i-lucide-square'
  status: 'submitted'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.stop` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.stop` key.
:::
::

### Streaming

When its status is `streaming`{lang="ts-type"}, use the `streaming-color`, `streaming-variant` and `streaming-icon` props to customize the Button. Defaults to:

- `streamingColor="neutral"`{lang="ts-type"}
- `streamingVariant="subtle"`{lang="ts-type"}
- `streamingIcon="i-lucide-square"`{lang="ts-type"}

::note
The `stop` event is emitted when the user clicks on the Button.
::

::component-code
---
prettier: true
ignore:
  - status
items:
  streamingColor:
    - primary
    - secondary
    - success
    - warning
    - error
    - neutral
  streamingVariant:
    - solid
    - outline
    - soft
    - subtle
    - ghost
props:
  streamingColor: 'neutral'
  streamingVariant: 'subtle'
  streamingIcon: 'i-lucide-square'
  status: 'streaming'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.stop` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.stop` key.
:::
::

### Error

When its status is `error`{lang="ts-type"}, use the `error-color`, `error-variant` and `error-icon` props to customize the Button. Defaults to:

- `errorColor="error"`{lang="ts-type"}
- `errorVariant="soft"`{lang="ts-type"}
- `errorIcon="i-lucide-rotate-ccw"`{lang="ts-type"}

::note
The `reload` event is emitted when the user clicks on the Button.
::

::component-code
---
prettier: true
ignore:
  - status
items:
  errorColor:
    - primary
    - secondary
    - success
    - warning
    - error
    - neutral
  errorVariant:
    - solid
    - outline
    - soft
    - subtle
    - ghost
props:
  errorColor: 'error'
  errorVariant: 'soft'
  errorIcon: 'i-lucide-rotate-ccw'
  status: 'error'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.reload` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.reload` key.
:::
::

## Examples

::note{to="https://ai-sdk.dev/docs/getting-started/nuxt" target="_blank"}
These chat components are designed to be used with the **AI SDK v5** from **Vercel AI SDK**.
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt-ui-templates/chat" target="_blank"}
Check out the source code of our **AI Chat template** on GitHub for a real-life example.
::

### Within a page

Use the ChatPromptSubmit component with the `Chat` class from AI SDK v5 to display a chat prompt within a page.

Pass the `status` prop and listen to the `stop` and `reload` events to control the chat.

```vue [pages/\[id\\].vue] {2-4,7,11-15,19,24}
<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

const input = ref('')

const chat = new Chat({
  onError(error) {
    console.error('Chat error:', error)
  }
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <UContainer>
        <UChatMessages :messages="chat.messages" :status="chat.status">
          <template #content="{ message }">
            <MDC :value="getTextFromMessage(message)" :cache-key="message.id" unwrap="p" />
          </template>
        </UChatMessages>
      </UContainer>
    </template>

    <template #footer>
      <UContainer>
        <UChatPrompt v-model="input" :error="chat.error" @submit="handleSubmit">
          <UChatPromptSubmit :status="chat.status" @stop="chat.stop" @reload="chat.regenerate" />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

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
