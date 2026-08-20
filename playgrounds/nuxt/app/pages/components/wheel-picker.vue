<script setup lang="ts">
import theme from '#build/ui/wheel-picker'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant]
})

const orientation = ref('vertical' as keyof typeof theme.variants.orientation)
const vertical = computed(() => orientation.value === 'vertical')

const sensitivity = ref(1)
const readonly = ref(false)
const haptics = ref(false)

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthDays = Array.from({ length: 31 }, (_, i) => i + 1)
const years = Array.from({ length: 60 }, (_, i) => 1980 + i)
const month = ref('June')
const day = ref(15)
const year = ref(2000)

const days = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]
const numbers = Array.from({ length: 24 }, (_, i) => i)
const objectItems = [
  { label: 'Apple', value: 'apple', icon: 'i-simple-icons-apple' },
  { label: 'GitHub', value: 'github', icon: 'i-simple-icons-github' },
  { label: 'Google', value: 'google', icon: 'i-simple-icons-google' },
  { label: 'Meta', value: 'meta', icon: 'i-simple-icons-meta', disabled: true }
]

const value = ref('Wednesday')
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="orientation" :items="orientations" />
    <UInputNumber v-model="sensitivity" :min="0.5" :max="4" :step="0.5" class="w-28" />
    <USwitch v-model="readonly" label="readonly" />
    <USwitch v-model="haptics" label="haptics" />
  </Navbar>

  <div class="mb-4 text-sm text-muted">
    Selected: <span class="text-default font-medium">{{ value }}</span>
  </div>

  <div class="mb-8 flex justify-center">
    <UWheelPickerGroup v-bind="{ color: attrs.color[0], size: attrs.size[0] }">
      <UWheelPicker v-model="month" :items="months" class="w-32" aria-label="Month" />
      <UWheelPicker v-model="day" :items="monthDays" class="w-16" aria-label="Day" loop />
      <UWheelPicker v-model="year" :items="years" class="w-20" aria-label="Year" />
    </UWheelPickerGroup>
  </div>

  <Matrix
    v-slot="props"
    :attrs="attrs"
    container-class="gap-8 items-start"
  >
    <UWheelPicker
      v-model="value"
      :items="days"
      :orientation="orientation"
      :sensitivity="sensitivity"
      :readonly="readonly"
      :haptics="haptics"
      :class="vertical && 'w-32'"
      v-bind="props"
    />
    <UWheelPicker
      :items="numbers"
      :default-value="12"
      :orientation="orientation"
      loop
      :class="vertical && 'w-16'"
      v-bind="props"
    />
    <UWheelPicker :items="objectItems" default-value="github" :orientation="orientation" :class="vertical && 'w-40'" v-bind="props" />
    <UWheelPicker
      :items="days"
      default-value="Friday"
      :orientation="orientation"
      disabled
      :class="vertical && 'w-32'"
      v-bind="props"
    />
    <UWheelPicker :items="[]" placeholder="No items" :orientation="orientation" :class="vertical && 'w-32'" v-bind="props" />
    <UWheelPicker
      :items="days"
      :orientation="orientation"
      :visible-items="7"
      :item-height="40"
      :class="vertical && 'w-32'"
      v-bind="props"
    />
  </Matrix>
</template>
