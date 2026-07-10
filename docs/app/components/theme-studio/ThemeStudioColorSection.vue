<script setup lang="ts">
import { TOKEN_SHADE_TARGETS, TOKEN_GROUPS, SHADES } from '../../utils/theme-engine'
import type { ColorAlias } from '../../utils/theme-engine'

/**
 * One color alias in the Colors panel: a section header carrying the edit
 * and adjust-shades toggles, the picker below, and the palette editor /
 * shade sliders folding out underneath. Color aliases expose their accent
 * pair; neutral carries every neutral-ramped token group.
 */
const props = defineProps<{
  alias: ColorAlias
  /** Header text — defaults to the capitalized alias. */
  label?: string
  helpTo?: string
}>()

const { isCustomPalette, style, setStyle, rampChip } = useThemeStudio()

const title = computed(() => props.label ?? props.alias.charAt(0).toUpperCase() + props.alias.slice(1))

const paletteEditor = ref(false)
const shadeEditor = ref(false)

// Per-token shade sliders, one light/dark pair. Only the touched mode is
// written so an untouched mode never becomes an override.
function tokenShadeSlider(token: string, defaults: { light: number, dark: number }, target: 'light' | 'dark') {
  return computed({
    get: () => {
      const value = style.value.tokenShades?.[token]?.[target] ?? defaults[target]
      return SHADES.indexOf(value as typeof SHADES[number])
    },
    set: (index: number) => {
      setStyle({
        tokenShades: {
          ...style.value.tokenShades,
          [token]: { ...style.value.tokenShades?.[token], [target]: SHADES[index]! }
        }
      })
    }
  })
}

const sections = TOKEN_SHADE_TARGETS
  .filter(target => props.alias === 'neutral' ? target.ramp === 'neutral' : target.token === `--ui-${props.alias}`)
  .map(target => ({
    ...target,
    sliders: {
      light: tokenShadeSlider(target.token, target.defaults, 'light'),
      dark: tokenShadeSlider(target.token, target.defaults, 'dark')
    }
  }))

// Neutral's token groups (background, text, borders) fold individually —
// all closed by default so the big panel opens compact.
const tokenGroups = TOKEN_GROUPS
  .map(group => ({ ...group, sections: sections.filter(section => section.group === group.key) }))
  .filter(group => group.sections.length)
const openGroups = reactive<Record<string, boolean>>({})
</script>

<template>
  <ThemeStudioSection :label="title" :help-to="helpTo">
    <template #actions>
      <UButton
        :icon="isCustomPalette(alias) ? 'i-lucide-paintbrush' : 'i-lucide-pencil'"
        color="neutral"
        variant="ghost"
        size="xs"
        :active="paletteEditor || isCustomPalette(alias)"
        active-color="primary"
        active-variant="subtle"
        :aria-label="`Edit ${alias} palette`"
        @click="paletteEditor = !paletteEditor"
      />

      <UTooltip text="Adjust shades">
        <UButton
          icon="i-lucide-sliders-horizontal"
          color="neutral"
          variant="ghost"
          size="xs"
          :active="shadeEditor"
          active-color="primary"
          active-variant="subtle"
          :aria-label="`Adjust ${alias} shades`"
          @click="shadeEditor = !shadeEditor"
        />
      </UTooltip>
    </template>

    <div>
      <ThemeStudioColorMenu :alias="alias" class="w-full" />

      <ThemeStudioPaletteEditor v-model:open="paletteEditor" :alias="alias" />

      <!-- The accent pair for color aliases. -->
      <div v-if="shadeEditor && alias !== 'neutral'" class="flex flex-col gap-1.5 pt-2">
        <ThemeStudioShadeSlider
          v-for="(slider, modeName) in sections[0]!.sliders"
          :key="modeName"
          v-model="slider.value"
          :mode="modeName"
          :chip="rampChip(alias)"
        />
      </div>

      <!-- Every neutral-ramped semantic token — the big one. -->
      <div v-else-if="shadeEditor" class="flex flex-col gap-1 pt-2">
        <UCollapsible v-for="tokenGroup in tokenGroups" :key="tokenGroup.key" v-model:open="openGroups[tokenGroup.key]">
          <UButton
            :label="tokenGroup.label"
            color="neutral"
            variant="ghost"
            size="sm"
            block
            class="justify-between"
            :trailing-icon="openGroups[tokenGroup.key] ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          />

          <template #content>
            <div class="flex flex-col gap-3 pt-2 pb-1 px-1">
              <div v-for="section in tokenGroup.sections" :key="section.token" class="flex flex-col gap-1.5">
                <span class="text-[11px] text-muted select-none">{{ section.label }}</span>

                <ThemeStudioShadeSlider
                  v-for="(slider, modeName) in section.sliders"
                  :key="modeName"
                  v-model="slider.value"
                  :mode="modeName"
                  :chip="rampChip(section.ramp)"
                />
              </div>
            </div>
          </template>
        </UCollapsible>
      </div>
    </div>
  </ThemeStudioSection>
</template>
