<script setup lang="ts">
import type { ColorAlias } from '../../utils/theme/engine'

const semanticAliases: ColorAlias[] = ['secondary', 'success', 'info', 'warning', 'error']
</script>

<template>
  <!-- Sections own their padding so the separators run edge to edge, and the
       panel drops the leading one since nothing sits above it. -->
  <div class="flex flex-col [&>*:first-child]:border-t-0">
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
      section-key="semantic"
    >
      <ThemeStudioColorSection
        v-for="alias in semanticAliases"
        :key="alias"
        :alias="alias"
      />
    </ThemeStudioSection>
  </div>
</template>
