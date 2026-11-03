<script setup lang="ts">
import { upperFirst } from 'scule'
import { keepPanels, toolbarPanelClass } from '../../../utils/theme/studio'
import type { Density, LayoutField } from '../../../utils/theme/engine/extras'
import { DENSITIES, LAYOUT_FIELDS } from '../../../utils/theme/engine/extras'

/**
 * The sizes of things and the states of controls. The density moves the
 * padding and gap of the whole control scale at once. Every value reads in px.
 */
const { layout, setLayout, radius, radiuses } = useTheme()

// `--ui-radius` is a rem length on a fixed ladder, read in px like the rest:
// `.125rem` doesn't fit the readout
const radiusPx = computed({
  get: () => radius.value * 16,
  set: (value: number) => (radius.value = value / 16)
})
const radiusStep = (radiuses[1]! - radiuses[0]!) * 16

const densityItems = DENSITIES.map(value => ({ label: upperFirst(value), value, defaultTag: value === 'default' }))

// the stock density is an absence, picking it clears the field
const density = computed({
  get: (): Density => layout.value.density ?? 'default',
  set: (value: Density) => setLayout({ ...layout.value, density: value === 'default' ? undefined : value })
})

/** Stored in px, read in px or %, the container in rem: four digits don't fit the readout. */
function fieldModel(key: LayoutField, scale: number) {
  return computed({
    get: () => (layout.value[key] ?? LAYOUT_FIELDS[key].default) / scale,
    set: (value: number) => setLayout({ ...layout.value, [key]: value * scale })
  })
}

const fields = (keys: LayoutField[]) => keys.map((key) => {
  const field = LAYOUT_FIELDS[key]
  const scale = key === 'containerWidth' ? 16 : 1
  return {
    key,
    ...field,
    min: field.min / scale,
    max: field.max / scale,
    step: field.step / scale,
    readout: key === 'containerWidth' ? 'rem' : field.unit === '%' ? '%' : 'px',
    model: fieldModel(key, scale)
  }
})

const controlFields = fields(['textStep'])
const pageFields = fields(['gutter', 'containerWidth', 'headerHeight'])
const stateFields = fields(['focusWidth', 'disabledOpacity'])

const props = defineProps<{
  /** Stacked in the mobile menu: the panel takes the trigger's width, like a select. */
  vertical?: boolean
}>()

const studioIcons = useStudioIcons()
const { groupDirtyFlags } = useThemeStudioToolbar()

const open = ref(false)
const dirty = groupDirtyFlags.layout

const content = computed(() => [...toolbarPanelClass(props.vertical), 'divide-y divide-default *:p-3'])
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'center', onInteractOutside: keepPanels }" :ui="{ content }">
    <ThemeStudioToolbarTrigger
      label="Variables"
      :icon="studioIcons.spacing"
      :dirty="dirty"
      :open="open"
      :class="vertical ? 'w-full' : 'w-38'"
      aria-label="Variables"
    />

    <template #content>
      <ThemeStudioSection label="Shape" section-key="radius">
        <ThemeStudioRow
          v-model="radiusPx"
          control="slider"
          label="Radius"
          aria-label="--ui-radius"
          :min="radiuses[0]! * 16"
          :max="radiuses.at(-1)! * 16"
          :step="radiusStep"
          unit="px"
        />
      </ThemeStudioSection>

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
      </ThemeStudioSection>
    </template>
  </UPopover>
</template>
