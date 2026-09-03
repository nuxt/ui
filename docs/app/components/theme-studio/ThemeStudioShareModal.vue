<script setup lang="ts">
import type { HighlighterGeneric } from 'shiki'
import { useClipboard } from '@vueuse/core'
import { encodeThemeDoc, THEME_LINK_PREFIX } from '../../utils/theme/link'

/** The export modal: a shareable link, then the two generated files. */
const open = defineModel<boolean>('open', { default: false })

const appConfig = useAppConfig()
const { exportCSS, exportConfig, configLabel, currentDoc } = useTheme()
const { track } = useAnalytics()

const link = ref('')
const { copy: copyLinkValue, copied: linkCopied } = useClipboard()

function copyLink() {
  copyLinkValue(link.value)
  track('Theme Exported', { type: 'Link' })
}

const css = ref('')
const config = ref('')

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

watch(open, async (isOpen) => {
  css.value = isOpen ? await exportCSS() : ''
  config.value = isOpen ? await exportConfig() : ''
  link.value = isOpen ? `${window.location.origin}${window.location.pathname}${THEME_LINK_PREFIX}${encodeThemeDoc(currentDoc())}` : ''
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Export theme"
    :ui="{ content: 'max-w-5xl' }"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Link" description="Opens the studio with this theme applied.">
          <UInput
            :model-value="link"
            readonly
            class="w-full"
            :ui="{ base: 'font-mono text-xs pe-8' }"
            aria-label="Shareable theme link"
            @focus="($event.target as HTMLInputElement).select()"
          >
            <template #trailing>
              <UTooltip :text="linkCopied ? 'Copied' : 'Copy link'">
                <UButton
                  :icon="linkCopied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
                  :color="linkCopied ? 'success' : 'neutral'"
                  variant="link"
                  size="sm"
                  :aria-label="linkCopied ? 'Link copied' : 'Copy link'"
                  @click="copyLink"
                />
              </UTooltip>
            </template>
          </UInput>
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
