<script setup lang="ts">
import { keepPanels, toolbarPanelClass, FONT_WEIGHT_DEFAULTS, loadFontPreviews } from '../../../utils/theme/studio'

/**
 * Every typographic setting in one panel: the three stacks up top, then the
 * treatment that rides on them. They were split across the toolbar and the
 * Options panel before, which meant the type decisions were never on screen
 * together.
 *
 * The stacks are what tailwind reads. Mono needs nothing else (preflight
 * points `code`/`kbd`/`pre`/`samp` at it) and serif drives the h1–h6 rule in
 * main.css until v5 ships `--ui-font-heading`.
 */
const { fonts, font, fontPrefs, setFontPrefs, fontSize } = useTheme()

onMounted(() => loadFontPreviews(fonts.map(entry => entry.name)))

// One writable model per tailwind weight step, the knobs components
// actually dereference at runtime.
function weightStepModel(step: keyof typeof FONT_WEIGHT_DEFAULTS) {
  return computed({
    get: () => fontPrefs.value.weights?.[step] ?? FONT_WEIGHT_DEFAULTS[step],
    set: (value: number) => setFontPrefs({ ...fontPrefs.value, weights: { ...fontPrefs.value.weights, [step]: value } })
  })
}

const WEIGHT_STEPS = ['normal', 'medium', 'semibold', 'bold'] as const
const weightSteps = Object.fromEntries(WEIGHT_STEPS.map(step => [step, weightStepModel(step)])) as Record<typeof WEIGHT_STEPS[number], ReturnType<typeof weightStepModel>>
const weights = WEIGHT_STEPS.map(step => ({ label: capitalize(step), model: weightSteps[step]! }))

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
 * Tailwind's other two stacks, labelled by what they drive rather than by
 * their variable. `undefined` (not the string) is inherit, so an untouched
 * row exports clean; the body stack always resolves, so it has no inherit.
 */
function stackModel(key: 'serif' | 'mono') {
  return computed({
    get: () => fontPrefs.value[key] ?? 'inherit',
    set: (value: string) => setFontPrefs({ ...fontPrefs.value, [key]: value === 'inherit' ? undefined : value })
  })
}

const stacks = [
  { label: 'Body', model: font, inherit: false, default: 'Public Sans', hint: 'Body font' },
  { label: 'Heading', model: stackModel('serif'), inherit: true, default: undefined, hint: 'Heading font' },
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
      :label="font"
      :icon="studioIcons.text"
      :dirty="dirty"
      :open="open"
      :class="vertical ? 'w-full' : 'w-38'"
      :aria-label="`Text: ${font}`"
    />

    <template #content>
      <!-- the panel owns the layout: padding per section, rules between them -->
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

      <ThemeStudioSection label="Weights" section-key="weights">
        <ThemeStudioRow
          v-for="weight in weights"
          :key="weight.label"
          v-model="weight.model.value"
          control="slider"
          :label="weight.label"
          :min="100"
          :max="900"
          :step="25"
        />
      </ThemeStudioSection>
    </template>
  </UPopover>
</template>
