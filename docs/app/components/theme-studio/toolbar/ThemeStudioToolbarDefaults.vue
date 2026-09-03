<script setup lang="ts">
import { keepPanels, toolbarPanelClass } from '../../../utils/theme/studio'
import type { VariantGroup } from '../../../utils/theme/engine'
import { GROUP_VARIANTS, GROUP_STOCK_VARIANT } from '../../../utils/theme/engine'

/**
 * The variant and colour Buttons, Cards and Inputs start from, one section
 * each so every group carries its own reset.
 */
const { style, setStyle } = useThemeStudio()

// MD is the stock default, one deduped entry storing 'default'
const defaultSizeItems = [
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'default', defaultTag: true },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' }
]

const defaultSize = computed({
  // legacy saved prefs may still pin 'md' explicitly, it IS the default
  get: () => {
    const size = style.value.defaults?.size || 'default'
    return size === 'md' ? 'default' : size
  },
  set: (value: any) => setStyle({ defaults: { ...style.value.defaults, size: value } })
})

// Each group offers only what its components support; the app-wide
// `variant` shows through as the fallback.
const variantItems = (values: string[]) => values.map(value => ({ label: capitalize(value), value }))

/** Variant names UButton can render itself, the rest (none) fall back. */
const RENDERABLE_VARIANTS = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']

/** Variant grid popovers close on pick, one open flag per group. */
const variantGridOpen = reactive<Record<string, boolean>>({ buttons: false, panels: false, inputs: false })

// Offered variants and the stock default both come off the engine tables,
// so a variant added to the library reaches this panel without an edit here.
const variantGroupFields = [
  { key: 'buttons' as const, label: 'Buttons', hasColor: true, stock: GROUP_STOCK_VARIANT.buttons, items: variantItems(GROUP_VARIANTS.buttons) },
  { key: 'panels' as const, label: 'Cards', hasColor: false, stock: GROUP_STOCK_VARIANT.panels, items: variantItems(GROUP_VARIANTS.panels) },
  { key: 'inputs' as const, label: 'Inputs', hasColor: true, stock: GROUP_STOCK_VARIANT.inputs, items: variantItems(GROUP_VARIANTS.inputs) }
]

function groupVariantModel(group: VariantGroup) {
  const supported = variantGroupFields.find(field => field.key === group)!.items.map(item => item.value)
  return computed({
    get: () => {
      const own = style.value.defaults?.variants?.[group]
      if (own && own !== 'default') return own
      // An app-wide value this group can't express (e.g. solid inputs)
      // truthfully reads as Default, the engine skips it there too.
      const appWide = style.value.defaults?.variant
      return appWide && supported.includes(appWide) ? appWide : 'default'
    },
    set: (value: any) => {
      const defaults = style.value.defaults || {}

      // Picking Default under an app-wide variant must actually win: the
      // engine skips 'default' entries, so the app-wide value explodes
      // into the OTHER groups (where they support it) and disappears.
      if (value === 'default' && defaults.variant) {
        const variants: Record<string, any> = {}
        for (const field of variantGroupFields) {
          if (field.key === group) continue
          const existing = defaults.variants?.[field.key]
          if (existing && existing !== 'default') {
            variants[field.key] = existing
          } else if (field.items.some(item => item.value === defaults.variant)) {
            variants[field.key] = defaults.variant
          }
        }
        const next = { ...defaults, variants }
        delete next.variant
        setStyle({ defaults: next })
        return
      }

      setStyle({ defaults: { ...defaults, variants: { ...defaults.variants, [group]: value } } })
    }
  })
}

const groupVariants = Object.fromEntries(variantGroupFields.map(field => [field.key, groupVariantModel(field.key)])) as Record<VariantGroup, ReturnType<typeof groupVariantModel>>

// Primary IS the stock default, one entry, tagged, storing 'default'
// (an explicit 'primary' would export a no-op override).
const defaultColorItems = [
  { label: 'Primary', value: 'default', chip: { color: 'primary' as any }, defaultTag: true },
  ...['secondary', 'success', 'info', 'warning', 'error', 'neutral'].map(value => ({
    label: capitalize(value),
    value,
    chip: { color: value as any }
  }))
]

function groupColorModel(group: VariantGroup) {
  return computed({
    get: () => style.value.defaults?.colors?.[group] || 'default',
    set: (value: any) => setStyle({ defaults: { ...style.value.defaults, colors: { ...style.value.defaults?.colors, [group]: value } } })
  })
}

