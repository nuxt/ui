<script setup lang="ts">
import { TOKEN_GROUPS } from '../../utils/theme-engine'
import type { ColorAlias, TokenGroup } from '../../utils/theme-engine'

/**
 * Per-mode shade sliders for the semantic tokens of one ramp, grouped under
 * plain headings. Shared by the Colors panel (background/text on neutral) and
 * the Style panel's Borders section (the border group), so a token group can
 * live next to whichever control it belongs with.
 *
 * The whole strip already sits behind its section's "Adjust shades" toggle —
 * folding the groups inside it too would be a third click for a slider.
 */
const props = defineProps<{
  alias: ColorAlias
  /** Restrict to these token groups; omit to show every group with tokens. */
  groups?: TokenGroup[]
}>()

const { rampChip } = useThemeStudio()
const { shadeLadder, sections } = useTokenShades(props.alias)

const tokenGroups = TOKEN_GROUPS
  .filter(group => !props.groups || props.groups.includes(group.key))
  .map(group => ({ ...group, sections: sections.filter(section => section.group === group.key) }))
  .filter(group => group.sections.length)
</script>

<template>
  <div class="flex flex-col gap-3 pt-2">
    <div v-for="tokenGroup in tokenGroups" :key="tokenGroup.key" class="flex flex-col gap-2">
      <!-- group heading only when there's more than one to tell apart -->
      <span v-if="tokenGroups.length > 1" class="text-xs font-medium text-muted select-none">{{ tokenGroup.label }}</span>

      <div v-for="section in tokenGroup.sections" :key="section.token" class="flex flex-col gap-1.5 px-1">
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
  </div>
</template>
