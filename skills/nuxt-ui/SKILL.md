---
name: nuxt-ui
description: Build UIs with @nuxt/ui v4 — 125+ accessible Vue components with Tailwind CSS theming. Use when creating interfaces, customizing themes to match a brand, building forms, or composing layouts like dashboards, docs sites, and chat interfaces.
---

# Nuxt UI

Vue component library built on [Reka UI](https://reka-ui.com/) + [Tailwind CSS](https://tailwindcss.com/) + [Tailwind Variants](https://www.tailwind-variants.org/). Works with Nuxt, Vue (Vite), Laravel (Inertia), and AdonisJS (Inertia).

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

> **Vue**: Add `class="isolate"` to your root `<div id="app">` in `index.html`.

> **Vue + Inertia**: Use `ui({ router: 'inertia' })` in `vite.config.ts`.

### UApp

Wrapping your app in `UApp` is **required** — it provides global config for toasts, tooltips, and programmatic overlays. It also accepts a `locale` prop for i18n (see [composables reference](references/composables.md)).

## Icons

Nuxt UI uses [Iconify](https://iconify.design/) for 200,000+ icons. In Nuxt, `@nuxt/icon` is auto-registered. In Vue, icons work out of the box via the Vite plugin.

### Naming convention

Icons use the format `i-{collection}-{name}`:

```vue
<UIcon name="i-lucide-sun" class="size-5" />
<UButton icon="i-lucide-plus" label="Add" />
<UAlert icon="i-lucide-info" title="Heads up" />
```

> Browse all icons at [icones.js.org](https://icones.js.org). The `lucide` collection is used throughout Nuxt UI defaults.

### Install icon collections locally

```bash
pnpm i @iconify-json/lucide
pnpm i @iconify-json/simple-icons
```

### Custom local collections (Nuxt)

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  icon: {
    customCollections: [{
      prefix: 'custom',
      dir: './app/assets/icons'
    }]
  }
})
```

```vue
<UIcon name="i-custom-my-icon" />
```

## Theming & Branding

Nuxt UI ships with a default look. The goal is to adapt it to your brand so every app looks unique.

**Always use semantic utilities** (`text-default`, `bg-elevated`, `border-muted`), never raw Tailwind palette colors. See [references/theming.md](references/theming.md) for the full list.

### Colors

7 semantic colors (`primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`) configurable at runtime:

```ts
// Nuxt — app.config.ts
export default defineAppConfig({
  ui: { colors: { primary: 'indigo', neutral: 'zinc' } }
})
```

```ts
// Vue — vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      ui: { colors: { primary: 'indigo', neutral: 'zinc' } }
    })
  ]
})
```

### Customizing components

**Override priority** (highest wins): `ui` prop / `class` prop > global config > theme defaults.

The `ui` prop overrides a component's **slots** after variants are computed — it wins over everything:

```vue
<UButton :ui="{ base: 'rounded-none', trailingIcon: 'size-3 rotate-90' }" />
<UCard :ui="{ header: 'bg-muted', body: 'p-8' }" />
```

**Read the generated theme file** to find slot names for any component:

- **Nuxt**: `.nuxt/ui/<component>.ts`
- **Vue**: `node_modules/.nuxt-ui/ui/<component>.ts`

> For CSS variables, custom colors, global config, compound variants, and a **full brand customization playbook**, see [references/theming.md](references/theming.md)

## Composables

```ts
// Notifications
const toast = useToast()
toast.add({ title: 'Saved', color: 'success', icon: 'i-lucide-check' })

// Programmatic overlays
const overlay = useOverlay()
const modal = overlay.create(MyModal)
const { result } = modal.open({ title: 'Confirm' })
await result

// Keyboard shortcuts
defineShortcuts({
  meta_k: () => openSearch(),
  escape: () => close()
})
```

> For full composable reference, see [references/composables.md](references/composables.md)

## Form validation

Uses Standard Schema — works with Zod, Valibot, Yup, or Joi.

```vue
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters')
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ email: '', password: '' })

