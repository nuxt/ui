<script setup lang="ts">
import { TOKEN_GROUPS } from '../../utils/theme-engine'
import type { ColorAlias, TokenGroup } from '../../utils/theme-engine'

/**
 * Per-mode shade rows for one ramp's semantic tokens. Shared by the Colors
 * panel and the Style panel's Borders section, so a group can sit next to
 * whichever control it belongs with.
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
  <div class="flex flex-col gap-2">
    <!-- Every group keeps its name: a headerless section can't fold, and its
         tokens would spill out flat wherever it's dropped. -->
    <ThemeStudioSection
      v-for="tokenGroup in tokenGroups"
      :key="tokenGroup.key"
      :label="tokenGroup.label"
    >
      <ThemeStudioShadeGroup
        v-for="section in tokenGroup.sections"
        :key="section.token"
        :label="`${tokenGroup.label.replace(/ shades$/, '')} ${section.label.toLowerCase()}`"
        separator
        :sliders="section.sliders"
        :chip="rampChip(section.ramp)"
        :ladder="shadeLadder"
      />
    </ThemeStudioSection>
  </div>
</template>
