---
title: Prompt
description: 'Display pre-built AI prompts with one-click copy and Cursor integration.'
category: components
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/prose/Prompt.vue
---

## Usage

Use the `prompt` component to display a pre-built AI prompt that users can copy to their clipboard or open directly in [Cursor](https://www.cursor.com). The `description` prop is shown as the visible label, while the default slot contains the prompt text that gets copied.

::code-preview{class="[&>div]:*:w-full [&>div]:*:my-0"}

::prompt{description="Generate clear, concise documentation." icon="i-lucide-sparkles"}
You are a technical writing assistant. Write documentation that is clear, accurate, and concise.
- Use second-person voice ("you") and active verbs.
- Start procedures with a goal-oriented heading.
- Before writing, ask clarifying questions about the end users of the documentation, their goals, and their needs.
::

#code

```mdc
::prompt{description="Generate clear, concise documentation." icon="i-lucide-sparkles"}
You are a technical writing assistant. Write documentation that is clear, accurate, and concise.
- Use second-person voice ("you") and active verbs.
- Start procedures with a goal-oriented heading.
- Before writing, ask clarifying questions about the end users of the documentation, their goals, and their needs.
::
```

::

### Icon

Use the `icon` prop to display an icon next to the description.

::code-preview{class="[&>div]:*:w-full [&>div]:*:my-0"}

:::div{class="flex flex-col gap-4 w-full"}

::prompt{description="Summarize the key points of a document."}
You are a document analyst. Read the provided document and extract the key points into a concise summary with bullet points.
::

::prompt{description="Review code for best practices." icon="i-lucide-code"}
You are a senior software engineer. Review the provided code for best practices, performance issues, and potential bugs. Be constructive and suggest improvements.
::

:::

#code

```mdc
::prompt{description="Summarize the key points of a document."}
You are a document analyst. Read the provided document and extract the key points into a concise summary with bullet points.
::

::prompt{description="Review code for best practices." icon="i-lucide-code"}
You are a senior software engineer. Review the provided code for best practices, performance issues, and potential bugs. Be constructive and suggest improvements.
::
```

::

### Actions

Use the `actions` prop to control which buttons are displayed. Defaults to `["copy"]`. Available actions are `copy`, `cursor` and `windsurf`.

::code-preview{class="[&>div]:*:w-full [&>div]:*:my-0"}

:::div{class="flex flex-col gap-4 w-full"}

::prompt{description="Debug a failing test." icon="i-lucide-bug" :actions='["copy", "cursor", "windsurf"]'}
Analyze the failing test output below and identify the root cause. Suggest a fix with an explanation.
::

::prompt{description="Write unit tests for a function." icon="i-lucide-test-tube" :actions='["cursor"]'}
Write comprehensive unit tests for the function provided. Cover edge cases, error handling, and happy paths.
::

:::

#code

```mdc
::prompt{description="Debug a failing test." icon="i-lucide-bug" :actions='["copy", "cursor", "windsurf"]'}
Analyze the failing test output below and identify the root cause. Suggest a fix with an explanation.
::

::prompt{description="Write unit tests for a function." icon="i-lucide-test-tube" :actions='["cursor"]'}
Write comprehensive unit tests for the function provided. Cover edge cases, error handling, and happy paths.
::
```

::

## API

### Props

:component-props{prose}

### Slots

:component-slots{prose}

## Theme

:component-theme{prose}

## Changelog

:component-changelog{prefix="prose"}
