<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/time-field'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { ComponentConfig } from '../types/utils'

type TimeField = ComponentConfig<typeof theme, AppConfig, 'timeField'>

export interface TimeFieldProps extends UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  /** The placeholder text when the input is empty. */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: TimeField['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: TimeField['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: TimeField['variants']['size']
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * The granularity to use for formatting times.
   * @defaultValue 'minute'
   */
  granularity?: 'hour' | 'minute' | 'second'
  /**
   * The hour cycle used for formatting times.
   */
  hourCycle?: 12 | 24
  /**
   * Whether to hide the time zone segment of the field
   */
  hideTimeZone?: boolean
  /**
   * The locale to use for formatting dates
   */
  locale?: string
  /**
   * The minimum time that can be selected
   */
  minValue?: any
  /**
   * The maximum time that can be selected
   */
  maxValue?: any
  class?: any
  ui?: TimeField['slots']
}

export interface TimeFieldEmits {
  (e: 'update:modelValue' | 'update:placeholder', payload: any): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
}

export interface TimeFieldSlots {
  leading(props?: {}): any
  default(props?: {}): any
  trailing(props?: {}): any
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Primitive, TimeFieldRoot, TimeFieldInput } from 'reka-ui'
import { Time } from '@internationalized/date'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TimeFieldProps>(), {
  granularity: 'minute',
  hideTimeZone: false
})
const emits = defineEmits<TimeFieldEmits>()
const slots = defineSlots<TimeFieldSlots>()

const [modelValue] = defineModel<any>()

// Default placeholder - when needed, use a Time object of 12:00
const defaultPlaceholder = new Time(12, 0, 0)

const appConfig = useAppConfig() as TimeField['AppConfig']
const { emitFormBlur, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, emitFormFocus, ariaAttrs } = useFormField<TimeFieldProps>(props, { deferInputValidation: true })
const { orientation, size: buttonGroupSize } = useButtonGroup<TimeFieldProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const fieldSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.timeField || {}) })({
  color: color.value,
  variant: props.variant,
  size: fieldSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}))

const fieldRef = ref<HTMLElement | null>(null)

function updateValue(value: any) {
  modelValue.value = value
  emitFormInput()
  emitFormChange()
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

defineExpose({
  fieldRef
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <TimeFieldRoot
      ref="fieldRef"
      :id="id"
      :name="name"
      :model-value="modelValue"
      :default-placeholder="defaultPlaceholder"
      :granularity="granularity"
      :hour-cycle="hourCycle"
      :hide-time-zone="hideTimeZone"
      :locale="locale"
      :min-value="minValue"
      :max-value="maxValue"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      v-slot="{ segments }"
      v-bind="{ ...ariaAttrs }"
      class="flex h-full w-full items-center"
      @update:model-value="updateValue"
      @update:placeholder="$emit('update:placeholder', $event)"
      @blur="onBlur"
      @focus="emitFormFocus"
    >
      <!-- Leading Icon/Slot -->
      <span v-if="isLeading || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        </slot>
      </span>

      <!-- Time Field Segments -->
      <div class="flex flex-1 items-center justify-center">
        <template v-for="segment in segments" :key="segment.part">
          <TimeFieldInput
            v-if="segment.part === 'literal'"
            :part="segment.part"
            :class="ui.base({ class: props.ui?.base })"
          >
            {{ segment.value }}
          </TimeFieldInput>
          <TimeFieldInput
            v-else
            :part="segment.part"
            :class="ui.base({ class: props.ui?.base })"
          >
            {{ segment.value }}
          </TimeFieldInput>
        </template>
      </div>

      <slot />

      <!-- Trailing Icon/Slot -->
      <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing">
          <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </span>
    </TimeFieldRoot>
  </Primitive>
</template>
