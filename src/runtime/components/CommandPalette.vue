<script lang="ts">
import { tv } from 'tailwind-variants'
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxItemProps } from 'radix-vue'
import type { FuseResult } from 'fuse.js'
import type { AppConfig } from '@nuxt/schema'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import _appConfig from '#build/app.config'
import theme from '#build/ui/command-palette'
import type { UseComponentIconsProps } from '#ui/composables/useComponentIcons'
import type { AvatarProps, ButtonProps, ChipProps, KbdProps, InputProps } from '#ui/types'
import type { DynamicSlots } from '#ui/types/utils'

const appConfig = _appConfig as AppConfig & { ui: { commandPalette: Partial<typeof theme> } }

const commandPalette = tv({ extend: tv(theme), ...(appConfig.ui?.commandPalette || {}) })

export interface CommandPaletteItem extends Pick<ComboboxItemProps, 'disabled'> {
  prefix?: string
  label?: string
  suffix?: string
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  kbds?: KbdProps['value'][] | KbdProps[]
  slot?: string
  select? (e: Event): void
}

export interface CommandPaletteGroup<T> {
  id: string
  label?: string
  slot?: string
  items?: T[]
  /** The icon displayed when an item is highlighted. */
  highlightedIcon?: string
}

export interface CommandPaletteProps<G, T> extends Pick<ComboboxRootProps, 'as' | 'multiple' | 'disabled' | 'modelValue' | 'defaultValue'>, Pick<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
  /**
   * The icon displayed in the input.
   * @defaultValue `appConfig.ui.icons.search`
   */
  icon?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue `appConfig.ui.icons.check`
   */
  selectedIcon?: string
  placeholder?: InputProps['placeholder']
  /** Display a close button in the input, clicking it will emit the `close` event. */
  close?: ButtonProps | boolean
  groups?: G[]
  fuse?: UseFuseOptions<T>
  class?: any
  ui?: Partial<typeof commandPalette.slots>
}

export type CommandPaletteEmits<T> = ComboboxRootEmits<T>

type SlotProps<T> = (props: { item: T, index: number }) => any

export type CommandPaletteSlots<G extends { slot?: string }, T extends { slot?: string }> = {
  'empty'(props: { searchTerm?: string }): any
  'close'(): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<G, SlotProps<T>> & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="G extends CommandPaletteGroup<T>, T extends CommandPaletteItem">
import { computed } from 'vue'
import { ComboboxRoot, ComboboxInput, ComboboxPortal, ComboboxContent, ComboboxEmpty, ComboboxViewport, ComboboxGroup, ComboboxLabel, ComboboxItem, ComboboxItemIndicator, useForwardProps, useForwardPropsEmits } from 'radix-vue'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { UInput, UAvatar, UIcon, UKbd, UChip } from '#components'
import { useAppConfig } from '#imports'
import { omit } from '#ui/utils'
import { highlight } from '#ui/utils/fuse'

const props = withDefaults(defineProps<CommandPaletteProps<G, T>>(), {
  modelValue: '',
  placeholder: 'Type a command or search...'
})
const emits = defineEmits<CommandPaletteEmits<T>>()
const slots = defineSlots<CommandPaletteSlots<G, T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'disabled', 'multiple', 'modelValue', 'defaultValue'), emits)
const inputProps = useForwardProps(reactivePick(props, 'loading', 'loadingIcon', 'placeholder'))

const ui = computed(() => tv({ extend: commandPalette, slots: props.ui })())

const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    ignoreLocation: true,
    keys: ['label', 'suffix']
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true
}))

const items = computed(() => props.groups?.filter((group) => {
  if (!group.id) {
    console.warn(`[@nuxt/ui] CommandPalette group is missing an \`id\` property`)
    return false
  }

  return true
}).flatMap(group => group.items?.map(item => ({ ...item, group: group.id })) || []) || [])

const { results: fuseResults } = useFuse<T>(searchTerm, items, fuse)

