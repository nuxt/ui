# Nuxt UI Theme Studio — Master Plan

> Working plan for the "ultimate theme customizer" contribution, targeting Nuxt UI v5.
> Status: draft for discussion.

## 1. Vision

Bootstrap sites "all looked the same" only when people shipped the default CSS. The fix was
never more components — it was making deep customization *approachable*. Nuxt UI has the
best raw material of any component system today: a clean chain of Tailwind palette → color
aliases → semantic CSS variables → component variants, split across CSS and `app.config`.
What it lacks is a rich theming ecosystem and a tool that exposes that chain.

The Theme Studio is a standalone page (main header navigation, not part of the docs) that:

- lets you go from "pick a primary color" to "edit the OKLCH curve of your neutral palette"
  on one continuous slope of drill-down, Blender-style;
- shows *where every value comes from* (inherited vs. overridden), Bootstrap-variable-chain-style;
- ships opinionated presets (Shadcn, Neo-brutalist, Anthropic, Spotify, …) and a taste-constrained shuffle;
- exports the **minimal** `main.css` + `app.config.ts` diff — only what you changed;
- previews live on a component bento and on template-scale pages (SaaS, Chat, Dashboard).

North star: someone who has never opened the theming docs produces a theme that doesn't
look like default Nuxt UI in 60 seconds — and someone who cares can drill all the way down
to a single semantic token or component slot without leaving the page.

## 2. Ground truth: how Nuxt UI theming works today (v4)

The studio must be a *lens over the real system*, not a parallel one. The real system is a
five-level inheritance chain:

| Level | What | Where | Mechanism |
|---|---|---|---|
| L0 | Palette: `--color-{name}-{50..950}` | Tailwind `@theme` / CSS | Tailwind defaults, overridable in `@theme static` |
| L1 | Alias shades: `--ui-color-{alias}-{shade}` | `src/runtime/plugins/colors.ts` | Generated at runtime from `app.config ui.colors` (`primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`), each shade falls back through `var(--color-{value}-{shade}, hex)` |
| L2 | Semantic tokens: `--ui-text[-dimmed/muted/toned/highlighted/inverted]`, `--ui-bg[-muted/elevated/accented/inverted]`, `--ui-border[-muted/accented/inverted]`, `--ui-primary` (=shade 500 light / 400 dark), `--ui-radius`, `--font-sans` | `src/runtime/index.css` (`:root` / `.dark`) | Plain CSS custom properties referencing L1 |
| L3 | Component themes: slots / variants / compoundVariants | `src/theme/*.ts` via `tv()` | Tailwind classes referencing L2 utilities (`text-muted`, `bg-elevated`, `rounded-md`…) |
| L4 | Defaults & overrides: `defaultVariants` + `app.config ui.<component>` | components spread `appConfig.ui?.<name>` into their `tv()` options | Runtime-mergeable, including `defaultVariants` per component |

Facts that matter for the design (verified in source):

- **Per-component `defaultVariants` are already overridable at runtime** via
  `app.config ui.button.defaultVariants` etc. (`Button.vue:95-108` spreads `appConfig.ui?.button`
  into the `tv()` options).
- **Global `defaultVariants`** exist only as a *build-time* module option and only for
  `color` and `size` (`src/module.ts:67`) — there is no global "default variant = subtle"
  switch. Gap → §7.
- The docs site already live-applies themes with zero flash: `useHead` inline `<style>`
  blocks + direct `app.config` mutation + localStorage persistence + FOUC inline scripts
  (`docs/app/composables/useTheme.ts`, `docs/app/plugins/theme.ts`). There is also a
  sanitized `applyThemeSettings()` path used by the AI theme feature — the studio must
  stay compatible with (and eventually power) it.
- The current popover exports are already **minimal-diff** (compare against defaults, emit
  only overrides, for both Nuxt `app.config.ts` and Vue `vite.config.ts`). This philosophy
  scales up; the mechanism (ad-hoc conditionals) doesn't — it becomes a generic
  diff-against-defaults engine (§4).
- The docs site already has custom neutral palettes (`taupe`, `mauve`, `mist`, `olive`)
  injected as `--color-*-{shade}` hex values — exactly the pattern the palette editor
  generalizes.

## 3. Core concept: the Theme Document and its resolver

Everything in the studio is a view over one serializable, versioned **Theme Document**.
The rule that makes inheritance, drill-down, shuffle, presets, share-links and minimal
export all fall out of one design:

> **A ThemeDoc stores only explicit overrides. Everything else is `inherit`.**

