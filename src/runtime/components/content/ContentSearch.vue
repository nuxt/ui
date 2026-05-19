<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { VNode } from 'vue'
import type { ContentNavigationItem } from '@nuxt/content'
import type { AppConfig } from '@nuxt/schema'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import theme from '#build/ui/content/content-search'
import type { ButtonProps, LinkProps, ModalProps, CommandPaletteProps, CommandPaletteSlots, CommandPaletteGroup, CommandPaletteItem, IconProps, LinkPropsKeys } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ContentSearch = ComponentConfig<typeof theme, AppConfig, 'contentSearch'>

export interface ContentSearchLink extends Omit<LinkProps, 'custom'> {
  label?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  children?: ContentSearchLink[]
}

export interface ContentSearchFile {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
}

export interface ContentSearchResult extends ContentSearchFile {
  snippets?: {
    title?: string
    content?: string
  }
}

export interface ContentSearchOptions {
  limit?: number
  snippet?: {
    columns?: ('title' | 'content')[]
    around?: number
  }
}

export type ContentSearchStatus = 'idle' | 'loading' | 'ready' | 'error'

export type ContentSearchFn = (query: string, opts?: ContentSearchOptions) => Promise<ContentSearchResult[]>

export interface ContentSearchItem extends Omit<LinkProps, 'custom'>, CommandPaletteItem {
  level?: number
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
}

export interface ContentSearchProps<T extends ContentSearchLink = ContentSearchLink> extends Pick<ModalProps, 'title' | 'description' | 'overlay' | 'transition' | 'content' | 'dismissible' | 'fullscreen' | 'modal' | 'portal'>, Pick<CommandPaletteProps<CommandPaletteGroup<ContentSearchItem>, ContentSearchItem>, 'icon' | 'placeholder' | 'autofocus' | 'loading' | 'loadingIcon' | 'closeIcon' | 'groups'> {
  /**
   * @defaultValue 'md'
   */
  size?: ContentSearch['variants']['size']
  /**
   * Display a close button in the input (useful when inside a Modal for example).
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @emits 'update:open'
   * @defaultValue true
   */
  close?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * Keyboard shortcut to open the search (used by [`defineShortcuts`](https://ui.nuxt.com/docs/composables/define-shortcuts))
   * @defaultValue 'meta_k'
   */
  shortcut?: string
  /** Links group displayed as the first group in the command palette. */
  links?: T[]
  navigation?: ContentNavigationItem[]
  files?: ContentSearchFile[]
  /**
   * Options for [useFuse](https://vueuse.org/integrations/useFuse) passed to the [CommandPalette](https://ui.nuxt.com/docs/components/command-palette).
   * @defaultValue {
      fuseOptions: {
        ignoreLocation: true,
        includeMatches: true,
        useTokenSearch: true,
        threshold: 0.1,
        keys: ['label', 'description', 'suffix']
      },
      resultLimit: 12,
      matchAllWhenSearchEmpty: true
    }
   */
  fuse?: UseFuseOptions<T>
  /**
   * Async search function (e.g. from [`useSearchCollection`](https://content.nuxt.com/docs/utils/use-search-collection)).
   * When provided, ContentSearch calls it on each keystroke and uses the results instead of Fuse.
   * Results are mapped, sanitized, and grouped by navigation internally.
   */
  search?: ContentSearchFn
  /**
   * Status of the async search index (e.g. from `useSearchCollection`).
   * When the status transitions to `'ready'`, the search is automatically re-triggered if there's a pending term.
   */
  searchStatus?: ContentSearchStatus
  /**
   * Delay (in milliseconds) before the search is triggered (debounced).
   * Keeps the input responsive by only running the search after typing settles.
   * Set to `0` to disable.
   * @defaultValue 100
   */
  searchDelay?: number
  /**
   * When `true`, the theme command will be added to the groups.
   * @defaultValue true
   */
  colorMode?: boolean
  class?: any
  ui?: ContentSearch['slots'] & CommandPaletteProps<CommandPaletteGroup<ContentSearchItem>, ContentSearchItem>['ui']
}

export type ContentSearchSlots = CommandPaletteSlots<ContentSearchItem> & {
  content?(props: { close: () => void }): VNode[]
}

</script>

<script setup lang="ts" generic="T extends ContentSearchLink">
import { computed, shallowRef, useTemplateRef, watch } from 'vue'
import { defu } from 'defu'
import { reactivePick, refDebounced } from '@vueuse/core'
import { useAppConfig, useColorMode, defineShortcuts } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { useForwardProps } from '../../composables/useForwardProps'
import { useContentSearch } from '../../composables/useContentSearch'
import { useLocale } from '../../composables/useLocale'
import { omit, transformUI } from '../../utils'
import { tv } from '../../utils/tv'
import UModal from '../Modal.vue'
import UCommandPalette from '../CommandPalette.vue'

const _props = withDefaults(defineProps<ContentSearchProps<T>>(), {
  shortcut: 'meta_k',
  colorMode: true,
  close: true,
  fullscreen: false,
  searchDelay: 100
})
const slots = defineSlots<ContentSearchSlots>()

const props = useComponentProps<ContentSearchProps<T>>('contentSearch', _props)

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const { t } = useLocale()
const { open, mapNavigationItems, mapLinks, mapSearchResults, postFilter } = useContentSearch()
// eslint-disable-next-line vue/no-dupe-keys
const colorMode = useColorMode()
const appConfig = useAppConfig() as ContentSearch['AppConfig']

const commandPaletteProps = useForwardProps(reactivePick(props, 'size', 'icon', 'placeholder', 'autofocus', 'loading', 'loadingIcon', 'close', 'closeIcon', 'searchDelay'))
const modalProps = useForwardProps(reactivePick(props, 'overlay', 'transition', 'content', 'dismissible', 'fullscreen', 'modal', 'portal'))

const getProxySlots = () => omit(slots, ['content'])

// eslint-disable-next-line vue/no-dupe-keys
const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    includeMatches: true,
    useTokenSearch: true
  },
  resultLimit: 12
} as UseFuseOptions<T>))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.contentSearch || {}) })({
  size: props.size,
  fullscreen: props.fullscreen
}))

