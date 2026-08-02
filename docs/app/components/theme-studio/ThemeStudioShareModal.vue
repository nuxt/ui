<script setup lang="ts">
import { importTheme, isDefaultTheme } from '../../utils/theme-engine'

/**
 * The shared import/export modal, plain toolbar buttons open it in either
 * mode. Export shows the generated files with copy buttons; import parses
 * a paste of the same two files back into editable settings.
 */
const open = defineModel<boolean>('open', { default: false })
const mode = defineModel<'import' | 'export'>('mode', { default: 'export' })

const { applyDoc, clearActivePreset } = useThemeStudio()
const { exportCSS, exportConfig, configLabel, hasCSSChanges, hasConfigChanges } = useTheme()
const { track } = useAnalytics()
const { copy: copyCSS, copied: copiedCSS } = useClipboard()
const { copy: copyConfig, copied: copiedConfig } = useClipboard()

const css = ref('')
const config = ref('')
const skipped = ref<string[]>([])
const imported = ref(false)
const empty = ref(false)

watch([open, mode], () => {
  skipped.value = []
  imported.value = false
  empty.value = false
  // Export fills the panes with the generated files; import starts blank.
  css.value = mode.value === 'export' && open.value ? exportCSS() : ''
  config.value = mode.value === 'export' && open.value ? exportConfig() : ''
})

function runImport() {
  const result = importTheme({ css: css.value, config: config.value })
  skipped.value = result.skipped
  empty.value = isDefaultTheme(result.doc)
  imported.value = false

  if (!empty.value) {
    applyDoc(result.doc)
    // an imported doc replaces the whole theme, the old preset is no
    // longer the baseline the dirty indicators should measure against
    clearActivePreset()
    imported.value = true
    track('Theme Imported', { skipped: result.skipped.length })
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="mode === 'export' ? 'Export theme' : 'Import theme'"
    :description="mode === 'export'
      ? 'Copy only what you changed, everything else stays inherited from Nuxt UI defaults.'
      : 'Paste an exported main.css and/or app.config.ts, the studio parses it back into editable settings.'"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          v-if="mode === 'export' && !hasCSSChanges && !hasConfigChanges"
          title="No changes yet"
          description="You are on the default theme. Tweak something and come back."
          icon="i-lucide-info"
          color="neutral"
          variant="subtle"
        />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div v-for="pane in (['css', 'config'] as const)" :key="pane" class="flex flex-col gap-2 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-semibold text-muted font-mono">
                {{ pane === 'css' ? 'main.css' : configLabel }}
              </p>

              <UButton
                v-if="mode === 'export'"
                size="xs"
                color="neutral"
                variant="ghost"
                :icon="(pane === 'css' ? copiedCSS : copiedConfig) ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                :aria-label="pane === 'css' ? 'Copy CSS' : 'Copy config'"
                @click="pane === 'css'
                  ? (copyCSS(css), track('Theme Exported', { type: 'CSS' }))
                  : (copyConfig(config), track('Theme Exported', { type: 'Config' }))"
              />
            </div>

            <pre v-if="mode === 'export'" class="text-xs font-mono bg-muted rounded-md p-3 overflow-x-auto max-h-96 whitespace-pre">{{ pane === 'css' ? css : config }}</pre>

            <UTextarea
              v-else-if="pane === 'css'"
              v-model="css"
              :rows="10"
              placeholder="@import &quot;tailwindcss&quot;;&#10;@import &quot;@nuxt/ui&quot;;&#10;…"
              class="w-full font-mono"
              variant="subtle"
              :ui="{ base: 'text-xs' }"
            />

            <UTextarea
              v-else
              v-model="config"
              :rows="10"
              variant="subtle"
              placeholder="export default defineAppConfig({&#10;  ui: { … }&#10;})"
              class="w-full font-mono"
              :ui="{ base: 'text-xs' }"
            />
          </div>
        </div>

        <UAlert
          v-if="imported"
          title="Theme imported"
          :description="skipped.length ? 'Applied, a few lines were outside the theme schema and were skipped (listed below).' : 'Applied. Every line was understood.'"
          icon="i-lucide-check"
          color="success"
          variant="subtle"
        />

        <UAlert
          v-else-if="empty"
          title="Nothing to import"
          description="No theme settings were recognized in the pasted content."
          icon="i-lucide-info"
          color="warning"
          variant="subtle"
        />

        <div v-if="skipped.length" class="flex flex-col gap-1">
          <p class="text-xs font-semibold text-muted">
            Skipped
          </p>
          <pre class="text-xs font-mono bg-muted rounded-md p-3 overflow-x-auto max-h-40 whitespace-pre">{{ skipped.join('\n') }}</pre>
        </div>
      </div>
    </template>

    <template v-if="mode === 'import'" #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          label="Cancel"
          color="neutral"
          variant="ghost"
          @click="open = false"
        />
        <UButton
          label="Import"
          icon="i-lucide-upload"
          color="neutral"
          :disabled="!css.trim() && !config.trim()"
          @click="runImport"
        />
      </div>
    </template>
  </UModal>
</template>
