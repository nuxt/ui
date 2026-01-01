<script setup lang="ts">
import theme from '#build/ui/tabs'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)
const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)

const items = [{
  label: 'Tab1',
  avatar: {
    src: 'https://github.com/benjamincanac.png'
  },
  content: 'This is the content shown for Tab1'
}, {
  label: 'Tab2',
  icon: 'i-lucide-user',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Tab3',
  icon: 'i-lucide-bell',
  content: 'Finally, this is the content for Tab3',
  slot: 'custom' as const,
  badge: '300'
}]
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" placeholder="Color" multiple />
    <USelect v-model="attrs.variant" :items="variants" placeholder="Variant" multiple />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
    <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="gap-4">
    <UTabs
      :orientation="orientation"
      :items="[{ label: 'Monthly' }, { label: 'Yearly' }]"
      :content="false"
      v-bind="props"
    />

    <UTabs
      :orientation="orientation"
      :items="items"
      class="w-80"
      v-bind="props"
    >
      <template #custom="{ item }">
        <span class="text-muted">Custom: {{ item.content }}</span>
      </template>
    </UTabs>
  </Matrix>
</template>
