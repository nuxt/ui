<script setup lang="ts">
import theme from '#build/ui/empty'

const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)

const loading = ref(false)

const attrs = reactive({
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.variant" :items="variants" multiple placeholder="Variant" />
    <USelect v-model="attrs.size" :items="sizes" multiple placeholder="Size" />
    <USwitch v-model="loading" label="Loading" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UEmpty
      icon="i-lucide-file"
      :loading="loading"
      :title="loading ? 'Loading projects' : 'No projects found'"
      :description="loading ? 'Please wait while we fetch your projects.' : 'It looks like you haven\'t added any projects. Create one to get started.'"
      :actions="loading ? undefined : [{
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
