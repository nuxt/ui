<script lang="ts">
import { tv } from 'tailwind-variants'
import type { ComboboxRootProps, ComboboxRootEmits } from 'radix-vue'
import type { FuseResult } from 'fuse.js'
import type { AppConfig } from '@nuxt/schema'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import _appConfig from '#build/app.config'
import theme from '#build/ui/command-palette'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps, ButtonProps, ChipProps, KbdProps, InputProps } from '../types'
import type { DynamicSlots, PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { commandPalette: Partial<typeof theme> } }

const commandPalette = tv({ extend: tv(theme), ...(appConfig.ui?.commandPalette || {}) })

export interface CommandPaletteItem {
  prefix?: string
  label?: string
  suffix?: string
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  kbds?: KbdProps['value'][] | KbdProps[]
  loading?: boolean
  disabled?: boolean
  slot?: string
  onSelect?(e?: Event): void
}

export interface CommandPaletteGroup<T> {
  id: string
  label?: string
  slot?: string
  items?: T[]
  /**
   * Whether to filter group items with [useFuse](https://vueuse.org/integrations/useFuse).
   * When `false`, items will not be filtered which is useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue true
   */
  filter?: boolean
  /** Filter group items after the search happened. */
  postFilter?: (searchTerm: string, items: T[]) => T[]
  /** The icon displayed when an item is highlighted. */
  highlightedIcon?: string
}

export interface CommandPaletteProps<G, T> extends Pick<ComboboxRootProps, 'multiple' | 'disabled' | 'modelValue' | 'defaultValue' | 'selectedValue' | 'resetSearchTermOnBlur'>, Pick<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed in the input.
   * @defaultValue appConfig.ui.icons.search
   */
  icon?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   */
  selectedIcon?: string
  /**
   * The placeholder text for the input.
   * @defaultValue 'Type a command or search...'
   */
  placeholder?: InputProps['placeholder']
  /**
   * Display a close button in the input (useful when inside a Modal for example).
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue false
   */
  close?: ButtonProps | boolean
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
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
  ui?: PartialString<typeof commandPalette.slots>
}

export type CommandPaletteEmits<T> = ComboboxRootEmits<T>

type SlotProps<T> = (props: { item: T, index: number }) => any

export type CommandPaletteSlots<G extends { slot?: string }, T extends { slot?: string }> = {
  'empty'(props: { searchTerm?: string }): any
  'close'(props: { ui: any }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<G, SlotProps<T>> & DynamicSlots<T, SlotProps<T>>

extendDevtoolsMeta({ example: 'CommandPaletteExample', ignoreProps: ['groups'] })
</script>

<script setup lang="ts" generic="G extends CommandPaletteGroup<T>, T extends CommandPaletteItem">
import { computed } from 'vue'
import { ComboboxRoot, ComboboxInput, ComboboxPortal, ComboboxContent, ComboboxEmpty, ComboboxViewport, ComboboxGroup, ComboboxLabel, ComboboxItem, ComboboxItemIndicator, useForwardProps, useForwardPropsEmits } from 'radix-vue'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { omit, get } from '../utils'
import { highlight } from '../utils/fuse'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UChip from './Chip.vue'
import UKbd from './Kbd.vue'
import UInput from './Input.vue'

const props = withDefaults(defineProps<CommandPaletteProps<G, T>>(), {
  modelValue: '',
  placeholder: 'Type a command or search...',
  labelKey: 'label'
})
const emits = defineEmits<CommandPaletteEmits<T>>()
const slots = defineSlots<CommandPaletteSlots<G, T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const appConfig = useAppConfig()
const { t } = useLocale()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'disabled', 'multiple', 'modelValue', 'defaultValue', 'selectedValue', 'resetSearchTermOnBlur'), emits)
const inputProps = useForwardProps(reactivePick(props, 'loading', 'loadingIcon', 'placeholder'))

