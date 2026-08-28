<script setup lang="ts">
const { track } = useAnalytics()
const { icon: iconSet } = useTheme()

// The chrome skins to the applied icon pack.
const studioIcons = useStudioIcons()

const { view, views } = useThemeStudio()
const { past, future, undo, redo } = useThemeStudioHistory({ record: true })

// The preview mirrors into ?view=, so a reload (or a shared link) lands on
// the same page. Read during setup rather than on mount: the server renders
// the requested view, and hydration has nothing to correct.
const route = useRoute()
const router = useRouter()
const requested = route.query.view
if (typeof requested === 'string' && views.some(tab => tab.value === requested)) {
  view.value = requested as typeof view.value
}
// grid is the default, so it stays out of the URL. Written on mount too:
// the view is app-level state, so coming back to /theme from another page
// lands on the last view with a URL that doesn't say so.
const sync = (value: typeof view.value) => router.replace({ query: { ...route.query, view: value === 'grid' ? undefined : value } })
watch(view, sync)
onMounted(() => {
  if ((route.query.view ?? 'grid') !== view.value) sync(view.value)
})

// The studio's preview is a card floating on a recessed canvas, which is the
// one background the semantic tokens can't express: `--ui-bg-*` only ever
// elevates, so there is no "behind the surface" step (v5's elevation ladder).
// Unhead drops the class on navigate, so the canvas stays on this page.
useHead({
  bodyAttrs: { class: 'theme-studio' }
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: 'Theme Studio',
  description: 'Customize Nuxt UI live: colors, radius, fonts and icons, then export only what you changed.'
})

onMounted(() => track('Theme Studio Opened'))

// Color mode rides the app-wide `d` binding in app.vue, no page copy needed.
defineShortcuts({
  meta_z: undo,
  meta_shift_z: redo,
  ctrl_y: redo
})

/** The view switcher's own popover, one instance per breakpoint. */
const openViews = reactive({ bar: false, menu: false })

/** The shared import/export modal, the two toolbar buttons pick its mode. */
const shareOpen = ref(false)
const shareMode = ref<'import' | 'export'>('export')
</script>

<template>
  <!-- page tint composites on the app root's bg-default (nuxt.config rootAttrs) -->
  <main class="max-w-(--ui-container) mx-auto">
    <!-- `modal: false` so the panels' popovers, portalled to the body, stay
         interactive over the fullscreen menu -->
    <UHeader :menu="{ modal: false }" :ui="{ root: () => 'h-(--ui-header-height) border-b border-transparent', right: 'gap-0.5 lg:gap-1.5' }">
      <template #left>
        <HeaderLogo />

        <div class="flex items-center">
          <UTooltip text="Undo" :kbds="['meta', 'Z']">
            <UButton
              :icon="studioIcons.undo"
              color="neutral"
              variant="ghost"
              :disabled="!past.length"
              aria-label="Undo theme change"
              class="hidden lg:inline-flex"
              @click="undo"
            />
          </UTooltip>

          <UTooltip text="Redo" :kbds="['meta', 'shift', 'Z']">
            <UButton
              :icon="studioIcons.redo"
              color="neutral"
              variant="ghost"
              :disabled="!future.length"
              aria-label="Redo theme change"
              class="hidden lg:inline-flex"
              @click="redo"
            />
          </UTooltip>
        </div>
      </template>

      <ThemeStudioViewSwitcher v-model:open="openViews.bar" />

      <template #right>
        <UTooltip text="Color mode" :kbds="['d']">
          <UColorModeButton color="neutral" variant="ghost" data-keep-panels class="shrink-0" />
        </UTooltip>

        <UButton
          color="neutral"
          label="Export"
          class="hidden lg:inline-flex"
          @click="shareMode = 'export'; shareOpen = true"
        />
      </template>

      <template #toggle="{ open, toggle, ui }">
        <HeaderToggleButton
          :open="open"
          :class="ui.toggle({ toggleSide: 'right' })"
          @click="toggle"
        />
      </template>

      <!-- below `lg` the centre slot and the footer bar are both hidden, so
           the menu is the only way to reach the views and the controls -->
      <template #body>
        <div class="flex flex-col gap-3">
          <UFormField label="View" :ui="{ root: 'text-xs', container: 'mt-1' }">
            <ThemeStudioViewSwitcher v-model:open="openViews.menu" vertical class="w-full" />
          </UFormField>

          <ThemeStudioToolbar vertical />

          <USeparator class="my-5" />

          <ThemeStudioShuffleButton variant="outline" vertical />
          <ThemeStudioResetButton variant="outline" vertical />

          <UButton
            :icon="studioIcons.export"
            color="neutral"
            label="Export theme"
            block
            @click="shareMode = 'export'; shareOpen = true"
          />
        </div>
      </template>
    </UHeader>

    <div class="flex flex-col bg-default rounded-xl overflow-hidden shadow ring ring-default h-[calc(100dvh-var(--ui-header-height)-0.5rem)] lg:h-[calc(100dvh-var(--ui-header-height)-var(--ui-header-height))] mx-2">
      <!-- [contain:paint]: Chromium won't clip nested composited layers by
             an ancestor's overflow alone. Keyed on the icon pack: demo views
             resolve icons at setup, so a pack swap remounts to re-resolve. -->
      <div :key="iconSet" class="flex-1 min-h-0 overflow-hidden *:contain-[paint]">
        <Playground v-if="view === 'grid'" />
        <LazyThemeStudioViewDashboard v-else-if="view === 'dashboard'" />
        <LazyThemeStudioViewChat v-else-if="view === 'chat'" />
        <LazyThemeStudioViewSaas v-else-if="view === 'saas'" />
        <LazyThemeStudioViewLanding v-else-if="view === 'landing'" />
        <LazyThemeStudioViewDocs v-else-if="view === 'docs'" />
        <LazyThemeStudioViewPortfolio v-else-if="view === 'portfolio'" />
        <LazyThemeStudioViewChangelog v-else-if="view === 'changelog'" />
        <LazyThemeStudioViewEditor v-else-if="view === 'editor'" />
        <LazyThemeStudioViewA11y v-else-if="view === 'a11y'" />
      </div>
    </div>

    <UFooter class="hidden lg:block" :ui="{ container: 'py-2 lg:py-4', left: 'mt-0', right: 'mt-0' }">
      <template #left>
        <ThemeStudioShuffleButton variant="outline" />
      </template>

      <ThemeStudioToolbar />

      <template #right>
        <ThemeStudioResetButton variant="outline" />
      </template>
    </UFooter>

    <ThemeStudioShareModal v-model:open="shareOpen" v-model:mode="shareMode" />
  </main>
</template>
