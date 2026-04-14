---
name: nuxt-ui
description: Build UIs with @nuxt/ui v4 — 125+ accessible Vue components with Tailwind CSS theming. Use when creating interfaces, customizing themes to match a brand, building forms, or composing layouts like dashboards, docs sites, and chat interfaces.
---

# Nuxt UI

Vue component library built on [Reka UI](https://reka-ui.com/) + [Tailwind CSS](https://tailwindcss.com/) + [Tailwind Variants](https://www.tailwind-variants.org/). Works with Nuxt, Vue (Vite), Laravel (Vite + Inertia), and AdonisJS (Vite + Inertia).

## MCP Server

For component API details (props, slots, events, full documentation, examples), use the [Nuxt UI MCP server](https://ui.nuxt.com/docs/getting-started/ai/mcp). If not already configured, add it:

**Cursor** — `.cursor/mcp.json`:

```json
{ "mcpServers": { "nuxt-ui": { "type": "http", "url": "https://ui.nuxt.com/mcp" } } }
```

**Claude Code**:

```bash
claude mcp add --transport http nuxt-ui https://ui.nuxt.com/mcp
```

Key MCP tools:
- `search_components` — find components by name, description, or category (no params = list all)
- `search_composables` — find composables by name or description (no params = list all)
- `search_icons` — search Iconify icons (defaults to `lucide`), returns `i-{prefix}-{name}` names
- `get_component` — full component documentation with usage examples
- `get_component_metadata` — props, slots, events (lightweight, no docs content)
- `get_example` — real-world code examples

When you need to know **what a component accepts** or **how its API works**, use the MCP. This skill teaches you **when to use which component** and **how to build well**.

## Core rules (always apply)

1. **Always wrap the app in `UApp`** — required for toasts, tooltips, and programmatic overlays. Accepts a `locale` prop for i18n.
2. **Always use semantic colors** — `text-default`, `bg-elevated`, `border-muted`, etc. Never use raw Tailwind palette colors like `text-gray-500`.
3. **Read generated theme files for slot names** — Nuxt: `.nuxt/ui/<component>.ts`, Vue: `node_modules/.nuxt-ui/ui/<component>.ts`. These show every slot, variant, and default class for any component.
4. **Override priority** (highest wins): `ui` prop / `class` prop → global config → theme defaults.
5. **Icons use `i-{collection}-{name}` format** — `lucide` is the default collection. Use the MCP `search_icons` tool to find icons, or browse at [icones.js.org](https://icones.js.org).

## How to use this skill

Based on the task, load the relevant reference files **before writing any code**. Don't load everything — only what's needed.

### Reference files

**Guidelines** — design decisions and conventions:
- [design-system](references/guidelines/design-system.md) — semantic colors, theming, brand customization, variants, the `ui` prop
- [component-selection](references/guidelines/component-selection.md) — decision matrices: when to use Modal vs Slideover, Select vs SelectMenu, Toast vs Alert, etc.
- [conventions](references/guidelines/conventions.md) — coding patterns, slot naming, items arrays, composables, keyboard shortcuts
- [forms](references/guidelines/forms.md) — form validation, field layout, error handling, Standard Schema

**Layouts** — full page structure patterns:
- [landing](references/layouts/landing.md) — landing pages, blog, changelog, pricing
- [dashboard](references/layouts/dashboard.md) — admin UI with sidebar and panels
- [docs](references/layouts/docs.md) — documentation sites with navigation and TOC
- [chat](references/layouts/chat.md) — AI chat with Vercel AI SDK
- [editor](references/layouts/editor.md) — rich text editor with toolbars

**Recipes** — complete patterns for common tasks:
- [data-tables](references/recipes/data-tables.md) — tables with filters, pagination, sorting, selection
- [auth](references/recipes/auth.md) — login, signup, forgot password forms
- [overlays](references/recipes/overlays.md) — modals, slideovers, drawers, command palette
- [navigation](references/recipes/navigation.md) — headers, sidebars, breadcrumbs, tabs

**Quick reference:**
- [components](references/components.md) — categorized component index for finding the right component name

### Routing table

| Task | Load these references |
|---|---|
| Build a landing page | design-system, conventions, landing |
| Build a dashboard / admin UI | conventions, component-selection, dashboard |
| Add a settings page | conventions, forms |
| Create a login / signup form | conventions, forms, auth |
| Display data in a table | conventions, component-selection, data-tables |
| Customize theme / brand colors | design-system |
| Add a chat interface | conventions, chat |
| Add a modal, slideover, or drawer | conventions, component-selection, overlays |
| Build site navigation | conventions, component-selection, navigation |
| Build a documentation site | conventions, docs |
| Add a rich text editor | conventions, editor |
| General UI work | conventions, component-selection |

## Installation

### Nuxt

```bash
pnpm add @nuxt/ui tailwindcss
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css']
})
```

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";
```

```vue
<!-- app.vue -->
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

### Vue (Vite)

```bash
pnpm add @nuxt/ui tailwindcss
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui()
  ]
})
```

```ts
// src/main.ts
import './assets/main.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'

const app = createApp(App)
const router = createRouter({
  routes: [],
  history: createWebHistory()
})

app.use(router)
app.use(ui)
app.mount('#app')
```

```css
/* assets/main.css */
@import "tailwindcss";
@import "@nuxt/ui";
```

```vue
<!-- src/App.vue -->
<template>
  <UApp>
    <RouterView />
  </UApp>
</template>
```

> Add `class="isolate"` to your root `<div id="app">` in `index.html`.
> For Inertia: use `ui({ router: 'inertia' })` in `vite.config.ts`.
