# Design System

## Semantic colors

Nuxt UI uses 7 semantic colors. Never use raw Tailwind palette colors in components — always use these semantic names.

| Color | Default | When to use |
|---|---|---|
| `primary` | green | CTAs, active states, brand accent, links |
| `secondary` | blue | Secondary actions, complementary highlights |
| `success` | green | Success messages, confirmations, positive states |
| `info` | blue | Informational alerts, tips, neutral highlights |
| `warning` | yellow | Warnings, caution states, pending actions |
| `error` | red | Errors, destructive actions, validation failures |
| `neutral` | slate | Text, borders, backgrounds, disabled states, chrome |

### Choosing colors for components

- **Primary action** on a page (submit, save, confirm) → `color="primary"`
- **Secondary actions** (cancel, back, alternative) → `color="neutral"` with `variant="outline"` or `"ghost"`
- **Destructive actions** (delete, remove) → `color="error"`
- **Status indicators** → match the semantic meaning: `success`, `warning`, `error`, `info`
- **Navigation and chrome** → `color="neutral"`

### Configuring colors

```ts
// Nuxt — app.config.ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'indigo',
      secondary: 'violet',
      success: 'emerald',
      error: 'rose',
      neutral: 'zinc'
    }
  }
})
```

```ts
// Vue — vite.config.ts
ui({
  ui: {
    colors: { primary: 'indigo', secondary: 'violet', neutral: 'zinc' }
  }
})
```

Only colors that exist in your theme work — either Tailwind's defaults or custom colors defined with `@theme`.

### Adding custom brand colors

1. Define all 11 shades in CSS:

```css
/* assets/css/main.css */
@theme static {
  --color-brand-50: #fef2f2;
  --color-brand-100: #fee2e2;
  --color-brand-200: #fecaca;
  --color-brand-300: #fca5a5;
  --color-brand-400: #f87171;
  --color-brand-500: #ef4444;
  --color-brand-600: #dc2626;
  --color-brand-700: #b91c1c;
  --color-brand-800: #991b1b;
  --color-brand-900: #7f1d1d;
  --color-brand-950: #450a0a;
}
```

2. Assign it: `ui: { colors: { primary: 'brand' } }`

### Extending with new semantic color names

To add a color beyond the 7 defaults (e.g., `tertiary`), register it in `theme.colors`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
    }
  }
})
```

## Semantic utility classes

Use these everywhere instead of raw palette colors:

### Text
- `text-default` — primary text (headings, labels)
- `text-muted` — secondary text (descriptions, hints)
- `text-dimmed` — tertiary text (placeholders, disabled)
- `text-highlighted` — inverse/highlighted text (on colored backgrounds)

### Backgrounds
- `bg-default` — page background
- `bg-elevated` — raised surfaces (cards, dropdowns)
- `bg-muted` — subtle backgrounds (hover states, alternating rows)
- `bg-inverted` — inverse background (dark on light, light on dark)
- `bg-accented` — subtle accent backgrounds

### Borders
- `border-default` — standard borders
- `border-muted` — subtle borders (dividers, separators)
- `border-accented` — accent borders (active states)
- `border-inverted` — inverse borders

## Variants

Most components accept a `variant` prop. Choose based on visual weight:

| Variant | Weight | When to use |
|---|---|---|
| `solid` | Highest | Primary actions, main CTAs |
| `outline` | Medium | Secondary actions, form fields |
| `soft` | Medium-low | Tags, badges, subtle buttons |
| `subtle` | Low | Background highlights, less prominent actions |
| `ghost` | Lowest | Inline actions, icon buttons, navigation items |
| `link` | Lowest | Text-only links inside content |

### Rules

- **One solid primary button per view** — everything else should be lower weight
- **Destructive buttons** use `color="error"` but not necessarily `variant="solid"` — use `variant="soft"` or `"outline"` unless it's the primary action on a confirmation dialog
- **Button groups** should use consistent variants — don't mix `solid` and `outline` siblings

## The `ui` prop

Every component accepts a `ui` prop to override theme slots after variants are computed — it wins over everything.

```vue
<UButton :ui="{ base: 'rounded-none', trailingIcon: 'size-3 rotate-90' }" />
<UCard :ui="{ header: 'bg-muted', body: 'p-8' }" />
```

### Finding slot names

Read the generated theme file for any component:
- **Nuxt**: `.nuxt/ui/<component>.ts`
- **Vue**: `node_modules/.nuxt-ui/ui/<component>.ts`

These files show every available slot name, variant combination, and default class.

## Global config

Override component defaults globally:

```ts
// Nuxt — app.config.ts
export default defineAppConfig({
  ui: {
    button: {
      defaultVariant: 'outline',
      slots: {
        base: 'rounded-full'
      }
    }
  }
})
```

## CSS variables

Nuxt UI exposes CSS variables you can override:

```css
:root {
  --ui-radius: var(--radius-lg);
  --ui-container: 80rem;
}
```

## Dark mode

- Nuxt: automatic with `@nuxtjs/color-mode` (included by default)
- Vue: add `dark` class to `<html>` element
- Toggle with `UColorModeButton` or `UColorModeSwitch`
- All semantic utilities adapt automatically — `text-default` is dark in light mode, light in dark mode
