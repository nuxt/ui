<script lang="ts">
import _appConfig from '#build/app.config'
import theme from '#build/ui/pininput'
import type { AppConfig } from '@nuxt/schema'
import type { PinInputRootEmits, PinInputRootProps } from 'radix-vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { pininput: Partial<typeof theme> } }

const pininput = tv({ extend: tv(theme), ...(appConfig.ui?.pininput || {}) })

type PinInputVariants = VariantProps<typeof pininput>

export interface PinInputProps extends Pick<PinInputRootProps, 'as' | 'asChild' | 'defaultValue' | 'dir' | 'disabled' | 'id' | 'mask' | 'modelValue' | 'name' | 'otp' | 'placeholder' | 'required' | 'type'> {
  color?: PinInputVariants['color']
  variant?: PinInputVariants['variant']
  size?: PinInputVariants['size']
  length?: number | string
  highlight?: boolean
  class?: any
  ui?: PartialString<typeof pininput.slots>
}

export interface PinInputEmits extends PinInputRootEmits {}
</script>

<script setup lang="ts">
import { PinInputInput, PinInputRoot } from 'radix-vue'
import { computed } from 'vue'
import { useFormField } from '../composables/useFormField'
import { looseToNumber } from '../utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PinInputProps>(), {
  type: 'text',
  length: 5
})
const emits = defineEmits<PinInputEmits>()

const [modelValue] = defineModel<string[]>()

const { emitFormChange, size: formGroupSize, color, id, name, highlight, disabled } = useFormField<PinInputProps>(props)

const inputSize = computed(() => formGroupSize.value)

const ui = computed(() => pininput({
  type: props.type as PinInputVariants['type'],
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  highlight: highlight.value
}))

function onComplete(value: string[]) {
  modelValue.value = value
  emitFormChange()
  emits('complete', modelValue.value)
}
</script>

<template>
  <PinInputRoot
    :id="id"
    :as="as"
    :as-child="asChild"
    :default-value="defaultValue"
    :dir="dir"
    :disabled="disabled"
    :mask="mask"
    :value="modelValue"
    :name="name"
    :otp="otp"
    :placeholder="placeholder"
    :required="required"
    :type="type"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    v-bind="$attrs"
    @complete="onComplete"
  >
    <PinInputInput
      v-for="(ids, index) in looseToNumber(props.length)"
      :key="ids"
      :index="index"
      :class="ui.base({ class: props.ui?.base })"
    />
  </PinInputRoot>
</template>
