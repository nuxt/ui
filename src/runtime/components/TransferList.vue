<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ListboxRootProps } from 'reka-ui'
import { computed, ref, toRef } from 'vue'
import type { PropType, VNode, Ref } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import theme from '#build/ui/transfer-list'
import type { AvatarProps, ChipProps, IconProps, ButtonProps, InputProps, LinkPropsKeys } from '../types'
import type { GetItemKeys } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type TransferList = ComponentConfig<typeof theme, AppConfig, 'transferList'>

export interface TransferListItem {
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
  ui?: Pick<TransferList['slots'], 'item' | 'itemLeadingIcon' | 'itemLeadingAvatar' | 'itemLeadingAvatarSize' | 'itemLeadingChip' | 'itemLeadingChipSize' | 'itemWrapper' | 'itemLabel' | 'itemDescription'>
  [key: string]: any
}

export interface TransferListProps<T extends TransferListItem = TransferListItem> extends Pick<ListboxRootProps, 'by' | 'disabled'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: TransferList['variants']['size']
  /**
   * All available items.
   */
  items?: T[]
  /**
   * The items currently in the target (right) list.
   */
  modelValue?: T[]
  /**
   * The default items in the target list when not controlled.
   */
  defaultValue?: T[]
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
   * Whether the source list should be in loading state.
   */
  sourceLoading?: boolean
  /**
   * Whether the target list should be in loading state.
   */
  targetLoading?: boolean
  /**
   * The icon displayed when loading.
   * @defaultValue appConfig.ui.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: IconProps['name']
  /**
   * Enable search/filter in both lists.
   * @defaultValue false
   */
  searchable?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>
  /**
   * The title displayed in the source (left) list header.
   */
  sourceTitle?: string
  /**
   * The title displayed in the target (right) list header.
   */
  targetTitle?: string
  /**
   * The placeholder text for the source list search input.
   */
  sourcePlaceholder?: string
  /**
   * The placeholder text for the target list search input.
   */
  targetPlaceholder?: string
  /**
   * Configure the transfer button.
   * `{ size: 'md', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  transfer?: Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the transfer button.
   * @defaultValue appConfig.ui.icons.chevronRight
   * @IconifyIcon
   */
  transferIcon?: IconProps['name']
  /**
   * Configure the remove button.
   * `{ size: 'md', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  remove?: Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the remove button.
   * @defaultValue appConfig.ui.icons.chevronLeft
   * @IconifyIcon
   */
  removeIcon?: IconProps['name']
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
  ui?: TransferList['slots']
}

export type TransferListEmits<T extends TransferListItem = TransferListItem> = {
  'update:modelValue': [value: T[]]
}

type SlotProps<T> = (props: { item: T, index: number, list: 'source' | 'target' }) => VNode[]

export type TransferListSlots<T extends TransferListItem = TransferListItem> = {
  'source-header'?(props: { count: number, selectedCount: number, ui: TransferList['ui'] }): VNode[]
  'target-header'?(props: { count: number, selectedCount: number, ui: TransferList['ui'] }): VNode[]
  'source-loading'?(props?: {}): VNode[]
  'target-loading'?(props?: {}): VNode[]
  'source-empty'?(props: { searchTerm: string }): VNode[]
  'target-empty'?(props: { searchTerm: string }): VNode[]
  'item'?: SlotProps<T>
  'item-leading'?: SlotProps<T>
  'item-label'?: SlotProps<T>
  'item-description'?: SlotProps<T>
  'controls'?(props: { transferSelected: () => void, removeSelected: () => void }): VNode[]
}

</script>

<script setup lang="ts" generic="T extends TransferListItem">
import { ListboxRoot, ListboxContent, ListboxVirtualizer, ListboxItem, ListboxItemIndicator, ListboxFilter } from 'reka-ui'
import { isEqual } from 'ohash/utils'
import { defu } from 'defu'
import { createReusableTemplate } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { useLocale } from '../composables/useLocale'
import { get } from '../utils'
import { getEstimateSize } from '../utils/virtualizer'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UChip from './Chip.vue'
import UInput from './Input.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TransferListProps<T>>(), {
  items: () => [],
  labelKey: 'label',
  descriptionKey: 'description',
  searchable: false,
  virtualize: false
})
const emits = defineEmits<TransferListEmits<T>>()
const slots = defineSlots<TransferListSlots<T>>()

const { t } = useLocale()
const appConfig = useAppConfig() as TransferList['AppConfig']
const uiProp = useComponentUI('transferList', props)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.transferList || {}) })({
  size: props.size,
  disabled: props.disabled
}))

const targetItems = ref<T[]>(props.defaultValue || []) as Ref<T[]>
const modelValue = computed({
  get: () => props.modelValue !== undefined ? props.modelValue : targetItems.value,
  set: (value: T[]) => {
    targetItems.value = value
    emits('update:modelValue', value)
  }
})

