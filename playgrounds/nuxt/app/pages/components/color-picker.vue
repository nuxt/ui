<script setup lang="ts">
import theme from '#build/ui/color-picker'
import type { ColorPickerProps } from '#ui/types'

const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  size: [theme.defaultVariants.size],
})

const colorHex = ref('#9C27B050')
const alphaTrack = ref(true)
const formats:NonNullable<ColorPickerProps['format']>[] = [
  'hex',
  'rgb',
  'hsl',
  'cmyk',
  'lab'
]
const targetFormat = ref<(typeof formats)[number]>('hex')

function handleColorChange(event: Event) {
  colorHex.value = (event.target as HTMLInputElement).value
}
</script>

<template>
  <Navbar>
    <USwitch v-model="alphaTrack" label="Alpha Track" />
    <USelect v-model="targetFormat" :items="formats" />
    <USelect v-model="attrs.size" :items="sizes" multiple />

    <UFieldGroup>
      <UButton color="neutral" variant="outline" square>
        <span :style="{ backgroundColor: colorHex }" class="inline-flex size-5 rounded-sm" />
      </UButton>
      <UInput :model-value="colorHex" @change="handleColorChange" />
    </UFieldGroup>
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UColorPicker v-model="colorHex" v-bind="props" :format="targetFormat" :alpha-track />
  </Matrix>
</template>
