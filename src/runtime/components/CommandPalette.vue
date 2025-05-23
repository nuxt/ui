<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ListboxRootProps, ListboxRootEmits } from 'reka-ui'
import type { FuseResult } from 'fuse.js'
import type { AppConfig } from '@nuxt/schema'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import theme from '#build/ui/command-palette'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, ButtonProps, ChipProps, KbdProps, InputProps, LinkProps } from '../types'
import type { ComponentConfig } from '../types/utils'

type CommandPalette = ComponentConfig<typeof theme, AppConfig, 'commandPalette'>

export interface CommandPaletteItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  prefix?: string
  label?: string
  suffix?: string
  /**
   * @IconifyIcon
   */
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  kbds?: KbdProps['value'][] | KbdProps[]
  active?: boolean
  loading?: boolean
  disabled?: boolean
  slot?: string
  onSelect?(e?: Event): void
  class?: any
  ui?: Pick<CommandPalette['slots'], 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemLabel' | 'itemLabelPrefix' | 'itemLabelBase' | 'itemLabelSuffix' | 'itemTrailing' | 'itemTrailingKbds' | 'itemTrailingKbdsSize' | 'itemTrailingHighlightedIcon' | 'itemTrailingIcon'>
  [key: string]: any
}

export interface CommandPaletteGroup<T> {
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
  highlightedIcon?: string
}

export interface CommandPaletteProps<G, T> extends Pick<ListboxRootProps, 'multiple' | 'disabled' | 'modelValue' | 'defaultValue' | 'highlightOnHover'>, Pick<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
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
  icon?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  selectedIcon?: string
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
  close?: boolean | Partial<ButtonProps>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: string
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
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string
  class?: any
  ui?: CommandPalette['slots']
}

export type CommandPaletteEmits<T> = ListboxRootEmits<T> & {
  'update:open': [value: boolean]
}

type SlotProps<T> = (props: { item: T, index: number }) => any

export type CommandPaletteSlots<G extends { slot?: string }, T extends { slot?: string }> = {
  'empty'(props: { searchTerm?: string }): any
  'close'(props: { ui: { [K in keyof Required<CommandPalette['slots']>]: (props?: Record<string, any>) => string } }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & Record<string, SlotProps<G>> & Record<string, SlotProps<T>>

</script>

<script setup lang="ts" generic="G extends CommandPaletteGroup<T>, T extends CommandPaletteItem">
import { computed } from 'vue'
import { ListboxRoot, ListboxFilter, ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxItem, ListboxItemIndicator, useForwardProps, useForwardPropsEmits } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { omit, get } from '../utils'
import { tv } from '../utils/tv'
import { highlight } from '../utils/fuse'
import { pickLinkProps } from '../utils/link'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UChip from './Chip.vue'
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'
import UInput from './Input.vue'
import UKbd from './Kbd.vue'

const props = withDefaults(defineProps<CommandPaletteProps<G, T>>(), {
  modelValue: '',
  labelKey: 'label',
  autofocus: true
})
const emits = defineEmits<CommandPaletteEmits<T>>()
const slots = defineSlots<CommandPaletteSlots<G, T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const { t } = useLocale()
const appConfig = useAppConfig() as CommandPalette['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'disabled', 'multiple', 'modelValue', 'defaultValue', 'highlightOnHover'), emits)
const inputProps = useForwardProps(reactivePick(props, 'loading', 'loadingIcon'))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.commandPalette || {}) })())

const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    ignoreLocation: true,
    threshold: 0.1,
    keys: [props.labelKey, 'suffix']
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true
}))

const items = computed(() => props.groups?.filter((group) => {
  if (!group.id) {
    console.warn(`[@nuxt/ui] CommandPalette group is missing an \`id\` property`)
    return false
  }

  if (group.ignoreFilter) {
    return false
  }

  return true
}).flatMap(group => group.items?.map(item => ({ ...item, group: group.id })) || []) || [])

const { results: fuseResults } = useFuse<typeof items.value[number]>(searchTerm, items, fuse)

function getGroupWithItems(group: G, items: (T & { matches?: FuseResult<T>['matches'] })[]) {
  if (group?.postFilter && typeof group.postFilter === 'function') {
    items = group.postFilter(searchTerm.value, items)
  }

  return {
    ...group,
    items: items.slice(0, fuse.value.resultLimit).map((item) => {
      return {
        ...item,
        labelHtml: highlight<T>(item, searchTerm.value, props.labelKey),
        suffixHtml: highlight<T>(item, searchTerm.value, undefined, [props.labelKey])
      }
    })
  }
}

