<script setup lang="ts">
import theme from '#build/ui/chart'

const types = Object.keys(theme.variants.type) as Array<keyof typeof theme.variants.type>

const type = ref<keyof typeof theme.variants.type>('line')
const curve = ref<'linear' | 'monotone' | 'step'>('linear')
const stacked = ref(false)
const points = ref(false)
const grid = ref(true)
const xAxis = ref(true)
const yAxis = ref(true)
const legend = ref(true)
const thickness = ref(24)

// Each option only shows for the types it applies to
const isCartesian = computed(() => type.value !== 'donut')
const hasCurve = computed(() => type.value === 'line' || type.value === 'area')
const hasStacked = computed(() => type.value === 'area' || type.value === 'bar')

const data = [
  { month: 'January', desktop: 186, mobile: 80, tablet: 40 },
  { month: 'February', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'March', desktop: 237, mobile: 120, tablet: 75 },
  { month: 'April', desktop: 73, mobile: 190, tablet: 60 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 110 },
  { month: 'June', desktop: 214, mobile: 140, tablet: 95 }
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' })
</script>

<template>
  <Navbar>
    <USelect v-model="type" :items="types" />
    <USelect v-if="hasCurve" v-model="curve" :items="['linear', 'monotone', 'step']" />
    <USwitch v-if="hasStacked" v-model="stacked" label="Stacked" />
    <USwitch v-if="type === 'line'" v-model="points" label="Points" />
    <USwitch v-if="isCartesian" v-model="grid" label="Grid" />
    <USwitch v-if="isCartesian" v-model="xAxis" label="X axis" />
    <USwitch v-if="isCartesian" v-model="yAxis" label="Y axis" />
    <USwitch v-model="legend" label="Legend" />
    <UInputNumber v-if="type === 'donut'" v-model="thickness" :min="4" :max="100" class="w-28" />
  </Navbar>

  <div class="grid gap-8 w-full max-w-3xl">
    <UCard>
      <UChart
        :type="type"
        :curve="curve"
        :stacked="stacked"
        :points="points"
        :grid="grid"
        :x-axis="xAxis"
        :y-axis="yAxis"
        :legend="legend"
        :thickness="thickness"
        :data="data"
        index="month"
        :categories="['desktop', 'mobile', 'tablet']"
        aria-label="Visitors by device"
      />
    </UCard>

    <UCard>
      <UChart
        :type="type"
        :curve="curve"
        :points="points"
        :grid="grid"
        :x-axis="xAxis"
        :y-axis="yAxis"
        :legend="legend"
        :thickness="thickness"
        :data="data"
        index="month"
        :categories="['desktop']"
        :colors="isCartesian ? ['success'] : undefined"
        :format="value => currency.format(value)"
        aria-label="Revenue"
      />
    </UCard>
  </div>
</template>
