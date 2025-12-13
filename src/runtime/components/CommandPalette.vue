<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ListboxRootProps, ListboxRootEmits } from 'reka-ui'
import type { FuseResult } from 'fuse.js'
import type { AppConfig } from '@nuxt/schema'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import theme from '#build/ui/command-palette'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, ButtonProps, ChipProps, KbdProps, InputProps, LinkProps, IconProps, LinkPropsKeys } from '../types'
import type { GetItemKeys } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type CommandPalette = ComponentConfig<typeof theme, AppConfig, 'commandPalette'>

export interface CommandPaletteItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  prefix?: string
  label?: string
  suffix?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps
  chip?: ChipProps
  kbds?: KbdProps['value'][] | KbdProps[]
  active?: boolean
  loading?: boolean
  disabled?: boolean
  slot?: string
  /**
   * The placeholder to display when the item has children.
   */
  placeholder?: string
  children?: CommandPaletteItem[]
  onSelect?: (e: Event) => void
  class?: any
  ui?: Pick<CommandPalette['slots'], 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemLabelPrefix' | 'itemLabelBase' | 'itemLabelSuffix' | 'itemTrailing' | 'itemTrailingKbds' | 'itemTrailingKbdsSize' | 'itemTrailingHighlightedIcon' | 'itemTrailingIcon'>
  [key: string]: any
}

export interface CommandPaletteGroup<T extends CommandPaletteItem = CommandPaletteItem> {
  id: string
  label?: string
  slot?: string
  items?: T[]
  /**
   * Whether to filter group items with [useFuse](https://vueuse.org/integrations/useFuse).
   * When `true`, items will not be filtered which is useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue false
   */
  ignoreFilter?: boolean
  /** Filter group items after the search happened. */
  postFilter?: (searchTerm: string, items: T[]) => T[]
  /**
   * The icon displayed when an item is highlighted.
   * @IconifyIcon
   */
  highlightedIcon?: IconProps['name']
}

export interface CommandPaletteProps<G extends CommandPaletteGroup<T> = CommandPaletteGroup<any>, T extends CommandPaletteItem = CommandPaletteItem> extends Pick<ListboxRootProps, 'multiple' | 'disabled' | 'modelValue' | 'defaultValue' | 'highlightOnHover' | 'selectionBehavior'>, Pick<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed in the input.
   * @defaultValue appConfig.ui.icons.search
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The icon displayed on the right side of the input.
   * @defaultValue appConfig.ui.icons.search
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  selectedIcon?: IconProps['name']
  /**
   * The icon displayed when an item has children.
   * @defaultValue appConfig.ui.icons.chevronRight
   * @IconifyIcon
   */
  childrenIcon?: IconProps['name']
  /**
   * The placeholder text for the input.
   * @defaultValue t('commandPalette.placeholder')
   */
  placeholder?: InputProps['placeholder']
  /**
   * Automatically focus the input when component is mounted.
   * @defaultValue true
   */
  autofocus?: boolean
  /**
   * Display a close button in the input (useful when inside a Modal for example).
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @emits 'update:open'
   * @defaultValue false
   */
  close?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: IconProps['name']
  /**
   * Display a button to navigate back in history.
   * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
   * @defaultValue true
   */
  back?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the back button.
   * @defaultValue appConfig.ui.icons.arrowLeft
   * @IconifyIcon
   */
  backIcon?: IconProps['name']
  groups?: G[]
  /**
   * Options for [useFuse](https://vueuse.org/integrations/useFuse).
   * @defaultValue {
      fuseOptions: {
        ignoreLocation: true,
        threshold: 0.1,
        keys: ['label', 'suffix']
      },
      resultLimit: 12,
      matchAllWhenSearchEmpty: true
    }
   */
  fuse?: UseFuseOptions<T>
  /**
   * Enable virtualization for large lists.
   * Note: when enabled, all groups are flattened into a single list due to a limitation of Reka UI (https://github.com/unovue/reka-ui/issues/1885).
   * @defaultValue false
   */
  virtualize?: boolean | {
    /**
     * Number of items rendered outside the visible area
     * @defaultValue 12
     */
    overscan?: number
    /**
     * Estimated size (in px) of each item
     * @defaultValue 32
     */
    estimateSize?: number
  }
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  /**
   * The key used to get the description from the item.
   * @defaultValue 'description'
   */
  descriptionKey?: GetItemKeys<T>
  /**
   * Whether to preserve the order of groups as defined in the `groups` prop when filtering.
   * When `false`, groups will appear based on item matches.
   * @defaultValue false
   */
  preserveGroupOrder?: boolean
  class?: any
  ui?: CommandPalette['slots']
}

