---
name: nuxt-ui-design-system
description: Apply a company's existing design system to an app built with Nuxt UI v5, by mapping its tokens onto the Nuxt UI CSS variables. Use when the user wants Nuxt UI to match their design system, brand guidelines, design tokens, a Tailwind config, a tokens JSON file or Figma variables, or asks to theme Nuxt UI from them.
---

# Apply a design system to Nuxt UI

The theme pages of the docs are the source of truth, this skill is the procedure to apply them. The role variables, what reads them and their defaults are in [references/roles.md](references/roles.md), load it before mapping anything. Fetch a page when a step needs more than the table:

```
https://raw.githubusercontent.com/nuxt/ui/v5/docs/content/docs/1.getting-started/5.theme/1.design-system.md
https://raw.githubusercontent.com/nuxt/ui/v5/docs/content/docs/1.getting-started/5.theme/2.css-variables.md
https://raw.githubusercontent.com/nuxt/ui/v5/docs/content/docs/1.getting-started/5.theme/3.components.md
```

Components read semantic utilities, which read `--ui-*` variables. The job is to set those variables, in this order, and to touch the app config only for what they can't express.

## 1. Read the tokens

Don't edit anything yet.

1. Check that the working tree is clean and create a branch.
2. Detect whether the project is a Nuxt app or a Vue app using the `@nuxt/ui/vite` plugin, and whether `@nuxt/ui/colors` is in the `exports` of the installed `@nuxt/ui`. Without it the project is on v4, stop: `@nuxt/ui/colors` and most of these variables are v5 only, point the user at the `migrate-nuxt-ui-v4-to-v5` skill.
3. Find the stylesheet that imports `@nuxt/ui`, and `app.config.ts` or the `app.use(ui)` call of the entry file.
4. Read the design system wherever it lives. Ask the user where it is when nothing below turns up:
   - **CSS variables**: `:root`, `.dark`, `[data-theme]` or `@media (prefers-color-scheme: dark)` blocks.
   - **Tailwind CSS config**: `theme` and `theme.extend` of a `tailwind.config.*` (colors, `borderRadius`, `fontFamily`, `fontSize`, `spacing`, `boxShadow`), or the `@theme` blocks of a v4 stylesheet.
   - **Design tokens JSON** in the DTCG format: `$value` and `$type`, groups inherit `$type`, `{group.token}` is a reference to resolve until it reaches a value. Dark values live in another file, another group or `$extensions`, look for all three.
   - **Figma variables** through the Figma MCP server, like its `get_variable_defs` tool. Read every collection and every mode, Light and Dark included. Without the server, ask the user for an export.
5. Write down an inventory, in both modes when the design system has them: the palettes and their steps, the semantic colors, the text, background and border tokens, the focus ring, the disabled state, the radius scale, the control sizes (height, horizontal padding, gap, icon size and font size per size), the font families, weights and type scale, and anything else, like shadows or motion.

## 2. Map

Fill a table with one row per token: the token, the Nuxt UI variable or option it maps to, the value, and one of `exact`, `guessed` or `no variable`. Follow these rules:

1. **Palettes** need every shade from `50` to `950`. A scale with other steps, like `100` to `900`, or with `25`, is `guessed`: say which shades you placed or interpolated. Name each palette with a prefix, like `acme-blue`, so it can't be taken for an alias or a Tailwind CSS palette.
2. **Aliases** by purpose: brand or main action to `primary`, danger, critical or negative to `error`, positive to `success`, caution to `warning`, the grays to `neutral`. A second brand color takes `secondary` before you add one. Find the solid of each color in each mode on its scale, that's `primary: acme-blue 600 400`. A solid that isn't a shade of the scale goes in `--ui-<color>` for both modes. A light solid, like a yellow `400`, makes `text-<color>` hard to read on white: set `--ui-<color>-text-default` to a darker shade and mark it `guessed` when the design system has no text token for it.
3. **Added colors** for the semantic colors left over. The name can't be a word a utility already has, the list is in the reference, nor the name of its palette. Rename a design system `accent` or `highlight` and say so.
4. **Text, background and border** tokens to the variables of the reference by what they're used for, not by their name: a design system's `text.secondary` is usually `--ui-text-muted`. With a single primary text color, set both `--ui-text-strong` and `--ui-text-default` to it. Write a value as `var(--ui-color-<alias>-<shade>)` when it's a shade of an alias's palette, never `var(--color-<palette>-<shade>)`, a literal otherwise. Leave out the variables whose default already matches. A value set on `:root` also applies in dark mode, so give every variable you set on `:root` its `.dark` value too, even when it's the default.
5. **Per-color roles** only for a value that differs from the recipe of the reference, like dark text on a warning solid. A single focus color for the whole design system goes in `--ui-outline-focus` and in the `--ui-<color>-outline-focus` of every color, since each color's outline defaults to its own color.
6. **Radius**: `--ui-radius` is the control radius divided by `1.5`. When the card radius isn't twice the base, keep `--ui-radius` for the small steps and set the steps that differ, `--radius-md`, `--radius-lg`, `--radius-xl`, in `@theme`, and tell the user it changes their own `rounded-*` classes too.
7. **Control sizes**: compare the heights with the table of the reference. When the default control matches another Nuxt UI size, set `ui.defaultVariants.size`, then retune the padding, gap and icon of the sizes that still differ with the `--ui-control-<px|py|gap|icon-size>-<size>` scale on `:root`, which Button, Select, FileUpload, Tabs, Tree, the menu items and every field but InputDate, InputTime and PinInput read. Badge and the other components the reference lists keep their own values: give them `--ui-control-*` entries in the app config only when the user wants them to follow. Their text goes in `--ui-control-text-<size>`, a 13px `md` is `--ui-control-text-md: 0.8125rem`, and its line height in `--ui-control-text-<size>--line-height`. A checkbox, radio or switch size goes in `--ui-control-box-<size>`. Tell the user when the size names shift, like their `lg` becoming Nuxt UI's `md`.
8. **Fonts** in `@theme` (`--font-sans`, `--font-heading`, `--font-mono`). Nuxt loads them through `@nuxt/fonts`, a Vue app has to load them itself. Weights in `--ui-font-weight-body` and `--ui-font-weight-heading`. A type scale goes in `--text-*` only when the user agrees that it applies to their whole app.
9. **What's left** goes to the app config, the slots and default variants of one component, or to the `no variable` list. Shadows have Tailwind CSS's `--shadow-*`, easing its `--ease-*`, both global: the steps the components use are in the reference.

