# Conventions

Coding patterns specific to Nuxt UI.

## UApp wrapper

Always wrap your app in `UApp` — it provides:
- Toast container (`useToast`)
- Tooltip provider
- Programmatic overlay context (`useOverlay`)
- i18n locale support

```vue
<UApp :locale="fr">
  <NuxtPage /> <!-- or <RouterView /> for Vue -->
</UApp>
```

## Icons

Format: `i-{collection}-{name}`. Prefer `lucide` collection.

```vue
<UIcon name="i-lucide-sun" class="size-5" />
<UButton icon="i-lucide-plus" label="Add" />
<UAlert icon="i-lucide-info" title="Heads up" />
```

Install collections locally for best performance:

```bash
pnpm i @iconify-json/lucide
pnpm i @iconify-json/simple-icons
```

Custom local collections (Nuxt only):

```ts
// nuxt.config.ts
icon: {
  customCollections: [{
    prefix: 'custom',
    dir: './app/assets/icons'
  }]
}
```

## Slot patterns

Most components follow consistent slot naming:

| Slot | Used by | Purpose |
|---|---|---|
| `#header` | Card, Modal, Slideover, DashboardPanel | Top section |
| `#body` | DashboardPanel | Scrollable content area |
| `#footer` | Card, Modal, Slideover, DashboardPanel | Bottom section |
| `#left` | Page, DashboardNavbar | Left sidebar or content |
| `#right` | Page, DashboardNavbar, Header | Right sidebar or content |
| `#leading` | Input, Button, Alert | Before main content (icon area) |
| `#trailing` | Input, Button | After main content (icon area) |
| `#content` | Modal, Slideover, Popover, Tooltip | Full content override |
| `#default` | Most components | Main content area |

## Items arrays

Many components accept an `items` prop. Two patterns:

**Flat array** — plain list:

```ts
const items = [
  { label: 'Edit', icon: 'i-lucide-pencil' },
  { label: 'Delete', icon: 'i-lucide-trash', color: 'error' }
]
```

**Nested array** — groups with automatic separators between them:

```ts
const items = [
  [
    { label: 'Edit', icon: 'i-lucide-pencil' },
    { label: 'Duplicate', icon: 'i-lucide-copy' }
  ],
  [
    { label: 'Delete', icon: 'i-lucide-trash', color: 'error' }
  ]
]
```

Components supporting nested arrays: `UDropdownMenu`, `UContextMenu`, `UCommandPalette`, `UNavigationMenu`.

## Composables

### useToast

```ts
const toast = useToast()

toast.add({
  title: 'Success',
  description: 'Item saved',
  color: 'success',
  icon: 'i-lucide-check-circle',
  duration: 5000,
  actions: [{ label: 'Undo', onClick: () => {} }]
})

toast.remove('toast-id')
toast.clear()
```

### useOverlay

Programmatic modals, slideovers, drawers — no template `v-model` needed.

```ts
const overlay = useOverlay()

const modal = overlay.create(MyModalComponent)
const { result } = modal.open({ title: 'Confirm delete?' })

if (await result) {
  // user confirmed — emit('close', true) inside the component
}

modal.close(false)   // close from outside
modal.patch({ title: 'Updated' })  // update props
```

### defineShortcuts

```ts
defineShortcuts({
  meta_k: () => openSearch(),
  escape: () => close(),
  meta_enter: {
    handler: () => submit(),
    whenever: [isFormValid]
  }
})
```

Keys: `meta` (Cmd/Ctrl), `ctrl`, `alt`, `shift`. Separator: `_`.

### extractShortcuts

Wire up keyboard shortcuts from menu items:

```ts
const items = [
  { label: 'New file', kbds: ['meta', 'n'], onSelect: () => newFile() },
  { label: 'Save', kbds: ['meta', 's'], onSelect: () => save() }
]

defineShortcuts(extractShortcuts(items))
```

### defineLocale / extendLocale

```ts
import { fr } from '@nuxt/ui/locale'

// Use built-in locale (50+ available)
// <UApp :locale="fr">

// Or extend
import { en } from '@nuxt/ui/locale'
const customEn = extendLocale(en, {
  messages: { commandPalette: { placeholder: 'Search...' } }
})
```

## Theme customization workflow

1. Find the component's theme file: `.nuxt/ui/<component>.ts` (Nuxt) or `node_modules/.nuxt-ui/ui/<component>.ts` (Vue)
2. Identify the slot names (e.g., `base`, `label`, `icon`, `header`, `body`)
3. Override via `ui` prop for one-off changes, or global config for app-wide defaults

```vue
<!-- One-off override -->
<UButton :ui="{ base: 'rounded-full', leadingIcon: 'size-3' }" />
```

```ts
// Global override — app.config.ts
export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'rounded-full'
      }
    }
  }
})
```

## Responsive patterns

- Dashboard sidebar hides on mobile, shows a slideover/drawer via `UDashboardSidebar` `mode` prop
- `UHeader` body slot is the mobile menu content (shown when hamburger is tapped)
- Most components handle responsiveness automatically — avoid manual breakpoint classes unless needed
- Use `UPageAside` for sidebars that should hide below `lg` breakpoint
