<script setup lang="ts">
/**
 * The header's slim theme popover: presets and quick color pickers for
 * fast theming from any page, with the full studio one click away.
 */
const route = useRoute()
const { track } = useAnalytics()

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
        icon="i-lucide-swatch-book"
        color="neutral"
        active-color="primary"
        :active="route.path === '/theme'"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Theme"
      />
    </UTooltip>

    <template #content>
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-muted">Theme</span>

        <UColorModeSwitch />
      </div>

      <ThemeStudioPresetMenu />

      <div class="flex flex-col gap-2">
        <div v-for="{ alias, label } in aliases" :key="alias" class="flex items-center gap-2">
          <span class="text-xs text-muted w-14 shrink-0">{{ label }}</span>

          <ThemeStudioColorMenu :alias="alias" class="flex-1 min-w-0" />
        </div>
      </div>

      <template v-if="route.path !== '/theme'">
        <USeparator />

        <UButton
          label="Open Theme Studio"
          icon="i-lucide-swatch-book"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="subtle"
          block
          to="/theme"
          @click="open = false"
        />
      </template>
    </template>
  </UPopover>
</template>
