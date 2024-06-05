<script setup lang="ts">
import theme from '#build/ui/tabs'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)

const color = ref(theme.defaultVariants.color)
const variant = ref(theme.defaultVariants.variant)
const orientation = ref('horizontal' as const)

const items = [{
  label: 'Tab1',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  content: 'This is the content shown for Tab1'
}, {
  label: 'Tab2',
  icon: 'i-heroicons-user',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Tab3',
  icon: 'i-heroicons-bell',
  content: 'Finally, this is the content for Tab3',
  slot: 'custom' as const
}]
</script>

<template>
  <div class="flex flex-col items-center gap-12">
    <div class="flex items-center gap-2">
      <USelect v-model="color" :items="colors" placeholder="Color" />
      <USelect v-model="variant" :items="variants" placeholder="Variant" />
      <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
    </div>

    <div class="flex gap-4">
      <UTabs :color="color" :variant="variant" :orientation="orientation" :items="[{ label: 'Monthly' }, { label: 'Yearly' }]" :content="false" />

      <UTabs :color="color" :variant="variant" :orientation="orientation" :items="items" class="w-96">
        <template #custom="{ item }">
          <span class="text-gray-500 dark:text-gray-400">Custom: {{ item.content }}</span>
        </template>
      </UTabs>
    </div>
  </div>
</template>
