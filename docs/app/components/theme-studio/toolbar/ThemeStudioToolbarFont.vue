<script setup lang="ts">
import { keepPanels, toolbarPanelClass, FONT_WEIGHT_DEFAULTS, loadFontPreviews } from '../../../utils/theme/studio'
import { THEME_DEFAULTS } from '../../../utils/theme/engine/types'

/**
 * Every typographic setting in one panel: the three stacks up top, their
 * weights, then the treatment that rides on them.
 *
 * The stacks are what tailwind reads. Mono needs nothing else (preflight
 * points `code`/`kbd`/`pre`/`samp` at it) and the heading one sets
 * `--font-heading`.
 */
const { fonts, font, fontPrefs, setFontPrefs, fontSize } = useTheme()

// The saved font is client-only: report the stock face until mounted, like
// the other triggers, so hydration adopts the server's label and aria-label.
const mounted = useMounted()
const fontLabel = computed(() => (mounted.value ? font.value : THEME_DEFAULTS.font))

onMounted(() => loadFontPreviews(fonts.map(entry => entry.name)))

// Body is `--ui-font-weight-body`, heading the `--ui-font-weight-heading`
// every title reads. Unset, the heading row rests on semibold and each title
// keeps its own step until the section reset clears it. Steps of 100 from 300
// to 800: those are the faces the studio loads, a weight in between would
// render as the nearest one.
function weightModel(key: keyof typeof FONT_WEIGHT_DEFAULTS) {
  return computed({
    get: () => fontPrefs.value.weights?.[key] ?? FONT_WEIGHT_DEFAULTS[key],
    set: (value: number) => setFontPrefs({ ...fontPrefs.value, weights: { ...fontPrefs.value.weights, [key]: value } })
  })
}

const bodyWeight = weightModel('body')
const headingWeight = weightModel('heading')

const uppercase = computed({
  get: () => !!fontPrefs.value.uppercase,
  set: (value: boolean) => setFontPrefs({ ...fontPrefs.value, uppercase: value })
})

const letterSpacing = computed({
  get: () => fontPrefs.value.letterSpacing ?? 0,
  set: (value: number) => setFontPrefs({ ...fontPrefs.value, letterSpacing: value })
})

const lineHeight = computed({
  get: () => fontPrefs.value.lineHeight ?? 1.5,
  set: (value: number) => setFontPrefs({ ...fontPrefs.value, lineHeight: value })
})

/**
 * The heading and code stacks. `undefined` (not the string) is inherit, so an untouched
 * row exports clean; the body stack always resolves, so it has no inherit.
 */
function stackModel(key: 'heading' | 'mono') {
  return computed({
    get: () => fontPrefs.value[key] ?? 'inherit',
    set: (value: string) => setFontPrefs({ ...fontPrefs.value, [key]: value === 'inherit' ? undefined : value })
  })
}

const stacks = [
  { label: 'Body', model: font, inherit: false, default: 'Public Sans', hint: 'Body font' },
  { label: 'Heading', model: stackModel('heading'), inherit: true, default: undefined, hint: 'Heading font' },
  { label: 'Code', model: stackModel('mono'), inherit: true, default: undefined, hint: 'Code font' }
]

const props = defineProps<{
  /** Stacked in the mobile menu: the panel takes the trigger's width, like a select. */
  vertical?: boolean
}>()

const studioIcons = useStudioIcons()
const { groupDirtyFlags } = useThemeStudioToolbar()

const open = ref(false)
const dirty = groupDirtyFlags.font

const content = computed(() => [...toolbarPanelClass(props.vertical), 'divide-y divide-default *:p-3'])
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'center', onInteractOutside: keepPanels }" :ui="{ content }">
    <ThemeStudioToolbarTrigger
      :label="fontLabel"
      :icon="studioIcons.text"
      :dirty="dirty"
      :open="open"
      :class="vertical ? 'w-full' : 'w-38'"
      :aria-label="`Text: ${fontLabel}`"
    />

    <template #content>
      <ThemeStudioSection label="Fonts" section-key="font">
        <ThemeStudioRow
          v-for="stack in stacks"
          :key="stack.label"
          control="custom"
          :label="stack.label"
        >
          <ThemeStudioToolbarFontPicker
            v-model="stack.model.value"
            :curated="fonts"
            :default-value="stack.default"
            :inherit="stack.inherit"
            :aria-label="stack.hint"
          />
        </ThemeStudioRow>
      </ThemeStudioSection>

      <ThemeStudioSection label="Weights" section-key="weights">
        <ThemeStudioRow
          v-model="bodyWeight"
          control="slider"
          label="Body"
          :min="300"
          :max="800"
          :step="100"
        />

        <ThemeStudioRow
          v-model="headingWeight"
          control="slider"
          label="Heading"
          :min="300"
          :max="800"
          :step="100"
        />
      </ThemeStudioSection>

      <ThemeStudioSection label="Treatment" section-key="type">
        <!-- font-size scales every rem metric, so it belongs with the type
           decisions rather than beside radius -->
        <ThemeStudioRow
          v-model="fontSize"
          control="slider"
          label="Size"
          :min="14"
          :max="18"
          :step="0.5"
          unit="px"
        />

        <ThemeStudioRow
          v-model="letterSpacing"
          control="slider"
          label="Spacing"
          :min="-0.05"
          :max="0.25"
          :step="0.005"
          unit="em"
        />

        <ThemeStudioRow
          v-model="lineHeight"
          control="slider"
          label="Height"
          :min="1"
          :max="2"
          :step="0.05"
        />

        <ThemeStudioRow
          v-model="uppercase"
          control="switch"
          label="Uppercase"
        />
      </ThemeStudioSection>
    </template>
  </UPopover>
</template>
