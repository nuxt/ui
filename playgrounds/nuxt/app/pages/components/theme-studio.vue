<script setup lang="ts">
import type { ThemeDoc, ThemePreset } from '@nuxt/ui-theme-studio/engine'

// where an app would persist to account data
function onChange(doc: ThemeDoc) {
  console.log('[theme-studio] change', JSON.stringify(doc))
}

const brand: ThemePreset[] = [{
  id: 'acme',
  name: 'Acme',
  description: 'A custom preset provided by the host app',
  icon: 'i-lucide-rocket',
  doc: {
    version: 1,
    colors: { primary: 'indigo', neutral: 'zinc' },
    font: { sans: 'Inter' },
    radius: 0.625
  }
}]
</script>

<template>
  <Navbar to="https://ui.nuxt.com/docs/getting-started/integrations/theme-studio" />

  <div class="flex flex-col items-center gap-8">
    <div class="flex flex-col items-center gap-2">
      <p class="text-sm font-medium text-muted">
        Default — full editor
      </p>
      <ThemeStudioButton @change="onChange" />
    </div>

    <div class="flex flex-col items-center gap-2">
      <p class="text-sm font-medium text-muted">
        Restricted presets + custom preset
      </p>
      <ThemeStudioButton :presets="['nuxt-ui', 'shadcn']" :custom-presets="brand" />
    </div>

    <div class="flex flex-col items-center gap-2">
      <p class="text-sm font-medium text-muted">
        User mode — curated presets, plain pickers
      </p>
      <ThemeStudioButton mode="user" :presets="['nuxt-ui', 'shadcn', 'neo-brutalist', '8bit']" />
    </div>

    <div class="flex flex-col items-center gap-2">
      <p class="text-sm font-medium text-muted">
        No presets, colors only, no share
      </p>
      <ThemeStudioButton :presets="false" :panels="['colors']" :share="false" />
    </div>

    <div class="flex flex-col items-center gap-2">
      <p class="text-sm font-medium text-muted">
        Custom trigger via slot
      </p>
      <ThemeStudioButton>
        <template #default="{ dirty }">
          <UButton
            :label="dirty ? 'Edit your theme' : 'Customize'"
            icon="i-lucide-paintbrush"
            color="neutral"
            variant="outline"
          />
        </template>
      </ThemeStudioButton>
    </div>
  </div>
</template>
