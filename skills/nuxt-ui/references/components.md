# Components

125+ Vue components powered by Tailwind CSS and Reka UI. For any component's theme slots, read the generated theme file (Nuxt: `.nuxt/ui/<component>.ts`, Vue: `node_modules/.nuxt-ui/ui/<component>.ts`).

## Layout

Core structural components for organizing your application's layout.

| Component | Purpose |
|---|---|
| `UApp` | **Required** root wrapper for toasts, tooltips, overlays |
| `UHeader` | Responsive header with mobile menu (`#title`, `#default`, `#right`, `#body`) |
| `UFooter` | Footer (`#left`, `#default`, `#right`, `#top`, `#bottom`) |
| `UFooterColumns` | Multi-column footer with link groups |
| `UMain` | Main content area (respects `--ui-header-height`) |
| `UContainer` | Centered max-width container (`--ui-container`) |

## Element

Essential UI building blocks.

| Component | Key props |
|---|---|
| `UButton` | `label`, `icon`, `color`, `variant`, `size`, `loading`, `disabled`, `to` |
| `UBadge` | `label`, `color`, `variant`, `size` |
| `UAvatar` | `src`, `alt`, `icon`, `text`, `size` |
| `UAvatarGroup` | `max`, `size` — wraps multiple `UAvatar` |
| `UIcon` | `name`, `size` |
| `UCard` | `variant` — slots: `#header`, `#default`, `#footer` |
| `UAlert` | `title`, `description`, `icon`, `color`, `variant`, `close` |
| `UBanner` | `title`, `icon`, `close` — sticky top banner |
| `UChip` | `color`, `size`, `position` — notification dot on children |
| `UKbd` | `value` — keyboard key display |
| `USeparator` | `label`, `icon`, `orientation`, `type` |
| `USkeleton` | `class` — loading placeholder |
| `UProgress` | `value`, `max`, `color`, `size` |
| `UCalendar` | `v-model`, `range` (boolean), `multiple` (boolean) |
| `UCollapsible` | `v-model:open` — animated expand/collapse |
| `UFieldGroup` | Groups form inputs horizontally/vertically |

## Form

Comprehensive form components for user input.

| Component | Key props |
|---|---|
| `UInput` | `v-model`, `type`, `placeholder`, `icon`, `loading` |
| `UTextarea` | `v-model`, `rows`, `autoresize`, `maxrows` |
| `USelect` | `v-model`, `items` (flat `T[]` or grouped `T[][]`), `placeholder` |
| `USelectMenu` | `v-model`, `items` (flat `T[]` or grouped `T[][]`), `searchable`, `multiple` |
| `UInputMenu` | `v-model`, `items` (flat `T[]` or grouped `T[][]`), `searchable` — autocomplete |
| `UInputNumber` | `v-model`, `min`, `max`, `step` |
| `UInputDate` | `v-model`, `range` (boolean for range selection), `locale` |
| `UInputTime` | `v-model`, `hour-cycle` (12/24), `granularity` |
| `UInputTags` | `v-model`, `max`, `placeholder` |
| `UPinInput` | `v-model`, `length`, `type`, `mask` |
| `UCheckbox` | `v-model`, `label`, `description` |
| `UCheckboxGroup` | `v-model`, `items`, `orientation` |
| `URadioGroup` | `v-model`, `items`, `orientation` |
| `USwitch` | `v-model`, `label`, `on-icon`, `off-icon` |
| `USlider` | `v-model`, `min`, `max`, `step` |
| `UColorPicker` | `v-model`, `format` (hex/rgb/hsl/cmyk/lab), `size` |
| `UFileUpload` | `v-model`, `accept`, `multiple`, `variant` (area/button) |
| `UForm` | `schema`, `state`, `@submit` — validation wrapper |
| `UFormField` | `name`, `label`, `description`, `hint`, `required` |

### Form validation

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
const form = ref()

async function onSubmit() {
  await form.value.validate()
}
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="onSubmit">
    <UFormField name="email" label="Email" required>
      <UInput v-model="state.email" type="email" />
    </UFormField>

    <UFormField name="password" label="Password" required>
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

With Valibot:

```vue
<script setup lang="ts">
import * as v from 'valibot'

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Min 8 characters'))
})
</script>
```

### File upload

