<script setup lang="ts">
import { reactive, ref } from 'vue'
import theme from '#build/ui/progress-group'
import type { ProgressGroupItem } from '@nuxt/ui'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const orientations = Object.keys(theme.variants.orientation)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size]
})

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)

const items = ref<ProgressGroupItem[]>([
  { label: 'System', value: 24, color: 'neutral', icon: 'i-lucide-cog' },
  { label: 'Apps', value: 8, color: 'error', icon: 'i-lucide-app-window' },
  { label: 'Documents', value: 12, color: 'warning', icon: 'i-lucide-file' },
  { label: 'Multimedia', value: 42, color: 'success', icon: 'i-lucide-film' }
])

const plain = ref<ProgressGroupItem[]>([
  { label: 'Read', value: 42 },
  { label: 'Write', value: 18 }
])

function shuffle() {
  items.value = items.value.map(item => ({ ...item, value: Math.round(Math.random() * 32) }))
}
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="orientation" :items="orientations" />
    <UButton label="Shuffle" color="neutral" variant="subtle" @click="shuffle" />
  </Navbar>

  <Matrix
    v-slot="props"
    :attrs="attrs"
    :container-props="{ 'data-orientation': orientation }"
    container-class="gap-4 data-[orientation=horizontal]:w-64 data-[orientation=vertical]:h-64 data-[orientation=vertical]:flex-row"
  >
    <UProgressGroup :items="items" :max="128" status :orientation="orientation" v-bind="props" />
    <UProgressGroup :items="plain" :orientation="orientation" v-bind="props" />
  </Matrix>
</template>
