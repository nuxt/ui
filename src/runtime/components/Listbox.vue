<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ListboxRootProps } from 'reka-ui'
import type { VNode } from 'vue'
import { computed, ref, toRef, useId } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import theme from '#build/ui/listbox'
import type { AvatarProps, ChipProps, IconProps, InputProps } from '../types'
import type { GetItemKeys } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Listbox = ComponentConfig<typeof theme, AppConfig, 'listbox'>

export interface ListboxItem {
  label?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps
  chip?: ChipProps
  disabled?: boolean
  class?: any
  ui?: Pick<Listbox['slots'], 'item' | 'itemLeadingIcon' | 'itemLeadingAvatar' | 'itemLeadingAvatarSize' | 'itemLeadingChip' | 'itemLeadingChipSize' | 'itemWrapper' | 'itemLabel' | 'itemDescription'>
  [key: string]: any
}

export interface ListboxProps<T extends ListboxItem = ListboxItem, M extends boolean = false> extends Pick<ListboxRootProps, 'by' | 'disabled' | 'selectionBehavior' | 'highlightOnHover' | 'orientation' | 'name'> {
  id?: string
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: Listbox['variants']['size']
  /**
   * The items to display in the list.
   */
  items?: T[]
  /**
   * The controlled value of the Listbox. Can be bound with `v-model`.
   */
  modelValue?: M extends true ? T[] : T
  /**
   * The default value when not controlled.
   */
  defaultValue?: M extends true ? T[] : T
  /**
   * Whether multiple items can be selected.
   * @defaultValue false
   */
  multiple?: M & boolean
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
   * Whether the list is in a loading state.
   */
  loading?: boolean
  /**
   * The icon displayed when loading.
   * @defaultValue appConfig.ui.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: IconProps['name']
  /**
   * Enable search/filter.
   * @defaultValue false
   */
  searchable?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>
  /**
   * The placeholder text for the search input.
   */
  placeholder?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  selectedIcon?: IconProps['name']
  /**
   * Enable virtualization for large lists.
   * @defaultValue false
   */
  virtualize?: boolean | {
    /**
     * Number of items rendered outside the visible area
     * @defaultValue 12
     */
    overscan?: number
    /**
     * Estimated size (in px) of each item, or a function that returns the size for a given index
     * @defaultValue 32
     */
    estimateSize?: number | ((index: number) => number)
  }
  /**
   * Options for [useFuse](https://vueuse.org/integrations/useFuse).
   */
  fuse?: UseFuseOptions<T>
  class?: any
  ui?: Listbox['slots']
}

export type ListboxEmits<T extends ListboxItem = ListboxItem, M extends boolean = false> = {
  'update:modelValue': [value: M extends true ? T[] : T]
}

type SlotProps<T> = (props: { item: T, index: number }) => VNode[]

export type ListboxSlots<T extends ListboxItem = ListboxItem> = {
  'loading'?(props?: {}): VNode[]
  'empty'?(props: { searchTerm: string }): VNode[]
  'item'?: SlotProps<T>
  'item-leading'?: SlotProps<T>
  'item-label'?: SlotProps<T>
  'item-description'?: SlotProps<T>
}

</script>

<script setup lang="ts" generic="T extends ListboxItem, M extends boolean = false">
import { ListboxRoot, ListboxContent, ListboxVirtualizer, ListboxItem as RekaListboxItem, ListboxItemIndicator, ListboxFilter } from 'reka-ui'
import { defu } from 'defu'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { get } from '../utils'
import { getEstimateSize } from '../utils/virtualizer'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UChip from './Chip.vue'
import UInput from './Input.vue'

const props = withDefaults(defineProps<ListboxProps<T, M>>(), {
  items: () => [],
  labelKey: 'label',
  descriptionKey: 'description',
  selectionBehavior: 'toggle',
  highlightOnHover: true,
  searchable: false,
  virtualize: false
})
const emits = defineEmits<ListboxEmits<T, M>>()
const slots = defineSlots<ListboxSlots<T>>()

const { t } = useLocale()
const appConfig = useAppConfig() as Listbox['AppConfig']
const uiProp = useComponentUI('listbox', props)

const { emitFormChange, emitFormInput, name, size, id: _id, disabled, ariaAttrs } = useFormField<ListboxProps<T>>(props, { bind: false })
// eslint-disable-next-line vue/no-dupe-keys
const id = _id.value ?? useId()

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.listbox || {}) })({
  size: size.value,
  disabled: disabled.value
}))

function onUpdate(value: any) {
  emits('update:modelValue', value)
  emitFormChange()
  emitFormInput()
}

const searchTerm = ref('')

const fuseOptions = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    ignoreLocation: true,
    threshold: 0.1,
    keys: [props.labelKey as string]
  },
  matchAllWhenSearchEmpty: true
}) as UseFuseOptions<T>)

const { results: fuseResults } = useFuse<T>(searchTerm, () => props.items, fuseOptions)

const filteredItems = computed(() => fuseResults.value.map(r => r.item))

const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false

  return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredItems.value, props.size || 'md', props.descriptionKey as string, !!slots['item-description'])
  })
})
</script>

