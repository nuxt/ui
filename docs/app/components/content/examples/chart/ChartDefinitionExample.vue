<script setup lang="ts">
import { defineChart, lineY, ruleY } from '@tanstack/charts'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip } from '@tanstack/charts/tooltip'

const data = [
  { month: 'January', revenue: 186 },
  { month: 'February', revenue: 305 },
  { month: 'March', revenue: 237 },
  { month: 'April', revenue: 273 },
  { month: 'May', revenue: 209 },
  { month: 'June', revenue: 314 }
]

const definition = defineChart({
  marks: [
    ruleY([250], { stroke: 'var(--ui-error)', strokeDasharray: '4 4' }),
    lineY(data, { x: 'month', y: 'revenue', stroke: 'var(--ui-primary)', strokeWidth: 2, points: true })
  ],
  scales: {
    x: { scale: () => scalePoint<string>().padding(0.2) },
    y: { scale: scaleLinear, nice: true, grid: true }
  },
  tooltip
})
</script>

<template>
  <UChart :definition="definition" aria-label="Revenue against target" />
</template>