export type CommandPaletteEmits<T extends CommandPaletteItem = CommandPaletteItem> = ListboxRootEmits<T> & {
  'update:open': [value: boolean]
}

type SlotProps<T> = (props: { item: T, index: number, ui: CommandPalette['ui'] }) => any

export type CommandPaletteSlots<G extends CommandPaletteGroup<T> = CommandPaletteGroup<any>, T extends CommandPaletteItem = CommandPaletteItem> = {
  'empty'(props: { searchTerm?: string }): any
  'footer'(props: { ui: CommandPalette['ui'] }): any
  'back'(props: { ui: CommandPalette['ui'] }): any
  'close'(props: { ui: CommandPalette['ui'] }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-description': SlotProps<T>
  'item-trailing': SlotProps<T>
} & Record<string, SlotProps<G>> & Record<string, SlotProps<T>>

</script>

<script setup lang="ts" generic="G extends CommandPaletteGroup<T>, T extends CommandPaletteItem">
import { computed, ref, useTemplateRef, toRef } from 'vue'
import { ListboxRoot, ListboxFilter, ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxVirtualizer, ListboxItem, ListboxItemIndicator, useForwardProps, useForwardPropsEmits } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick, createReusableTemplate, refThrottled } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { omit, get } from '../utils'
import { highlight } from '../utils/fuse'
import { pickLinkProps } from '../utils/link'
import { getEstimateSize } from '../utils/virtualizer'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UChip from './Chip.vue'
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'
import UInput from './Input.vue'
import UKbd from './Kbd.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CommandPaletteProps<G, T>>(), {
  modelValue: '',
  labelKey: 'label',
  descriptionKey: 'description',
  autofocus: true,
  back: true,
  preserveGroupOrder: false,
  virtualize: false,
  highlightOnHover: true
})
const emits = defineEmits<CommandPaletteEmits<T>>()
const slots = defineSlots<CommandPaletteSlots<G, T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const { t } = useLocale()
const appConfig = useAppConfig() as CommandPalette['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'disabled', 'multiple', 'modelValue', 'defaultValue', 'highlightOnHover'), emits)
const inputProps = useForwardProps(reactivePick(props, 'loading'))
const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false

  return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredItems.value, 'md', props.descriptionKey as string)
  })
})

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: CommandPaletteItem, group?: CommandPaletteGroup, index: number }>({
  props: {
    item: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: false
    },
    index: {
      type: Number,
      required: false
    }
  }
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.commandPalette || {}) })({
  virtualize: !!props.virtualize
}))

const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    ignoreLocation: true,
    threshold: 0.1,
    keys: [props.labelKey, 'suffix']
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true
}) as UseFuseOptions<T>)

const history = ref<(CommandPaletteGroup & { placeholder?: string })[]>([])

const placeholder = computed(() => history.value[history.value.length - 1]?.placeholder || props.placeholder || t('commandPalette.placeholder'))

const groups = computed(() => history.value?.length ? [history.value[history.value.length - 1] as G] : props.groups)

