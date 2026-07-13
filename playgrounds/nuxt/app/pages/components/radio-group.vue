<script setup lang="ts">
import theme from '#build/ui/radio-group'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)
const indicators = Object.keys(theme.variants.indicator)
const orientations = Object.keys(theme.variants.orientation)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant],
  indicator: [theme.defaultVariants.indicator]
})

const orientation = ref('vertical' as keyof typeof theme.variants.orientation)

const items = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' }
]
const itemsLiteral = [
  'Option 1',
  'Option 2',
  'Option 3'
]
const itemsWithDescription = [
  { value: '1', label: 'Option 1', description: 'Description 1' },
  { value: '2', label: 'Option 2', description: 'Description 2' },
  { value: '3', label: 'Option 3', description: 'Description 3' }
]
const itemsWithIcon = [
  { value: '1', label: 'System', icon: 'i-lucide-monitor' },
  { value: '2', label: 'Light', icon: 'i-lucide-sun' },
  { value: '3', label: 'Dark', icon: 'i-lucide-moon' }
]
const viewItems = [
  { value: 'table', label: 'Table', icon: 'i-lucide-table' },
  { value: 'board', label: 'Board', icon: 'i-lucide-kanban' },
  { value: 'calendar', label: 'Calendar', icon: 'i-lucide-calendar' },
  { value: 'list', label: 'List', icon: 'i-lucide-list' },
  { value: 'gallery', label: 'Gallery', icon: 'i-lucide-images' },
  { value: 'map', label: 'Map', icon: 'i-lucide-map' }
]
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.indicator" :items="indicators" multiple />
    <USelect v-model="orientation" :items="orientations" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <URadioGroup :items="items" default-value="1" :orientation="orientation" v-bind="props" />
    <URadioGroup :items="itemsLiteral" default-value="Option 1" :orientation="orientation" v-bind="props" />
    <URadioGroup :items="itemsWithDescription" :orientation="orientation" v-bind="props" />
    <URadioGroup :items="itemsWithIcon" :orientation="orientation" v-bind="props" />
    <URadioGroup :items="items" disabled :orientation="orientation" v-bind="props" />
    <URadioGroup :items="items" legend="Legend" :orientation="orientation" v-bind="props" />
    <URadioGroup :items="items" legend="Legend" required :orientation="orientation" v-bind="props" />
    <URadioGroup :items="items" :orientation="orientation" v-bind="props">
      <template #legend>
        <span class="italic font-bold">
          With slots
        </span>
      </template>
      <template #label="{ item }">
        <span class="italic">
          {{ item.label }}
        </span>
      </template>
    </URadioGroup>
  </Matrix>

  <!-- Icon-on-top card grid built on the per-item `icon`, using only `ui` overrides -->
  <div class="p-4 border-t border-default">
    <URadioGroup
      default-value="table"
      variant="card"
      indicator="hidden"
      :items="viewItems"
      :ui="{
        fieldset: 'grid grid-cols-3 gap-2 w-96',
        label: 'flex flex-col items-center gap-1.5',
        leadingIcon: 'size-6 me-0'
      }"
    />
  </div>
</template>
