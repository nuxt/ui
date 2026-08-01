<script setup lang="ts">
/**
 * The header's slim theme popover: presets and quick color pickers for
 * fast theming from any page, with the full studio one click away.
 */
const route = useRoute()
const { track } = useAnalytics()
const studioIcons = useStudioIcons()

const open = ref(false)

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Picker Opened')
  }
})

const aliases = [
  { alias: 'primary', label: 'Primary' },
  { alias: 'neutral', label: 'Neutral' }
] as const
</script>

<template>
  <UPopover v-model:open="open" :ui="{ content: 'w-64 p-3 flex flex-col gap-3' }">
    <UTooltip text="Theme">
      <UButton
        :icon="studioIcons.themes"
        color="neutral"
        active-color="primary"
        :active="route.path === '/theme'"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Theme"
      />
    </UTooltip>

    <template #content>
      <span class="text-xs font-semibold text-muted">Theme</span>

      <!-- Preset leads its row like the colors below it, so all three
           controls share one left edge. -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted w-14 shrink-0">Preset</span>

          <ThemeStudioPresetMenu size="sm" class="flex-1 min-w-0" />
        </div>

        <div v-for="{ alias, label } in aliases" :key="alias" class="flex items-center gap-2">
          <span class="text-xs text-muted w-14 shrink-0">{{ label }}</span>

          <ThemeStudioColorMenu :alias="alias" class="flex-1 min-w-0" />
        </div>
      </div>

      <template v-if="route.path !== '/theme'">
        <USeparator />

        <UButton
          label="Edit theme"
          :icon="studioIcons.themes"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="subtle"
          size="sm"
          block
          to="/theme"
          @click="open = false"
        />
      </template>
    </template>
  </UPopover>
</template>