const sourceSelection = ref<T[]>([]) as Ref<T[]>
const targetSelection = ref<T[]>([]) as Ref<T[]>

function compare(a: any, b: any): boolean {
  if (typeof props.by === 'function') return props.by(a, b)
  if (typeof props.by === 'string') return get(a, props.by) === get(b, props.by)
  return isEqual(a, b)
}

function isInList(item: T, list: T[]): boolean {
  return list.some(listItem => compare(item, listItem))
}

const sourceItems = computed(() => props.items.filter(item => !isInList(item, modelValue.value)))

const sourceSearchTerm = ref('')
const targetSearchTerm = ref('')

const fuseOptions = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    ignoreLocation: true,
    threshold: 0.1,
    keys: [props.labelKey as string]
  },
  matchAllWhenSearchEmpty: true
}) as UseFuseOptions<T>)

const { results: sourceFuseResults } = useFuse<T>(sourceSearchTerm, sourceItems, fuseOptions)
const { results: targetFuseResults } = useFuse<T>(targetSearchTerm, modelValue, fuseOptions)

const filteredSourceItems = computed(() => sourceFuseResults.value.map(r => r.item))
const filteredTargetItems = computed(() => targetFuseResults.value.map(r => r.item))

const sourceVirtualizerProps = toRef(() => {
  if (!props.virtualize) return false

  return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredSourceItems.value, props.size || 'md', props.descriptionKey as string, !!slots['item-description'])
  })
})

const targetVirtualizerProps = toRef(() => {
  if (!props.virtualize) return false

  return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredTargetItems.value, props.size || 'md', props.descriptionKey as string, !!slots['item-description'])
  })
})

function transferSelected() {
  if (!sourceSelection.value.length) return
  modelValue.value = [...modelValue.value, ...sourceSelection.value]
  sourceSelection.value = []
}

function removeSelected() {
  if (!targetSelection.value.length) return
  modelValue.value = modelValue.value.filter(item => !isInList(item, targetSelection.value))
  targetSelection.value = []
}

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: TransferListItem, index: number, list: 'source' | 'target' }>({
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    list: {
      type: String as PropType<'source' | 'target'>,
      required: true
    }
  }
})
</script>

