<script setup lang="ts">
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

// Written out so Tailwind finds each scope class
const colors = [
  { name: 'primary', scope: '[--ui-accent:var(--ui-primary)]' },
  { name: 'secondary', scope: '[--ui-accent:var(--ui-secondary)]' },
  { name: 'success', scope: '[--ui-accent:var(--ui-success)]' },
  { name: 'info', scope: '[--ui-accent:var(--ui-info)]' },
  { name: 'warning', scope: '[--ui-accent:var(--ui-warning)]' },
  { name: 'error', scope: '[--ui-accent:var(--ui-error)]' },
  { name: 'neutral', scope: '[--ui-accent:var(--ui-neutral)]' }
]

const texts = [
  { class: 'text-strong', variable: '--ui-text-strong' },
  { class: 'text-default', variable: '--ui-text-default' },
  { class: 'text-muted', variable: '--ui-text-muted' },
  { class: 'text-faint', variable: '--ui-text-faint' }
]

const backgrounds = [
  { class: 'bg-default', variable: '--ui-bg-default' },
  { class: 'bg-tint', variable: '--ui-bg-tint' },
  { class: 'bg-soft', variable: '--ui-bg-soft' },
  { class: 'bg-strong', variable: '--ui-bg-strong' },
  { class: 'bg-neutral', variable: '--ui-neutral' }
]

const borders = [
  { class: 'border-default', variable: '--ui-border-default' },
  { class: 'border-strong', variable: '--ui-border-strong' },
  { class: 'border-neutral', variable: '--ui-neutral' }
]

// The surfaces a translucent fill or border sits on
const surfaces = [
  { label: 'On the page', class: 'bg-default' },
  { label: 'On bg-soft', class: 'bg-soft' },
  { label: 'On bg-strong', class: 'bg-strong' }
]

const accentFills = ['bg-accent-tint', 'bg-accent-soft', 'bg-accent-strong', 'bg-accent', 'bg-accent-hover']
const accentTexts = ['text-accent-default', 'text-accent-muted', 'text-accent-faint']
const accentBorders = ['border-accent-default', 'border-accent-strong']

const radii = ['rounded-xs', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl']

const values = ref<Record<string, string>>({})

function readValues() {
  const style = getComputedStyle(document.documentElement)
  values.value = Object.fromEntries([...texts, ...backgrounds, ...borders].map(({ variable }) => [variable, style.getPropertyValue(variable).trim()]))
}

// The color mode is a class on `<html>` in both playgrounds
let observer: MutationObserver | undefined

onMounted(() => {
  readValues()
  observer = new MutationObserver(readValues)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <UDashboardNavbar title="Tokens" class="absolute top-0 inset-x-0 z-5 bg-default" />

  <div class="flex flex-col gap-10 min-h-0 w-full max-w-full py-6">
    <p class="max-w-lg text-muted">
      The surface tokens, the color aliases and their accent roles, with the value each variable resolves to. Toggle dark mode to check both themes.
    </p>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Text
      </h2>
      <div class="grid gap-3 sm:grid-cols-3">
        <div v-for="surface in surfaces" :key="surface.label" class="rounded-lg border border-default p-4 space-y-2" :class="surface.class">
          <p class="text-xs text-muted">
            {{ surface.label }}
          </p>
          <p v-for="text in texts" :key="text.class" :class="text.class">
            {{ text.class }}
            <span class="block font-mono text-xs opacity-75">{{ values[text.variable] }}</span>
          </p>
        </div>
      </div>
      <div class="inline-flex rounded-lg bg-neutral px-4 py-2 text-contrast">
        text-contrast on bg-neutral
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Backgrounds
      </h2>
      <div class="grid gap-3 sm:grid-cols-3">
        <div v-for="surface in surfaces" :key="surface.label" class="rounded-lg border border-default p-4 space-y-2" :class="surface.class">
          <p class="text-xs text-muted">
            {{ surface.label }}
          </p>
          <div v-for="background in backgrounds" :key="background.class" class="rounded-md border border-default px-3 py-2 text-sm" :class="[background.class, background.class === 'bg-neutral' && 'text-contrast']">
            {{ background.class }}
            <span class="block font-mono text-xs opacity-75">{{ values[background.variable] || 'unset' }}</span>
          </div>
        </div>
      </div>
      <div class="relative h-24 overflow-hidden rounded-lg border border-default">
        <div class="absolute inset-0 bg-linear-to-r from-primary to-secondary" />
        <div class="absolute inset-0 flex items-center justify-center bg-backdrop text-sm text-strong">
          bg-backdrop
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Borders
      </h2>
      <div class="grid gap-3 sm:grid-cols-3">
        <div v-for="surface in surfaces" :key="surface.label" class="rounded-lg border border-default p-4 space-y-2" :class="surface.class">
          <p class="text-xs text-muted">
            {{ surface.label }}
          </p>
          <div v-for="border in borders" :key="border.class" class="rounded-md border px-3 py-2 text-sm" :class="border.class">
            {{ border.class }}
            <span class="block font-mono text-xs text-muted">{{ values[border.variable] }}</span>
          </div>
          <div class="divide-y divide-default rounded-md ring ring-strong text-sm">
            <div class="px-3 py-2">
              ring-strong
            </div>
            <div class="px-3 py-2">
              divide-default
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Palettes
      </h2>
      <div class="overflow-x-auto">
        <div class="grid w-max items-center gap-x-1 gap-y-2 grid-cols-[6rem_repeat(11,3rem)]">
          <span />
          <span v-for="shade in shades" :key="shade" class="text-center text-xs text-muted">{{ shade }}</span>
          <template v-for="color in colors" :key="color.name">
            <span class="text-sm text-default">{{ color.name }}</span>
            <span v-for="shade in shades" :key="shade" class="h-8 rounded-sm" :style="{ backgroundColor: `var(--ui-color-${color.name}-${shade})` }" />
          </template>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Accent roles
      </h2>
      <div class="overflow-x-auto">
        <div class="grid w-max items-center gap-x-2 gap-y-2 grid-cols-[6rem_repeat(10,8.5rem)]">
          <span />
          <span v-for="role in [...accentFills, ...accentTexts, ...accentBorders]" :key="role" class="font-mono text-xs text-muted">{{ role.replace('accent-', '') }}</span>
          <template v-for="color in colors" :key="color.name">
            <span class="text-sm text-default">{{ color.name }}</span>
            <span v-for="fill in accentFills" :key="fill" class="h-8 rounded-sm" :class="[color.scope, fill]" />
            <span v-for="text in accentTexts" :key="text" class="text-sm font-medium" :class="[color.scope, text]">Aa</span>
            <span v-for="border in accentBorders" :key="border" class="h-8 rounded-sm border" :class="[color.scope, border]" />
          </template>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <span v-for="color in colors" :key="color.name" class="rounded-md bg-accent px-3 py-1.5 text-sm text-accent-contrast" :class="color.scope">
          {{ color.name }}
        </span>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Radius
      </h2>
      <div class="flex flex-wrap gap-3">
        <div v-for="radius in radii" :key="radius" class="flex size-24 items-center justify-center bg-soft ring ring-strong text-xs text-muted" :class="radius">
          {{ radius }}
        </div>
      </div>
    </section>
  </div>
</template>