// eslint-disable-next-line vue/no-dupe-keys
const ui = commandPalette()

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

  if (group.filter === false) {
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

  const nonFuseGroups = props.groups?.filter(group => group.filter === false && group.items?.length).map((group) => {
    return getGroupWithItems(group, group.items || [])
  }) || []

  return [
    ...fuseGroups,
    ...nonFuseGroups
  ]
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <ComboboxRoot v-bind="rootProps" v-model:search-term="searchTerm" open :class="ui.root({ class: [props.class, props.ui?.root] })">
    <ComboboxInput as-child>
      <UInput
        variant="none"
        autofocus
        size="lg"
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
              v-bind="typeof close === 'object' ? close : undefined"
              :class="ui.close({ class: props.ui?.close })"
              @click="emits('update:open', false)"
            />
          </slot>
        </template>
      </UInput>
    </ComboboxInput>

    <ComboboxPortal disabled>
      <ComboboxContent :class="ui.content({ class: props.ui?.content })" :dismissable="false">
        <ComboboxEmpty :class="ui.empty({ class: props.ui?.empty })">
          <slot name="empty" :search-term="searchTerm">
            {{ searchTerm ? t('commandPalette.noMatch', { searchTerm }) : t('commandPalette.noData') }}
          </slot>
        </ComboboxEmpty>

        <ComboboxViewport :class="ui.viewport({ class: props.ui?.viewport })">
          <ComboboxGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group({ class: props.ui?.group })">
            <ComboboxLabel v-if="get(group, props.labelKey as string)" :class="ui.label({ class: props.ui?.label })">
              {{ get(group, props.labelKey as string) }}
            </ComboboxLabel>

            <ComboboxItem
              v-for="(item, index) in group.items"
              :key="`group-${groupIndex}-${index}`"
              :value="omit(item, ['matches' as any, 'group' as any, 'onSelect', 'labelHtml', 'suffixHtml'])"
              :disabled="item.disabled"
              :class="ui.item({ class: props.ui?.item })"
              @select="item.onSelect"
            >
              <slot :name="item.slot || group.slot || 'item'" :item="item" :index="index">
                <slot :name="item.slot ? `${item.slot}-leading` : group.slot ? `${group.slot}-leading` : `item-leading`" :item="item" :index="index">
                  <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" :class="ui.itemLeadingIcon({ class: props.ui?.itemLeadingIcon, loading: true })" />
                  <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: props.ui?.itemLeadingIcon })" />
                  <UAvatar v-else-if="item.avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
                  <UChip
                    v-else-if="item.chip"
                    :size="((props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                    inset
                    standalone
                    v-bind="item.chip"
                    :class="ui.itemLeadingChip({ class: props.ui?.itemLeadingChip })"
                  />
                </slot>

                <span v-if="item.labelHtml || get(item, props.labelKey as string) || !!slots[item.slot ? `${item.slot}-label` : group.slot ? `${group.slot}-label` : `item-label`]" :class="ui.itemLabel({ class: props.ui?.itemLabel })">
                  <slot :name="item.slot ? `${item.slot}-label` : group.slot ? `${group.slot}-label` : `item-label`" :item="item" :index="index">
                    <span v-if="item.prefix" :class="ui.itemLabelPrefix({ class: props.ui?.itemLabelPrefix })">{{ item.prefix }}</span>

                    <span :class="ui.itemLabelBase({ class: props.ui?.itemLabelBase })" v-html="item.labelHtml || get(item, props.labelKey as string)" />

                    <span :class="ui.itemLabelSuffix({ class: props.ui?.itemLabelSuffix })" v-html="item.suffixHtml || item.suffix" />
                  </slot>
                </span>

                <span :class="ui.itemTrailing({ class: props.ui?.itemTrailing })">
                  <slot :name="item.slot ? `${item.slot}-trailing` : group.slot ? `${group.slot}-trailing` : `item-trailing`" :item="item" :index="index">
                    <span v-if="item.kbds?.length" :class="ui.itemTrailingKbds({ class: props.ui?.itemTrailingKbds })">
                      <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="((props.ui?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()) as KbdProps['size'])" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
                    </span>
                    <UIcon v-else-if="group.highlightedIcon" :name="group.highlightedIcon" :class="ui.itemTrailingHighlightedIcon({ class: props.ui?.itemTrailingHighlightedIcon })" />
                  </slot>

                  <ComboboxItemIndicator as-child>
                    <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: props.ui?.itemTrailingIcon })" />
                  </ComboboxItemIndicator>
                </span>
              </slot>
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
