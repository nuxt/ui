<script setup lang="ts">
import theme from '#build/ui/button'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)

const color = ref<keyof typeof theme.variants.color>('warning')
const variant = ref<keyof typeof theme.variants.variant>('soft')
const size = ref<keyof typeof theme.variants.size>('lg')
</script>

<template>
  <Navbar>
    <USelect v-model="color" :items="colors" />
    <USelect v-model="variant" :items="variants" />
    <USelect v-model="size" :items="sizes" />
  </Navbar>

  <div class="flex flex-col gap-8">
    <!-- Per-component prop defaults via :props -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        <code>:props={{ `{ button: { color: '${color}', variant: '${variant}', size: '${size}' } }` }}</code>
      </p>

      <UTheme :props="{ button: { color, variant, size } }">
        <div class="flex items-center gap-2">
          <UButton label="Themed" />
          <UButton label="Themed with icon" icon="i-lucide-rocket" />
          <UButton label="Themed square" icon="i-lucide-star" square />
        </div>
      </UTheme>
    </div>

    <!-- Multiple components share one :props object -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        <code>:props</code> applies to multiple components at once
      </p>

      <UTheme :props="{ button: { color, variant }, tooltip: { delayDuration: 0 } }">
        <div class="flex items-center gap-2">
          <UTooltip text="Instant tooltip from theme">
            <UButton label="Hover me" />
          </UTooltip>
          <UTooltip text="Same delay">
            <UButton label="And me" icon="i-lucide-rocket" />
          </UTooltip>
        </div>
      </UTheme>
    </div>

    <!-- Explicit prop overrides theme -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Explicit props win over <code>:props</code>
      </p>

      <UTheme :props="{ button: { color, variant, size } }">
        <div class="flex items-center gap-2">
          <UButton label="Theme only" />
          <UButton label="color=primary" color="primary" />
          <UButton label="variant=solid" variant="solid" />
          <UButton label="size=xs" size="xs" />
        </div>
      </UTheme>
    </div>

    <!-- :ui (slot classes) + :props (prop defaults) together -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        <code>:ui</code> slot classes + <code>:props</code> prop defaults together
      </p>

      <UTheme
        :props="{ button: { color, variant } }"
        :ui="{ button: { base: 'font-bold rounded-full' } }"
      >
        <div class="flex items-center gap-2">
          <UButton label="Styled + themed" />
          <UButton label="With icon" icon="i-lucide-zap" />
        </div>
      </UTheme>
    </div>

    <!-- Nested UTheme: inner overrides outer, non-overridden keys inherit -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Nested <code>&lt;UTheme&gt;</code>: inner overrides bleed in, outer keys are inherited
      </p>

      <UTheme :props="{ button: { color, variant, size } }">
        <div class="flex items-center gap-2">
          <UButton label="Outer" />
          <UTheme :props="{ button: { color: 'success' } }">
            <UButton label="color=success (inner)" />
          </UTheme>
          <UButton label="Outer again" />
        </div>
      </UTheme>
    </div>

    <!-- Baseline -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Without <code>&lt;UTheme&gt;</code> (baseline)
      </p>

      <div class="flex items-center gap-2">
        <UButton label="Default" />
        <UButton label="Default with icon" icon="i-lucide-rocket" />
      </div>
    </div>
  </div>
</template>