const groups = computed(() => {
  if (!fuseResults.value?.length) {
    return []
  }

  const groups: Record<string, (T & { matches: FuseResult<T>['matches'] })[]> = fuseResults.value.reduce((acc, result) => {
    const { item, matches } = result
    if (!item.group) {
      return acc
    }

    acc[item.group] ||= []
    acc[item.group].push({ ...item, matches })

    return acc
  }, {})

  return Object.entries(groups).map(([id, items]) => {
    const group = props.groups?.find(group => group.id === id)

    return {
      ...group,
      items: items.slice(0, fuse.value.resultLimit)
    }
  })
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <ComboboxRoot v-bind="rootProps" v-model:search-term="searchTerm" open :class="ui.root({ class: props.class })">
    <ComboboxInput as-child>
      <UInput
        variant="none"
        autofocus
        size="md"
        v-bind="inputProps"
        :icon="icon || appConfig.ui.icons.search"
        :class="ui.input()"
      >
        <template v-if="close || !!slots.close" #trailing>
          <slot name="close" :class="ui.close()">
            <UButton
              v-if="close"
              :icon="appConfig.ui.icons.close"
              size="md"
              color="gray"
              variant="ghost"
              aria-label="Close"
              v-bind="typeof close === 'object' ? close : {}"
              :class="ui.close()"
              @click="emits('update:open', false)"
            />
          </slot>
        </template>
      </UInput>
    </ComboboxInput>

    <ComboboxPortal :disabled="true">
      <ComboboxContent :class="ui.content()" :dismissable="false">
        <ComboboxEmpty :class="ui.empty()">
          <slot name="empty" :search-term="searchTerm">
            {{ searchTerm ? `No results for ${searchTerm}` : 'No results' }}
          </slot>
        </ComboboxEmpty>

        <ComboboxViewport :class="ui.viewport()">
          <ComboboxGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group()">
            <ComboboxLabel v-if="group.label" :class="ui.label()">
              {{ group.label }}
            </ComboboxLabel>

            <ComboboxItem
              v-for="(item, index) in group.items"
              :key="`group-${groupIndex}-${index}`"
              :value="omit(item, ['matches' as any, 'group' as any, 'select'])"
              :disabled="item.disabled"
              :class="ui.item()"
              @select="item.select"
            >
              <slot :name="item.slot || group.slot || 'item'" :item="item" :index="index">
                <slot :name="item.slot ? `${item.slot}-leading` : group.slot ? `${group.slot}-leading` : `item-leading`" :item="item" :index="index">
                  <UAvatar v-if="item.avatar" size="2xs" v-bind="item.avatar" :class="ui.itemLeadingAvatar()" />
                  <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon()" />
                  <UChip
                    v-else-if="item.chip"
                    size="md"
                    inset
                    standalone
                    v-bind="item.chip"
                    :class="ui.itemLeadingChip()"
                  />
                </slot>

                <span v-if="item.label || !!slots[item.slot ? `${item.slot}-label` : group.slot ? `${group.slot}-label` : `item-label`]" :class="ui.itemLabel()">
                  <slot :name="item.slot ? `${item.slot}-label` : group.slot ? `${group.slot}-label` : `item-label`" :item="item" :index="index">
                    <span v-if="item.prefix" :class="ui.itemLabelPrefix()">{{ item.prefix }}</span>

                    <span :class="ui.itemLabelBase()" v-html="highlight<T>(item, searchTerm, 'label') || item.label" />

                    <span :class="ui.itemLabelSuffix()" v-html="highlight<T>(item, searchTerm, undefined, ['label']) || item.suffix" />
                  </slot>
                </span>

                <span :class="ui.itemTrailing()">
                  <slot :name="item.slot ? `${item.slot}-trailing` : group.slot ? `${group.slot}-trailing` : `item-trailing`" :item="item" :index="index">
                    <span v-if="item.kbds?.length" :class="ui.itemTrailingKbds()">
                      <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" size="md" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
                    </span>
                    <UIcon v-else-if="group.highlightedIcon" :name="group.highlightedIcon" :class="ui.itemTrailingHighlightedIcon()" />
                  </slot>

                  <ComboboxItemIndicator as-child>
                    <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingSelectedIcon()" />
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
