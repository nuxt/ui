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

const { track } = useAnalytics()

const {
  primaryColors,
  primary,
  setBlackAsPrimary,
  neutralColors,
  neutral,
  radiuses,
  radius,
  fonts,
  font,
  resetTheme
} = useTheme()

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T
}

function shuffle() {
  if (Math.random() < 0.125) {
    setBlackAsPrimary(true)
  } else {
    primary.value = pick(primaryColors)
  }

  neutral.value = pick(neutralColors)
  radius.value = pick(radiuses)
  font.value = pick(fonts)

  track('Theme Studio Shuffled')
}
</script>

<template>
  <main class="flex flex-col lg:flex-row lg:h-[calc(100vh-var(--ui-header-height))]">
    <aside class="shrink-0 lg:w-80 border-b lg:border-b-0 lg:border-r border-default lg:overflow-y-auto p-4 sm:p-6">
      <ThemeStudioControls />
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <div class="flex items-center gap-2 border-b border-default px-4 sm:px-6 py-3">
        <h1 class="text-sm font-semibold text-highlighted me-2">
          Theme Studio
        </h1>

        <UBadge label="v0" variant="subtle" size="sm" />

        <span class="flex-1" />

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
            @click="resetTheme"
          />
        </UTooltip>
      </div>

      <div class="flex-1 lg:overflow-y-auto p-4 sm:p-6">
        <ThemeStudioBento />
      </div>
    </div>
  </main>
</template>
