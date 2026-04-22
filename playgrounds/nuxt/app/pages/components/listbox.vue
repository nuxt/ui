<script setup lang="ts">
import type { ListboxItem } from '@nuxt/ui'
import theme from '#build/ui/listbox'

const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  size: [theme.defaultVariants.size]
})

const value = ref()

const filter = ref(true)
const disabled = ref(false)
const loading = ref(false)
const multiple = ref(false)
const virtualize = ref(false)

const virtualItems = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  label: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`
}))

const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'].map(f => ({ label: f }))
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek'].map(v => ({ label: v }))

const items = [
  [{ label: 'Fruits', type: 'label' as const }, ...fruits],
  [{ label: 'Vegetables', type: 'label' as const }, ...vegetables]
] satisfies ListboxItem[]
</script>

<template>
  <Navbar>
    <USwitch v-model="filter" label="Filter" />
    <USwitch v-model="disabled" label="Disabled" />
    <USwitch v-model="loading" label="Loading" />
    <USwitch v-model="multiple" label="Multiple" />
    <USwitch v-model="virtualize" label="Virtualize" />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="w-48">
    <UListbox
      v-model="value"
      autofocus
      :items="virtualize ? virtualItems : items"
      :filter="filter"
      :disabled="disabled"
      :loading="loading"
      :multiple="multiple"
      :virtualize="virtualize"
      v-bind="props"
      class="w-full"
    />
  </Matrix>
</template>
