<script lang="ts">
import type { ToggleGroupRootProps, ToggleGroupRootEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/toggle-group'
import type { ButtonProps, ButtonSlots } from './Button.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { AcceptableValue, GetItemKeys } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type ToggleGroup = ComponentConfig<typeof theme, AppConfig, 'toggleGroup'>

export interface ToggleGroupItem extends Omit<ButtonProps, Exclude<LinkPropsKeys, 'activeClass' | 'inactiveClass'> | 'type'> {
  /**
   * A unique value for the item. Defaults to the index.
   */
  value?: AcceptableValue
  [key: string]: any
}

export interface ToggleGroupProps<T extends ToggleGroupItem = ToggleGroupItem> extends Pick<ToggleGroupRootProps, 'type' | 'modelValue' | 'defaultValue' | 'disabled' | 'loop' | 'rovingFocus' | 'name' | 'required'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: T[]
  /**
   * The color of the items.
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * The variant of the items.
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  /**
   * The color of the pressed items.
   * @defaultValue 'primary'
   */
  activeColor?: ButtonProps['color']
  /**
   * The variant of the pressed items.
   * @defaultValue 'soft'
   */
  activeVariant?: ButtonProps['variant']
  size?: ButtonProps['size']
  /**
   * The orientation the items are laid out.
   * @defaultValue 'horizontal'
   */
  orientation?: ToggleGroup['variants']['orientation']
  /**
   * The key used to get the value from the item.
   * @defaultValue 'value'
   */
  valueKey?: GetItemKeys<T>
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  class?: any
  ui?: ToggleGroup['slots']
}

export interface ToggleGroupEmits extends ToggleGroupRootEmits {}

type SlotProps<T extends ToggleGroupItem> = (props: { item: T, index: number, pressed: boolean, ui: Parameters<NonNullable<ButtonSlots['default']>>[0]['ui'] }) => VNode[]

export interface ToggleGroupSlots<T extends ToggleGroupItem = ToggleGroupItem> {
  leading?: SlotProps<T>
  default?: SlotProps<T>
  trailing?: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends ToggleGroupItem">
import { computed } from 'vue'
import { ToggleGroupRoot, ToggleGroupItem as RToggleGroupItem } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { get, omit } from '../utils'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<ToggleGroupProps<T>>(), {
  type: 'single',
  color: 'neutral',
  variant: 'ghost',
  activeColor: 'primary',
  activeVariant: 'soft',
  orientation: 'horizontal',
  rovingFocus: true,
  loop: true,
  valueKey: 'value',
  labelKey: 'label'
})
const emits = defineEmits<ToggleGroupEmits>()
const slots = defineSlots<ToggleGroupSlots<T>>()

const props = useComponentProps<ToggleGroupProps<T>>('toggleGroup', _props)

const appConfig = useAppConfig() as ToggleGroup['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'type', 'modelValue', 'defaultValue', 'disabled', 'loop', 'rovingFocus', 'orientation', 'name', 'required'), emits)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.toggleGroup || {}) })({
  orientation: props.orientation
}))

function getValue(item: T, index: number) {
  return get(item, props.valueKey as string) ?? String(index)
}

function getButtonProps(item: T): ButtonProps {
  return defu(omit(item as ToggleGroupItem, ['value', 'disabled', props.valueKey as string, props.labelKey as string]), {
    label: get(item, props.labelKey as string),
    color: props.color,
    variant: props.variant,
    activeColor: props.activeColor,
    activeVariant: props.activeVariant,
    size: props.size
  })
}
</script>

<template>
  <ToggleGroupRoot v-bind="rootProps" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <RToggleGroupItem
      v-for="(item, index) in props.items"
      :key="getValue(item, index)"
      v-slot="{ pressed }"
      :value="getValue(item, index)"
      :disabled="item.disabled"
      as-child
    >
      <UButton
        v-bind="getButtonProps(item)"
        :active="pressed"
        data-slot="item"
        :class="ui.item({ class: [props.ui?.item, item.class] })"
      >
        <template v-if="!!slots.leading" #leading="{ ui: buttonUi }">
          <slot name="leading" :item="item" :index="index" :pressed="pressed" :ui="buttonUi" />
        </template>
        <template v-if="!!slots.default" #default="{ ui: buttonUi }">
          <slot :item="item" :index="index" :pressed="pressed" :ui="buttonUi" />
        </template>
        <template v-if="!!slots.trailing" #trailing="{ ui: buttonUi }">
          <slot name="trailing" :item="item" :index="index" :pressed="pressed" :ui="buttonUi" />
        </template>
      </UButton>
    </RToggleGroupItem>
  </ToggleGroupRoot>
</template>
