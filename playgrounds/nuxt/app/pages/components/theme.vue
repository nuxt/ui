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
    <!-- Variants only -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        UTheme variants={{ `{ button: { color: '${color}', variant: '${variant}', size: '${size}' } }` }}
      </p>

      <UTheme :variants="{ button: { color, variant, size } }">
        <div class="flex items-center gap-2">
          <UButton label="Themed" />
          <UButton label="Themed with icon" icon="i-lucide-rocket" />
          <UButton label="Themed square" icon="i-lucide-star" square />
        </div>
      </UTheme>
    </div>

    <!-- Explicit prop overrides theme -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Explicit props override theme variants
      </p>

      <UTheme :variants="{ button: { color, variant, size } }">
        <div class="flex items-center gap-2">
          <UButton label="Theme only" />
          <UButton label="color=primary" color="primary" />
          <UButton label="variant=solid" variant="solid" />
          <UButton label="size=xs" size="xs" />
        </div>
      </UTheme>
    </div>

    <!-- UI + Variants combined -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        UI slot classes + variant defaults together
      </p>

      <UTheme
        :variants="{ button: { color, variant } }"
        :ui="{ button: { base: 'font-bold rounded-full' } }"
      >
        <div class="flex items-center gap-2">
          <UButton label="Styled + themed" />
          <UButton label="With icon" icon="i-lucide-zap" />
        </div>
      </UTheme>
    </div>

    <!-- Without UTheme (baseline) -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Without UTheme (baseline)
      </p>

      <div class="flex items-center gap-2">
        <UButton label="Default" />
        <UButton label="Default with icon" icon="i-lucide-rocket" />
      </div>
    </div>
  </div>
</template>