```vue
<script setup>
const files = ref<File[]>([])
</script>

<template>
  <UFileUpload v-model="files" accept="image/*" multiple>
    <template #actions="{ open }">
      <UButton label="Upload" icon="i-lucide-upload" color="neutral" variant="outline" @click="open()" />
    </template>
  </UFileUpload>
</template>
```

## Data

Components for displaying and organizing data.

| Component | Key props |
|---|---|
| `UTable` | `data`, `columns`, `loading`, `sticky` |
| `UAccordion` | `items`, `type` (single/multiple), `collapsible` |
| `UCarousel` | `items`, `orientation`, `arrows`, `dots` |
| `UTimeline` | `items` — vertical timeline |
| `UTree` | `items` — hierarchical tree |
| `UUser` | `name`, `description`, `avatar` — user display |
| `UEmpty` | `icon`, `title`, `description` — empty state |
| `UMarquee` | `repeat`, `reverse`, `orientation`, `pauseOnHover` — infinite scroll |
| `UScrollArea` | Custom scrollbar wrapper |

## Navigation

Components for user navigation and wayfinding.

| Component | Key props |
|---|---|
| `UNavigationMenu` | `items` (flat `T[]` or grouped `T[][]`), `orientation` (horizontal/vertical) |
| `UBreadcrumb` | `items` |
| `UTabs` | `items`, `orientation`, `variant` |
| `UStepper` | `items`, `orientation`, `color` |
| `UPagination` | `v-model`, `total`, `items-per-page` |
| `ULink` | `to`, `active`, `inactive` — styled NuxtLink |
| `UCommandPalette` | `v-model:open`, `groups` (`{ id, label, items }[]`), `placeholder` |

## Overlay

Floating UI elements that appear above the main content. **All require `<UApp>` wrapper.**

| Component | Key props |
|---|---|
| `UModal` | `v-model:open`, `title`, `description`, `fullscreen`, `scrollable` |
| `USlideover` | `v-model:open`, `title`, `side` (left/right/top/bottom) |
| `UDrawer` | `v-model:open`, `title`, `handle` |
| `UPopover` | `arrow`, `content: { side, align }`, `openDelay`, `closeDelay` |
| `UTooltip` | `text`, `content: { side }`, `delayDuration` |
| `UDropdownMenu` | `items` (flat `T[]` or grouped `T[][]` with separators, supports nested `children`) |
| `UContextMenu` | `items` (flat `T[]` or grouped `T[][]`) — right-click menu |
| `UToast` | Used via `useToast()` composable |

### Modal

```vue
<UModal v-model:open="isOpen" title="Edit" description="Edit your profile">
  <template #body>Content</template>
  <template #footer>
    <UButton variant="ghost" @click="isOpen = false">Cancel</UButton>
    <UButton @click="save">Save</UButton>
  </template>
</UModal>
```

Slots: `#content`, `#header`, `#body`, `#footer`

### Slideover

```vue
<USlideover v-model:open="isOpen" title="Settings" side="right">
  <template #body>Content</template>
</USlideover>
```

### Drawer

```vue
<UDrawer v-model:open="isOpen" title="Options" handle>
  <template #body>Content</template>
</UDrawer>
```

### DropdownMenu

Items accept a flat array or a nested array (each sub-array is rendered as a group separated by dividers):

```vue
<!-- Flat array -->
<UDropdownMenu :items="[
  { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => edit() },
  { type: 'separator' },
  { label: 'Delete', icon: 'i-lucide-trash', color: 'error' }
]">
  <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" />
</UDropdownMenu>

<!-- Nested array (groups with automatic separators) -->
<UDropdownMenu :items="[
  [{ label: 'Edit', icon: 'i-lucide-pencil' }, { label: 'Duplicate', icon: 'i-lucide-copy' }],
  [{ label: 'Delete', icon: 'i-lucide-trash', color: 'error' }]
]">
  <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" />
</UDropdownMenu>
```

### Toast

```ts
const toast = useToast()

toast.add({
  title: 'Success',
  description: 'Changes saved',
  color: 'success',
  icon: 'i-lucide-check-circle',
  duration: 5000,
  actions: [{ label: 'Undo', onClick: () => undo() }]
})
```

### Programmatic overlays

```ts
const overlay = useOverlay()

// create() returns a reusable instance
const confirmDialog = overlay.create(ConfirmDialog)

// open() returns an object with .result (a Promise)
const { result } = confirmDialog.open({
  title: 'Delete?',
  message: 'This cannot be undone.'
})

if (await result) {
  // User confirmed
}

// Inside the overlay component, emit close with a value:
// emit('close', true) or emit('close', false)
```

