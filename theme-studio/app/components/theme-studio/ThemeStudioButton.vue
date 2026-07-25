<script setup lang="ts">
import type { ThemePreset } from '../../utils/theme-engine'

/**
 * The drop-in theme studio: one button opening the full editor in a
 * popover — presets, colors, general and style — for any Nuxt UI app
 * extending the layer. Everything is optional: hosts choose which panels
 * to expose, restrict or extend the preset list, and hide import/export.
 * Pairs with `@nuxt/ui-theme-studio/theme.css` in the app's Tailwind
 * entry, which carries the shadow/border machinery the controls drive.
 */
const props = withDefaults(defineProps<{
  /** Show the Presets panel — `false` hides it, an id list restricts it. */
  presets?: boolean | string[]
  /** Extra presets appended after the stock list. */
  customPresets?: ThemePreset[]
  /** Which control panels to offer, in order. */
  sections?: ('colors' | 'general' | 'style')[]
  /** Offer theme import/export. */
  share?: boolean
  /** Offer the reset-to-stock control. */
  reset?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  presets: true,
  sections: () => ['colors', 'general', 'style'],
  share: true,
  reset: true
})

const { resetTheme, hasCSSChanges, hasConfigChanges } = useTheme()
const studioIcons = useStudioIcons()
const appConfig = useAppConfig()

const open = ref(false)
const shareOpen = ref(false)
const shareMode = ref<'import' | 'export'>('export')

const SECTION_LABELS = { colors: 'Colors', general: 'General', style: 'Style' } as const

const tabs = computed(() => [
  ...props.presets ? [{ label: 'Presets', value: 'presets' }] : [],
  ...props.sections.map(section => ({ label: SECTION_LABELS[section], value: section }))
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
  <UPopover v-model:open="open" :content="{ align: 'end' }">
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
      <div class="w-80 flex flex-col">
        <div v-if="tabs.length > 1" class="p-2 pb-0">
          <UTabs
            v-model="tab"
            :items="tabs"
            :content="false"
            size="xs"
            color="neutral"
            class="w-full"
          />
        </div>

        <div class="max-h-[60vh] overflow-y-auto overscroll-contain">
          <ThemeStudioPresetList
            v-if="tab === 'presets'"
            :include="Array.isArray(presets) ? presets : undefined"
            :extra="customPresets"
            class="w-full"
          />
          <ThemeStudioControls v-else-if="controlsGroup" :group="controlsGroup" />
        </div>

        <div v-if="share || reset" class="flex items-center gap-1 p-2 border-t border-default">
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
