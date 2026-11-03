<script setup lang="ts">
import { upperFirst } from 'scule'
import { CHART_ALIASES, CHART_COLORS, CHART_DEFAULTS, CHART_SERIES } from '../../../utils/theme/engine/extras'

/** The six chart series, each an alias or a palette, `--ui-chart-1` to `-6`. */
const { charts, setCharts } = useTheme()
const colorMode = useColorMode()

const items = Object.keys(CHART_COLORS).map(value => ({ label: upperFirst(value), value }))
// the aliases lead, then the palettes in Tailwind's order
items.sort((a, b) => Number(!CHART_ALIASES.includes(a.value)) - Number(!CHART_ALIASES.includes(b.value)))

const series = CHART_SERIES.map(key => ({
  key,
  model: computed({
    get: () => charts.value[key] ?? CHART_DEFAULTS[key],
    set: (value: string) => setCharts({ ...charts.value, [key]: value })
  }),
  items: items.map(item => ({ ...item, defaultTag: item.value === CHART_DEFAULTS[key] }))
}))

const swatch = (value: string) => CHART_COLORS[value]?.[colorMode.value === 'dark' ? 'dark' : 'light']
</script>

<template>
  <ThemeStudioSection label="Charts" section-key="charts">
    <ThemeStudioRow
      v-for="entry in series"
      :key="entry.key"
      v-model="entry.model.value"
      control="select"
      :label="`Series ${entry.key}`"
      :items="entry.items"
      :aria-label="`Chart series ${entry.key}`"
    >
      <template #leading>
        <span class="mx-1 size-2 rounded-full" :style="{ background: swatch(entry.model.value) }" />
      </template>
    </ThemeStudioRow>
  </ThemeStudioSection>
</template>
