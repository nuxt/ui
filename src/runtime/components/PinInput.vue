<script lang="ts">
import _appConfig from '#build/app.config'
import theme from '#build/ui/pin-input'
import type { AppConfig } from '@nuxt/schema'
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import type { PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { pinInput: Partial<typeof theme> } }

const pinInput = tv({ extend: tv(theme), ...(appConfig.ui?.pinInput || {}) })

type PinInputVariants = VariantProps<typeof pinInput>

export interface PinInputProps extends Pick<PinInputRootProps, 'defaultValue' | 'disabled' | 'id' | 'mask' | 'modelValue' | 'name' | 'otp' | 'placeholder' | 'required' | 'type'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  color?: PinInputVariants['color']
  variant?: PinInputVariants['variant']
  size?: PinInputVariants['size']
  length?: number | string
  highlight?: boolean
  class?: any
  ui?: PartialString<typeof pinInput.slots>
}

export type PinInputEmits = PinInputRootEmits & {
  change: [payload: Event]
  blur: [payload: Event]
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PinInputInput, PinInputRoot, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useFormField } from '../composables/useFormField'
import { looseToNumber } from '../utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PinInputProps>(), {
  type: 'text',
  length: 5
})
const emits = defineEmits<PinInputEmits>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultValue', 'disabled', 'id', 'mask', 'modelValue', 'name', 'otp', 'placeholder', 'required', 'type'), emits)
const { emitFormInput, emitFormChange, emitFormBlur, size, color, id, name, highlight, disabled } = useFormField<PinInputProps>(props)

const ui = computed(() => pinInput({
  color: color.value,
  variant: props.variant,
  size: size.value,
  highlight: highlight.value
}))

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
</script>

<template>
  <PinInputRoot
    v-bind="rootProps"
    :id="id"
    :name="name"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    @update:model-value="emitFormInput()"
    @complete="onComplete"
  >
    <PinInputInput
      v-for="(ids, index) in looseToNumber(props.length)"
      :key="ids"
      :index="index"
      :class="ui.base({ class: props.ui?.base })"
      v-bind="$attrs"
      :disabled="disabled"
      @blur="onBlur"
    />
  </PinInputRoot>
</template>