```ts
interface ThemeDoc {
  version: 1
  meta?: { name?: string, base?: string /* preset id this was forked from */, seed?: number }

  /** L0 — custom or tweaked palettes. Generator params kept so palettes stay editable. */
  palettes?: Record<string, {
    /** explicit shades win over generated ones */
    shades?: Partial<Record<Shade, string>>
    /** OKLCH curve generator params (see §5.2) */
    curve?: { anchor?: string, lightness?: CurveParams, chroma?: CurveParams, hue?: CurveParams }
    /** when tweaking an existing tailwind palette rather than creating one */
    extends?: string
  }>

  /** L1 — alias → palette name ('indigo', 'neutral', or a key of `palettes`) */
  colors?: Partial<Record<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral', string>>

  /** L2 — semantic token overrides per mode; values are `var(--ui-color-…)` refs or raw colors */
  tokens?: { light?: Record<string, string>, dark?: Record<string, string> }
  radius?: number
  font?: { sans?: string /* future: mono, heading */ }
  icons?: string

  /** L4 — global defaults, expanded to per-component app.config on export until core supports it */
  defaultVariants?: { color?: string, size?: string, variant?: string }

  /** L4 — per-component overrides: defaultVariants + slot/variant class overrides */
  components?: Record<string, Record<string, unknown>>
}
```

Around it, a small pure-TypeScript **theme engine** (no Vue imports, fully unit-testable):

- `resolve(doc): ResolvedTheme` — walks the chain and computes every effective value **with
  provenance**: `{ value, source: 'default' | 'override', chain: ['--ui-border', '--ui-color-neutral-200', '--color-slate-200', '#e2e8f0'] }`.
  Provenance is what powers the Blender-style UI: overridden controls get a highlight dot,
  every control has "reset to inherited", and hovering a value shows its inheritance
  breadcrumb.
- `materializePalette(def): Record<Shade, string>` — runs the OKLCH curve generator.
- `diff(doc): { css: string, appConfig: object }` — the export generators. Because the doc
  *is* the diff, minimal export is free: serialize what's there, route each override to the
  right medium (CSS vs config) per the table in §5.6.
- `applyRuntime(doc)` — thin Vue adapter: mutates `app.config` + feeds `useHead` styles,
  extending the exact mechanism `useTheme` uses today (same localStorage keys, so the
  existing popover and the studio stay in sync — the popover becomes the "mini" remote
  control of the same state, plus an "Open Theme Studio →" link).

## 4. The page

**Placement** — standalone page in the main header navigation (like Templates, Showcase,
Figma), *not* under `/docs`. Proposed route: `/theme` (bikeshed: `/studio`, `/themes`).
Added to `desktopLinks` / mobile links in `docs/app/components/header/`. The page gets the
full viewport; the docs chrome (aside, toc) doesn't apply.

**Layout** — three zones:

```
┌──────────────────────────────────────────────────────────────┐
│ Presets ▾   🎲 Shuffle   [locks]        Share ⧉  Export ⬇  ↺ │
├───────────────┬──────────────────────────────────────────────┤
│ CONTROLS      │ PREVIEW                                      │
│               │  [Bento | SaaS | Dashboard | Chat]  ☀/🌙  ⤢  │
│ ▸ Essentials  │                                              │
│ ▸ Palette     │   live components / template page            │
│ ▸ Tokens      │                                              │
│ ▸ Components  │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

**Control altitudes** (the drill-down slope — each level is optional, defaults flow up):

1. **Essentials** — parity with today's popover: primary, neutral, radius, font, icons,
   color mode, plus the new *global default variant* control ("solid / soft / subtle /
   outline everywhere"). One screen, 60-second theme.
2. **Palette** — the OKLCH curve editor (§5.2). Edit primary's ramp, replace the neutral
   ramp ("I want my -50s less white"), create named custom palettes.
3. **Tokens** — the semantic layer: every `--ui-*` variable per light/dark, each shown with
   its inheritance chain and a picker constrained to sensible values (a shade of an alias,
   another token, or a raw color). This is where "background color (and edit)" lives beyond
   the neutral swap: remap `--ui-bg` to `neutral-950` in dark, tint `--ui-bg-muted`, etc.
4. **Components** — per-component `defaultVariants` and (expert mode) slot class overrides,
   fed by the same theme metadata the docs' ComponentTheme pages use. Search box + the
   handful of components people actually restyle (Button, Input, Card, Badge, Alert…)
   surfaced first.

Every control at every altitude follows the same contract: shows effective value, shows
override state (dot), offers reset-to-inherited, and edits write into the ThemeDoc — never
into derived state.

## 5. Feature specs

### 5.1 Primary & background color — choose *and edit*

- Choose: swatch grid of Tailwind palettes (as today) + black-as-primary + custom palettes.
- Edit: any chosen palette opens in the curve editor pre-loaded with its current values
  (`extends: 'indigo'` + sparse `shades` overrides → export emits only changed shades).
- Background = the neutral alias + the `--ui-bg*` token remaps in the Tokens altitude.

### 5.2 OKLCH palette curve editor (the gray-generator, generalized)

Port of the Tailwind gray palette generator concept, on OKLCH (perceptually uniform, what
Tailwind v4 itself uses):

- Three curves across the 11 shade stops: **Lightness** (monotonic, eased), **Chroma**
  (bell-ish curve — where does color concentrate), **Hue** (base + drift, for warm-dark /
  cool-light ramps). Parametric (a few draggable handles per curve), not 33 free numbers —
  with per-shade nudge overrides on top.
- **Anchor color**: paste a brand hex, pin it to a stop (e.g. 500), curves fit around it.
- Rendering: `culori` (tiny, tree-shakeable) for OKLCH↔sRGB + gamut clamping.
- Guardrails inline: WCAG/APCA contrast badges for the token pairs that matter
  (`text` on `bg`, `text-inverted` on `primary-500`, `text-muted` on `bg-elevated`…).
- Output: 11 hex values injected as `--color-{name}-{shade}` (exactly how the docs' custom
  neutrals work today) — plus the generator params stored in the doc so it stays editable.

### 5.3 Inheritance & drill-down (Blender × Bootstrap)

Covered structurally by §3/§4. UI specifics:

- Overridden values get a colored dot + bold label (Blender's "changed from default" cue).
- Hover/expand shows the chain: `--ui-border ← --ui-color-neutral-200 ← --color-slate-200 ← #e2e8f0`.
- "Reset" exists at every granularity: single value, section, altitude, whole theme.
- Editing an inherited value forks it into an override *at that level only* — e.g. changing
  `--ui-bg-elevated` doesn't touch the neutral palette; changing the neutral palette flows
  into every token still inheriting from it.

