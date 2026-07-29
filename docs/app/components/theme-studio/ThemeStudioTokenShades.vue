<script setup lang="ts">
import { TOKEN_GROUPS } from '../../utils/theme-engine'
import type { ColorAlias, TokenGroup } from '../../utils/theme-engine'

/**
 * Per-mode shade sliders for the semantic tokens of one ramp, grouped and
 * folded. Shared by the Colors panel (background/text on neutral) and the
 * Style panel's Borders section (the border group), so a token group can live
 * next to whichever control it belongs with.
 */
const props = defineProps<{
  alias: ColorAlias
  /** Restrict to these token groups; omit to show every group with tokens. */
  groups?: TokenGroup[]
}>()

const { rampChip } = useThemeStudio()
const { shadeLadder, sections } = useTokenShades(props.alias)

// Groups fold individually — all closed by default so the panel opens compact.
const tokenGroups = TOKEN_GROUPS
  .filter(group => !props.groups || props.groups.includes(group.key))
  .map(group => ({ ...group, sections: sections.filter(section => section.group === group.key) }))
  .filter(group => group.sections.length)
const openGroups = reactive<Record<string, boolean>>({})
</script>

<template>
  <div class="flex flex-col gap-1 pt-2">
    <UCollapsible v-for="tokenGroup in tokenGroups" :key="tokenGroup.key" v-model:open="openGroups[tokenGroup.key]">
      <UButton
        :label="tokenGroup.label"
        :icon="openGroups[tokenGroup.key] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
        color="neutral"
        variant="ghost"
        size="sm"
        block
        :active="openGroups[tokenGroup.key]"
        active-variant="subtle"
        class="justify-start"
      />

      <template #content>
        <div class="flex flex-col gap-3 pt-2 pb-1 px-1">
          <div v-for="section in tokenGroup.sections" :key="section.token" class="flex flex-col gap-1.5">
            <span class="text-xs text-muted select-none">{{ section.label }}</span>

            <ThemeStudioSliderRow
              v-for="(slider, modeName) in section.sliders"
              :key="modeName"
              v-model="slider.model.value"
              :mode="modeName"
              :chip="rampChip(section.ramp)"
              :ladder="shadeLadder"
              resettable
              :dirty="slider.dirty.value"
              @reset="slider.reset()"
            />
          </div>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
