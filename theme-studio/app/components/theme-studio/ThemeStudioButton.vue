<script setup lang="ts">
import type { ThemeDoc, ThemePreset } from '../../utils/theme-engine'

/**
 * The drop-in theme studio: one button opening the full editor in a
 * popover — presets, colors, general and style — for any Nuxt UI app
 * extending the layer. Everything is optional: hosts choose which panels
 * to expose, restrict or extend the preset list, and hide import/export.
 * Pairs with `@nuxt/ui-theme-studio/theme.css` in the app's Tailwind
 * entry, which carries the shadow/border machinery the controls drive.
 */
const props = withDefaults(defineProps<{
  /**
   * Who the editor is for. `dev` (the default) exposes the full studio —
   * palette curves, per-token shades, semantic aliases, import/export.
   * `user` curates it down to what an end user personalizing a product
   * needs: presets and plain pickers. Every individual prop below
   * overrides its mode default.
   */
  mode?: 'dev' | 'user'
  /** Show the Presets panel — `false` hides it, an id list restricts it. */
  presets?: boolean | string[]
  /** Extra presets appended after the stock list. */
  customPresets?: ThemePreset[]
  /** Which control panels to offer, in order. Mode default: dev all three, user colors + general. */
  sections?: ('colors' | 'general' | 'style')[]
  /** Offer theme import/export. Mode default: dev on, user off. */
  share?: boolean
  /** Offer the reset-to-stock control. */
  reset?: boolean
  /** The palette curve editor on each color. Mode default: dev on, user off. */
  palette?: boolean
  /** Per-token shade sliders. Mode default: dev on, user off. */
  shades?: boolean
  /** The Semantic alias section in Colors. Mode default: dev on, user off. */
  semantic?: boolean
  /** The Button/Card/Input Defaults sections. Mode default: dev on, user off. */
  components?: boolean
  /** Base font size, spacing density and default size — radius always stays. Mode default: dev on, user off. */
  scale?: boolean
  /** Section-header links into the Nuxt UI docs. Off by default — they point at ui.nuxt.com paths. */
  help?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  mode: 'dev',
  presets: true,
  reset: true,
  help: false,
  // absent optional booleans cast to false — pin these to undefined so the
  // mode defaults below can actually see "not provided"
  share: undefined,
  palette: undefined,
  shades: undefined,
  semantic: undefined,
  components: undefined,
  scale: undefined
})

const dev = computed(() => props.mode !== 'user')
const share = computed(() => props.share ?? dev.value)
// the Style panel (shadows/borders) is a design tool, not a preference
const sections = computed(() => props.sections ?? (dev.value ? ['colors', 'general', 'style'] as const : ['colors', 'general'] as const))

provideStudioFeatures(() => ({
  palette: props.palette ?? dev.value,
  shades: props.shades ?? dev.value,
  semantic: props.semantic ?? dev.value,
  components: props.components ?? dev.value,
  scale: props.scale ?? dev.value,
  help: props.help
}))

const emit = defineEmits<{
  /**
   * Fires with the full ThemeDoc on every edit — persist it to account
   * data and restore later with useThemeStudio().applyDoc().
   */
  change: [doc: ThemeDoc]
}>()

const { resetTheme, hasCSSChanges, hasConfigChanges, themeDoc } = useTheme()

// client-only watch: the doc reads persisted state that never exists on
// the server, and hosts only care about edits the user actually makes
onMounted(() => {
  watch(themeDoc, doc => emit('change', doc))
})
const studioIcons = useStudioIcons()
const appConfig = useAppConfig()

const open = ref(false)
const shareOpen = ref(false)
const shareMode = ref<'import' | 'export'>('export')

const SECTION_LABELS = { colors: 'Colors', general: 'General', style: 'Style' } as const

const tabs = computed(() => [
  ...props.presets ? [{ label: 'Presets', value: 'presets' }] : [],
  ...sections.value.map(section => ({ label: SECTION_LABELS[section], value: section }))
])
const tab = ref<string>()
watchEffect(() => {
  if (!tabs.value.some(item => item.value === tab.value)) tab.value = tabs.value[0]?.value
})
// template-side `as` casts parse as deprecated Vue filters — narrow here
const controlsGroup = computed(() => tab.value === 'presets' ? undefined : tab.value as 'colors' | 'general' | 'style' | undefined)

// Dirty (and so the reset affordance) is client-only persisted state —
// gate on mount so hydration matches the server's clean fallback.
const mounted = ref(false)
onMounted(() => (mounted.value = true))
const dirty = computed(() => mounted.value && (hasCSSChanges.value || hasConfigChanges.value))

function openShare(mode: 'import' | 'export') {
  shareMode.value = mode
  shareOpen.value = true
}
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'end', collisionPadding: 8 }">
    <slot :open="open" :dirty="dirty">
      <UChip :show="dirty" color="primary" size="sm">
        <UButton
          :icon="studioIcons.themes"
          color="neutral"
          variant="ghost"
          :size="size"
          aria-label="Customize theme"
        />
      </UChip>
    </slot>

    <template #content>
      <!-- Capped to the popover's collision-aware available height so a
           mid-page trigger with a long panel scrolls instead of running
           off the viewport. -->
      <div class="w-80 flex flex-col max-h-[min(70vh,var(--reka-popover-content-available-height))]">
        <div v-if="tabs.length > 1" class="p-2 pb-0 shrink-0">
          <UTabs
            v-model="tab"
            :items="tabs"
            :content="false"
            size="xs"
            color="neutral"
            class="w-full"
          />
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <ThemeStudioPresetList
            v-if="tab === 'presets'"
            :include="Array.isArray(presets) ? presets : undefined"
            :extra="customPresets"
            class="w-full"
          />
          <ThemeStudioControls v-else-if="controlsGroup" :group="controlsGroup" />
        </div>

        <div v-if="share || reset" class="shrink-0 flex items-center gap-1 p-2 border-t border-default">
          <UTooltip v-if="reset" text="Reset theme">
            <UButton
              :icon="studioIcons.reset"
              color="neutral"
              variant="ghost"
              size="xs"
              :disabled="!dirty"
              aria-label="Reset theme"
              @click="resetTheme()"
            />
          </UTooltip>

          <span class="flex-1" />

          <template v-if="share">
            <UTooltip text="Import theme">
              <UButton
                :icon="appConfig.ui.icons.upload"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Import theme"
                @click="openShare('import')"
              />
            </UTooltip>

            <UButton
              label="Export"
              :icon="studioIcons.export"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="openShare('export')"
            />
          </template>
        </div>
      </div>
    </template>
  </UPopover>

  <ThemeStudioShareModal v-if="share" v-model:open="shareOpen" v-model:mode="shareMode" />
</template>
