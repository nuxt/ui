<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { encodeThemeDoc } from '../../utils/theme/link'
import { parseCode } from '../../utils/markdown'
import type { MarkdownDoc } from '../../utils/markdown'

/**
 * The export modal: a link that carries the whole theme, then the generated
 * files, one tab each, to copy or download.
 */
const open = defineModel<boolean>('open', { default: false })

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()
const { exportCSS, exportConfig, exportApp, configLabel, appLabel, currentDoc } = useTheme()
const { presets, activePreset, dirty } = useThemeStudio()
const { framework } = useFrameworks()
const { track } = useAnalytics()

// One clipboard per action, or copying a file would light up the link button.
const { copy: copyToClipboard, copied: linkCopied } = useClipboard()
const { copy: copyFileToClipboard, copied: fileCopied } = useClipboard()

const css = ref('')
const config = ref('')
const app = ref('')
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

// the pane shows the plain file for the frame the highlighter takes to arrive
const docs = shallowRef<Partial<Record<'css' | 'config' | 'app', MarkdownDoc>>>({})

// the app.vue/App.vue snippet only exists when a default variant/size/color
// is set, most exports never touch one
const panes = computed(() => [
  { key: 'css' as const, filename: 'main.css', code: css.value },
  { key: 'config' as const, filename: configLabel.value, code: config.value },
  ...(app.value ? [{ key: 'app' as const, filename: appLabel.value, code: app.value }] : [])
])

const tab = ref<'css' | 'config' | 'app'>('css')
const pane = computed(() => panes.value.find(entry => entry.key === tab.value) ?? panes.value[0]!)

const EXPORT_TYPE_LABELS = { css: 'CSS', config: 'Config', app: 'App' } as const

/** Copy and Download both act on the file the tab is showing. */
function copyFile() {
  copyFileToClipboard(pane.value.code)
  track('Theme Exported', { type: EXPORT_TYPE_LABELS[pane.value.key], action: 'Copy' })
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
  track('Theme Exported', { type: EXPORT_TYPE_LABELS[pane.value.key], action: 'Download' })
}

// framework too: only one half of the export is framework-agnostic. The last
// change wins: a run for a framework that has moved on is dropped.
let version = 0
watch([open, framework], async ([isOpen]) => {
  const current = ++version
  css.value = ''
  config.value = ''
  app.value = ''
  docs.value = {}

  if (!isOpen) {
    return
  }

  const [nextCss, nextConfig, nextApp] = await Promise.all([exportCSS(), exportConfig(), exportApp()])
  const [cssDoc, configDoc, appDoc] = await Promise.all([
    parseCode(nextCss, 'css'),
    parseCode(nextConfig, 'ts'),
    nextApp ? parseCode(nextApp, 'vue') : undefined
  ])
  if (current !== version) return

  css.value = nextCss
  config.value = nextConfig
  app.value = nextApp
  docs.value = { css: cssDoc, config: configDoc, ...(appDoc ? { app: appDoc } : {}) }
  // the app.vue/App.vue tab only exists conditionally, fall back to css if it was selected and vanished
  if (tab.value === 'app' && !nextApp) tab.value = 'css'
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
      <div class="flex flex-col gap-2 p-4 sm:px-6 bg-tint border-b border-default">
        <div class="flex items-center gap-2">
          <UIcon :name="studioIcons.link" class="size-4 shrink-0 text-faint" />
          <span class="text-sm font-semibold text-strong">Share link</span>
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
              :disabled="!pane.code"
              @click="copyFile"
            />

            <UButton
              :icon="studioIcons.download"
              label="Download"
              color="neutral"
              variant="outline"
              class="hidden lg:inline-flex"
              :disabled="!pane.code"
              @click="downloadFile"
            />
          </div>
        </div>

        <!-- A fixed pane height: the files and the highlighter both land after
             the modal paints, a box that sized to them would jump. -->
        <CodePane
          v-if="docs[pane.key]"
          :doc="docs[pane.key]!"
          :ui="{ root: 'my-0', base: 'h-96 whitespace-pre text-xs/5' }"
        />
        <ProsePre
          v-else
          :code="pane.code"
          :copy="false"
          :ui="{ root: 'my-0', base: 'h-96 whitespace-pre text-xs/5' }"
        >
          {{ pane.code }}
        </ProsePre>
      </div>
    </template>
  </UModal>
</template>
