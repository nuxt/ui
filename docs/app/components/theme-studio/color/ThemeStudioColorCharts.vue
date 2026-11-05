<script setup lang="ts">
import { upperFirst } from 'scule'
import type { DropdownMenuItem } from '@nuxt/ui'
import { CHART_ALIASES, CHART_COLORS, CHART_DEFAULTS, CHART_SERIES } from '../../../utils/theme/engine/extras'

/**
 * The six chart series, `--ui-chart-1` to `-6`, in one menu: a row per
 * series with its color, the aliases and palettes a submenu away.
 */
const { charts, setCharts } = useTheme()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const swatch = (name: string) => CHART_COLORS[name]?.[colorMode.value === 'dark' ? 'dark' : 'light']

const value = (series: typeof CHART_SERIES[number]) => charts.value[series] ?? CHART_DEFAULTS[series]

/** Picking a color keeps the menu open, so several series can be changed in a row. */
const keep = (apply: () => void) => (event: Event) => {
  event.preventDefault()
  apply()
}

const palettes = Object.keys(CHART_COLORS).filter(name => !CHART_ALIASES.includes(name))

const items = computed<DropdownMenuItem[]>(() => CHART_SERIES.map((series) => {
  const option = (name: string): DropdownMenuItem => ({
    label: upperFirst(name),
    slot: 'color',
    dot: swatch(name),
    type: 'checkbox',
    checked: value(series) === name,
    onSelect: keep(() => setCharts({ ...charts.value, [series]: name }))
  })
  return {
    label: `Series ${series}`,
    slot: 'series',
    value: upperFirst(value(series)),
    dot: swatch(value(series)),
    dirty: charts.value[series] !== undefined,
    // the menu's width reaches every submenu, this hands them their own size back
    content: { class: 'w-auto max-h-80' },
    children: [CHART_ALIASES.map(option), palettes.map(option)]
  }
}))

function asRow(item: unknown) {
  return item as { label: string, value?: string, dot?: string, dirty?: boolean }
}
</script>

<template>
  <ThemeStudioSection label="Charts" section-key="charts">
    <UDropdownMenu
      :items="items"
      :content="{ side: 'bottom', align: 'start' }"
      :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
    >
      <UButton
        size="sm"
        color="neutral"
        variant="subtle"
        block
        :trailing-icon="appConfig.ui.icons.chevronDown"
        aria-label="Chart series colors"
        class="group"
        :ui="{ trailingIcon: 'text-faint transition-transform duration-200 group-data-[state=open]:rotate-180' }"
      >
        <!-- the default slot replaces the label span; `ps-1` lines the first dot up
             with the chips above, which sit in a `mx-1` leading slot -->
        <span class="flex-1 flex items-center gap-1 ps-1">
          <span
            v-for="series in CHART_SERIES"
            :key="series"
            class="size-2 rounded-full"
            :style="{ backgroundColor: swatch(value(series)) }"
          />
        </span>
      </UButton>

      <template #series-trailing="{ item }">
        <span class="flex items-center gap-1.5 min-w-0" :class="asRow(item).dirty ? 'text-primary' : 'text-muted'">
          <span class="size-2 shrink-0 rounded-full" :style="{ backgroundColor: asRow(item).dot }" />
          <span class="truncate">{{ asRow(item).value }}</span>
        </span>

        <UIcon :name="appConfig.ui.icons.chevronRight" class="size-(--ui-control-icon-size) shrink-0 text-faint" />
      </template>

      <!-- the swatch sits in the box an item icon takes, so it centers on the label -->
      <template #color-leading="{ item }">
        <span class="size-(--ui-control-icon-size) shrink-0 flex items-center justify-center">
          <span class="size-2 rounded-full" :style="{ backgroundColor: asRow(item).dot }" />
        </span>
      </template>
    </UDropdownMenu>
  </ThemeStudioSection>
</template>