function onSubmit() {
  // UForm validates before emitting @submit — state is valid here
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField name="email" label="Email" required>
      <UInput v-model="state.email" type="email" />
    </UFormField>

    <UFormField name="password" label="Password" required>
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Sign in</UButton>
  </UForm>
</template>
```

> For all form components and validation patterns, see [references/components.md](references/components.md#form)

## Overlays

```vue
<!-- Modal -->
<UModal v-model:open="isOpen" title="Edit" description="Edit your profile">
  <template #body>Content</template>
  <template #footer>
    <UButton variant="ghost" @click="isOpen = false">Cancel</UButton>
    <UButton @click="save">Save</UButton>
  </template>
</UModal>

<!-- Slideover (side panel) -->
<USlideover v-model:open="isOpen" title="Settings" side="right">
  <template #body>Content</template>
</USlideover>

<!-- Dropdown menu (flat array) -->
<UDropdownMenu :items="[
  { label: 'Edit', icon: 'i-lucide-pencil' },
  { type: 'separator' },
  { label: 'Delete', icon: 'i-lucide-trash', color: 'error' }
]">
  <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" />
</UDropdownMenu>

<!-- Dropdown menu (nested array — groups with automatic separators) -->
<UDropdownMenu :items="[
  [{ label: 'Edit', icon: 'i-lucide-pencil' }, { label: 'Duplicate', icon: 'i-lucide-copy' }],
  [{ label: 'Delete', icon: 'i-lucide-trash', color: 'error' }]
]">
  <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" />
</UDropdownMenu>
```

> For all overlay components, see [references/components.md](references/components.md#overlay)

## Layouts

Nuxt UI provides components to compose full page layouts. Load the reference matching your use case:

| Layout | Description | Reference |
|---|---|---|
| Page | Landing, blog, changelog, pricing — public-facing pages | [layouts/page.md](references/layouts/page.md) |
| Dashboard | Admin UI with resizable sidebar and panels | [layouts/dashboard.md](references/layouts/dashboard.md) |
| Docs | Documentation with sidebar nav and TOC | [layouts/docs.md](references/layouts/docs.md) |
| Chat | AI chat with messages and prompt | [layouts/chat.md](references/layouts/chat.md) |
| Editor | Rich text editor with toolbars | [layouts/editor.md](references/layouts/editor.md) |

## Templates

Official starter templates at [github.com/nuxt-ui-templates](https://github.com/nuxt-ui-templates):

| Template | Framework | GitHub |
|---|---|---|
| Starter | Nuxt | [nuxt-ui-templates/starter](https://github.com/nuxt-ui-templates/starter) |
| Starter | Vue | [nuxt-ui-templates/starter-vue](https://github.com/nuxt-ui-templates/starter-vue) |
| Dashboard | Nuxt | [nuxt-ui-templates/dashboard](https://github.com/nuxt-ui-templates/dashboard) |
| Dashboard | Vue | [nuxt-ui-templates/dashboard-vue](https://github.com/nuxt-ui-templates/dashboard-vue) |
| SaaS | Nuxt | [nuxt-ui-templates/saas](https://github.com/nuxt-ui-templates/saas) |
| Landing | Nuxt | [nuxt-ui-templates/landing](https://github.com/nuxt-ui-templates/landing) |
| Docs | Nuxt | [nuxt-ui-templates/docs](https://github.com/nuxt-ui-templates/docs) |
| Portfolio | Nuxt | [nuxt-ui-templates/portfolio](https://github.com/nuxt-ui-templates/portfolio) |
| Chat | Nuxt | [nuxt-ui-templates/chat](https://github.com/nuxt-ui-templates/chat) |
| Editor | Nuxt | [nuxt-ui-templates/editor](https://github.com/nuxt-ui-templates/editor) |
| Changelog | Nuxt | [nuxt-ui-templates/changelog](https://github.com/nuxt-ui-templates/changelog) |
| Starter | Laravel | [nuxt-ui-templates/starter-laravel](https://github.com/nuxt-ui-templates/starter-laravel) |
| Starter | AdonisJS | [nuxt-ui-templates/starter-adonis](https://github.com/nuxt-ui-templates/starter-adonis) |

> When starting a new project, clone the matching template instead of setting up from scratch.

## Additional references

Load based on your task — **do not load all at once**:

- [references/theming.md](references/theming.md) — CSS variables, custom colors, component theme overrides
- [references/components.md](references/components.md) — all 125+ components by category with props and usage
- [references/composables.md](references/composables.md) — useToast, useOverlay, defineShortcuts
- Generated theme files — all slots, variants, and default classes for any component (Nuxt: `.nuxt/ui/<component>.ts`, Vue: `node_modules/.nuxt-ui/ui/<component>.ts`)
