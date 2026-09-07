<script setup lang="ts">
import { decodeThemeDoc } from '../utils/theme/link'
import { snapshotStoredTheme, writeStoredTheme } from '../utils/theme/storage'

const { track } = useAnalytics()
const { icon: iconSet } = useTheme()

const { open: chatOpen } = useChat()

function toggleChat() {
  if (!chatOpen.value) {
    track('AI Chat Opened', { source: 'header' })
  }
  chatOpen.value = !chatOpen.value
}

// The chrome skins to the applied icon pack.
const studioIcons = useStudioIcons()

const { view, views, applyDoc, presets, activePreset } = useThemeStudio()
const { past, future, undo, redo } = useThemeStudioHistory({ record: true })

const route = useRoute()
const router = useRouter()

// A theme travels in ?doc=, a query rather than a hash so the server sees
// it: the page renders in the linked theme and the boot restore stands down
// (plugins/theme.ts), so a shared link paints right on its first frame
// instead of after hydration. Applied on both sides, the app config writes
// don't ride the payload. Consumed on mount, or the URL would keep
// re-applying it. A link naming a preset that no longer exists applies
// nothing and is consumed all the same.
const linked = route.query.doc !== undefined
const link = typeof route.query.doc === 'string' ? await decodeThemeDoc(route.query.doc) : undefined
const linkedPreset = link?.preset ? presets.find(entry => entry.id === link.preset) : undefined
const linkApplied = !!link && (!link.preset || !!linkedPreset)
if (linkApplied) {
  applyDoc(linkedPreset?.doc ?? link!)
  activePreset.value = linkedPreset?.id
}

// The boot restore stood down for the link (plugins/theme.ts). One that
// applied has to be stored: its state arrived in the payload rather than
// through a change, so nothing else trips the persistence watcher. One that
// turned out not to be a theme hands the visitor their own theme back.
if (import.meta.client && linked) {
  if (linkApplied) onMounted(() => writeStoredTheme(snapshotStoredTheme()))
  else useNuxtApp().$restoreStoredTheme()
}

// The preview mirrors into ?view=, so a reload (or a shared link) lands on
// the same page. Read during setup rather than on mount: the server renders
// the requested view, and hydration has nothing to correct.
const requested = route.query.view
if (typeof requested === 'string' && views.some(tab => tab.value === requested)) {
  view.value = requested as typeof view.value
}
// grid is the default, so it stays out of the URL, and a consumed theme link
// leaves it too. Written on mount as well: the view is app-level state, so
// coming back to /theme from another page lands on the last view with a URL
// that doesn't say so.
const sync = (value: typeof view.value) => router.replace({ query: { ...route.query, doc: undefined, view: value === 'grid' ? undefined : value } })
watch(view, sync)
onMounted(() => {
  if (linked || (route.query.view ?? 'grid') !== view.value) sync(view.value)
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
  title: 'Theme',
  description: 'Customize Nuxt UI live: colors, radius, fonts and icons, then export only what you changed.',
  // a shared link is one visitor's theme, not a page to index
  robots: linked ? 'noindex' : undefined
})

onMounted(() => {
  track('Theme Studio Opened')
  if (linkApplied) track('Theme Link Applied', { preset: linkedPreset?.id })
})

// Color mode rides the app-wide `d` binding in app.vue, no page copy needed.
defineShortcuts({
  meta_z: undo,
  meta_shift_z: redo,
  ctrl_y: redo
})

/** The export modal, opened from the header. */
const shareOpen = ref(false)
</script>

