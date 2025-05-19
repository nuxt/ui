<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/pin-input'
import type { ComponentConfig } from '../types/utils'

type PinInput = ComponentConfig<typeof theme, AppConfig, 'pinInput'>

export interface PinInputProps extends Pick<PinInputRootProps, 'defaultValue' | 'disabled' | 'id' | 'mask' | 'modelValue' | 'name' | 'otp' | 'placeholder' | 'required' | 'type'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: PinInput['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: PinInput['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: PinInput['variants']['size']
  /**
   * The number of input fields.
   * @defaultValue 5
   */
  length?: number | string
  autofocus?: boolean
  autofocusDelay?: number
  highlight?: boolean
  class?: any
  ui?: PinInput['slots']
}

export type PinInputEmits = PinInputRootEmits & {
  change: [payload: Event]
  blur: [payload: Event]
}

</script>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { PinInputInput, PinInputRoot, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { looseToNumber } from '../utils'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<PinInputProps>(), {
  type: 'text',
  length: 5,
  autofocusDelay: 0
})
const emits = defineEmits<PinInputEmits>()

const appConfig = useAppConfig() as PinInput['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultValue', 'disabled', 'id', 'mask', 'modelValue', 'name', 'otp', 'placeholder', 'required', 'type'), emits)

const { emitFormInput, emitFormFocus, emitFormChange, emitFormBlur, size, color, id, name, highlight, disabled, ariaAttrs } = useFormField<PinInputProps>(props)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pinInput || {}) })({
  color: color.value,
  variant: props.variant,
  size: size.value,
  highlight: highlight.value
}))

const inputsRef = ref<ComponentPublicInstance[]>([])

const completed = ref(false)
function onComplete(value: string[]) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
}

function onBlur(event: FocusEvent) {
  if (!event.relatedTarget || completed.value) {
    emits('blur', event)
    emitFormBlur()
  }
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
  <PinInputRoot
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :id="id"
    :name="name"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="emitFormInput()"
    @complete="onComplete"
  >
    <PinInputInput
      v-for="(ids, index) in looseToNumber(props.length)"
      :key="ids"
      :ref="el => (inputsRef[index] = el as ComponentPublicInstance)"
      :index="index"
      :class="ui.base({ class: props.ui?.base })"
      :disabled="disabled"
      @blur="onBlur"
      @focus="emitFormFocus"
    />
  </PinInputRoot>
</template>