### 5.4 Default variants

- Global control in Essentials: default `variant` (+ `color`, `size`) for all components
  that have them. Until core has a global runtime switch (§7), the engine expands it to
  per-component `defaultVariants` entries in the exported `app.config` (the mechanism that
  already works today).
- Per-component refinement in the Components altitude ("Buttons solid, everything else subtle").

### 5.5 Presets & shuffle

Presets are just ThemeDocs shipped as static JSON — each one deliberately exercises a
different engine capability (they double as milestones and as living tests):

| Preset | What it proves |
|---|---|
| **Nuxt UI** (default) | empty doc, everything inherited |
| **Shadcn** | neutral=zinc, black-as-primary, radius 0.5, tight shadows, global subtle-ish variants |
| **Neo-brutalist** | radius 0, thick borders, hard offset shadows, bold type → component class overrides + the shadow/border token gap (§7) |
| **Anthropic** | custom warm neutral ramp (ivory/kraft/book-cloth) + clay primary (~`#CC785C`) → the palette curve editor |
| **Spotify** | dark-first, custom `#1DB954` ramp, near-black green-tinted neutrals, pill buttons → per-component defaultVariants + token remaps |

- Selecting a preset *replaces* the doc (with confirm if dirty); `meta.base` tracks the fork
  so "changed vs. preset" provenance still works.
- **Shuffle** 🎲: seeded, taste-constrained randomness — pick an archetype (preset family),
  then hue, curve params, radius, font pairing and variant defaults from curated
  compatibility sets. Per-section **locks** (lock primary, shuffle the rest — coolors.co
  model). Seed stored in `meta.seed` so a great roll is reproducible and shareable.
- Later: community preset gallery — presets are JSON, submissions are PRs adding a file.

### 5.6 Export — minimal by construction

Routing table (each ThemeDoc field has exactly one export medium):

| Doc field | `main.css` | `app.config.ts` / `vite.config.ts` |
|---|---|---|
| `palettes` | `@theme static { --color-… }` (only changed/generated shades) | — |
| `colors` (aliases) | — | `ui.colors` |
| `tokens` | `:root, .light { --ui-… }` / `.dark { … }` | — |
| `radius`, `font` | `:root { --ui-radius }` / `@theme { --font-sans }` | — |
| `icons` | — | `ui.icons` |
| `defaultVariants` (global) | — | expanded per-component (until core support) |
| `components` | — | `ui.<component>` |

- Both targets rendered for Nuxt and Vue (as today), shown in a side-by-side code panel
  with copy buttons, not just clipboard-only.
- **Share URL**: lz-string-compressed doc in the hash (`/theme#<payload>`) → paste a link
  in a PR/issue/Discord and the recipient sees your exact theme. Also "Copy JSON" for
  preset submissions and for feeding the AI theme endpoint.

### 5.7 Preview

- **Bento** (default): a dense grid of real components rendered in-page — buttons in all
  variants, form cluster, card, table, tabs, chat bubbles, pricing card, calendar, toast
  trigger, auth form. Same Vue app ⇒ live theming is free via the existing head-style +
  app.config mechanism. Light/dark toggle, and a split view showing both modes at once.
