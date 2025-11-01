<script lang="ts">
import type { TimeFieldRootProps, TimeFieldRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-time'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type InputTime = ComponentConfig<typeof theme, AppConfig, 'inputTime'>

export interface InputTimeProps extends Omit<TimeFieldRootProps, 'as' | 'locale' | 'dir'>, UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  color?: InputTime['variants']['color']
  variant?: InputTime['variants']['variant']
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
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}

export interface InputTimeSlots {
  leading(props: { ui: InputTime['ui'] }): any
  default(props: { ui: InputTime['ui'] }): any
  trailing(props: { ui: InputTime['ui'] }): any
}
</script>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { TimeFieldRoot, TimeFieldInput, useForwardPropsEmits, Primitive } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<InputTimeProps>(), {
  autofocusDelay: 0
})
const emits = defineEmits<InputTimeEmits>()
const slots = defineSlots<InputTimeSlots>()

const { code: codeLocale, dir } = useLocale()
const appConfig = useAppConfig() as InputTime['AppConfig']

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'modelValue', 'defaultValue', 'color', 'variant', 'size', 'highlight', 'autofocus', 'autofocusDelay', 'locale', 'icon', 'avatar', 'class', 'ui'), emits)

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formGroupSize, name, highlight, disabled, ariaAttrs } = useFormField<InputTimeProps>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputTimeProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const locale = computed(() => props.locale || codeLocale.value)
const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputTime || {}) })({
  color: color.value,
  variant: props.variant,
  size: inputSize.value,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}))

const inputsRef = ref<ComponentPublicInstance[]>([])

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
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <TimeFieldRoot
      v-bind="{ ...rootProps, ...ariaAttrs }"
      :id="id"
      v-slot="{ segments }"
      :model-value="modelValue"
      :default-value="defaultValue"
      :name="name"
      :disabled="disabled"
      :locale="locale"
      :dir="dir"
      :class="ui.base({ class: [props.ui?.base] })"
      @update:model-value="onUpdate"
      @blur="onBlur"
      @focus="onFocus"
    >
      <TimeFieldInput
        v-for="(segment, index) in segments"
        :key="`${segment.part}-${index}`"
        :ref="el => (inputsRef[index] = el as ComponentPublicInstance)"
        :part="segment.part"
        :class="segment.part !== 'literal' ? ui.segment({ class: props.ui?.segment }) : ''"
      >
        {{ segment.value.trim() }}
      </TimeFieldInput>

      <slot :ui="ui" />

      <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading" :ui="ui">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
        </slot>
      </span>

      <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing" :ui="ui">
          <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </span>
    </TimeFieldRoot>
  </Primitive>
</template>
