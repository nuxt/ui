<script setup lang="ts">
/**
 * A font family picker: the curated shortlist grouped by category up front,
 * with a search box over the full Google Fonts catalog (fetched lazily on
 * first open). Rows render themselves in their own face, and each result
 * batch loads its preview faces, debounced so keystrokes don't fan out into
 * stylesheet requests.
 *
 * Every instance offers all three categories. The stacks are independent, so
 * the slot a picker fills says nothing about which face belongs in it.
 */
import { watchDebounced } from '@vueuse/core'
import { loadFontPreviews, keepPanels } from '../../utils/theme/studio'
import type { FontCategory } from '../../utils/theme/studio'

const props = defineProps<{
  /** The shortlist offered before the user searches. */
  curated: Array<{ name: string, category: FontCategory }>
  /** The value that wears the (Default) tag. */
  defaultValue?: string
  /** Prepend an "Inherit" option, for the stacks that may follow the body. */
  inherit?: boolean
  ariaLabel?: string
}>()

const model = defineModel<string>({ required: true })

const { status, load, search } = useGoogleFonts()
// the studio chrome skins to the applied pack, the search glyph included
const appConfig = useAppConfig()

const open = ref(false)
const query = ref('')

// A stale query would flash old results on reopen; the catalog fetch only
// starts once someone actually reaches for the picker.
watch(open, (value) => {
  if (value) {
    query.value = ''
    load()
  }
})

const results = computed(() => open.value ? search(query.value) : [])

/**
 * The metadata endpoint reports `Sans Serif` / `Serif` / `Monospace` /
 * `Display` / `Handwriting`, the developer API the same in lowercase.
 */
function categoryOf(raw: string): FontCategory {
  const category = raw.toLowerCase()
  if (category.startsWith('mono')) return 'Mono'
  if (category === 'serif') return 'Serif'
  return 'Sans'
}

type FontItem = { label: string, value?: string, type?: 'label' }

/** One group per category, each led by its own label row. */
function group(entries: Array<{ name: string, category: FontCategory }>): FontItem[][] {
  return (['Sans', 'Serif', 'Mono'] as const)
    .map(category => ({ category, entries: entries.filter(entry => entry.category === category) }))
    .filter(({ entries }) => entries.length)
    .map(({ category, entries }) => [
      { label: category, type: 'label' as const },
      ...entries.map(entry => ({ label: entry.name, value: entry.name }))
    ])
}

const items = computed<FontItem[][]>(() => {
  if (query.value.trim()) {
    return group(results.value.map(font => ({ name: font.name, category: categoryOf(font.category) })))
  }
  const curated = [...props.curated]
  // A searched pick isn't in the shortlist, pin it on top so the selection
  // stays visible (and deselectable) on reopen.
  if (model.value !== 'inherit' && !curated.some(entry => entry.name === model.value)) {
    curated.unshift({ name: model.value, category: 'Sans' })
  }
  return [
    ...(props.inherit ? [[{ label: 'Inherit', value: 'inherit' }]] : []),
    ...group(curated)
  ]
})

watchDebounced(results, value => loadFontPreviews(value.map(font => font.name)), { debounce: 250 })

const empty = computed(() => {
  if (status.value === 'loading') return 'Loading the Google Fonts catalog…'
  if (status.value === 'error') return 'Couldn’t load the Google Fonts catalog'
  return 'No fonts match your search'
})

/** Rows preview themselves; `inherit` has no face of its own to show. */
function faceOf(value?: string) {
  return !value || value === 'inherit' ? undefined : { fontFamily: `'${value}', sans-serif` }
}
</script>

<template>
  <USelectMenu
    v-model="model"
    v-model:open="open"
    v-model:search-term="query"
    :items="items"
    value-key="value"
    ignore-filter
    :content="{ onInteractOutside: keepPanels, sideOffset: 7 }"
    :search-input="{ placeholder: 'Search Google Fonts…', icon: appConfig.ui.icons.search }"
    :aria-label="ariaLabel"
    size="sm"
    class="w-full"
    :ui="{ content: 'w-(--reka-combobox-trigger-width)', trailingIcon: ['transition-transform duration-200', open && 'rotate-180'] }"
  >
    <!-- No inline face on the trigger: the panel already renders in the body
         font, so the name inherits it. -->
    <template #default>
      <span class="truncate">{{ model === 'inherit' ? 'Inherit' : model }}</span>
    </template>

    <template #item-label="{ item }">
      <span :style="faceOf(item.value)">{{ item.label }}</span><span v-if="item.value && item.value === defaultValue" class="text-dimmed">&nbsp;(Default)</span>
    </template>

    <template #item-description="{ item }">
      <span
        v-if="item.value && item.value !== 'inherit'"
        class="text-xs text-muted truncate"
        :style="faceOf(item.value)"
      >Grumpy wizards make toxic brew</span>
    </template>

    <template #empty>
      {{ empty }}
    </template>
  </USelectMenu>
</template>
