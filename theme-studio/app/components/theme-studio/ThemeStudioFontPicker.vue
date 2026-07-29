<script setup lang="ts">
/**
 * The font family picker: the curated families up front, with a search box
 * over the full Google Fonts catalog (fetched lazily on first open). Rows
 * render themselves in their own face — each result batch loads its preview
 * faces, debounced so keystrokes don't fan out into stylesheet requests.
 */
import { watchDebounced } from '@vueuse/core'

const props = defineProps<{
  /** The curated families offered before the user searches. */
  curated: readonly string[]
  /** The value that wears the (Default) tag. */
  defaultValue: string
  /** Prepend an "Inherit base" option (the headings row). */
  inherit?: boolean
  icon?: string
  ariaLabel?: string
}>()

const model = defineModel<string>({ required: true })

const { status, load, search } = useGoogleFonts()

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

interface FontItem {
  label: string
  value: string
  category?: string
}

const items = computed<FontItem[]>(() => {
  if (query.value.trim()) {
    return results.value.map(font => ({ label: font.name, value: font.name, category: font.category }))
  }
  const curated: FontItem[] = props.curated.map(name => ({ label: name, value: name }))
  // A searched pick isn't in the curated list — pin it on top so the
  // selection stays visible (and deselectable) on reopen.
  if (model.value !== 'inherit' && !props.curated.includes(model.value)) {
    curated.unshift({ label: model.value, value: model.value })
  }
  return props.inherit ? [{ label: 'Inherit base', value: 'inherit' }, ...curated] : curated
})

watchDebounced(results, value => loadFontPreviews(value.map(font => font.name)), { debounce: 250 })

const emptyLabel = computed(() => {
  if (status.value === 'loading') return 'Loading the Google Fonts catalog…'
  if (status.value === 'error') return 'Couldn’t load the Google Fonts catalog'
  return 'No fonts match your search'
})
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'start' }">
    <UButton
      color="neutral"
      variant="subtle"
      size="sm"
      block
      :icon="icon"
      trailing-icon="i-lucide-chevron-down"
      :ui="{ label: 'flex-1 text-left truncate' }"
      :aria-label="ariaLabel"
    >
      <span
        class="truncate"
        :style="model === 'inherit' ? undefined : { fontFamily: `'${model}', sans-serif` }"
      >{{ model === 'inherit' ? 'Inherit base' : model }}<span v-if="model === defaultValue" class="text-dimmed font-normal">&nbsp;(Default)</span></span>
    </UButton>

    <template #content>
      <div class="w-72 flex flex-col">
        <UInput
          v-model="query"
          icon="i-lucide-search"
          placeholder="Search Google Fonts…"
          variant="none"
          autofocus
          class="border-b border-default"
          aria-label="Search Google Fonts"
        />

        <UListbox
          v-if="items.length"
          v-model="model"
          :items="items"
          value-key="value"
          :ui="{ root: 'ring-0 rounded-md', content: 'max-h-80' }"
          @update:model-value="open = false"
        >
          <template #item-label="{ item }">
            <span :style="item.value === 'inherit' ? undefined : { fontFamily: `'${item.value}', sans-serif` }">{{ item.label }}</span><span v-if="item.value === defaultValue" class="text-dimmed">&nbsp;(Default)</span>
          </template>

          <template #item-description="{ item }">
            <span v-if="item.value !== 'inherit'" class="flex items-center gap-2 min-w-0">
              <span
                class="text-xs text-muted truncate"
                :style="{ fontFamily: `'${item.value}', sans-serif` }"
              >Grumpy wizards make toxic brew</span>
              <span v-if="item.category" class="text-xs text-dimmed shrink-0 ms-auto">{{ item.category }}</span>
            </span>
          </template>
        </UListbox>

        <p v-else class="px-3 py-6 text-xs text-muted text-center select-none">
          {{ emptyLabel }}
        </p>
      </div>
    </template>
  </UPopover>
</template>