### CommandPalette

```vue
<script setup>
const groups = [{
  id: 'actions',
  label: 'Actions',
  items: [
    { label: 'New file', icon: 'i-lucide-file-plus', onSelect: () => {} },
    { label: 'Settings', to: '/settings' }
  ]
}]

defineShortcuts({ meta_k: () => { isOpen.value = true } })
</script>

<UCommandPalette v-model:open="isOpen" :groups="groups" placeholder="Search..." />
```

## Page

Pre-built sections for marketing and content pages.

| Component | Purpose |
|---|---|
| `UPage` | Multi-column grid (`#left`, `#default`, `#right`) |
| `UPageAside` | Sticky sidebar wrapper (visible from `lg`) |
| `UPageHero` | Hero section with title, description, links, media |
| `UPageSection` | Content section with headline, features grid |
| `UPageCTA` | Call to action block |
| `UPageHeader` | Page title and description |
| `UPageBody` | Main content area with prose styling |
| `UPageFeature` | Individual feature item |
| `UPageGrid` | Grid layout for cards |
| `UPageColumns` | Multi-column layout |
| `UPageCard` | Content card for grids |
| `UPageLogos` | Logo wall |
| `UPageAnchors` | Anchor links (simpler TOC) |
| `UPageLinks` | Related resource links |
| `UPageList` | List items |
| `UBlogPosts` | Responsive grid of blog posts (`orientation`) |
| `UBlogPost` | Individual blog post card |
| `UChangelogVersions` | Changelog version list |
| `UChangelogVersion` | Individual changelog entry |
| `UPricingPlans` | Pricing plan cards |
| `UPricingTable` | Feature comparison table |

## Dashboard

Specialized components for admin interfaces with resizable panels and sidebars.

| Component | Purpose |
|---|---|
| `UDashboardGroup` | Root wrapper — manages sidebar state |
| `UDashboardSidebar` | Resizable/collapsible sidebar (`#header`, `#default`, `#footer`) |
| `UDashboardPanel` | Content panel (`#header`, `#body`, `#footer`) |
| `UDashboardNavbar` | Panel navbar (`#left`, `#default`, `#right`) |
| `UDashboardToolbar` | Toolbar for filters/actions |
| `UDashboardSearch` | Command palette for dashboards |
| `UDashboardSearchButton` | Search trigger button |
| `UDashboardSidebarToggle` | Mobile sidebar toggle |
| `UDashboardSidebarCollapse` | Desktop collapse button |
| `UDashboardResizeHandle` | Custom resize handle |

## Chat

Components for conversational AI interfaces, powered by [Vercel AI SDK](https://ai-sdk.dev/).

| Component | Purpose |
|---|---|
| `UChatMessages` | Scrollable message list with auto-scroll |
| `UChatMessage` | Individual message display |
| `UChatPrompt` | Enhanced textarea for prompts |
| `UChatPromptSubmit` | Submit button with status handling |
| `UChatPalette` | Chat layout for overlays |

## Editor

Rich text editor powered by [TipTap](https://tiptap.dev/).

| Component | Purpose |
|---|---|
| `UEditor` | Editor (`v-model`, `content-type`: json/html/markdown) |
| `UEditorToolbar` | Toolbar (`layout`: fixed/bubble/floating) |
| `UEditorDragHandle` | Block drag-and-drop |
| `UEditorSuggestionMenu` | Slash command menu |
| `UEditorMentionMenu` | @ mention menu |
| `UEditorEmojiMenu` | Emoji picker |

## Content

Components integrating with `@nuxt/content`.

| Component | Purpose |
|---|---|
| `UContentNavigation` | Sidebar navigation tree |
| `UContentToc` | Table of contents |
| `UContentSurround` | Prev/next links |
| `UContentSearch` | Search command palette |
| `UContentSearchButton` | Search trigger button |

## Color Mode

| Component | Purpose |
|---|---|
| `UColorModeButton` | Toggle light/dark button |
| `UColorModeSwitch` | Toggle light/dark switch |
| `UColorModeSelect` | Dropdown selector |
| `UColorModeAvatar` | Avatar with different src per mode |
| `UColorModeImage` | Image with different src per mode |
