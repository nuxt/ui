<script lang="ts" setup>
import theme from '#build/ui/timeline'

const sizes = Object.keys(theme.variants.size)
const colors = Object.keys(theme.variants.color)
const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('vertical' as const)
const color = ref('primary' as const)
const size = ref('md' as const)
const activeValue = ref('none' as const)

const items = [
  {
    title: 'John Doe',
    description: 'added label "backlog"',
    icon: 'i-lucide-tag',
    value: 'backlog'
  },
  {
    title: 'Benjamin Canac',
    description: 'Assigned to Benjamin Canac',
    avatar: {
      src: 'https://github.com/benjamincanac.png'
    },
    value: 'assigned'
  },
  {
    title: 'Benjamin Canac',
    description: 'Moved this to "in progress"',
    icon: 'i-lucide-loader',
    value: 'in-progress'
  },
  {
    title: 'John Doe',
    description: 'Moved this to "done"',
    icon: 'i-lucide-check-circle',
    value: 'done'
  }
]

const values = ['none', ...items.map(item => item.value)]
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex items-center justify-center gap-2 ">
      <USelect v-model="color" :items="colors" placeholder="Color" />
      <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
      <USelect v-model="size" :items="sizes" placeholder="Size" />
      <USelect v-model="activeValue" :items="values" placeholder="Active value" />
    </div>

    <UTimeline :size="size" :color="color" :orientation="orientation" :active-value="activeValue" :items="items" />
  </div>
</template>