const groupColors = Object.fromEntries(variantGroupFields.map(field => [field.key, groupColorModel(field.key)])) as Record<VariantGroup, ReturnType<typeof groupColorModel>>

const props = defineProps<{
  /** Stacked in the mobile menu: the panel takes the trigger's width, like a select. */
  vertical?: boolean
}>()

const studioIcons = useStudioIcons()
const appConfig = useAppConfig()
const { defaultsLabel, groupDirtyFlags } = useThemeStudioToolbar()

const open = ref(false)
const dirty = groupDirtyFlags.defaults

const content = computed(() => [...toolbarPanelClass(props.vertical), 'divide-y divide-default *:p-3'])
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'center', onInteractOutside: keepPanels }" :ui="{ content }">
    <ThemeStudioToolbarTrigger
      :label="defaultsLabel"
      :icon="studioIcons.options"
      :dirty="dirty"
      :open="open"
      :class="vertical ? 'w-full' : 'w-38'"
      :aria-label="`Defaults: ${defaultsLabel}`"
    />

    <template #content>
      <!-- the panel owns the layout: padding per section, rules between them -->
      <ThemeStudioSection label="Global" section-key="size">
        <ThemeStudioRow
          v-model="defaultSize"
          control="select"
          label="Size"
          control-icon="i-lucide-proportions"
          :items="defaultSizeItems"
          aria-label="Default size"
        />
      </ThemeStudioSection>

      <ThemeStudioSection
        v-for="field in variantGroupFields"
        :key="field.key"
        :label="field.label"
        :section-key="field.key"
      >
        <div class="flex flex-col gap-1">
          <ThemeStudioRow control="custom" label="Variant">
            <UPopover
              v-model:open="variantGridOpen[field.key]"
              :content="{ side: 'bottom', align: 'center' }"
              :ui="{ content: 'p-1 grid grid-cols-2 gap-1 w-(--reka-popover-trigger-width)' }"
              class="flex-1"
            >
              <UButton
                size="sm"
                color="neutral"
                variant="subtle"
                block
                icon="i-lucide-layers"
                :trailing-icon="appConfig.ui.icons.chevronDown"
                :aria-label="`Default variant for ${field.label.toLowerCase()}`"
                class="group"
                :ui="{
                  label: 'flex-1 text-left',
                  leadingIcon: 'text-dimmed',
                  trailingIcon: 'text-dimmed transition-transform duration-200 group-data-[state=open]:rotate-180'
                }"
              >
                <!-- the tag belongs in the grid, where it names the stock option -->
                {{ field.items.find(item => item.value === (groupVariants[field.key].value === 'default' ? field.stock : groupVariants[field.key].value))?.label }}
              </UButton>

              <template #content>
                <UButton
                  v-for="item in field.items"
                  :key="item.value"
                  size="sm"
                  block
                  color="neutral"
                  :variant="RENDERABLE_VARIANTS.includes(item.value) ? (item.value as any) : 'subtle'"
                  :active="groupVariants[field.key].value === item.value || (groupVariants[field.key].value === 'default' && item.value === field.stock)"
                  active-color="primary"
                  :class="[item.value === 'none' && 'opacity-60', 'min-w-0']"
                  @click="groupVariants[field.key].value = (item.value === field.stock ? 'default' : item.value); variantGridOpen[field.key] = false"
                >
                  <!-- opacity, not a color: text-dimmed would fight the variant's own text color -->
                  <span class="truncate">{{ item.label }}<span v-if="item.value === field.stock" class="opacity-70 font-normal">&nbsp;(Default)</span></span>
                </UButton>
              </template>
            </UPopover>
          </ThemeStudioRow>

          <ThemeStudioRow
            v-if="field.hasColor"
            v-model="groupColors[field.key].value"
            control="select"
            label="Color"
            :items="defaultColorItems"
            :aria-label="`Default color for ${field.label.toLowerCase()}`"
          >
            <template #leading>
              <UChip
                :color="((groupColors[field.key].value === 'default' ? 'primary' : groupColors[field.key].value) as any)"
                inset
                standalone
                class="mx-1"
                :ui="{ base: 'ring-0' }"
              />
            </template>
          </ThemeStudioRow>
        </div>
      </ThemeStudioSection>
    </template>
  </UPopover>
</template>
