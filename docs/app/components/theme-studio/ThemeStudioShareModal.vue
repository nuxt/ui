<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import type { HighlighterGeneric } from 'shiki'
import { encodeThemeDoc } from '../../utils/theme/link'

/**
 * The export modal: a link that carries the whole theme, then the generated
 * files, one tab each, to copy or download.
 */
const open = defineModel<boolean>('open', { default: false })

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()
const { exportCSS, exportConfig, configLabel, currentDoc } = useTheme()
const { presets, activePreset, dirty } = useThemeStudio()
const { framework } = useFrameworks()
const { track } = useAnalytics()

// One clipboard per action, or copying a file would light up the link button.
const { copy: copyToClipboard, copied: linkCopied } = useClipboard()
const { copy: copyFileToClipboard, copied: fileCopied } = useClipboard()

const css = ref('')
const config = ref('')
const link = ref('')

/** The URL the studio reads back on load, theme and all. */
async function buildLink() {
  const doc = currentDoc()
  const preset = presets.find(entry => entry.id === activePreset.value)
  // the id only while nothing has been touched since, so a tweak still
  // travels whole; the studio's own measure, a raw comparison would miss
  // every preset whose tokens applyDoc promotes into shades
  const payload = preset && !dirty.value ? { version: 1 as const, preset: preset.id } : doc
  // a query, not a hash, so the server renders the linked theme (pages/theme.vue)
  return `${window.location.origin}${window.location.pathname}?doc=${await encodeThemeDoc(payload)}`
}

function copyThemeLink() {
  copyToClipboard(link.value)
  track('Theme Exported', { type: 'Link' })
}

const colorMode = useColorMode()

// Ready on first open; the pane falls back to a plain <pre> for the frame
// the highlighter takes to arrive.
const highlighter = shallowRef<HighlighterGeneric<any, any> | null>(null)
watch(open, async (isOpen) => {
  if (isOpen && !highlighter.value) {
    highlighter.value = await useHighlighter()
  }
})

// One theme per mode rather than shiki's dual-theme vars (those ride inline
// styles), and `inline` structure: ProsePre brings the <pre> of its own.
function highlight(code: string, lang: 'css' | 'typescript') {
  if (!highlighter.value || !code) return ''
  return highlighter.value.codeToHtml(code, {
    lang,
    theme: colorMode.value === 'dark' ? 'material-theme-palenight' : 'material-theme-lighter',
    structure: 'inline'
  })
}

const panes = computed(() => [
  { key: 'css' as const, filename: 'main.css', code: css.value, html: highlight(css.value, 'css') },
  { key: 'config' as const, filename: configLabel.value, code: config.value, html: highlight(config.value, 'typescript') }
])

const tab = ref<'css' | 'config'>('css')
const pane = computed(() => panes.value.find(entry => entry.key === tab.value) ?? panes.value[0]!)

/** Copy and Download both act on the file the tab is showing. */
function copyFile() {
  copyFileToClipboard(pane.value.code)
  track('Theme Exported', { type: pane.value.key === 'css' ? 'CSS' : 'Config', action: 'Copy' })
}

function downloadFile() {
  const url = URL.createObjectURL(new Blob([pane.value.code], { type: 'text/plain;charset=utf-8' }))
  const anchor = Object.assign(document.createElement('a'), { href: url, download: pane.value.filename })
  // in the document for the click, and the URL outlives the handler: Safari
  // starts the download after the click returns
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
  track('Theme Exported', { type: pane.value.key === 'css' ? 'CSS' : 'Config', action: 'Download' })
}

// framework too: only one half of the export is framework-agnostic
watch([open, framework], async ([isOpen]) => {
  css.value = isOpen ? await exportCSS() : ''
  config.value = isOpen ? await exportConfig() : ''
})

// The theme can't change while the modal covers the studio, so the link is
// built once per open.
watch(open, async (isOpen) => {
  link.value = isOpen ? await buildLink() : ''
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Export theme"
    :ui="{ content: 'max-w-4xl', body: 'p-0 sm:p-0' }"
  >
    <template #actions>
      <FrameworkTabs class="w-40 ms-auto me-8" />
    </template>

    <template #body>
      <div class="flex flex-col gap-2 p-4 sm:px-6 bg-elevated/50 border-b border-default">
        <div class="flex items-center gap-2">
          <UIcon :name="studioIcons.link" class="size-4 shrink-0 text-dimmed" />
          <span class="text-sm font-semibold text-highlighted">Share link</span>
          <span class="text-sm text-muted truncate hidden sm:block">Opens the editor with this theme applied</span>
        </div>

        <div class="flex items-center gap-2">
          <UInput
            :model-value="link"
            readonly
            class="flex-1 min-w-0"
            :ui="{ base: 'font-mono text-xs py-2' }"
            aria-label="Link to this theme"
            @focus="($event.target as HTMLInputElement).select()"
          />

          <UButton
            :icon="linkCopied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
            label="Copy link"
            color="neutral"
            @click="copyThemeLink"
          />
        </div>
      </div>

      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <div class="flex items-center gap-2">
          <UButton
            v-for="entry in panes"
            :key="entry.key"
            color="neutral"
            variant="ghost"
            :active="tab === entry.key"
            active-variant="soft"
            :label="entry.filename"
            @click="tab = entry.key"
          >
            <template #leading>
              <ProseCodeIcon :filename="entry.filename" class="size-5 shrink-0" />
            </template>
          </UButton>

          <div class="ms-auto flex items-center gap-2">
            <UButton
              :icon="fileCopied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
              label="Copy"
              color="neutral"
              variant="outline"
              :ui="{ base: 'px-1.5 sm:px-2.5', label: 'hidden sm:inline-flex' }"
              @click="copyFile"
            />

            <UButton
              :icon="studioIcons.download"
              label="Download"
              color="neutral"
              variant="outline"
              class="hidden lg:inline-flex"
              @click="downloadFile"
            />
          </div>
        </div>

        <!-- A fixed pane height: the files and the highlighter both land after
             the modal paints, a box that sized to them would jump. -->
        <ProsePre
          :code="pane.code"
          :copy="false"
          :ui="{ root: 'my-0', base: 'h-96 whitespace-pre text-xs/5' }"
        >
          <!-- eslint-disable-next-line vue/no-v-html -- shiki output over our own generated files -->
          <code v-if="pane.html" v-html="pane.html" />
          <template v-else>
            {{ pane.code }}
          </template>
        </ProsePre>
      </div>
    </template>
  </UModal>
</template>