<template>
  <DefineItemTemplate v-slot="{ item, index, list }">
    <ListboxItem
      :value="item"
      :disabled="item.disabled"
      data-slot="item"
      :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class] })"
    >
      <slot name="item" :item="(item as T)" :index="index" :list="list">
        <slot name="item-leading" :item="(item as T)" :index="index" :list="list">
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
            <slot name="item-label" :item="(item as T)" :index="index" :list="list">
              {{ get(item, props.labelKey as string) }}
            </slot>
          </span>

          <span v-if="get(item, props.descriptionKey as string) || !!slots['item-description']" data-slot="itemDescription" :class="ui.itemDescription({ class: [uiProp?.itemDescription, item.ui?.itemDescription] })">
            <slot name="item-description" :item="(item as T)" :index="index" :list="list">
              {{ get(item, props.descriptionKey as string) }}
            </slot>
          </span>
        </span>

        <ListboxItemIndicator as-child>
          <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiProp?.itemLeadingIcon] })" />
        </ListboxItemIndicator>
      </slot>
    </ListboxItem>
  </DefineItemTemplate>

  <component :is="as || 'div'" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="sourceList" :class="ui.sourceList({ class: uiProp?.sourceList })">
      <div v-if="sourceTitle || !!slots['source-header']" data-slot="listHeader" :class="ui.listHeader({ class: uiProp?.listHeader })">
        <slot name="source-header" :count="sourceItems.length" :selected-count="sourceSelection.length" :ui="ui">
          <span data-slot="listTitle" :class="ui.listTitle({ class: uiProp?.listTitle })">{{ sourceTitle }}</span>
        </slot>
      </div>

      <ListboxRoot
        v-model="sourceSelection"
        multiple
        selection-behavior="toggle"
        :by="by"
        :disabled="disabled"
        highlight-on-hover
      >
        <ListboxFilter v-if="searchable" v-model="sourceSearchTerm" as-child>
          <UInput
            variant="none"
            :size="size"
            v-bind="typeof searchable === 'object' ? searchable : {}"
            :placeholder="sourcePlaceholder || t('transferList.search')"
            :icon="appConfig.ui.icons.search"
            data-slot="listSearch"
            :class="ui.listSearch({ class: uiProp?.listSearch })"
          />
        </ListboxFilter>

        <ListboxContent data-slot="listContent" :class="ui.listContent({ class: uiProp?.listContent })">
          <div v-if="sourceLoading" data-slot="listLoading" :class="ui.listLoading({ class: uiProp?.listLoading })">
            <slot name="source-loading">
              <UIcon :name="loadingIcon || appConfig.ui.icons.loading" data-slot="listLoadingIcon" :class="ui.listLoadingIcon({ class: uiProp?.listLoadingIcon })" />
            </slot>
          </div>
          <div v-else-if="!filteredSourceItems.length" data-slot="listEmpty" :class="ui.listEmpty({ class: uiProp?.listEmpty })">
            <slot name="source-empty" :search-term="sourceSearchTerm">
              {{ sourceSearchTerm ? t('transferList.noMatch', { searchTerm: sourceSearchTerm }) : t('transferList.noData') }}
            </slot>
          </div>

          <ListboxVirtualizer
            v-else-if="!!virtualize"
            v-slot="{ option: item, virtualItem }"
            :options="(filteredSourceItems as any[])"
            :text-content="(item: any) => get(item, props.labelKey as string)"
            v-bind="sourceVirtualizerProps"
          >
            <ReuseItemTemplate :item="item" :index="virtualItem.index" list="source" />
          </ListboxVirtualizer>

          <template v-else>
            <ReuseItemTemplate
              v-for="(item, index) in filteredSourceItems"
              :key="index"
              :item="item"
              :index="index"
              list="source"
            />
          </template>
        </ListboxContent>
      </ListboxRoot>
    </div>

    <div data-slot="controls" :class="ui.controls({ class: uiProp?.controls })">
      <slot name="controls" :transfer-selected="transferSelected" :remove-selected="removeSelected">
        <UButton
          :icon="transferIcon || appConfig.ui.icons.chevronRight"
          :size="size"
          color="neutral"
          variant="outline"
          :disabled="!sourceSelection.length"
          :aria-label="t('transferList.transfer')"
          v-bind="(typeof transfer === 'object' ? transfer : {})"
          data-slot="controlButton"
          :class="ui.controlButton({ class: uiProp?.controlButton })"
          @click="transferSelected"
        />
        <UButton
          :icon="removeIcon || appConfig.ui.icons.chevronLeft"
          :size="size"
          color="neutral"
          variant="outline"
          :disabled="!targetSelection.length"
          :aria-label="t('transferList.remove')"
          v-bind="(typeof remove === 'object' ? remove : {})"
          data-slot="controlButton"
          :class="ui.controlButton({ class: uiProp?.controlButton })"
          @click="removeSelected"
        />
      </slot>
    </div>

    <div data-slot="targetList" :class="ui.targetList({ class: uiProp?.targetList })">
      <div v-if="targetTitle || !!slots['target-header']" data-slot="listHeader" :class="ui.listHeader({ class: uiProp?.listHeader })">
        <slot name="target-header" :count="modelValue.length" :selected-count="targetSelection.length" :ui="ui">
          <span data-slot="listTitle" :class="ui.listTitle({ class: uiProp?.listTitle })">{{ targetTitle }}</span>
        </slot>
      </div>

      <ListboxRoot
        v-model="targetSelection"
        multiple
        selection-behavior="toggle"
        :by="by"
        :disabled="disabled"
        highlight-on-hover
      >
        <ListboxFilter v-if="searchable" v-model="targetSearchTerm" as-child>
          <UInput
            variant="none"
            :size="size"
            v-bind="typeof searchable === 'object' ? searchable : {}"
            :placeholder="targetPlaceholder || t('transferList.search')"
            :icon="appConfig.ui.icons.search"
            data-slot="listSearch"
            :class="ui.listSearch({ class: uiProp?.listSearch })"
          />
        </ListboxFilter>

        <ListboxContent data-slot="listContent" :class="ui.listContent({ class: uiProp?.listContent })">
          <div v-if="targetLoading" data-slot="listLoading" :class="ui.listLoading({ class: uiProp?.listLoading })">
            <slot name="target-loading">
              <UIcon :name="loadingIcon || appConfig.ui.icons.loading" data-slot="listLoadingIcon" :class="ui.listLoadingIcon({ class: uiProp?.listLoadingIcon })" />
            </slot>
          </div>
          <div v-else-if="!filteredTargetItems.length" data-slot="listEmpty" :class="ui.listEmpty({ class: uiProp?.listEmpty })">
            <slot name="target-empty" :search-term="targetSearchTerm">
              {{ targetSearchTerm ? t('transferList.noMatch', { searchTerm: targetSearchTerm }) : t('transferList.noData') }}
            </slot>
          </div>

          <ListboxVirtualizer
            v-else-if="!!virtualize"
            v-slot="{ option: item, virtualItem }"
            :options="(filteredTargetItems as any[])"
            :text-content="(item: any) => get(item, props.labelKey as string)"
            v-bind="targetVirtualizerProps"
          >
            <ReuseItemTemplate :item="item" :index="virtualItem.index" list="target" />
          </ListboxVirtualizer>

          <template v-else>
            <ReuseItemTemplate
              v-for="(item, index) in filteredTargetItems"
              :key="index"
              :item="item"
              :index="index"
              list="target"
            />
          </template>
        </ListboxContent>
      </ListboxRoot>
    </div>
  </component>
</template>
