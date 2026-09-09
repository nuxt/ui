<script setup lang="ts">
import { parseCode } from '../../utils/markdown'
import type { MarkdownDoc } from '../../utils/markdown'

/**
 * The theme as the files you would ship, for the home hero's right half:
 * main.css and the config, one tab each, regenerated as the theme changes
 * through the preset pills below, the header menu or the studio. The server
 * renders the stock theme highlighted; the client takes over after mount,
 * once the persisted theme is on.
 */
const { exportCSS, exportConfig, configLabel, currentDoc } = useTheme()
const { framework } = useFrameworks()

interface Pane {
  key: 'css' | 'config'
  filename: string
  doc: MarkdownDoc
}

async function generate(): Promise<Pane[]> {
  // explicit: the stock theme is a pair of files too, not an empty diff
  const [css, config] = await Promise.all([exportCSS({ explicit: true }), exportConfig({ explicit: true })])
  const [cssDoc, configDoc] = await Promise.all([parseCode(css, 'css'), parseCode(config, 'ts')])

  return [
    { key: 'css', filename: 'main.css', doc: cssDoc },
    { key: 'config', filename: configLabel.value, doc: configDoc }
  ]
}

// The payload carries the stock theme's files; the persisted theme is
// client-only, so the first regeneration waits for mount.
const { data: panes } = await useAsyncData('home-theme-code', generate, { default: () => [] as Pane[] })

// the last change wins: a result for a theme that has moved on is dropped
let version = 0
async function regenerate() {
  const current = ++version
  const result = await generate()
  if (current === version) {
    panes.value = result
  }
}

onMounted(regenerate)
// the doc reads every theme ref, the framework picks the config file
watch(() => [JSON.stringify(currentDoc()), framework.value], regenerate)

const tab = ref<Pane['key']>('css')
const pane = computed(() => panes.value.find(entry => entry.key === tab.value) ?? panes.value[0])
</script>

<template>
  <!-- min-w-0: the controls row would otherwise hold the grid column open at
       its own min-content width and push the hero past the viewport -->
  <div class="hidden lg:flex flex-col gap-2 min-w-0 rounded-xl bg-elevated/50 px-2.5 py-2">
    <div class="flex items-center gap-1 ps-1 pe-2 pt-0.5">
      <UButton
        v-for="entry in panes"
        :key="entry.key"
        color="neutral"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :label="entry.filename"
        :active="tab === entry.key"
        :class="tab === entry.key ? 'bg-accented/75' : ''"
        @click="tab = entry.key"
      >
        <template #leading>
          <ProseCodeIcon :filename="entry.filename" class="size-4 shrink-0" />
        </template>
      </UButton>
    </div>

    <!-- A fixed pane: the files change length with the theme, the hero must not.
         The tabs above are its header, so the filename stays off the block. -->
    <CodePane
      v-if="pane"
      :doc="pane.doc"
      :ui="{ root: 'my-0', base: 'h-74 whitespace-pre text-xs/5 bg-default/50 border-0 rounded-lg shadow-sm backdrop-blur-xs' }"
    />

    <HomeThemePresets />
  </div>
</template>
