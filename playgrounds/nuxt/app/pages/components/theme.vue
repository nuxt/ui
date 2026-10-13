<script setup lang="ts">
import theme from '#build/ui/button'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)

const color = ref<keyof typeof theme.variants.color>('warning')
const variant = ref<keyof typeof theme.variants.variant>('soft')
const size = ref<keyof typeof theme.variants.size>('lg')

const checkbox = ref<boolean>(false)
const radio = ref<string>('1')
const select = ref<string>('')
const input = ref<string>('')
const radioItems = ['1', '2', '3']
const selectItems = ['Apple', 'Banana', 'Cherry']
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

    <!-- Nested UTheme: inner overrides bleed in, other components inherit from outer -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Nested <code>&lt;UTheme&gt;</code>: outer sets tooltip globally, inner only overrides button — both compose
      </p>

      <UTheme :props="{ button: { color, variant, size }, tooltip: { delayDuration: 0, arrow: true } }">
        <div class="flex items-center gap-2">
          <UTooltip text="Outer tooltip (instant + arrow)">
            <UButton label="Outer" />
          </UTooltip>
          <UTheme :props="{ button: { color: 'success' } }">
            <UTooltip text="Inner tooltip still inherits delay + arrow">
              <UButton label="color=success (inner)" />
            </UTooltip>
          </UTheme>
          <UTooltip text="Outer tooltip again">
            <UButton label="Outer again" />
          </UTooltip>
        </div>
      </UTheme>
    </div>

    <!-- :props on form components (with and without UFormField wrapping) -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        <code>:props</code> flows into every form component (with or without <code>&lt;UFormField&gt;</code>)
      </p>

      <UTheme :props="{ input: { size, color }, pinInput: { size, color }, checkbox: { size, color }, switch: { size, color }, radioGroup: { color, orientation: 'horizontal' }, select: { color, variant: 'subtle' } }">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4">
            <UInput v-model="input" placeholder="Bare input" />
            <UPinInput :length="3" />
            <UCheckbox v-model="checkbox" label="Bare checkbox" />
            <USwitch label="Bare switch" />
          </div>
          <div class="flex items-center gap-6">
            <URadioGroup v-model="radio" :items="radioItems" />
            <USelect v-model="select" :items="selectItems" placeholder="Themed select" />
          </div>
        </div>
      </UTheme>
    </div>

    <!-- Closer context wins: UFormField/FieldGroup beats :props; error beats both -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Closer context wins: <code>&lt;UFormField size="xl"&gt;</code> beats <code>:props</code>; validation error forces <code>error</code> color
      </p>

      <UTheme :props="{ input: { size, color } }">
        <div class="flex flex-col gap-3">
          <UFormField label="Bare (theme size applies)">
            <UInput v-model="input" placeholder="theme size" />
          </UFormField>
          <UFormField label="FormField size=xl wins" size="xl">
            <UInput v-model="input" placeholder="formfield size" />
          </UFormField>
          <UFormField label="With error: error color wins" error="Required">
            <UInput v-model="input" placeholder="error color" />
          </UFormField>
        </div>
      </UTheme>
    </div>

    <!-- Baseline: bare components must keep Reka primitives' own defaults -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Without <code>&lt;UTheme&gt;</code> (baseline) — bare Tooltip uses Reka's default delay and has no arrow; bare Checkbox matches unstyled defaults
      </p>

      <div class="flex items-center gap-4">
        <UButton label="Default" />
        <UButton label="Default with icon" icon="i-lucide-rocket" />
        <UTooltip text="Default delay, no arrow">
          <UButton label="Hover (baseline)" variant="outline" />
        </UTooltip>
        <UCheckbox label="Bare checkbox" />
      </div>
    </div>
  </div>
</template>