<template>
  <ListboxRoot
    :id="id"
    :model-value="modelValue"
    :default-value="defaultValue"
    :as="as || 'div'"
    :multiple="multiple"
    :selection-behavior="selectionBehavior"
    :by="by"
    :disabled="disabled"
    :highlight-on-hover="highlightOnHover"
    :orientation="orientation"
    :name="name"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    @update:model-value="onUpdate"
  >
    <ListboxFilter v-if="searchable" v-model="searchTerm" as-child>
      <UInput
        variant="none"
        :size="size"
        :placeholder="placeholder || t('listbox.search')"
        :icon="appConfig.ui.icons.search"
        data-slot="search"
        :class="ui.search({ class: uiProp?.search })"
        v-bind="typeof searchable === 'object' ? searchable : {}"
      />
    </ListboxFilter>

    <ListboxContent data-slot="content" :class="ui.content({ class: uiProp?.content })" v-bind="ariaAttrs">
      <div v-if="loading" data-slot="loading" :class="ui.loading({ class: uiProp?.loading })">
        <slot name="loading">
          <UIcon :name="loadingIcon || appConfig.ui.icons.loading" data-slot="loadingIcon" :class="ui.loadingIcon({ class: uiProp?.loadingIcon })" />
        </slot>
      </div>
      <div v-else-if="!filteredItems.length" data-slot="empty" :class="ui.empty({ class: uiProp?.empty })">
        <slot name="empty" :search-term="searchTerm">
          {{ searchTerm ? t('listbox.noMatch', { searchTerm }) : t('listbox.noData') }}
        </slot>
      </div>

      <ListboxVirtualizer
        v-else-if="!!virtualize"
        v-slot="{ option: item, virtualItem }"
        :options="(filteredItems as any[])"
        :text-content="(item: any) => get(item, props.labelKey as string)"
        v-bind="virtualizerProps"
      >
        <RekaListboxItem
          :value="item"
          :disabled="item.disabled"
          data-slot="item"
          :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class] })"
        >
          <slot name="item" :item="(item as T)" :index="virtualItem.index">
            <slot name="item-leading" :item="(item as T)" :index="virtualItem.index">
              <UIcon v-if="item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiProp?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
              <UAvatar v-else-if="item.avatar" :size="((item.ui?.itemLeadingAvatarSize || uiProp?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [uiProp?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
              <UChip
                v-else-if="item.chip"
                :size="((item.ui?.itemLeadingChipSize || uiProp?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                inset
                standalone
                v-bind="item.chip"
                data-slot="itemLeadingChip"
                :class="ui.itemLeadingChip({ class: [uiProp?.itemLeadingChip, item.ui?.itemLeadingChip] })"
              />
            </slot>

            <span v-if="get(item, props.labelKey as string) || get(item, props.descriptionKey as string) || !!slots['item-label'] || !!slots['item-description']" data-slot="itemWrapper" :class="ui.itemWrapper({ class: [uiProp?.itemWrapper, item.ui?.itemWrapper] })">
              <span v-if="get(item, props.labelKey as string) || !!slots['item-label']" data-slot="itemLabel" :class="ui.itemLabel({ class: [uiProp?.itemLabel, item.ui?.itemLabel] })">
                <slot name="item-label" :item="(item as T)" :index="virtualItem.index">
                  {{ get(item, props.labelKey as string) }}
                </slot>
              </span>

              <span v-if="get(item, props.descriptionKey as string) || !!slots['item-description']" data-slot="itemDescription" :class="ui.itemDescription({ class: [uiProp?.itemDescription, item.ui?.itemDescription] })">
                <slot name="item-description" :item="(item as T)" :index="virtualItem.index">
                  {{ get(item, props.descriptionKey as string) }}
                </slot>
              </span>
            </span>

            <ListboxItemIndicator as-child>
              <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemSelectedIcon" :class="ui.itemSelectedIcon({ class: [uiProp?.itemSelectedIcon] })" />
            </ListboxItemIndicator>
          </slot>
        </RekaListboxItem>
      </ListboxVirtualizer>

      <template v-else>
        <RekaListboxItem
          v-for="(item, index) in filteredItems"
          :key="index"
          :value="item"
          :disabled="item.disabled"
          data-slot="item"
          :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class] })"
        >
          <slot name="item" :item="(item as T)" :index="index">
            <slot name="item-leading" :item="(item as T)" :index="index">
              <UIcon v-if="item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiProp?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
              <UAvatar v-else-if="item.avatar" :size="((item.ui?.itemLeadingAvatarSize || uiProp?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [uiProp?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
              <UChip
                v-else-if="item.chip"
                :size="((item.ui?.itemLeadingChipSize || uiProp?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                inset
                standalone
                v-bind="item.chip"
                data-slot="itemLeadingChip"
                :class="ui.itemLeadingChip({ class: [uiProp?.itemLeadingChip, item.ui?.itemLeadingChip] })"
              />
            </slot>

            <span v-if="get(item, props.labelKey as string) || get(item, props.descriptionKey as string) || !!slots['item-label'] || !!slots['item-description']" data-slot="itemWrapper" :class="ui.itemWrapper({ class: [uiProp?.itemWrapper, item.ui?.itemWrapper] })">
              <span v-if="get(item, props.labelKey as string) || !!slots['item-label']" data-slot="itemLabel" :class="ui.itemLabel({ class: [uiProp?.itemLabel, item.ui?.itemLabel] })">
                <slot name="item-label" :item="(item as T)" :index="index">
                  {{ get(item, props.labelKey as string) }}
                </slot>
              </span>

              <span v-if="get(item, props.descriptionKey as string) || !!slots['item-description']" data-slot="itemDescription" :class="ui.itemDescription({ class: [uiProp?.itemDescription, item.ui?.itemDescription] })">
                <slot name="item-description" :item="(item as T)" :index="index">
                  {{ get(item, props.descriptionKey as string) }}
                </slot>
              </span>
            </span>

            <ListboxItemIndicator as-child>
              <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemSelectedIcon" :class="ui.itemSelectedIcon({ class: [uiProp?.itemSelectedIcon] })" />
            </ListboxItemIndicator>
          </slot>
        </RekaListboxItem>
      </template>
    </ListboxContent>
  </ListboxRoot>
</template>
