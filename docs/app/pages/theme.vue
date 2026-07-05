<script setup lang="ts">
const title = 'Theme Studio'
const description = 'Customize Nuxt UI live: colors, radius, fonts and icons — then export only what you changed.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('Docs.takumi', {
    title,
    description
  })
}

const { presets, activePreset, applyPreset, shuffle, reset } = useThemeStudio()

const sidebarOpen = ref(true)

const presetItems = computed(() => presets.map(preset => ({
  label: preset.name,
  icon: preset.icon,
  type: 'checkbox' as const,
  checked: activePreset.value === preset.id,
  onSelect: () => applyPreset(preset)
})))
</script>

<template>
  <main class="flex flex-col lg:flex-row lg:h-[calc(100vh-var(--ui-header-height))]">
    <aside
      v-show="sidebarOpen"
      class="shrink-0 lg:w-80 border-b lg:border-b-0 lg:border-r border-default lg:overflow-y-auto p-4"
    >
      <ThemeStudioControls />
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <div class="flex items-center gap-2 border-b border-default px-4 sm:px-6 py-3">
        <UTooltip :text="sidebarOpen ? 'Hide settings' : 'Show settings'">
          <UButton
            :icon="sidebarOpen ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Toggle settings panel"
            @click="sidebarOpen = !sidebarOpen"
          />
        </UTooltip>

        <h1 class="text-sm font-semibold text-highlighted me-2">
          Theme Studio
        </h1>

        <UBadge label="Concept" variant="subtle" size="sm" />

        <span class="flex-1" />

        <UDropdownMenu :items="presetItems" :content="{ align: 'end' }">
          <UButton
            label="Presets"
            icon="i-lucide-layout-grid"
            trailing-icon="i-lucide-chevron-down"
            color="neutral"
            variant="outline"
            size="sm"
          />
        </UDropdownMenu>

        <UTooltip text="Random theme">
          <UButton
            label="Shuffle"
            icon="i-lucide-dices"
            color="neutral"
            variant="outline"
            size="sm"
            @click="shuffle"
          />
        </UTooltip>

        <ThemeStudioExport />

        <UTooltip text="Reset theme">
          <UButton
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="outline"
            size="sm"
            aria-label="Reset theme"
            @click="reset"
          />
        </UTooltip>
      </div>

      <div class="flex-1 lg:overflow-y-auto p-4 sm:p-6">
        <ThemeStudioBento />
      </div>
    </div>
  </main>
</template>
