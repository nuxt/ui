<script lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { TimeRangeFieldRootProps, TimeRangeFieldRootEmits, TimeRangeFieldInputProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-time-range'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type InputTimeRange = ComponentConfig<
  typeof theme,
  AppConfig,
  'inputTimeRange'
>

type TimeRange = TimeRangeFieldRootProps['modelValue']

export interface InputTimeRangeProps
  extends
  Omit<TimeRangeFieldRootProps, 'as' | 'asChild' | 'locale' | 'dir'>,
  UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: InputTimeRange['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: InputTimeRange['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: InputTimeRange['variants']['size']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  /**
   * The icon to use as a range separator.
   * @defaultValue appConfig.ui.icons.minus
   * @IconifyIcon
   */
  separatorIcon?: IconProps['name']
  class?: any
  ui?: InputTimeRange['slots']
}

export interface InputTimeRangeEmits extends TimeRangeFieldRootEmits {
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}

export interface InputTimeRangeSlots {
  leading(props: { ui: InputTimeRange['ui'] }): any
  default(props: { ui: InputTimeRange['ui'] }): any
  trailing(props: { ui: InputTimeRange['ui'] }): any
  separator(props: { ui: InputTimeRange['ui'] }): any
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  useForwardPropsEmits,
  TimeRangeFieldRoot,
  TimeRangeFieldInput
} from 'reka-ui'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputTimeRangeProps>(), {
  autofocusDelay: 0
})
const emits = defineEmits<InputTimeRangeEmits>()
const slots = defineSlots<InputTimeRangeSlots>()

const appConfig = useAppConfig() as InputTimeRange['AppConfig']

const rootProps = useForwardPropsEmits(
  reactiveOmit(
    props,
    'id',
    'name',
    'modelValue',
    'defaultValue',
    'color',
    'variant',
    'size',
    'highlight',
    'disabled',
    'autofocus',
    'autofocusDelay',
    'icon',
    'avatar',
    'leading',
    'leadingIcon',
    'trailing',
    'trailingIcon',
    'loading',
    'loadingIcon',
    'separatorIcon',
    'class',
    'ui'
  ),
  emits
)
const {
  emitFormBlur,
  emitFormFocus,
  emitFormChange,
  emitFormInput,
  size: formGroupSize,
  color,
  id,
  name,
  highlight,
  disabled,
  ariaAttrs
} = useFormField<InputTimeRangeProps>(props)
const { orientation, size: fieldGroupSize }
  = useFieldGroup<InputTimeRangeProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName }
  = useComponentIcons(props)

const [DefineSegmentsTemplate, ReuseSegmentsTemplate] = createReusableTemplate<{
  segments?: { part: TimeRangeFieldInputProps['part'], value: string }[]
  type?: 'start' | 'end'
}>()

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() =>
  tv({ extend: tv(theme), ...(appConfig.ui?.inputTimeRange || {}) })({
    color: color.value,
    variant: props.variant,
    size: inputSize.value,
    highlight: highlight.value,
    loading: props.loading,
    leading: isLeading.value || !!props.avatar || !!slots.leading,
    trailing: isTrailing.value || !!slots.trailing,
    fieldGroup: orientation.value
  })
)

const inputsRef = ref<ComponentPublicInstance[]>([])

function onUpdate(value: TimeRange) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)

  emitFormChange()
  emitFormInput()
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

function onFocus(event: FocusEvent) {
  emitFormFocus()
  emits('focus', event)
}

function autoFocus() {
  if (props.autofocus) {
    inputsRef.value[0]?.$el?.focus()
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

defineExpose({
  inputsRef
})
</script>

<template>
  <DefineSegmentsTemplate v-slot="{ segments, type }">
    <TimeRangeFieldInput
      v-for="(segment, index) in segments"
      :key="`${segment.part}-${index}`"
      :ref="(el) => (inputsRef[index] = el as ComponentPublicInstance)"
      :type="type!"
      :part="segment.part"
      data-slot="segment"
      :class="ui.segment({ class: props.ui?.segment })"
    >
      {{ segment.value.trim() }}
    </TimeRangeFieldInput>
  </DefineSegmentsTemplate>

  <TimeRangeFieldRoot
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :id="id"
    v-slot="{ segments }"
    :model-value="modelValue"
    :default-value="defaultValue"
    :name="name"
    :disabled="disabled"
    data-slot="base"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
    @blur="onBlur"
    @focus="onFocus"
  >
    <ReuseSegmentsTemplate :segments="segments.start" type="start" />
    <slot name="separator" :ui="ui">
      <UIcon
        :name="separatorIcon || appConfig.ui.icons.minus"
        data-slot="separatorIcon"
        :class="ui.separatorIcon({ class: props.ui?.separatorIcon })"
      />
    </slot>
    <ReuseSegmentsTemplate :segments="segments.end" type="end" />

    <slot :ui="ui" />

    <span
      v-if="isLeading || !!avatar || !!slots.leading"
      data-slot="leading"
      :class="ui.leading({ class: props.ui?.leading })"
    >
      <slot name="leading" :ui="ui">
        <UIcon
          v-if="isLeading && leadingIconName"
          :name="leadingIconName"
          data-slot="leadingIcon"
          :class="ui.leadingIcon({ class: props.ui?.leadingIcon })"
        />
        <UAvatar
          v-else-if="!!avatar"
          :size="
            (props.ui?.leadingAvatarSize
              || ui.leadingAvatarSize()) as AvatarProps['size']
          "
          v-bind="avatar"
          data-slot="leadingAvatar"
          :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })"
        />
      </slot>
    </span>

    <span
      v-if="isTrailing || !!slots.trailing"
      data-slot="trailing"
      :class="ui.trailing({ class: props.ui?.trailing })"
    >
      <slot name="trailing" :ui="ui">
        <UIcon
          v-if="trailingIconName"
          :name="trailingIconName"
          data-slot="trailingIcon"
          :class="ui.trailingIcon({ class: props.ui?.trailingIcon })"
        />
      </slot>
    </span>
  </TimeRangeFieldRoot>
</template>
