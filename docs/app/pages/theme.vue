<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { decodeThemeDoc, encodeThemeDoc, isSameDoc } from '../utils/theme/link'

const { track } = useAnalytics()
const appConfig = useAppConfig()
const { icon: iconSet, currentDoc } = useTheme()

const { copy: copyLink, copied: linkCopied } = useClipboard()

const { open: chatOpen } = useChat()

function toggleChat() {
  if (!chatOpen.value) {
    track('AI Chat Opened', { source: 'header' })
  }
  chatOpen.value = !chatOpen.value
}

// The chrome skins to the applied icon pack.
const studioIcons = useStudioIcons()

const { view, views, applyDoc, applyPreset, presets, activePreset } = useThemeStudio()
const { past, future, undo, redo } = useThemeStudioHistory({ record: true })

async function shareTheme() {
  const doc = currentDoc()
  const preset = presets.find(entry => entry.id === activePreset.value)
  // the id only when nothing has been touched since, so a tweak still travels whole
  const payload = preset && isSameDoc(doc, preset.doc) ? { version: 1 as const, preset: preset.id } : doc

  copyLink(`${window.location.origin}${window.location.pathname}#${await encodeThemeDoc(payload)}`)
  track('Theme Exported', { type: 'Link' })
}

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

// A theme travels in the hash, so a link carries the whole document without a
// server. Consumed on arrival, or the URL would keep re-applying it; anything
// that isn't a theme is left alone. On nuxt-ready, not on mount: the plugin
// restores the stored theme on the same hook, and a link has to outlive it.
onNuxtReady(async () => {
  const link = await decodeThemeDoc(window.location.hash.slice(1))
  if (!link) return

  // consumed either way: a link naming a preset that no longer exists should
  // not sit in the URL looking like it will still apply
  window.history.replaceState(null, '', window.location.pathname + window.location.search)

  const preset = link.preset ? presets.find(entry => entry.id === link.preset) : undefined
  if (link.preset && !preset) return

  if (preset) applyPreset(preset)
  else applyDoc(link)
  track('Theme Link Applied')
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
  description: 'Customize Nuxt UI live: colors, radius, fonts and icons, then export only what you changed.'
})

onMounted(() => track('Theme Studio Opened'))

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
        <UTooltip text="Switch color mode" :kbds="['d']">
          <ThemeStudioColorModeTabs data-keep-panels class="shrink-0" />
        </UTooltip>

        <UTooltip text="Ask AI" :kbds="['meta', 'I']" ignore-non-keyboard-focus>
          <UButton
            color="neutral"
            variant="soft"
            label="Ask AI"
            aria-label="Ask AI for help"
            class="hidden lg:inline-flex"
            @click="toggleChat"
          />
        </UTooltip>

        <UFieldGroup>
          <UTooltip :text="linkCopied ? 'Link copied' : 'Copy link to this theme'">
            <UButton
              :icon="linkCopied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
              :color="linkCopied ? 'primary' : 'neutral'"
              variant="subtle"
              :aria-label="linkCopied ? 'Link copied' : 'Copy link to this theme'"
              class="hidden lg:inline-flex z-1"
              @click="shareTheme"
            />
          </UTooltip>

          <UButton
            color="neutral"
            variant="outline"
            label="Export theme"
            class="hidden lg:inline-flex"
            @click="shareOpen = true"
          />
        </UFieldGroup>
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

          <USeparator class="my-5" />

          <ThemeStudioShuffleButton variant="outline" vertical />
          <ThemeStudioResetButton variant="outline" vertical />

          <UButton
            :icon="linkCopied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
            :color="linkCopied ? 'success' : 'neutral'"
            variant="outline"
            :label="linkCopied ? 'Link copied' : 'Copy link'"
            block
            @click="shareTheme"
          />

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

    <UFooter class="hidden lg:block ring ring-default rounded-xl bg-default mx-2 mt-2" :ui="{ container: 'py-3! px-6! overflow-x-auto', left: 'mt-0 gap-0 lg:flex-none', right: 'mt-0' }">
      <template #left>
        <UTooltip text="Undo" :kbds="['meta', 'Z']">
          <UButton
            :icon="studioIcons.undo"
            color="neutral"
            variant="ghost"
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
            :disabled="!future.length"
            aria-label="Redo theme change"
            @click="redo"
          />
        </UTooltip>

        <USeparator orientation="vertical" class="h-auto self-stretch py-1 ms-3 me-1.5" />
      </template>

      <ThemeStudioToolbar />

      <template #right>
        <ThemeStudioShuffleButton variant="soft" />
        <ThemeStudioResetButton variant="soft" />
      </template>
    </UFooter>

    <ThemeStudioShareModal v-model:open="shareOpen" />
  </main>
</template>
