<script lang="ts">
import type { CheckboxRootProps, CheckboxRootEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/checkbox'
import type { IconProps } from '../types'
import type { ButtonHTMLAttributes } from '../types/html'
import type { ComponentConfig } from '../types/tv'

type Checkbox = ComponentConfig<typeof theme, AppConfig, 'checkbox'>

export interface CheckboxProps<T = boolean> extends Pick<CheckboxRootProps<T>, 'disabled' | 'required' | 'name' | 'value' | 'id' | 'defaultValue' | 'modelValue' | 'trueValue' | 'falseValue'>, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  label?: string
  description?: string
  /**
   * @defaultValue 'primary'
   */
  color?: Checkbox['variants']['color']
  /**
   * @defaultValue 'list'
   */
  variant?: Checkbox['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Checkbox['variants']['size']
  /**
   * Position of the indicator.
   * @defaultValue 'start'
   */
  indicator?: Checkbox['variants']['indicator']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * The icon displayed when checked.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The icon displayed when the checkbox is indeterminate.
   * @defaultValue appConfig.ui.icons.minus
   * @IconifyIcon
   */
  indeterminateIcon?: IconProps['name']
  class?: any
  ui?: Checkbox['slots']
}

export interface CheckboxEmits<T = boolean> extends CheckboxRootEmits<T> {
  change: [event: Event]
}

export interface CheckboxSlots {
  label?(props: { label: string | undefined }): VNode[]
  description?(props: { description: string | undefined }): VNode[]
}
</script>

<script setup lang="ts" generic="T = boolean">
import { computed, useAttrs, useId } from 'vue'
import { Primitive, CheckboxRoot, CheckboxIndicator, Label } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const _props = defineProps<CheckboxProps<T>>()
const slots = defineSlots<CheckboxSlots>()
const emits = defineEmits<CheckboxEmits<T>>()

const props = useComponentProps<CheckboxProps<T>>('checkbox', _props)

const appConfig = useAppConfig() as Checkbox['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'required', 'value', 'defaultValue', 'modelValue', 'trueValue', 'falseValue'), emits)

const { id: _id, emitFormChange, emitFormInput, size, color, highlight, name, disabled, ariaAttrs } = useFormField<CheckboxProps<T>>(_props)
const id = _id.value ?? useId()

const attrs = useAttrs()
// Omit `data-state` to prevent conflicts with parent components (e.g. TooltipTrigger)
const forwardedAttrs = computed(() => {
  const { 'data-state': _, ...rest } = attrs
  return rest
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.checkbox || {}) })({
  size: size.value ?? props.size,
  color: color.value ?? props.color,
  variant: props.variant,
  indicator: props.indicator,
  highlight: highlight.value ?? props.highlight,
  required: props.required,
  disabled: disabled.value
}))

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <Primitive :as="(!props.variant || props.variant === 'list') ? props.as : Label" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <CheckboxRoot
        :id="id"
        v-bind="{ ...rootProps, ...forwardedAttrs, ...ariaAttrs }"
        :name="name"
        :disabled="disabled"
        data-slot="base"
        :class="ui.base({ class: props.ui?.base })"
        @update:model-value="onUpdate"
      >
        <template #default="{ state }">
          <CheckboxIndicator data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
            <UIcon v-if="state === 'indeterminate'" :name="props.indeterminateIcon || appConfig.ui.icons.minus" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
            <UIcon v-else :name="props.icon || appConfig.ui.icons.check" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
          </CheckboxIndicator>
        </template>
      </CheckboxRoot>
    </div>

    <div v-if="(props.label || !!slots.label) || (props.description || !!slots.description)" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <component :is="(!props.variant || props.variant === 'list') ? Label : 'p'" v-if="props.label || !!slots.label" :for="id" data-slot="label" :class="ui.label({ class: props.ui?.label })">
        <slot name="label" :label="props.label">
          {{ props.label }}
        </slot>
      </component>
      <p v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description" :description="props.description">
          {{ props.description }}
        </slot>
      </p>
    </div>
  </Primitive>
</template>
