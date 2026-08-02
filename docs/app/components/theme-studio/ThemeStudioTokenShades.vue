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
    <!-- Static sections all the way down, like every other nested group in
         the panels — no bare heading spans re-guessing the treatment.
         The group OWNS its tokens. With only one group its name would just
         repeat the section above it, so it goes label-less and draws no
         header — the tokens still nest inside it. -->
    <ThemeStudioSection
      v-for="tokenGroup in tokenGroups"
      :key="tokenGroup.key"
      :label="tokenGroups.length > 1 ? tokenGroup.label : undefined"
      :collapsible="false"
      class="flex flex-col gap-2"
    >
      <ThemeStudioSection
        v-for="section in tokenGroup.sections"
        :key="section.token"
        :label="section.label"
        :collapsible="false"
      >
        <ThemeStudioRow
          v-for="(slider, modeName) in section.sliders"
          :key="modeName"
          v-model="slider.model.value"
          control="shade"
          :mode="modeName"
          :chip="rampChip(section.ramp)"
          :ladder="shadeLadder"
          resettable
          :dirty="slider.dirty.value"
          @reset="slider.reset()"
        />
      </ThemeStudioSection>
    </ThemeStudioSection>
  </div>
</template>
