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

export interface ToggleGroupItem extends Omit<ButtonProps, Exclude<LinkPropsKeys, 'activeClass' | 'inactiveClass'> | 'type' | 'loadingAuto'> {
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
  /** Attach the items together, like in a FieldGroup. */
  attached?: boolean
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

export interface ToggleGroupEmits extends ToggleGroupRootEmits {
  change: [event: Event]
}

type SlotProps<T extends ToggleGroupItem> = (props: { item: T, index: number, pressed: boolean, ui: Parameters<NonNullable<ButtonSlots['default']>>[0]['ui'] }) => VNode[]

export interface ToggleGroupSlots<T extends ToggleGroupItem = ToggleGroupItem> {
  leading?: SlotProps<T>
  default?: SlotProps<T>
  trailing?: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends ToggleGroupItem">
import { computed, provide, useId } from 'vue'
import { ToggleGroupRoot, ToggleGroupItem as RToggleGroupItem } from 'reka-ui'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { fieldGroupInjectionKey, useFieldGroup } from '../composables/useFieldGroup'
import { useFormField } from '../composables/useFormField'
import { get, omit } from '../utils'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<ToggleGroupProps<T>>(), {
  type: 'single',
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

const rootProps = useForwardProps(props, ['as', 'type', 'modelValue', 'defaultValue', 'loop', 'rovingFocus', 'orientation', 'required'], emits)

const { id: _id, name, size: formFieldSize, color: formFieldColor, disabled: formFieldDisabled, labelId, ariaAttrs, emitFormChange, emitFormInput } = useFormField<ToggleGroupProps<T>>(_props, { bind: false })
const id = _id.value ?? useId()

const { size: fieldGroupSize } = useFieldGroup<ToggleGroupProps<T>>(_props)

// The `neutral` default lives here rather than in `withDefaults`, so `useFormField` doesn't return it over `<UTheme :props>`
// eslint-disable-next-line vue/no-dupe-keys
const color = computed(() => formFieldColor.value ?? props.color ?? 'neutral')
// eslint-disable-next-line vue/no-dupe-keys
const size = computed(() => fieldGroupSize.value ?? formFieldSize.value ?? props.size)

const disabled = computed(() => formFieldDisabled.value ?? props.disabled)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.toggleGroup || {}) })({
  orientation: props.orientation,
  fieldGroup: props.attached ? props.orientation : undefined
}))

// Rounds the item buttons like in a FieldGroup when attached, and keeps a wrapping FieldGroup from reaching them
provide(fieldGroupInjectionKey, computed(() => ({
  size: undefined,
  orientation: props.attached ? props.orientation : undefined
})))

function getValue(item: T, index: number) {
  return get(item, props.valueKey as string) ?? String(index)
}

function getButtonProps(item: T): ButtonProps {
  return defu({
    ...omit(item as ToggleGroupItem, ['value', 'disabled', 'label', props.valueKey as string, props.labelKey as string]),
    label: get(item, props.labelKey as string)
  }, {
    color: color.value,
    variant: props.variant,
    activeColor: props.activeColor,
    activeVariant: props.activeVariant,
    size: size.value
  })
}

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <ToggleGroupRoot
    :id="id"
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :name="disabled ? undefined : name"
    :disabled="disabled"
    :aria-labelledby="($attrs['aria-labelledby'] as string | undefined) ?? ($attrs['aria-label'] ? undefined : labelId)"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onUpdate"
  >
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
