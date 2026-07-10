<script setup lang="ts">
const { copy: copyCSS, copied: copiedCSS } = useClipboard()
const { copy: copyConfig, copied: copiedConfig } = useClipboard()
const { track } = useAnalytics()

const { exportCSS, exportConfig, configLabel, hasCSSChanges, hasConfigChanges } = useTheme()

const open = ref(false)

const css = ref('')
const config = ref('')

watch(open, (isOpen) => {
  if (isOpen) {
    css.value = exportCSS()
    config.value = exportConfig()
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Export theme"
    description="Copy only what you changed — everything else stays inherited from Nuxt UI defaults."
    :ui="{ content: 'max-w-3xl' }"
  >
    <UButton
      label="Export"
      icon="i-lucide-download"
      color="neutral"
      variant="subtle"
      block
    />

    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          v-if="!hasCSSChanges && !hasConfigChanges"
          title="No changes yet"
          description="You are on the default theme. Tweak something and come back."
          icon="i-lucide-info"
          color="neutral"
          variant="subtle"
        />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-semibold text-muted font-mono">
                main.css
              </p>

              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                :icon="copiedCSS ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                aria-label="Copy CSS"
                @click="copyCSS(css); track('Theme Exported', { type: 'CSS' })"
              />
            </div>

            <pre class="text-xs font-mono bg-muted rounded-md p-3 overflow-x-auto max-h-96 whitespace-pre">{{ css }}</pre>
          </div>

          <div class="flex flex-col gap-2 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-semibold text-muted font-mono">
                {{ configLabel }}
              </p>

              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                :icon="copiedConfig ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                aria-label="Copy config"
                @click="copyConfig(config); track('Theme Exported', { type: 'Config' })"
              />
            </div>

            <pre class="text-xs font-mono bg-muted rounded-md p-3 overflow-x-auto max-h-96 whitespace-pre">{{ config }}</pre>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
