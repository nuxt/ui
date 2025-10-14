<script setup lang="ts">
import theme from '#build/ui/empty'

const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.variant" :items="variants" multiple placeholder="Variant" />
    <USelect v-model="attrs.size" :items="sizes" multiple placeholder="Size" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UEmpty
      icon="i-lucide-file"
      title="No projects found"
      description="It looks like you haven't added any projects. Create one to get started."
      :actions="[{
        icon: 'i-lucide-plus',
        label: 'Create new'
      }, {
        icon: 'i-lucide-refresh-ccw',
        label: 'Refresh',
        color: 'neutral',
        variant: 'subtle'
      }]"
      v-bind="props"
    />
  </Matrix>
</template>
