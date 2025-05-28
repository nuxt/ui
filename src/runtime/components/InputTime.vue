<script lang="ts">
import type { TimeFieldRootProps, TimeFieldRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-time'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { ComponentConfig } from '../types/utils'

type InputTime = ComponentConfig<typeof theme, AppConfig, 'inputTime'>

export interface InputTimeProps extends Pick<TimeFieldRootProps, 'defaultValue' | 'defaultPlaceholder' | 'placeholder' | 'modelValue' | 'hourCycle' | 'step' | 'granularity' | 'hideTimeZone' | 'minValue' | 'maxValue' | 'disabled' | 'readonly' | 'required' | 'id' | 'name' | 'required'>, UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: InputTime['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: InputTime['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: InputTime['variants']['size']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  /**
   * The locale to use for formatting and parsing numbers.
   * @defaultValue UApp.locale.code
   */
  locale?: string
  class?: any
  ui?: InputTime['slots']
}

export interface InputTimeEmits extends TimeFieldRootEmits {
  blur: [event: FocusEvent]
  change: [event: Event]
}

export interface InputTimeSlots {
  leading(props?: {}): any
  default(props?: {}): any
  trailing(props?: {}): any
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Primitive, TimeFieldRoot, TimeFieldInput, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputTimeProps>(), {
  autofocusDelay: 0
})
const emits = defineEmits<InputTimeEmits>()
const slots = defineSlots<InputTimeSlots>()

const { code: codeLocale } = useLocale()
const appConfig = useAppConfig() as InputTime['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'hourCycle', 'step', 'granularity', 'hideTimeZone', 'readonly', 'required'), emits)

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formGroupSize, name, highlight, disabled, ariaAttrs } = useFormField<InputTimeProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputTimeProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const locale = computed(() => props.locale || codeLocale.value)
const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputTime || {}) })({
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}))

const inputRef = ref<InstanceType<typeof TimeFieldInput> | null>(null)

function onUpdate(value: any) {
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

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus()
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

defineExpose({
  inputRef
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <TimeFieldRoot
      v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
      :id="id"
      ref="inputRef"
      v-slot="{ segments }"
      :name="name"
      :default-value="defaultValue"
      :model-value="modelValue"
      :default-placeholder="defaultPlaceholder"
      :placeholder="placeholder"
      :max-value="maxValue"
      :min-value="minValue"
      :locale="locale"
      :disabled="disabled"
      :class="ui.base({ class: props.ui?.base })"
      @update:model-value="onUpdate"
      @blur="onBlur"
      @focus="emitFormFocus"
    >
      <TimeFieldInput
        v-for="segment in segments"
        :key="segment.part"
        :part="segment.part"
        :class="ui.segment({ class: props.ui?.segment })"
      >
        {{ segment.value }}
      </TimeFieldInput>

      <span v-if="isLeading || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        </slot>
      </span>

      <slot />

      <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing">
          <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </span>
    </TimeFieldRoot>
  </Primitive>
</template>
