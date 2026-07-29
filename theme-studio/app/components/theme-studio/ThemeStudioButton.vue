<script setup lang="ts">
import type { ThemeDoc, ThemePreset } from '../../utils/theme-engine'
import type { StudioFeatures } from '../../composables/useStudioFeatures'

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
   * needs: presets and plain pickers. `features` overrides individual
   * affordances on top of whichever mode you pick.
   */
  mode?: 'dev' | 'user'
  /** The Presets panel — omit for all presets, an id list to restrict, `false` to hide. */
  presets?: false | string[]
  /** Extra presets appended after the stock list. */
  customPresets?: ThemePreset[]
  /** Which control panels to offer, in order. Mode default: dev all three, user colors + general. */
  panels?: ('colors' | 'general' | 'style')[]
  /** Heading above the panels — omit for none. */
  title?: string
  /** A light/dark switch in the header. Mode default: on for user, off for dev. */
  colorMode?: boolean
  /** Offer theme import/export. Mode default: dev on, user off. */
  share?: boolean
  /** Offer the reset-to-stock control. */
  reset?: boolean
  /**
   * Override individual affordances on top of the mode default — e.g.
   * `mode="user"` with `{ shades: true }` keeps the shade sliders. `help`
   * stays off in a host app: its links are docs-site paths.
   */
  features?: Partial<StudioFeatures>
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  mode: 'dev',
  reset: true,
  // an absent optional boolean casts to false — pin these so the mode defaults
  // below can see "not provided"
  share: undefined,
  colorMode: undefined
})

const dev = computed(() => props.mode !== 'user')
const share = computed(() => props.share ?? dev.value)
// end users expect a light/dark toggle where they pick a look; the docs studio
// has its own in the toolbar
const colorModeSwitch = computed(() => props.colorMode ?? !dev.value)
// the Style panel (shadows/borders) is a design tool, not a preference
const panels = computed(() => props.panels ?? (dev.value ? ['colors', 'general', 'style'] as const : ['colors', 'general'] as const))

provideStudioFeatures(() => ({
  palette: dev.value,
  shades: dev.value,
  semantic: dev.value,
  typography: dev.value,
  components: dev.value,
  scale: dev.value,
  help: false,
  // a host's own routes don't serve /docs/* — send help links to the real site
  helpBase: 'https://ui.nuxt.com',
  // the prop is the ergonomic front door; `features` still wins if both are set
  reset: props.reset,
  ...props.features
}))

const emit = defineEmits<{
  /**
   * Fires with the full ThemeDoc on every edit — persist it to account
   * data and restore later with useThemeStudio().applyDoc().
   */
  change: [doc: ThemeDoc]
}>()

const { resetTheme, hasCSSChanges, hasConfigChanges, themeDoc } = useTheme()

// Client-only: the doc reads persisted state that never exists on the server.
// Immediate, so a host syncing to a backend also learns the theme restored
// from localStorage — otherwise a pre-signin edit never reaches the account.
onMounted(() => {
  watch(themeDoc, doc => emit('change', doc), { immediate: true })
})
const studioIcons = useStudioIcons()
const appConfig = useAppConfig()

const open = ref(false)
const shareOpen = ref(false)
const shareMode = ref<'import' | 'export'>('export')

const SECTION_LABELS = { colors: 'Colors', general: 'General', style: 'Style' } as const

const tabs = computed(() => [
  ...props.presets !== false ? [{ label: 'Presets', value: 'presets' }] : [],
  ...panels.value.map(panel => ({ label: SECTION_LABELS[panel], value: panel }))
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
        <div v-if="title || colorModeSwitch || share || reset" class="shrink-0 flex items-center gap-1 p-2 border-b border-default">
          <span v-if="title" class="text-sm font-medium text-highlighted truncate px-1">{{ title }}</span>

          <span class="flex-1" />

          <UColorModeSwitch v-if="colorModeSwitch" size="sm" class="me-1" />

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

            <UTooltip text="Export theme">
              <UButton
                :icon="studioIcons.export"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Export theme"
                @click="openShare('export')"
              />
            </UTooltip>
          </template>
        </div>

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
      </div>
    </template>
  </UPopover>

  <ThemeStudioShareModal v-if="share" v-model:open="shareOpen" v-model:mode="shareMode" />
</template>
