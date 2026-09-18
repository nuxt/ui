---
title: CodeEditor
description: A code editor styled like a Textarea, powered by CodeMirror and highlighted with Shiki.
category: form
keywords:
  - code input
  - codemirror
  - shiki
  - syntax highlighting
links:
  - label: CodeMirror
    avatar:
      src: https://github.com/codemirror.png
      loading: lazy
    to: https://codemirror.net/
  - label: Shiki
    avatar:
      src: https://github.com/shikijs.png
      loading: lazy
    to: https://shiki.style/
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/CodeEditor.vue
navigation.badge: Soon
---

## Usage

The CodeEditor component wraps a [CodeMirror 6](https://codemirror.net/) editor and highlights its content with [Shiki](https://shiki.style/). It looks and behaves like a [Textarea](/docs/components/textarea): same colors, variants and sizes, and it works inside a [FormField](/docs/components/form-field). The line numbers, selection, search panel and tooltips are styled with your theme in light and dark mode.

::note{to="https://codemirror.net/docs/guide/"}
Install the CodeMirror packages and Shiki in your project to use this component.
::

::code-group{sync="pm"}

```bash [pnpm]
pnpm add @codemirror/state @codemirror/view @codemirror/commands @codemirror/search @codemirror/language @codemirror/autocomplete shiki
```

```bash [yarn]
yarn add @codemirror/state @codemirror/view @codemirror/commands @codemirror/search @codemirror/language @codemirror/autocomplete shiki
```

```bash [npm]
npm install @codemirror/state @codemirror/view @codemirror/commands @codemirror/search @codemirror/language @codemirror/autocomplete shiki
```

```bash [bun]
bun add @codemirror/state @codemirror/view @codemirror/commands @codemirror/search @codemirror/language @codemirror/autocomplete shiki
```

::

Use the `v-model` directive to control the value of the CodeEditor.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: "const greeting = 'Hello Nuxt UI'\n\nconsole.log(greeting)\n"
  lang: ts
---
::

::tip
The editor grows with its content. Press :kbd{value="meta"} :kbd{value="F"} to open the search panel, :kbd{value="meta"} :kbd{value="G"} to jump to the next match and :kbd{value="Escape"} to close it.
::

### Language

Use the `lang` prop to set the language used to highlight the code. Any [language bundled with Shiki](https://shiki.style/languages) is loaded on demand. Defaults to `text`.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
items:
  lang:
    - ts
    - vue
    - json
    - css
    - html
    - markdown
    - bash
props:
  modelValue: "<script setup lang=\"ts\">\nconst count = ref(0)\n</script>\n\n<template>\n  <UButton @click=\"count++\">\n    Clicked {{ count }} times\n  </UButton>\n</template>\n"
  lang: vue
---
::

### Theme

Use the `theme` prop to set the [Shiki theme](https://shiki.style/themes) used to color the tokens. Pass an object to use a different theme in light and dark mode. Defaults to `material-theme-lighter` and `material-theme-palenight`.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: "export default defineNuxtConfig({\n  modules: ['@nuxt/ui']\n})\n"
  lang: ts
  theme:
    light: vitesse-light
    dark: vitesse-dark
---
::

::note
Only the token colors of the theme are used, the background and the chrome of the editor follow your Nuxt UI theme.
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
props:
  placeholder: 'Paste your code…'
---
::

### Rows

Use the `rows` prop to set the minimum number of visible rows. Defaults to `3`.

Use the `maxrows` prop to set the maximum number of visible rows before the editor scrolls. Defaults to `0`, the editor grows with its content.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: "{\n  \"name\": \"nuxt-app\",\n  \"private\": true,\n  \"scripts\": {\n    \"build\": \"nuxt build\",\n    \"dev\": \"nuxt dev\",\n    \"generate\": \"nuxt generate\",\n    \"preview\": \"nuxt preview\"\n  }\n}\n"
  lang: json
  rows: 2
  maxrows: 6
---
::

### Line numbers

Use the `line-numbers` prop to hide the line numbers gutter. Defaults to `true`.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: "npx nuxi@latest init my-app\ncd my-app\n"
  lang: bash
  lineNumbers: false
---
::

### Line wrapping

Use the `line-wrapping` prop to wrap long lines instead of scrolling horizontally.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: "A long line of text that would otherwise scroll horizontally, but wraps instead because line wrapping is enabled on this editor.\n"
  lineWrapping: true
---
::

### Color

Use the `color` prop to change the ring color when the editor is focused.

::component-code
---
ignore:
  - placeholder
props:
  color: neutral
  highlight: true
  placeholder: 'Paste your code…'
---
::

::note
The `highlight` prop is used here to show the focus state. It's used internally when a validation error occurs.
::

### Selection color

The selected text is drawn natively by the browser, tinted with the accent color of the operating system so the tokens stay readable in light and dark mode. Set the `--ui-code-editor-selection` CSS variable to change it globally, for example in your `main.css`:

```css [main.css]
:root {
  --ui-code-editor-selection: color-mix(in oklch, var(--ui-primary) 20%, transparent);
}
```

### Variant

Use the `variant` prop to change the variant of the CodeEditor.

::component-code
---
ignore:
  - placeholder
props:
  color: neutral
  variant: subtle
  highlight: false
  placeholder: 'Paste your code…'
---
::

### Size

Use the `size` prop to change the size of the CodeEditor.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: "const size = 'xl'\n"
  lang: ts
  size: xl
---
::

### Disabled

Use the `disabled` prop to disable the CodeEditor.

::component-code
---
ignore:
  - placeholder
props:
  disabled: true
  placeholder: 'Paste your code…'
---
::

### Readonly

Use the `readonly` prop to prevent editing while keeping the content selectable and searchable.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: "// This snippet cannot be edited\nexport const locked = true\n"
  lang: ts
  readonly: true
---
::

## Examples

### Within a Form

The CodeEditor integrates with the [Form](/docs/components/form) and [FormField](/docs/components/form-field) components like any other input: errors highlight the editor and the label is linked to it.

:component-example{name="code-editor-form-example"}

### With extensions

Use the `extensions` prop to pass additional [CodeMirror extensions](https://codemirror.net/docs/extensions/), they are appended after the built-in ones. This example binds :kbd{value="meta"} :kbd{value="S"} to a save command and highlights whitespace.

:component-example{name="code-editor-extensions-example"}

::note
The built-in extensions include the history, bracket matching and closing, the search panel, the active line and selection matches highlighting. The selection is drawn natively by the browser, add `drawSelection()` and `EditorState.allowMultipleSelections.of(true)` for multiple cursors. Pass the `indent-with-tab` prop to indent with the :kbd{value="Tab"} key, disabled by default as it traps the keyboard focus.
::

### With a custom highlighter

By default, a Shiki highlighter using the [JavaScript RegExp engine](https://shiki.style/guide/regex-engines#javascript-regexp-engine) is created once and shared by every editor, loading languages and themes on demand. Use the `highlighter` prop to pass your own instance instead, for example to use the Oniguruma engine, a custom grammar or a highlighter shared with the rest of your application.

:component-example{name="code-editor-highlighter-example"}

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `editorRef`{lang="ts-type"} | `Ref<HTMLDivElement \| null>`{lang="ts-type"} |
| `view`{lang="ts-type"} | `Ref<EditorView \| undefined>`{lang="ts-type"} |

## Theme

:component-theme

## Changelog

:component-changelog