const items = computed(() => groups.value?.filter((group) => {
  if (!group.id) {
    console.warn(`[@nuxt/ui] CommandPalette group is missing an \`id\` property`)
    return false
  }
  if (group.ignoreFilter) {
    return false
  }
  return true
})?.flatMap(group => group.items?.map(item => ({ ...item, group: group.id })) || []) || [])

const { results: fuseResults } = useFuse<typeof items.value[number]>(searchTerm, items, fuse)

const throttledFuseResults = refThrottled(fuseResults, 16, true)

function processGroupItems(group: G, items: (T & { matches?: FuseResult<T>['matches'] })[]) {
  let processedItems = items

  if (group?.postFilter && typeof group.postFilter === 'function') {
    processedItems = group.postFilter(searchTerm.value, processedItems)
  }

  return {
    ...group,
    items: processedItems.slice(0, fuse.value.resultLimit).map((item) => {
      return {
        ...item,
        labelHtml: highlight<T>(item, searchTerm.value, props.labelKey),
        suffixHtml: highlight<T>(item, searchTerm.value, undefined, [props.labelKey])
      }
    })
  }
}

const filteredGroups = computed(() => {
  const currentGroups = groups.value

  const groupsById = throttledFuseResults.value.reduce((acc, result) => {
    const { item, matches } = result
    if (!item.group) {
      return acc
    }

    acc[item.group] ||= []
    acc[item.group]?.push({ ...item, matches })

    return acc
  }, {} as Record<string, (T & { matches?: FuseResult<T>['matches'] })[]>)

  if (props.preserveGroupOrder) {
    const processedGroups: Array<ReturnType<typeof processGroupItems>> = []

    for (const group of currentGroups || []) {
      if (!group.items?.length) {
        continue
      }

      const items = group.ignoreFilter ? group.items : groupsById[group.id]
      if (!items?.length) {
        continue
      }

      const processedGroup = processGroupItems(group, items)

      // Filter out groups that become empty after postFilter
      if (processedGroup.items?.length) {
        processedGroups.push(processedGroup)
      }
    }

    return processedGroups
  }

  const fuseGroups = Object.entries(groupsById).map(([id, items]) => {
    const group = currentGroups?.find(group => group.id === id)
    if (!group) {
      return
    }

    const processedGroup = processGroupItems(group, items)
    // Filter out groups without items after postFilter
    return processedGroup.items?.length ? processedGroup : undefined
  }).filter(group => !!group)

  const nonFuseGroups = currentGroups
    ?.map((group, index) => ({ ...group, index }))
    ?.filter(group => group.ignoreFilter && group.items?.length)
    ?.map((group) => {
      const processedGroup = processGroupItems(group, group.items || [])
      return { ...processedGroup, index: group.index }
    })
    // Filter out groups without items after postFilter
    ?.filter(group => group.items?.length) || []

  return nonFuseGroups.reduce((acc, group) => {
    acc.splice(group.index, 0, group)
    return acc
  }, [...fuseGroups])
})

const filteredItems = computed(() => filteredGroups.value.flatMap(group => group.items || []))

const rootRef = useTemplateRef('rootRef')

function navigate(item: T) {
  if (!item.children?.length) {
    return
  }

  history.value.push({
    id: `history-${history.value.length}`,
    label: item.label,
    slot: item.slot,
    placeholder: item.placeholder,
    items: item.children
  } as any)

  searchTerm.value = ''

  rootRef.value?.highlightFirstItem()
}

function navigateBack() {
  if (!history.value.length) {
    return
  }

  history.value.pop()

  searchTerm.value = ''

  rootRef.value?.highlightFirstItem()
}

function onBackspace() {
  if (!searchTerm.value) {
    navigateBack()
  }
}

