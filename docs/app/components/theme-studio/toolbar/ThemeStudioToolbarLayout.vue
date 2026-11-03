<script setup lang="ts">
import { upperFirst } from 'scule'
import { keepPanels, toolbarPanelClass } from '../../../utils/theme/studio'
import type { Density, LayoutField } from '../../../utils/theme/engine/extras'
import { DENSITIES, LAYOUT_FIELDS } from '../../../utils/theme/engine/extras'

/**
 * The sizes of things and the states of controls. The density moves the
 * padding and gap of the whole control scale at once. Every value reads in px.
 */
const { layout, setLayout } = useTheme()

const densityItems = DENSITIES.map(value => ({ label: upperFirst(value), value, defaultTag: value === 'default' }))

// the stock density is an absence, picking it clears the field
const density = computed({
  get: (): Density => layout.value.density ?? 'default',
  set: (value: Density) => setLayout({ ...layout.value, density: value === 'default' ? undefined : value })
})

function fieldModel(key: LayoutField) {
  return computed({
    get: () => layout.value[key] ?? LAYOUT_FIELDS[key].default,
    set: (value: number) => setLayout({ ...layout.value, [key]: value })
  })
}

const fields = (keys: LayoutField[]) => keys.map(key => ({
  key,
  ...LAYOUT_FIELDS[key],
  readout: LAYOUT_FIELDS[key].unit === '%' ? '%' : 'px',
  model: fieldModel(key)
}))

// `--ui-outline-focus`, the primary's opacity on components without a color
const { rows: focusMixes } = useTokenMixes('states')

const controlFields = fields(['textStep'])
const pageFields = fields(['gutter', 'headerHeight'])
const stateFields = fields(['focusWidth', 'disabledOpacity'])

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
      <ThemeStudioSection label="Controls" section-key="controls">
        <ThemeStudioRow
          v-model="density"
          control="select"
          label="Density"
          :control-icon="studioIcons.proportions"
          :items="densityItems"
          aria-label="Control density"
        />

        <ThemeStudioRow
          v-for="field in controlFields"
          :key="field.key"
          v-model="field.model.value"
          control="slider"
          :label="field.label"
          :aria-label="field.variable"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :unit="field.readout"
        />
      </ThemeStudioSection>

      <ThemeStudioSection label="Page" section-key="page">
        <ThemeStudioRow
          v-for="field in pageFields"
          :key="field.key"
          v-model="field.model.value"
          control="slider"
          :label="field.label"
          :aria-label="field.variable"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :unit="field.readout"
        />
      </ThemeStudioSection>

      <ThemeStudioSection label="States" section-key="states">
        <ThemeStudioRow
          v-for="field in stateFields"
          :key="field.key"
          v-model="field.model.value"
          control="slider"
          :label="field.label"
          :aria-label="field.variable"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :unit="field.readout"
        />

        <ThemeStudioRow
          v-for="row in focusMixes"
          :key="row.token"
          v-model="row.model.value"
          control="slider"
          :label="row.label"
          :aria-label="row.token"
          :min="0"
          :max="100"
          :step="5"
          unit="%"
        />
      </ThemeStudioSection>
    </template>
  </UPopover>
</template>
