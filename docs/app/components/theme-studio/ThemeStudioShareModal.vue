<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import type { HighlighterGeneric } from 'shiki'
import { encodeThemeDoc, isSameDoc } from '../../utils/theme/link'

/**
 * The export modal: a link that carries the whole theme, then the two
 * generated files, highlighted, with copy buttons.
 */
const open = defineModel<boolean>('open', { default: false })

const appConfig = useAppConfig()
const { exportCSS, exportConfig, configLabel, currentDoc } = useTheme()
const { presets, activePreset } = useThemeStudio()
const { framework } = useFrameworks()
const { track } = useAnalytics()

const { copy, copied } = useClipboard()

const css = ref('')
const config = ref('')
const link = ref('')

/** The URL the studio reads back on load, theme and all. */
async function buildLink() {
  const doc = currentDoc()
  const preset = presets.find(entry => entry.id === activePreset.value)
  // the id only when nothing has been touched since, so a tweak still travels whole
  const payload = preset && isSameDoc(doc, preset.doc) ? { version: 1 as const, preset: preset.id } : doc
  return `${window.location.origin}${window.location.pathname}#${await encodeThemeDoc(payload)}`
}

function copyThemeLink() {
  copy(link.value)
  track('Theme Exported', { type: 'Link' })
}

const colorMode = useColorMode()

// Ready on first open; the panes fall back to a plain <pre> for the frame
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

/** ProsePre owns the copy button; the capture only adds the analytics event. */
function onCopyCapture(key: 'css' | 'config', event: Event) {
  if ((event.target as HTMLElement).closest('button')) {
    track('Theme Exported', { type: key === 'css' ? 'CSS' : 'Config' })
  }
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
    :ui="{ content: 'max-w-4xl' }"
  >
    <template #actions>
      <FrameworkTabs class="w-40" />
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField description="Opens the editor with this theme applied." :ui="{ container: 'mt-1' }">
          <UFieldGroup class="w-full">
            <UInput
              :model-value="link"
              readonly
              class="flex-1"
              :ui="{ base: 'font-mono text-xs' }"
              aria-label="Link to this theme"
              @focus="($event.target as HTMLInputElement).select()"
            />

            <UButton
              :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
              :color="copied ? 'primary' : 'neutral'"
              variant="subtle"
              :aria-label="copied ? 'Link copied' : 'Copy link to this theme'"
              @click="copyThemeLink"
            />
          </UFieldGroup>
        </UFormField>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div v-for="pane in panes" :key="pane.key" class="min-w-0">
            <!-- A fixed pane height: the files and the highlighter both land
                 after the modal paints, a box that sized to them would jump. -->
            <ProsePre
              :filename="pane.filename"
              :code="pane.code"
              :ui="{ root: 'my-0', base: 'h-96 whitespace-pre text-xs/5' }"
              @click.capture="onCopyCapture(pane.key, $event)"
            >
              <!-- eslint-disable-next-line vue/no-v-html -- shiki output over our own generated files -->
              <code v-if="pane.html" v-html="pane.html" />
              <template v-else>
                {{ pane.code }}
              </template>
            </ProsePre>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
