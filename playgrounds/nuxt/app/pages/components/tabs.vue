<script setup lang="ts">
import theme from '#build/ui/tabs'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)
const overflows = ['none', ...Object.keys(theme.variants.overflow)]
const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)
const overflow = ref<'none' | keyof typeof theme.variants.overflow>('none')

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

const manyItems = [
  { label: 'Overview', icon: 'i-lucide-layout-dashboard', content: 'Overview content' },
  { label: 'Activity', icon: 'i-lucide-activity', content: 'Activity content' },
  { label: 'Settings', icon: 'i-lucide-settings', content: 'Settings content' },
  { label: 'Members', icon: 'i-lucide-users', content: 'Members content' },
  { label: 'Billing', icon: 'i-lucide-credit-card', content: 'Billing content' },
  { label: 'Integrations', icon: 'i-lucide-plug', content: 'Integrations content' },
  { label: 'Notifications', icon: 'i-lucide-bell', content: 'Notifications content' },
  { label: 'Security', icon: 'i-lucide-shield', content: 'Security content' },
  { label: 'API Keys', icon: 'i-lucide-key', content: 'API Keys content' },
  { label: 'Logs', icon: 'i-lucide-scroll-text', content: 'Logs content' }
]

const overflowProp = computed(() => overflow.value === 'none' ? undefined : overflow.value)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" placeholder="Color" multiple />
    <USelect v-model="attrs.variant" :items="variants" placeholder="Variant" multiple />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
    <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
    <USelect v-model="overflow" :items="overflows" placeholder="Overflow" />
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

    <UTabs
      :orientation="orientation"
      :overflow="overflowProp"
      :items="manyItems"
      :class="orientation === 'vertical' ? 'h-80' : 'w-96'"
      v-bind="props"
    />
  </Matrix>
</template>