<template>
  <!-- page tint composites on the app root's bg-default (nuxt.config rootAttrs) -->
  <main class="max-w-(--ui-container) mx-auto">
    <!-- `modal: false` so the panels' popovers, portalled to the body, stay
         interactive over the fullscreen menu -->
    <UHeader :menu="{ modal: false }" :ui="{ root: () => 'h-(--ui-header-height) border-b border-transparent' }">
      <template #left>
        <HeaderLogo />
      </template>

      <ThemeStudioViewSwitcher />

      <template #right>
        <UTooltip text="Ask AI" :kbds="['meta', 'I']" ignore-non-keyboard-focus>
          <UButton
            color="neutral"
            variant="outline"
            label="Ask AI"
            aria-label="Ask AI for help"
            class="hidden lg:inline-flex"
            @click="toggleChat"
          />
        </UTooltip>

        <UButton
          color="neutral"
          variant="solid"
          label="Export"
          class="hidden lg:inline-flex"
          @click="shareOpen = true"
        />
      </template>

      <template #toggle="{ open, toggle, ui }">
        <HeaderToggleButton
          :open="open"
          variant="soft"
          :class="ui.toggle({ toggleSide: 'right' })"
          @click="toggle"
        />
      </template>

      <!-- below `lg` the centre slot and the footer bar are both hidden, so
           the menu is the only way to reach the views and the controls -->
      <template #body>
        <div class="flex flex-col gap-3">
          <UFormField label="View" :ui="{ root: 'text-xs', container: 'mt-1' }">
            <ThemeStudioViewSwitcher vertical class="w-full" />
          </UFormField>

          <ThemeStudioToolbar vertical />

          <UFormField label="Color mode" :ui="{ root: 'text-xs', container: 'mt-1' }">
            <ThemeStudioColorModeTabs size="sm" class="w-full" />
          </UFormField>

          <USeparator class="my-5" />

          <ThemeStudioShuffleButton variant="outline" vertical />
          <ThemeStudioResetButton variant="outline" vertical />

          <UButton
            :icon="studioIcons.export"
            color="neutral"
            label="Export theme"
            block
            @click="shareOpen = true"
          />
        </div>
      </template>
    </UHeader>

    <div class="flex flex-col bg-default rounded-xl overflow-hidden shadow ring ring-default h-[calc(100dvh-var(--ui-header-height)-0.5rem)] lg:h-[calc(100dvh-var(--ui-header-height)-var(--ui-header-height)-0.5rem)] mx-2">
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
      </div>
    </div>

    <!-- the centre takes every pixel the two clusters leave and shrinks
         (min-w-0), so the toolbar inside it scrolls instead of widening the bar -->
    <UFooter class="hidden lg:block ring ring-default rounded-xl bg-default mx-2 mt-2" :ui="{ container: 'py-3! px-6!', left: 'mt-0 gap-0 lg:flex-none', center: 'flex-1 min-w-0 justify-start', right: 'mt-0 lg:flex-none' }">
      <template #left>
        <!-- one cluster: these four move the whole theme, the controls beside
             them each change one setting. Framed like the mode tabs' own track
             at the other end, a size down on the buttons so both land at the
             height of the plain controls between them. -->
        <div class="flex items-center gap-0.5 p-0.5 rounded-lg ring ring-default bg-elevated/50">
          <UTooltip text="Undo" :kbds="['meta', 'Z']">
            <UButton
              :icon="studioIcons.undo"
              color="neutral"
              variant="ghost"
              size="sm"
              :disabled="!past.length"
              aria-label="Undo theme change"
              @click="undo"
            />
          </UTooltip>

          <UTooltip text="Redo" :kbds="['meta', 'shift', 'Z']">
            <UButton
              :icon="studioIcons.redo"
              color="neutral"
              variant="ghost"
              size="sm"
              :disabled="!future.length"
              aria-label="Redo theme change"
              @click="redo"
            />
          </UTooltip>

          <!-- undo/redo step through history, the two beside them rewrite it -->
          <USeparator orientation="vertical" class="h-4 mx-0.5" />

          <ThemeStudioResetButton size="sm" />
          <ThemeStudioShuffleButton size="sm" />
        </div>

        <USeparator orientation="vertical" class="h-auto self-stretch py-1 ms-4.5 me-1.5" />
      </template>

      <ThemeStudioToolbar />

      <template #right>
        <UTooltip text="Switch color mode" :kbds="['d']">
          <!-- framed like the history cluster, the bar's two ends match -->
          <ThemeStudioColorModeTabs
            data-keep-panels
            class="shrink-0"
          />
        </UTooltip>
      </template>
    </UFooter>

    <ThemeStudioShareModal v-model:open="shareOpen" />
  </main>
</template>
