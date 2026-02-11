# Theming

## Semantic colors

| Color | Default | Purpose |
|---|---|---|
| `primary` | green | CTAs, active states, brand |
| `secondary` | blue | Secondary actions |
| `success` | green | Success messages |
| `info` | blue | Informational |
| `warning` | yellow | Warnings |
| `error` | red | Errors, destructive actions |
| `neutral` | slate | Text, borders, disabled |

## Configuring colors

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

You can only use colors that exist in your theme — either [Tailwind's default colors](https://tailwindcss.com/docs/colors) or custom colors defined with `@theme`.

## Adding custom colors

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

2. Assign it as a semantic color value: `ui: { colors: { primary: 'brand' } }`

You can only use colors that have all shades defined — either from Tailwind's defaults or custom `@theme` definitions.

### Extending with new semantic color names

If you need a new semantic color beyond the defaults (e.g., `tertiary`), register it in `theme.colors`:

```ts
// Nuxt — nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
    }
  }
})
```

```ts
// Vue — vite.config.ts
ui({
  theme: {
    colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
  }
})
```

Then assign it: `ui: { colors: { tertiary: 'indigo' } }` and use it via the `color` prop: `<UButton color="tertiary">`.

## CSS utilities

### Text

| Class | Use | Light value | Dark value |
|---|---|---|---|
| `text-default` | Body text | `neutral-700` | `neutral-200` |
| `text-muted` | Secondary text | `neutral-500` | `neutral-400` |
| `text-dimmed` | Placeholders, hints | `neutral-400` | `neutral-500` |
| `text-toned` | Subtitles | `neutral-600` | `neutral-300` |
| `text-highlighted` | Headings, emphasis | `neutral-900` | `white` |
| `text-inverted` | On dark/light backgrounds | `white` | `neutral-900` |

### Background

| Class | Use | Light value | Dark value |
|---|---|---|---|
| `bg-default` | Page background | `white` | `neutral-900` |
| `bg-muted` | Subtle sections | `neutral-50` | `neutral-800` |
| `bg-elevated` | Cards, modals | `neutral-100` | `neutral-800` |
| `bg-accented` | Hover states | `neutral-200` | `neutral-700` |
| `bg-inverted` | Inverted sections | `neutral-900` | `white` |

### Border

| Class | Use | Light value | Dark value |
|---|---|---|---|
| `border-default` | Default borders | `neutral-200` | `neutral-800` |
| `border-muted` | Subtle borders | `neutral-200` | `neutral-700` |
| `border-accented` | Emphasized borders | `neutral-300` | `neutral-700` |
| `border-inverted` | Inverted borders | `neutral-900` | `white` |

### Semantic color utilities

Each semantic color (`primary`, `secondary`, `success`, `info`, `warning`, `error`) is available as a Tailwind utility: `text-primary`, `bg-primary`, `border-primary`, `ring-primary`, etc.

They resolve to shade **500** in light mode and shade **400** in dark mode (via `--ui-<color>` CSS variables). This is generated at runtime by the colors plugin — you don't need to write dark-mode variants manually.

To adjust which shade is used, override `--ui-primary` (or any semantic color) in your `main.css`:

```css
:root { --ui-primary: var(--ui-color-primary-600); }
.dark { --ui-primary: var(--ui-color-primary-300); }
```

### CSS variables

All customizable in `main.css`:

```css
:root {
  --ui-radius: 0.25rem;               /* base radius for all components */
  --ui-container: 80rem;              /* UContainer max-width */
  --ui-header-height: 4rem;            /* UHeader height */
  --ui-primary: var(--ui-color-primary-500); /* adjust shade used */
}

.dark {
  --ui-primary: var(--ui-color-primary-400);
}
```

### Solid colors (black/white)

```css
:root { --ui-primary: black; }
.dark { --ui-primary: white; }
```

## Component theme customization

### How it works

Components are styled with [Tailwind Variants](https://www.tailwind-variants.org/). The theme defines:

- **`slots`** — named style targets (e.g., `root`, `base`, `label`, `leadingIcon`)
- **`variants`** — styles applied based on props (e.g., `color`, `variant`, `size`)
- **`compoundVariants`** — styles for specific prop combinations (e.g., `color: 'primary'` + `variant: 'outline'`)
- **`defaultVariants`** — default prop values when none are specified

### Override priority

**`ui` prop / `class` prop > global config > theme defaults**

The `ui` prop overrides slots **after** variants are computed. If the `size: 'md'` variant applies `size-5` to `trailingIcon`, and you set `:ui="{ trailingIcon: 'size-3' }"`, the `size-3` wins.

Tailwind Variants uses [tailwind-merge](https://github.com/dcastil/tailwind-merge) under the hood so conflicting classes are resolved automatically.

### Understanding the generated theme

Every component's full resolved theme is generated at build time. Always read this file before customizing a component — it shows exactly what classes are applied where.

- **Nuxt**: `.nuxt/ui/<component>.ts`
- **Vue**: `node_modules/.nuxt-ui/ui/<component>.ts`

For example, the card theme:

```ts
{
  slots: {
    root: "rounded-lg overflow-hidden",
    header: "p-4 sm:px-6",
    body: "p-4 sm:p-6",
    footer: "p-4 sm:px-6"
  },
  variants: {
    variant: {
      outline: { root: "bg-default ring ring-default divide-y divide-default" },
      soft: { root: "bg-elevated/50 divide-y divide-default" }
    }
  },
  defaultVariants: { variant: "outline" }
}
```

### Global config

Override the theme for all instances of a component:

```ts
// Nuxt — app.config.ts
export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'font-bold rounded-full'
      },
      variants: {
        size: {
          md: { leadingIcon: 'size-4' }
        }
      },
      compoundVariants: [{
        color: 'neutral',
        variant: 'outline',
        class: { base: 'ring-2' }
      }],
      defaultVariants: {
        color: 'neutral',
        variant: 'outline'
      }
    }
  }
})
```

```ts
// Vue — vite.config.ts
ui({
  ui: {
    button: {
      slots: { base: 'font-bold rounded-full' },
      defaultVariants: { color: 'neutral', variant: 'outline' }
    }
  }
})
```

### Per-instance (`ui` prop)

Overrides slots after variant computation:

```vue
<UButton :ui="{ base: 'font-mono', trailingIcon: 'size-3 rotate-90' }" />
<UCard :ui="{ root: 'shadow-xl', body: 'p-8' }" />
```

### Per-instance (`class` prop)

Overrides the `root` or `base` slot:

```vue
<UButton class="rounded-none">Square</UButton>
```

Components without slots (e.g., `UContainer`, `USkeleton`, `UMain`) only have the `class` prop.

### Theme structure patterns

**Slots-based** (most components — `slots` is an object in the generated theme):

```ts
// global config
ui: {
  button: {
    slots: { base: 'font-bold' }
  }
}
// per instance
<UButton :ui="{ base: 'font-bold' }" />
```

**Flat base** (`base` is a top-level string in the generated theme):

```ts
// global config
ui: {
  container: {
    base: 'max-w-lg'
  }
}
// per instance — class prop only
<UContainer class="max-w-lg" />
```

Always check the generated theme file to see which pattern applies.

## Dark mode

```ts
const colorMode = useColorMode()
colorMode.preference = 'dark' // 'light', 'dark', 'system'
```

```vue
<UColorModeButton /> <!-- Toggle -->
<UColorModeSelect /> <!-- Dropdown -->
```

## Fonts

```css
/* assets/css/main.css */
@theme {
  --font-sans: 'Public Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

In Nuxt, fonts defined with `@theme` are automatically loaded by the `@nuxt/fonts` module.

## Brand customization playbook

Follow these steps to fully rebrand Nuxt UI (e.g., "make a Ghibli theme", "match our corporate brand"):

### Step 1 — Define the color palette

Pick colors that match the brand. Map them to semantic roles:

```ts
// app.config.ts (Nuxt) or vite.config.ts (Vue)
ui: {
  colors: {
    primary: 'emerald',    // brand accent
    secondary: 'amber',    // secondary accent
    success: 'green',
    info: 'sky',
    warning: 'orange',
    error: 'rose',
    neutral: 'stone'       // affects all text, borders, backgrounds
  }
}
```

If no Tailwind default color fits, define custom shades in CSS (see [Adding custom colors](#adding-custom-colors)):

```css
@theme static {
  --color-forest-50: #f0fdf4;
  /* ... all 11 shades (50–950) ... */
  --color-forest-950: #052e16;
}
```

Then use it: `primary: 'forest'`.

### Step 2 — Set fonts

```css
/* assets/css/main.css */
@theme {
  --font-sans: 'Quicksand', system-ui, sans-serif;
}
```

### Step 3 — Adjust CSS variables

```css
:root {
  --ui-radius: 0.75rem;   /* rounder = softer/playful, smaller = sharper/corporate */
  --ui-primary: var(--ui-color-primary-600); /* adjust which shade is used */
}

.dark {
  --ui-primary: var(--ui-color-primary-400);
}
```

### Step 4 — Override key components globally

Read the generated theme files to find slot names, then apply global overrides:

```ts
// app.config.ts (Nuxt) or vite.config.ts (Vue)
ui: {
  // ... colors from Step 1
  button: {
    slots: {
      base: 'rounded-full font-semibold'
    },
    defaultVariants: {
      variant: 'soft'
    }
  },
  card: {
    slots: {
      root: 'rounded-2xl shadow-lg'
    }
  },
  badge: {
    slots: {
      base: 'rounded-full'
    }
  }
}
```

> **Tip**: Read `.nuxt/ui/button.ts` (Nuxt) or `node_modules/.nuxt-ui/ui/button.ts` (Vue) to see all available slots and variants before overriding.

### Step 5 — Verify dark mode

Check that both modes look correct. Adjust `--ui-primary` shade per mode and test contrast. Use `useColorMode()` to toggle during development.

### Quick checklist

| Step | What to change | Where |
|---|---|---|
| Colors | `primary`, `secondary`, `neutral` | `app.config.ts` / `vite.config.ts` |
| Custom palette | 11 shades per color | `main.css` (`@theme static`) |
| Fonts | `--font-sans`, `--font-mono` | `main.css` (`@theme`) |
| Radius | `--ui-radius` | `main.css` (`:root`) |
| Primary shade | `--ui-primary` | `main.css` (`:root` + `.dark`) |
| Component shapes | Global slot overrides | `app.config.ts` / `vite.config.ts` |
| Dark mode | Verify contrast, adjust variables | `main.css` (`.dark`) |
