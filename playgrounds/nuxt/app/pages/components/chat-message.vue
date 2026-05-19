<script setup lang="ts">
import theme from '#build/ui/chat-message'
import type { ButtonProps } from '@nuxt/ui'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant]
})

const actions = ref<ButtonProps[]>([
  {
    label: 'Copy to clipboard',
    icon: 'i-lucide-copy'
  }
])
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UChatMessage id="1" role="user" :parts="[{ type: 'text', text: 'Hello, how are you?' }]" v-bind="props" />
    <UChatMessage
      id="2"
      role="user"
      :parts="[{ type: 'text', text: 'Hello, how are you?' }]"
      icon="i-lucide-user"
      :actions="actions"
      v-bind="props"
    />
  </Matrix>
</template>
