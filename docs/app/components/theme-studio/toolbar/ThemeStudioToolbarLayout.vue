<script setup lang="ts">
import { upperFirst } from 'scule'
import { keepPanels, toolbarPanelClass } from '../../../utils/theme/studio'
import type { Density, ThemeLayout } from '../../../utils/theme/engine/types'
import { DENSITIES, LAYOUT_DEFAULTS, LAYOUT_RANGES } from '../../../utils/theme/engine/types'

/**
 * The room around things and the states of controls. The density writes the
 * whole control scale from one choice rather than a slider per variable, the
 * gutter and the two states take a slider each.
 */
const { layout, setLayout } = useTheme()

const densityItems = DENSITIES.map(value => ({ label: upperFirst(value), value, defaultTag: value === 'default' }))

function layoutModel<K extends keyof ThemeLayout>(key: K, fallback: NonNullable<ThemeLayout[K]>) {
  return computed({
    get: () => layout.value[key] ?? fallback,
    set: (value: NonNullable<ThemeLayout[K]>) => setLayout({ ...layout.value, [key]: value })
  })
}

// the stock density is an absence, picking it clears the field
const density = computed({
  get: (): Density => layout.value.density ?? 'default',
  set: (value: Density) => setLayout({ ...layout.value, density: value === 'default' ? undefined : value })
})
const focusWidth = layoutModel('focusWidth', LAYOUT_DEFAULTS.focusWidth)
const disabledOpacity = layoutModel('disabledOpacity', LAYOUT_DEFAULTS.disabledOpacity)

// Stored in `--spacing` steps, read in px like the other rows
const gutterSteps = layoutModel('gutter', LAYOUT_DEFAULTS.gutter)
const gutter = computed({
  get: () => gutterSteps.value * 4,
  set: (value: number) => (gutterSteps.value = value / 4)
})

const props = defineProps<{
  /** Stacked in the mobile menu: the panel takes the trigger's width, like a select. */
  vertical?: boolean
}>()

const studioIcons = useStudioIcons()
const { groupDirtyFlags } = useThemeStudioToolbar()

// The saved layout is client-only: report the stock density until mounted,
// like the other triggers, so hydration adopts the server's label.
const mounted = useMounted()
const label = computed(() => upperFirst(mounted.value ? density.value : 'default'))

const open = ref(false)
const dirty = groupDirtyFlags.layout

const content = computed(() => [...toolbarPanelClass(props.vertical), 'divide-y divide-default *:p-3'])
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'center', onInteractOutside: keepPanels }" :ui="{ content }">
    <ThemeStudioToolbarTrigger
      :label="label"
      :icon="studioIcons.spacing"
      :dirty="dirty"
      :open="open"
      :class="vertical ? 'w-full' : 'w-38'"
      :aria-label="`Layout: ${label}`"
    />

    <template #content>
      <ThemeStudioSection label="Spacing" section-key="spacing">
        <ThemeStudioRow
          v-model="density"
          control="select"
          label="Density"
          :control-icon="studioIcons.proportions"
          :items="densityItems"
          aria-label="Control density"
        />

        <ThemeStudioRow
          v-model="gutter"
          control="slider"
          label="Gutter"
          :min="LAYOUT_RANGES.gutter.min * 4"
          :max="LAYOUT_RANGES.gutter.max * 4"
          :step="LAYOUT_RANGES.gutter.step * 4"
          unit="px"
        />
      </ThemeStudioSection>

      <ThemeStudioSection label="States" section-key="states">
        <ThemeStudioRow
          v-model="focusWidth"
          control="slider"
          label="Focus"
          aria-label="Focus outline width"
          v-bind="LAYOUT_RANGES.focusWidth"
          unit="px"
        />

        <ThemeStudioRow
          v-model="disabledOpacity"
          control="slider"
          label="Disabled"
          aria-label="Disabled opacity"
          v-bind="LAYOUT_RANGES.disabledOpacity"
          unit="%"
        />
      </ThemeStudioSection>
    </template>
  </UPopover>
</template>
