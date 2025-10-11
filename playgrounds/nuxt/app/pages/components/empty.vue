<script setup lang="ts">
import type { ButtonProps } from '#ui/types'

import theme from '#build/ui/empty'

const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  variant: [theme.defaultVariants.variant]
})

const title = 'No projects found'
const description = 'It looks like you haven\'t added any projects. Create one to get started.'
const actions: ButtonProps[] = [{
  icon: 'i-lucide-plus',
  label: 'Add Data'
}, {
  icon: 'i-lucide-refresh-ccw',
  label: 'Refresh',
  color: 'neutral',
  variant: 'subtle'
}]
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UEmpty v-bind="props" icon="i-lucide-file" :title="title" :description="description" :actions="actions" />
    <UEmpty v-bind="props" :title="title" :description="description" :actions="actions">
      <Placeholder class="w-52 h-32" />
    </UEmpty>
    <UEmpty v-bind="props" :title="title" :description="description" :actions="actions" />
  </Matrix>
</template>