const groups = computed(() => {
  const groupsById = fuseResults.value.reduce((acc, result) => {
    const { item, matches } = result
    if (!item.group) {
      return acc
    }

    acc[item.group] ||= []
    acc[item.group]?.push({ ...item, matches })

    return acc
  }, {} as Record<string, (T & { matches?: FuseResult<T>['matches'] })[]>)

  const fuseGroups = Object.entries(groupsById).map(([id, items]) => {
    const group = props.groups?.find(group => group.id === id)
    if (!group) {
      return
    }

    return getGroupWithItems(group, items)
  }).filter(group => !!group)

  const nonFuseGroups = props.groups
    ?.map((group, index) => ({ ...group, index }))
    ?.filter(group => group.ignoreFilter && group.items?.length)
    ?.map(group => ({ ...getGroupWithItems(group, group.items || []), index: group.index })) || []

  return nonFuseGroups.reduce((acc, group) => {
    acc.splice(group.index, 0, group)
    return acc
  }, [...fuseGroups])
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <ListboxRoot v-bind="rootProps" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ListboxFilter v-model="searchTerm" as-child>
      <UInput
        :placeholder="placeholder || t('commandPalette.placeholder')"
        variant="none"
        :autofocus="autofocus"
        v-bind="inputProps"
        :icon="icon || appConfig.ui.icons.search"
        :class="ui.input({ class: props.ui?.input })"
      >
        <template v-if="close || !!slots.close" #trailing>
          <slot name="close" :ui="ui">
            <UButton
              v-if="close"
              :icon="closeIcon || appConfig.ui.icons.close"
              size="md"
              color="neutral"
              variant="ghost"
              :aria-label="t('commandPalette.close')"
              v-bind="(typeof close === 'object' ? close as Partial<ButtonProps> : {})"
              :class="ui.close({ class: props.ui?.close })"
              @click="emits('update:open', false)"
            />
          </slot>
        </template>
      </UInput>
    </ListboxFilter>

    <ListboxContent :class="ui.content({ class: props.ui?.content })">
      <div v-if="groups?.length" role="presentation" :class="ui.viewport({ class: props.ui?.viewport })">
        <ListboxGroup v-for="group in groups" :key="`group-${group.id}`" :class="ui.group({ class: props.ui?.group })">
          <ListboxGroupLabel v-if="get(group, props.labelKey as string)" :class="ui.label({ class: props.ui?.label })">
            {{ get(group, props.labelKey as string) }}
          </ListboxGroupLabel>

          <ListboxItem
            v-for="(item, index) in group.items"
            :key="`group-${group.id}-${index}`"
            :value="omit(item, ['matches' as any, 'group' as any, 'onSelect', 'labelHtml', 'suffixHtml'])"
            :disabled="item.disabled"
            as-child
            @select="item.onSelect"
          >
            <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
              <ULinkBase v-bind="slotProps" :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], active: active || item.active })">
                <slot :name="((item.slot || group.slot || 'item') as keyof CommandPaletteSlots<G, T>)" :item="(item as any)" :index="index">
                  <slot :name="((item.slot ? `${item.slot}-leading` : group.slot ? `${group.slot}-leading` : `item-leading`) as keyof CommandPaletteSlots<G, T>)" :item="(item as any)" :index="index">
                    <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], loading: true })" />
                    <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], active: active || item.active })" />
                    <UAvatar v-else-if="item.avatar" :size="((item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active: active || item.active })" />
                    <UChip
                      v-else-if="item.chip"
                      :size="((item.ui?.itemLeadingChipSize || props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                      inset
                      standalone
                      v-bind="item.chip"
                      :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip], active: active || item.active })"
                    />
                  </slot>

                  <span v-if="item.labelHtml || get(item, props.labelKey as string) || !!slots[(item.slot ? `${item.slot}-label` : group.slot ? `${group.slot}-label` : `item-label`) as keyof CommandPaletteSlots<G, T>]" :class="ui.itemLabel({ class: [props.ui?.itemLabel, item.ui?.itemLabel], active: active || item.active })">
                    <slot :name="((item.slot ? `${item.slot}-label` : group.slot ? `${group.slot}-label` : `item-label`) as keyof CommandPaletteSlots<G, T>)" :item="(item as any)" :index="index">
                      <span v-if="item.prefix" :class="ui.itemLabelPrefix({ class: [props.ui?.itemLabelPrefix, item.ui?.itemLabelPrefix] })">{{ item.prefix }}</span>

                      <span :class="ui.itemLabelBase({ class: [props.ui?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })" v-html="item.labelHtml || get(item, props.labelKey as string)" />

                      <span :class="ui.itemLabelSuffix({ class: [props.ui?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })" v-html="item.suffixHtml || item.suffix" />
                    </slot>
                  </span>

                  <span :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, item.ui?.itemTrailing] })">
                    <slot :name="((item.slot ? `${item.slot}-trailing` : group.slot ? `${group.slot}-trailing` : `item-trailing`) as keyof CommandPaletteSlots<G, T>)" :item="(item as any)" :index="index">
                      <span v-if="item.kbds?.length" :class="ui.itemTrailingKbds({ class: [props.ui?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
                        <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="((item.ui?.itemTrailingKbdsSize || props.ui?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()) as KbdProps['size'])" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
                      </span>
                      <UIcon v-else-if="group.highlightedIcon" :name="group.highlightedIcon" :class="ui.itemTrailingHighlightedIcon({ class: [props.ui?.itemTrailingHighlightedIcon, item.ui?.itemTrailingHighlightedIcon] })" />
                    </slot>

                    <ListboxItemIndicator as-child>
                      <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon] })" />
                    </ListboxItemIndicator>
                  </span>
                </slot>
              </ULinkBase>
            </ULink>
          </ListboxItem>
        </ListboxGroup>
      </div>

      <div v-else :class="ui.empty({ class: props.ui?.empty })">
        <slot name="empty" :search-term="searchTerm">
          {{ searchTerm ? t('commandPalette.noMatch', { searchTerm }) : t('commandPalette.noData') }}
        </slot>
      </div>
    </ListboxContent>
  </ListboxRoot>
</template>
