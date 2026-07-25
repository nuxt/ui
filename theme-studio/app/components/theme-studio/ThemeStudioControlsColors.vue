<script setup lang="ts">
import type { ColorAlias } from '../../utils/theme-engine'

const semanticAliases: ColorAlias[] = ['secondary', 'success', 'info', 'warning', 'error']
const features = useStudioFeatures()
</script>

<template>
  <!-- Sections own their padding so the separators run edge to edge. -->
  <div class="flex flex-col">
    <ThemeStudioColorSection
      alias="primary"
      help-to="/docs/getting-started/theme/css-variables#colors"
      class="p-4"
      section-key="primary"
    />

    <USeparator />

    <ThemeStudioColorSection
      alias="neutral"
      help-to="/docs/getting-started/theme/css-variables#text"
      class="p-4"
      section-key="neutral"
    />

    <USeparator v-if="features.semantic" />

    <ThemeStudioSection
      v-if="features.semantic"
      label="Semantic"
      help-to="/docs/getting-started/theme/design-system"
      :default-open="false"
      class="p-4"
      section-key="semantic"
    >
      <div class="flex flex-col gap-3 pt-1">
        <ThemeStudioColorSection v-for="alias in semanticAliases" :key="alias" :alias="alias" />
      </div>
    </ThemeStudioSection>
  </div>
</template>
