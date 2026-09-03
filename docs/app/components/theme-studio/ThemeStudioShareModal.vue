<script setup lang="ts">
import type { HighlighterGeneric } from 'shiki'

/** The export modal: the two generated files, highlighted, with copy buttons. */
const open = defineModel<boolean>('open', { default: false })

const { exportCSS, exportConfig, configLabel } = useTheme()
const { track } = useAnalytics()

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
