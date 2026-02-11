# Composables

## useToast

Show notifications. Requires `<UApp>` wrapper.

```ts
const toast = useToast()

toast.add({
  title: 'Success',
  description: 'Item saved',
  color: 'success',       // primary, success, error, warning, info
  icon: 'i-lucide-check-circle',
  duration: 5000,         // 0 = never dismiss
  actions: [{ label: 'Undo', onClick: () => {} }]
})

toast.remove('toast-id')
toast.clear()
```

## useOverlay

Programmatically create modals, slideovers, drawers.

```ts
const overlay = useOverlay()

// create() returns a reusable instance with open(), close(), patch()
const modal = overlay.create(MyComponent)

// open() accepts props and returns an object with .result (a Promise)
const { result } = modal.open({ title: 'Confirm' })

if (await result) {
  // User confirmed
}

// Inside the overlay component, emit close with a value:
// emit('close', true) or emit('close', false)

// You can also close from outside:
modal.close(false)
```

## defineShortcuts

Define keyboard shortcuts.

```ts
defineShortcuts({
  meta_k: () => openSearch(),        // Cmd+K (Mac) / Ctrl+K (Win)
  meta_shift_p: () => openPalette(), // Cmd+Shift+P
  escape: () => close(),
  ctrl_s: () => save(),

  // With condition
  meta_enter: {
    handler: () => submit(),
    whenever: [isFormValid]
  }
})
```

| Key | Meaning |
|---|---|
| `meta` | Cmd (Mac) / Ctrl (Windows) |
| `ctrl` | Ctrl key |
| `alt` | Alt / Option key |
| `shift` | Shift key |
| `_` | Key separator |

## defineLocale / extendLocale

i18n locale definition.

```ts
import { fr } from '@nuxt/ui/locale'

// Use a built-in locale (50+ available)
// <UApp :locale="fr">

// Define custom locale
const locale = defineLocale({
  name: 'Español',
  code: 'es',
  dir: 'ltr',
  messages: {
    select: { placeholder: 'Seleccionar...' }
  }
})

// Extend existing locale
import { en } from '@nuxt/ui/locale'

const customEn = extendLocale(en, {
  messages: { commandPalette: { placeholder: 'Search a component...' } }
})
```

```vue
<UApp :locale="fr"><NuxtPage /></UApp>
```

## extractShortcuts

Extract shortcut keys from a list of items (e.g., dropdown menu items) into a shortcuts map for `defineShortcuts`.

```ts
const items = [
  { label: 'New file', kbds: ['meta', 'n'], onSelect: () => newFile() },
  { label: 'Save', kbds: ['meta', 's'], onSelect: () => save() }
]

defineShortcuts(extractShortcuts(items))
```

## Quick reference

| Composable | Purpose |
|---|---|
| `useToast` | Show notifications |
| `useOverlay` | Programmatic modals/slideovers |
| `defineShortcuts` | Keyboard shortcuts |
| `defineLocale` / `extendLocale` | i18n locale |
| `extractShortcuts` | Parse shortcut definitions |
