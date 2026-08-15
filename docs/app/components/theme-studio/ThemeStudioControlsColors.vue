<script setup lang="ts">
import type { ColorAlias } from '../../utils/theme/engine'

const semanticAliases: ColorAlias[] = ['secondary', 'success', 'info', 'warning', 'error']
</script>

<template>
  <!-- Sections own their padding so the separators run edge to edge. -->
  <ThemeStudioColorSection
    alias="primary"
    help-to="/docs/getting-started/theme/css-variables#colors"
    section-key="primary"
  />

  <ThemeStudioColorSection
    alias="neutral"
    help-to="/docs/getting-started/theme/css-variables#text"
    section-key="neutral"
  />

  <ThemeStudioSection
    label="Semantic"
    help-to="/docs/getting-started/theme/design-system"
    :default-open="false"
    section-key="semantic"
  >
    <ThemeStudioColorSection
      v-for="alias in semanticAliases"
      :key="alias"
      :alias="alias"
      :collapsible="false"
    />
  </ThemeStudioSection>
</template>
