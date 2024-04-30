<script lang="ts">
import { tv } from 'tailwind-variants'
import type { ComboboxRootProps, ComboboxRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import _appConfig from '#build/app.config'
import theme from '#build/ui/command-palette'
import type { UseComponentIconsProps } from '#ui/composables/useComponentIcons'
import type { AvatarProps, ButtonProps, ChipProps, KbdProps } from '#ui/types'
import type { DynamicSlots } from '#ui/types/utils'

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
  disabled?: boolean
  slot?: string
  select? (e: Event): void
}

export interface CommandPaletteGroup<T> {
  id: string
  label?: string
  items?: T[]
  /** The icon displayed when an item is highlighted. */
  highlightedIcon?: string
}

export interface CommandPaletteProps<G, T> extends Pick<ComboboxRootProps, 'as' | 'multiple' | 'disabled' | 'modelValue'>, Omit<UseComponentIconsProps, 'leading' | 'trailing' | 'icon'> {
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
  /**
   * The placeholder text when the input is empty.
   * @defaultValue `'Type a command or search...'`
   */
  placeholder?: string
  /** Display a close button in the input, clicking it will emit the `close` event. */
  close?: ButtonProps | boolean
  groups?: G[]
  fuse?: UseFuseOptions<T>
  class?: any
  ui?: Partial<typeof commandPalette.slots>
}

export type CommandPaletteEmits<T> = {
  close: []
} & Omit<ComboboxRootEmits<T>, 'update:open'>

type SlotProps<T> = (props: { item: T, index: number }) => any

export type CommandPaletteSlots<T extends { slot?: string }> = {
  empty(props: { searchTerm: string }): any
  close(): any
  leading: SlotProps<T>
  label: SlotProps<T>
  trailing: SlotProps<T>
  item: SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="G extends CommandPaletteGroup<T>, T extends CommandPaletteItem">
import { computed } from 'vue'
import { ComboboxRoot, ComboboxInput, ComboboxPortal, ComboboxContent, ComboboxEmpty, ComboboxViewport, ComboboxGroup, ComboboxLabel, ComboboxItem, ComboboxItemIndicator, useForwardPropsEmits } from 'radix-vue'
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
defineSlots<CommandPaletteSlots<T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'disabled', 'multiple', 'modelValue'), emits)

const ui = computed(() => tv({ extend: commandPalette, slots: props.ui })())

const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    ignoreLocation: true,
    keys: ['label', 'suffix']
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true
}))

const items = computed(() => props.groups?.flatMap(group => group.items?.map(item => ({ ...item, group: group.id })) || []) || [])

const { results: fuseResults } = useFuse(searchTerm, items, fuse)

const groups = computed(() => {
  if (!fuseResults.value?.length) {
    return []
  }

  const groups: Record<string, T[]> = fuseResults.value.reduce((acc, result) => {
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
    if (!group) {
      return
    }

    return {
      ...group,
      items: items.slice(0, fuse.value.resultLimit)
    }
  }).filter(Boolean)
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <ComboboxRoot v-bind="rootProps" v-model:search-term="searchTerm" open :class="ui.root({ class: props.class })">
    <ComboboxInput as-child>
      <UInput
        variant="none"
        autofocus
        :icon="icon || appConfig.ui.icons.search"
        :loading="loading"
        :loading-icon="loadingIcon"
        :placeholder="placeholder"
        :class="ui.input()"
      >
        <template v-if="close || $slots.close" #trailing>
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
              @click="emits('close')"
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
            <ComboboxLabel v-if="group!.label" :class="ui.label()">
              {{ group!.label }}
            </ComboboxLabel>

            <ComboboxItem
              v-for="(item, index) in group!.items"
              :key="`group-${groupIndex}-${index}`"
              :value="omit(item, ['matches' as any, 'group' as any, 'select'])"
              :disabled="item.disabled"
              :class="ui.item()"
              @select="item.select"
            >
              <slot :name="item.slot || 'item'" :item="item" :index="index">
                <slot :name="`${group.id}-leading`" :item="item" :index="index">
                  <slot name="leading" :item="item" :index="index">
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
                </slot>

                <span v-if="item.label || $slots.label || $slots[`${group.id}-label`]" :class="ui.itemLabel()">
                  <slot :name="`${group.id}-label`" :item="item" :index="index">
                    <slot name="label" :item="item" :index="index">
                      <span v-if="item.prefix" :class="ui.itemLabelPrefix()">{{ item.prefix }}</span>

                      <span :class="ui.itemLabelBase()" v-html="highlight(item, searchTerm, 'label') || item.label" />

                      <span :class="ui.itemLabelSuffix()" v-html="highlight(item, searchTerm, undefined, ['label']) || item.suffix" />
                    </slot>
                  </slot>
                </span>

                <span :class="ui.itemTrailing()">
                  <slot :name="`${group.id}-trailing`" :item="item" :index="index">
                    <slot name="trailing" :item="item" :index="index">
                      <span v-if="item.kbds?.length" :class="ui.itemTrailingKbds()">
                        <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" size="md" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
                      </span>
                      <UIcon v-else-if="group.highlightedIcon" :name="group.highlightedIcon" :class="ui.itemTrailingHighlightedIcon()" />
                    </slot>
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