- **Template previews**: the real templates (SaaS, Chat, Dashboard…) are separate repos
  deployed cross-origin — CSS injection is impossible there. Instead: lightweight
  replica pages inside the docs app (`/theme/preview/saas` etc.), rendered in a
  **same-origin iframe** (isolates full-page layout from the studio chrome) and themed via
  `BroadcastChannel`/localStorage — the persistence layer already broadcasts. Start with
  one (SaaS landing), add more as the bento proves insufficient.

## 6. Architecture & repo layout

```
docs/app/
  utils/theme-engine/          # pure TS, unit-tested (vitest)
    schema.ts                  # ThemeDoc types + zod-ish validation + version migration
    resolve.ts                 # provenance resolver
    palette.ts                 # OKLCH curve generator (culori)
    export-css.ts, export-config.ts
    presets/*.json
  composables/useThemeStudio.ts  # doc state, persistence (same keys as useTheme), applyRuntime
  pages/theme/index.vue          # the studio
  pages/theme/preview/*.vue      # iframe template replicas
  components/theme-studio/       # ControlRow, ProvenanceChip, PaletteCurveEditor,
                                 # TokenGrid, PresetGallery, ShuffleBar, ExportPanel, BentoPreview…
```

- Engine stays framework-free so it can graduate later into a package
  (`@nuxt/ui-theme-tools`) usable by a CLI (`npx nuxt-ui-theme`) or third parties — but we
  don't build the package first. Docs-side proves it.
- `useTheme` (popover) is refactored to read/write through the same store; the popover
  shrinks to Essentials + "Open Theme Studio →".
- The AI theme path (`applyThemeSettings`) migrates to "AI produces a ThemeDoc" — same
  sanitization boundary, richer output. Optional later phase: a "describe your brand" box
  in the studio itself.

## 7. Core gaps → small upstream PRs (the contribution trail)

The studio mostly needs zero core changes (it's docs-side). But it exposes real gaps worth
individual, well-scoped PRs to `nuxt/ui` — nice contribution artifacts on their own:

1. **Global `defaultVariants.variant`** — module option today only covers `color`/`size`
   and is build-time; propose adding `variant` and/or a runtime `app.config` equivalent.
2. **Semantic shadow & border-width tokens** (`--ui-shadow-*`, `--ui-border-width`) —
   without them, neo-brutalism needs per-component class hacks; with them it's two tokens.
3. **Font pairing** — only `--font-sans` is themed today; a heading/serif slot would
   unlock editorial presets (Anthropic-style).
4. **Custom alias names** are build-time (`theme.colors` module option) — fine for the
   studio (works with the seven standard aliases), documented as a known limit.

Each lands independently; the studio degrades gracefully without them.

## 8. Phased roadmap (each phase ships)

- **P0 — RFC.** Open a discussion/issue on `nuxt/ui`: this document, distilled. Align on
  naming, the header-nav placement, v5 timing, and appetite for the §7 core PRs before
  building big. (The team is active; theme tooling touches their website — buy-in first.)
- **P1 — Engine.** `theme-engine/` with schema, resolver+provenance, palette generator,
  export generators. Pure TS + tests. Snapshot tests: preset → expected css/config output.
- **P2 — Studio shell.** `/theme` page + header nav entry, bento preview, Essentials
  altitude at parity with the popover, shared state with it, reset. *Already useful.*
- **P3 — Palette editor.** OKLCH curves, anchor color, contrast badges, custom
  primary/neutral flowing into minimal `@theme` export.
- **P4 — Drill-down.** Tokens altitude with provenance UI + reset-to-inherited; Components
  altitude with per-component/global defaultVariants.
- **P5 — Presets & shuffle.** The five launch presets, seeded shuffle with locks, share
  URLs, JSON import/export.
- **P6 — Scale-out.** Template preview iframes, a11y/contrast audit panel, community preset
  gallery, AI → ThemeDoc integration.

## 9. Risks & open questions

- **v5 timing** — repo is v4.9.0; "v5" scope/schedule unknown. Mitigation: build against
  v4 branch, version the ThemeDoc schema, keep the engine independent of component
  internals (it only knows tokens + app.config shapes).
- **Scope creep** — this plan is deliberately phase-gated; P2 alone already beats the
  status quo. Resist starting the palette editor before the engine has tests.
- **Preview drift** — replica template pages need upkeep; start with one, treat the bento
  as the primary surface.
- **Upstream acceptance** — worst case the studio lives as a community site first; the
  engine/package split keeps that door open. P0 exists to avoid finding out late.
- **Naming** — "Theme Studio"? route `/theme`? To settle in P0.
