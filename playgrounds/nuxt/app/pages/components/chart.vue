<script setup lang="ts">
import theme from '#build/ui/chart'

const types = Object.keys(theme.variants.type) as Array<keyof typeof theme.variants.type>

const type = ref<keyof typeof theme.variants.type>('line')
const stacked = ref(false)
const curve = ref<'linear' | 'monotone' | 'step'>('linear')

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
    <USelect v-model="curve" :items="['linear', 'monotone', 'step']" />
    <USwitch v-model="stacked" label="Stacked" />
  </Navbar>

  <div class="grid gap-8 w-full max-w-3xl">
    <UCard>
      <UChart
        :type="type"
        :stacked="stacked"
        :curve="curve"
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
        :data="data"
        index="month"
        :categories="['desktop']"
        :colors="['success']"
        :format="value => currency.format(value)"
        aria-label="Revenue"
      />
    </UCard>
  </div>
</template>
