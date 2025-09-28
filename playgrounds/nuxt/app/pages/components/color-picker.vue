<script setup lang="ts">
import theme from '#build/ui/color-picker'

const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  size: [theme.defaultVariants.size]
})

const colorHex = ref('#9C27B0')

function handleColorChange(event: Event) {
  colorHex.value = (event.target as HTMLInputElement).value
}
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.size" :items="sizes" multiple />

    <UFieldGroup>
      <UButton color="neutral" variant="outline" square>
        <span :style="{ backgroundColor: colorHex }" class="inline-flex size-5 rounded-sm" />
      </UButton>
      <UInput :model-value="colorHex" @change="handleColorChange" />
    </UFieldGroup>
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UColorPicker v-model="colorHex" v-bind="props" />
  </Matrix>
</template>
