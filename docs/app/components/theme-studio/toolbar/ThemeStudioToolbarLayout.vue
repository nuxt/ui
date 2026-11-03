<script setup lang="ts">
import { upperFirst } from 'scule'
import { keepPanels, toolbarPanelClass } from '../../../utils/theme/studio'
import type { Density, LayoutField } from '../../../utils/theme/engine/extras'
import { CONTROL_COLUMNS, CONTROL_SIZES, DENSITIES, LAYOUT_FIELDS, controlBase, controlVariable } from '../../../utils/theme/engine/extras'

/**
 * The sizes of things and the states of controls. The density moves the
 * padding and gap of the whole control scale at once, and the scale editor
 * beside it opens every cell for the rest. Every value reads in px.
 */
const { layout, setLayout } = useTheme()

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

// `--ui-outline-focus`, the primary's opacity on components without a color
const { rows: focusMixes } = useTokenMixes('states')

const controlFields = fields(['textStep'])
const pageFields = fields(['gutter', 'containerWidth', 'headerHeight'])
const stateFields = fields(['focusWidth', 'disabledOpacity'])

/** A cell of the scale, the density's value until it is typed over. */
function cellValue(variable: string) {
  return layout.value.scale?.[variable] ?? controlBase(variable, density.value)
}

function setCell(variable: string, raw: string | number) {
  const value = Number(raw)
  if (raw === '' || !Number.isFinite(value)) return
  setLayout({ ...layout.value, scale: { ...layout.value.scale, [variable]: value } })
}

const rows = CONTROL_SIZES.map(size => ({
  size,
  cells: CONTROL_COLUMNS.map(column => ({ key: column.key, variable: controlVariable(column.key, size) }))
}))

const scaleEdited = computed(() => !!Object.keys(layout.value.scale ?? {}).length)

function clearScale() {
  setLayout({ ...layout.value, scale: undefined })
}

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
const scaleEditor = ref(false)
const dirty = groupDirtyFlags.layout

const content = computed(() => [...toolbarPanelClass(props.vertical), 'divide-y divide-default *:p-3'])
// beside the panel like the color editors, the grid is wider than it
const editorContent = { side: 'right' as const, align: 'start' as const, alignOffset: -8, collisionPadding: 8 }
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
        <template #actions>
          <UPopover v-model:open="scaleEditor" :content="editorContent" :ui="{ content: 'max-w-[calc(100vw-2rem)] p-3' }">
            <UTooltip text="Edit scale" ignore-non-keyboard-focus>
              <UButton
                :icon="studioIcons.options"
                color="neutral"
                variant="ghost"
                size="sm"
                :active="scaleEditor"
                active-color="primary"
                active-variant="subtle"
                aria-label="Edit the control scale"
              />
            </UTooltip>

            <template #content>
              <ThemeStudioSection
                label="Control scale (px)"
                resettable
                :reset-dirty="scaleEdited"
                @reset="clearScale"
              >
                <!-- scrolls on a phone, the grid is wider than the viewport there -->
                <div class="grid grid-cols-[auto_repeat(7,3rem)] gap-1 items-center text-xs overflow-x-auto">
                  <span />
                  <span v-for="column in CONTROL_COLUMNS" :key="column.key" class="text-center text-muted">{{ column.label }}</span>

                  <template v-for="row in rows" :key="row.size">
                    <span class="pe-1 font-mono uppercase text-muted">{{ row.size }}</span>
                    <UInput
                      v-for="cell in row.cells"
                      :key="cell.variable"
                      :model-value="cellValue(cell.variable)"
                      type="number"
                      inputmode="decimal"
                      variant="soft"
                      size="xs"
                      :ui="{ base: ['px-1 text-center font-mono', layout.scale?.[cell.variable] !== undefined ? 'text-strong' : 'text-muted'] }"
                      :aria-label="cell.variable"
                      @change="setCell(cell.variable, ($event.target as HTMLInputElement).value)"
                    />
                  </template>
                </div>
              </ThemeStudioSection>
            </template>
          </UPopover>
        </template>

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