Never set `--ui-accent-*`, `--ui-layer-*` or `--ui-highlight`, the components set them. Never write a palette class like `bg-acme-blue-600` in a template or the app config.

Show the user the table and the `guessed` and `no variable` rows, and wait for their go.

## 3. Apply

In this order, in the stylesheet that imports `@nuxt/ui`, after the imports:

1. The palettes in `@theme`, every shade.
2. One `@plugin "@nuxt/ui/colors"` block with the aliases and the added colors.
3. The text, background, border and per-color role variables, in `:root` and `.dark`, unlayered or in `@layer base`, never in `@layer theme`. Each one in both blocks.
4. The other variables the mapping set: `--ui-focus-width`, `--ui-disabled-opacity`, the `--ui-control-*-<size>` scale, `--ui-control-text-step`, `--ui-container-width`, `--ui-gutter`, `--ui-header-height` and `--ui-chart-*`, on `:root`, in `.dark` too when they differ by mode, and in an `@variant sm` or `@media` block inside `:root` for a value per breakpoint, like the gutter.
5. The radius, the fonts, then the `--shadow-*` and `--ease-*` the mapping set, in `@theme`.
6. The app config: `ui.defaultVariants`, then the `--ui-control-*` entries of the components off the scale, then the slots.

Put a comment over each group with the design system tokens it comes from, so the next update of the design system can be mapped again.

When the project has components of its own styled with hardcoded design system classes, and the user wants them ported, rewrite their classes with the semantic utilities and style them with `useComponentTheme`, with `colorVariant` from `@nuxt/ui/utils/theme` for a `color` prop: it takes the added colors with no extra entry. The Components page's "Custom components" section has the full example.

## 4. Verify

1. Run the build. The `@nuxt/ui/colors` plugin fails it on an unknown palette, a missing shade or a name that's taken, with the fix in the message.
2. Run the linter with `no-palette-colors` at `error`: `ui.eslint.rules` in `nuxt.config.ts` with `@nuxt/eslint` and `eslint-plugin-better-tailwindcss` installed, or the `@nuxt/ui/eslint` config in a Vue app's `eslint.config`. The module skips its config when the `eslint.config` already registers `eslint-plugin-better-tailwindcss`: replace that registration with the `@nuxt/ui/eslint` config. It reports through `better-tailwindcss/no-restricted-classes`, and only knows Tailwind CSS's own palettes: a palette you declared in `@theme`, like `bg-acme-blue-600`, isn't reported, step 4 finds those. Replace each class with the alias or the token the message names, or point an alias at the palette it names. It checks `class` attributes, `:ui` objects, the `:ui`, `:variants` and `:props` of `<UTheme>` and the `ui` of the app config or `app.use(ui)`, not class strings elsewhere in scripts, so search those too, like a column's `meta.class`.
3. Run the type check. An added color is part of every `color` prop type, so a `color` value that doesn't exist fails it. On Vue, `ui.d.ts` has to be in the `tsconfig` `include`.
4. Search the templates, the app config and the stylesheets for the hex values and palette names of the design system that are left.

Then report three lists: what maps exactly, what you guessed and why, and what needed the app config or has no variable. Name the pages to check in the browser in both modes.