const commandPaletteRef = useTemplateRef('commandPaletteRef')

const debouncedSearchTerm = refDebounced(searchTerm, () => props.searchDelay!)

const rawSearchResults = shallowRef<ContentSearchResult[]>([])
const searchResults = computed(() => mapSearchResults(rawSearchResults.value, props.navigation))

let searchRequestId = 0

async function runSearch(term: string) {
  // Always bump the request id, even on the early-return path — otherwise an
  // in-flight prior request could resolve after we clear results and overwrite
  // them again (e.g. user types "foo" then backspaces before "foo" settles).
  const requestId = ++searchRequestId

  if (!props.search || !term) {
    rawSearchResults.value = []
    return
  }
  try {
    const results = await props.search(term, {
      limit: (fuse.value as UseFuseOptions<T>).resultLimit,
      snippet: { columns: ['title', 'content'], around: 20 }
    })
    // Discard stale responses: a newer request started before this one resolved.
    if (requestId !== searchRequestId) return
    rawSearchResults.value = results
  } catch (err) {
    if (requestId !== searchRequestId) return
    console.error('[ContentSearch] search failed:', err)
    rawSearchResults.value = []
  }
}

watch(debouncedSearchTerm, runSearch)

watch(() => props.search, () => {
  if (debouncedSearchTerm.value) {
    runSearch(debouncedSearchTerm.value)
  }
})

watch(() => props.searchStatus, (status) => {
  if (status === 'ready' && debouncedSearchTerm.value) {
    runSearch(debouncedSearchTerm.value)
  }
})

const linksGroup = computed(() => {
  if (!props.links?.length) {
    return null
  }

  return { id: 'links', label: t('contentSearch.links'), items: mapLinks(props.links) }
})

const searchGroups = computed(() => {
  if (!searchTerm.value || !searchResults.value.length) return []

  return [{ id: 'search', label: t('contentSearch.search'), items: searchResults.value, ignoreFilter: true }]
})

const navigationGroups = computed(() => {
  if (!props.navigation?.length) {
    return []
  }

  if (props.navigation.some(link => !!link.children?.length)) {
    return props.navigation.map(group => ({
      id: group.path,
      label: group.title,
      items: mapNavigationItems(group.children || [], props.files || []),
      postFilter
    }))
  } else {
    return [{ id: 'docs', items: mapNavigationItems(props.navigation, props.files || []), postFilter }]
  }
})

const themeGroup = computed(() => {
  if (!props.colorMode || colorMode?.forced) {
    return null
  }

  return {
    id: 'theme',
    label: t('contentSearch.theme'),
    items: [{
      label: t('colorMode.system'),
      icon: appConfig.ui.icons.system,
      active: colorMode.preference === 'system',
      onSelect: () => {
        colorMode.preference = 'system'
      }
    }, {
      label: t('colorMode.light'),
      icon: appConfig.ui.icons.light,
      active: colorMode.preference === 'light',
      onSelect: () => {
        colorMode.preference = 'light'
      }
    }, {
      label: t('colorMode.dark'),
      icon: appConfig.ui.icons.dark,
      active: colorMode.preference === 'dark',
      onSelect: () => {
        colorMode.preference = 'dark'
      }
    }]
  }
})

const groups = computed(() => {
  const groups = []

  if (linksGroup.value) {
    groups.push(linksGroup.value)
  }

  if (props.search) {
    groups.push(...searchGroups.value)
  } else {
    groups.push(...navigationGroups.value)
  }

  groups.push(...(props.groups || []))

  if (themeGroup.value) {
    groups.push(themeGroup.value)
  }

  return groups
})

function onSelect(item: ContentSearchItem) {
  if (item.disabled) {
    return
  }

  // Close modal on select
  open.value = false
  // Reset search term on select
  searchTerm.value = ''
}

defineShortcuts({
  [props.shortcut!]: {
    usingInput: true,
    handler: () => open.value = !open.value
  }
})

defineExpose({
  commandPaletteRef
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="props.title || t('contentSearch.title')"
    :description="props.description || t('contentSearch.description')"
    v-bind="modalProps"
    data-slot="modal"
    :class="ui.modal({ class: [props.ui?.modal, props.class] })"
  >
    <template #content="contentData">
      <slot name="content" v-bind="contentData">
        <UCommandPalette
          ref="commandPaletteRef"
          v-model:search-term="searchTerm"
          v-bind="commandPaletteProps"
          :groups="groups"
          :fuse="fuse"
          :input="{ fixed: true }"
          :ui="transformUI(omit(ui, ['modal']), props.ui)"
          @update:model-value="onSelect"
          @update:open="open = $event"
        >
          <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </UCommandPalette>
      </slot>
    </template>
  </UModal>
</template>
