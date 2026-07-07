<script setup lang="ts">
import { importTheme, isDefaultTheme } from '../../utils/theme-engine'

const { applyDoc } = useThemeStudio()
const { track } = useAnalytics()

const open = ref(false)

const css = ref('')
const config = ref('')

const skipped = ref<string[]>([])
const imported = ref(false)
const empty = ref(false)

watch(open, () => {
  css.value = ''
  config.value = ''
  skipped.value = []
  imported.value = false
  empty.value = false
})

function runImport() {
  const result = importTheme({ css: css.value, config: config.value })
  skipped.value = result.skipped
  empty.value = isDefaultTheme(result.doc)
  imported.value = false

  if (!empty.value) {
    applyDoc(result.doc)
    imported.value = true
    track('Theme Imported', { skipped: result.skipped.length })
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Import theme"
    description="Paste an exported main.css and/or app.config.ts — the studio parses it back into editable settings."
    :ui="{ content: 'max-w-3xl' }"
  >
    <UTooltip text="Import theme">
      <UButton
        icon="i-lucide-upload"
        color="neutral"
        variant="subtle"
        size="sm"
        block
        aria-label="Import theme"
      />
    </UTooltip>

    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2 min-w-0">
            <p class="text-xs font-semibold text-muted font-mono">
              main.css
            </p>

            <UTextarea
              v-model="css"
              :rows="10"
              placeholder="@import &quot;tailwindcss&quot;;&#10;@import &quot;@nuxt/ui&quot;;&#10;…"
              class="w-full font-mono"
              :ui="{ base: 'text-xs' }"
            />
          </div>

          <div class="flex flex-col gap-2 min-w-0">
            <p class="text-xs font-semibold text-muted font-mono">
              app.config.ts
            </p>

            <UTextarea
              v-model="config"
              :rows="10"
              placeholder="export default defineAppConfig({&#10;  ui: { … }&#10;})"
              class="w-full font-mono"
              :ui="{ base: 'text-xs' }"
            />
          </div>
        </div>

        <UAlert
          v-if="imported"
          title="Theme imported"
          :description="skipped.length ? 'Applied — a few lines were outside the theme schema and were skipped (listed below).' : 'Applied. Every line was understood.'"
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

    <template #footer>
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
