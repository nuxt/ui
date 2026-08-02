<script setup lang="ts">
import type { VariantGroup } from '../../utils/theme-engine'

/**
 * Per-component defaults: the variant (and colour, where the group has one)
 * that Buttons, Cards and Inputs start from. One fold over all three — they
 * were three sections for three short forms. Collapsed by default and last in
 * the panel; it's the least-reached-for control.
 */
const { style, setStyle } = useThemeStudio()

// Per-group default variants, each offering only what its components support;
// the app-wide `variant` shows through as the fallback.
const variantItems = (values: string[]) => values.map(value => ({ label: capitalize(value), value }))

/** Variant names UButton can render itself — the rest (none) fall back. */
const RENDERABLE_VARIANTS = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']

/** Variant grid popovers close on pick — one open flag per group. */
const variantGridOpen = reactive<Record<string, boolean>>({ buttons: false, panels: false, inputs: false })

// `stock` is the library's own default variant — its cell wears the
// "(Default)" tag and picking it clears the override instead of pinning.
const variantGroupFields = [
  { key: 'buttons' as const, label: 'Button Defaults', hasColor: true, stock: 'solid', items: variantItems(['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']) },
  { key: 'panels' as const, label: 'Card Defaults', hasColor: false, stock: 'outline', items: variantItems(['solid', 'outline', 'soft', 'subtle']) },
  { key: 'inputs' as const, label: 'Input Defaults', hasColor: true, stock: 'outline', items: variantItems(['outline', 'soft', 'subtle', 'ghost', 'none']) }
]

function groupVariantModel(group: VariantGroup) {
  const supported = variantGroupFields.find(field => field.key === group)!.items.map(item => item.value)
  return computed({
    get: () => {
      const own = style.value.defaults?.variants?.[group]
      if (own && own !== 'default') return own
      // An app-wide value this group can't express (e.g. solid inputs)
      // truthfully reads as Default — the engine skips it there too.
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

// Primary IS the stock default — one entry, tagged, storing 'default'
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
</script>

<template>
  <ThemeStudioSection
    label="Defaults"
    :default-open="false"
    class="p-4"
    :section-key="variantGroupFields.map(field => field.key)"
  >
    <div class="flex flex-col gap-3">
      <!-- Static sections, like the aliases nested under Semantic — same
           primitive, so the group labels indent and space identically. -->
      <ThemeStudioSection
        v-for="field in variantGroupFields"
        :key="field.key"
        :label="field.label"
        :collapsible="false"
      >
        <div class="flex flex-col gap-1.5">
          <ThemeStudioRow control="custom" label="Variant">
            <UPopover v-model:open="variantGridOpen[field.key]" :content="{ side: 'bottom', align: 'start' }" class="flex-1">
              <UButton
                size="sm"
                color="neutral"
                variant="subtle"
                block
                icon="i-lucide-layers"
                trailing-icon="i-lucide-chevron-down"
                :ui="{ label: 'flex-1 text-left' }"
                :aria-label="`${field.label} variant`"
              >
                <!-- the tag stays in the grid below, where it names the stock
                     option; here it only pads the value you picked -->
                {{ field.items.find(item => item.value === (groupVariants[field.key].value === 'default' ? field.stock : groupVariants[field.key].value))?.label }}
              </UButton>

              <template #content>
                <!-- each cell renders IN the variant it picks -->
                <div class="w-64 p-2 grid grid-cols-2 gap-1">
                  <UButton
                    v-for="item in field.items"
                    :key="item.value"
                    size="sm"
                    block
                    :color="(groupVariants[field.key].value === item.value || (groupVariants[field.key].value === 'default' && item.value === field.stock)) ? 'primary' : 'neutral'"
                    :variant="RENDERABLE_VARIANTS.includes(item.value) ? (item.value as any) : 'subtle'"
                    :class="[item.value === 'none' && 'opacity-60', 'min-w-0']"
                    @click="groupVariants[field.key].value = (item.value === field.stock ? 'default' : item.value); variantGridOpen[field.key] = false"
                  >
                    <!-- opacity, not a color: text-dimmed would fight the variant's own text color -->
                    <span class="truncate">{{ item.label }}<span v-if="item.value === field.stock" class="opacity-70 font-normal">&nbsp;(Default)</span></span>
                  </UButton>
                </div>
              </template>
            </UPopover>
          </ThemeStudioRow>

          <ThemeStudioRow
            v-if="field.hasColor"
            v-model="groupColors[field.key].value"
            control="select"
            label="Color"
            :items="defaultColorItems"
            :aria-label="`${field.label} color`"
          >
            <template #leading>
              <UChip
                :color="(groupColors[field.key].value === 'default' ? 'primary' : groupColors[field.key].value) as any"
                inset
                standalone
              />
            </template>
          </ThemeStudioRow>
        </div>
      </ThemeStudioSection>
    </div>
  </ThemeStudioSection>
</template>