function onSelect(e: Event, item: T) {
  if (item.children?.length) {
    e.preventDefault()

    navigate(item)
  } else {
    item.onSelect?.(e)
  }
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <DefineItemTemplate v-slot="{ item, index, group }">
    <ListboxItem
      :value="omit(item, ['matches' as any, 'group' as any, 'onSelect', 'labelHtml', 'suffixHtml', 'children'])"
      :disabled="item.disabled"
      as-child
      @select="onSelect($event, item as T)"
    >
      <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
        <ULinkBase v-bind="slotProps" data-slot="item" :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], active: active || item.active })">
          <slot :name="((item.slot || group?.slot || 'item') as keyof CommandPaletteSlots<G, T>)" :item="(item as any)" :index="index" :ui="ui">
            <slot :name="((item.slot ? `${item.slot}-leading` : group?.slot ? `${group.slot}-leading` : `item-leading`) as keyof CommandPaletteSlots<G, T>)" :item="(item as any)" :index="index" :ui="ui">
              <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], loading: true })" />
              <UIcon v-else-if="item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], active: active || item.active })" />
              <UAvatar v-else-if="item.avatar" :size="((item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active: active || item.active })" />
              <UChip
                v-else-if="item.chip"
                :size="((item.ui?.itemLeadingChipSize || props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                inset
                standalone
                v-bind="item.chip"
                data-slot="itemLeadingChip"
                :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip], active: active || item.active })"
              />
            </slot>

            <span v-if="(item.prefix || (item.labelHtml || get(item, props.labelKey as string)) || (item.suffixHtml || item.suffix) || !!slots[(item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`) as keyof CommandPaletteSlots<G, T>]) || (get(item, props.descriptionKey as string) || !!slots[(item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`) as keyof CommandPaletteSlots<G, T>])" data-slot="itemWrapper" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, item.ui?.itemWrapper] })">
              <span data-slot="itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, item.ui?.itemLabel], active: active || item.active })">
                <slot :name="((item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`) as keyof CommandPaletteSlots<G, T>)" :item="(item as any)" :index="index" :ui="ui">
                  <span v-if="item.prefix" data-slot="itemLabelPrefix" :class="ui.itemLabelPrefix({ class: [props.ui?.itemLabelPrefix, item.ui?.itemLabelPrefix] })">{{ item.prefix }}</span>

                  <span v-if="item.labelHtml" data-slot="itemLabelBase" :class="ui.itemLabelBase({ class: [props.ui?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })" v-html="item.labelHtml" />
                  <span v-else data-slot="itemLabelBase" :class="ui.itemLabelBase({ class: [props.ui?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })">{{ get(item, props.labelKey as string) }}</span>

                  <span v-if="item.suffixHtml" data-slot="itemLabelSuffix" :class="ui.itemLabelSuffix({ class: [props.ui?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })" v-html="item.suffixHtml" />
                  <span v-else-if="item.suffix" data-slot="itemLabelSuffix" :class="ui.itemLabelSuffix({ class: [props.ui?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })">{{ item.suffix }}</span>
                </slot>
              </span>

              <span v-if="get(item, props.descriptionKey as string)" data-slot="itemDescription" :class="ui.itemDescription({ class: [props.ui?.itemDescription, item.ui?.itemDescription] })">
                <slot :name="((item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`) as keyof CommandPaletteSlots<G, T>)" :item="(item as any)" :index="index" :ui="ui">
                  {{ get(item, props.descriptionKey as string) }}
                </slot>
              </span>
            </span>

            <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, item.ui?.itemTrailing] })">
              <slot :name="((item.slot ? `${item.slot}-trailing` : group?.slot ? `${group.slot}-trailing` : `item-trailing`) as keyof CommandPaletteSlots<G, T>)" :item="(item as any)" :index="index" :ui="ui">
                <UIcon
                  v-if="item.children && item.children.length > 0"
                  :name="childrenIcon || appConfig.ui.icons.chevronRight"
                  data-slot="itemTrailingIcon"
                  :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon] })"
                />

                <span v-else-if="item.kbds?.length" data-slot="itemTrailingKbds" :class="ui.itemTrailingKbds({ class: [props.ui?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
                  <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="((item.ui?.itemTrailingKbdsSize || props.ui?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()) as KbdProps['size'])" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
                </span>

                <UIcon v-else-if="group?.highlightedIcon" :name="group.highlightedIcon" data-slot="itemTrailingHighlightedIcon" :class="ui.itemTrailingHighlightedIcon({ class: [props.ui?.itemTrailingHighlightedIcon, item.ui?.itemTrailingHighlightedIcon] })" />
              </slot>

              <ListboxItemIndicator v-if="!item.children?.length" as-child>
                <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon] })" />
              </ListboxItemIndicator>
            </span>
          </slot>
        </ULinkBase>
      </ULink>
    </ListboxItem>
  </DefineItemTemplate>

  <ListboxRoot v-bind="{ ...rootProps, ...$attrs }" ref="rootRef" :selection-behavior="selectionBehavior" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ListboxFilter v-model="searchTerm" as-child>
      <UInput
        :placeholder="placeholder"
        variant="none"
        :autofocus="autofocus"
        v-bind="inputProps"
        :loading-icon="loadingIcon"
        :trailing-icon="trailingIcon"
        :icon="icon || appConfig.ui.icons.search"
        data-slot="input"
        :class="ui.input({ class: props.ui?.input })"
        @keydown.backspace="onBackspace"
      >
        <template v-if="history?.length && (back || !!slots.back)" #leading>
          <slot name="back" :ui="ui">
            <UButton
              :icon="backIcon || appConfig.ui.icons.arrowLeft"
              color="neutral"
              variant="link"
              :aria-label="t('commandPalette.back')"
              v-bind="(typeof back === 'object' ? back : {})"
              data-slot="back"
              :class="ui.back({ class: props.ui?.back })"
              @click="navigateBack"
            />
          </slot>
        </template>

        <template v-if="close || !!slots.close" #trailing>
          <slot name="close" :ui="ui">
            <UButton
              v-if="close"
              :icon="closeIcon || appConfig.ui.icons.close"
              color="neutral"
              variant="ghost"
              :aria-label="t('commandPalette.close')"
              v-bind="(typeof close === 'object' ? close : {})"
              data-slot="close"
              :class="ui.close({ class: props.ui?.close })"
              @click="emits('update:open', false)"
            />
          </slot>
        </template>
      </UInput>
    </ListboxFilter>

    <ListboxContent data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <div v-if="filteredGroups?.length" role="presentation" data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
        <ListboxVirtualizer
          v-if="!!virtualize"
          v-slot="{ option: item, virtualItem }"
          :options="(filteredItems as any[])"
          :text-content="item => get(item, props.labelKey as string)"
          v-bind="virtualizerProps"
        >
          <ReuseItemTemplate :item="item" :index="virtualItem.index" />
        </ListboxVirtualizer>

        <template v-else>
          <ListboxGroup v-for="group in filteredGroups" :key="`group-${group.id}`" data-slot="group" :class="ui.group({ class: props.ui?.group })">
            <ListboxGroupLabel v-if="get(group, props.labelKey as string)" data-slot="label" :class="ui.label({ class: props.ui?.label })">
              {{ get(group, props.labelKey as string) }}
            </ListboxGroupLabel>

            <ReuseItemTemplate
              v-for="(item, index) in group.items"
              :key="`group-${group.id}-${index}`"
              :item="item"
              :index="index"
              :group="(group as CommandPaletteGroup)"
            />
          </ListboxGroup>
        </template>
      </div>

      <div v-else data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
        <slot name="empty" :search-term="searchTerm">
          {{ searchTerm ? t('commandPalette.noMatch', { searchTerm }) : t('commandPalette.noData') }}
        </slot>
      </div>
    </ListboxContent>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" :ui="ui" />
    </div>
  </ListboxRoot>
</template>
