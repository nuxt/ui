<script lang="ts">
import _appConfig from '#build/app.config'
import theme from '#build/ui/pininput'
import type { AppConfig } from '@nuxt/schema'
import type { PinInputRootEmits, PinInputRootProps } from 'radix-vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { pininput: Partial<typeof theme> } }

const pininput = tv({ extend: tv(theme), ...(appConfig.ui?.pininput || {}) })

type InputVariants = VariantProps<typeof pininput>

export interface PinInputProps extends Pick<PinInputRootProps, 'as' | 'asChild' | 'defaultValue' | 'dir' | 'disabled' | 'id' | 'mask' | 'modelValue' | 'name' | 'otp' | 'placeholder' | 'required' | 'type'> {
  color?: InputVariants['color']
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  length?: number
  highlight?: boolean
  class?: any
  ui?: PartialString<typeof pininput.slots>
}
</script>

<script setup lang="ts">
import { PinInputInput, PinInputRoot } from 'radix-vue'
import { computed, ref } from 'vue'
import { useFormField } from '../composables/useFormField'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PinInputProps>(), {
  type: 'text',
  autocomplete: 'off',
  autofocusDelay: 0
})
const emits = defineEmits<PinInputRootEmits>()

const [modelValue] = defineModel<string[]>()

const { emitFormChange, size: formGroupSize, color, id, name, highlight, disabled } = useFormField<PinInputProps>(props)

const inputSize = computed(() => formGroupSize.value)

const ui = computed(() => pininput({
  type: props.type as InputVariants['type'],
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  highlight: highlight.value
}))

const inputRef = ref<HTMLInputElement | null>(null)

// Custom function to handle the v-model properties
function onComplete(value: string[]) {
  modelValue.value = value
  emitFormChange()
  emits('complete', modelValue.value)
}
defineExpose({
  inputRef
})
</script>

<template>
  <div>
    <!-- <input
      :id="id"
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :class="ui.base({ class: props.ui?.base })"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      v-bind="$attrs"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
    > -->
    <PinInputRoot
      :id="id"
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :class="ui.root({ class: [props.class, props.ui?.root] })"
      :disabled="disabled"
      :required="required"
      v-bind="$attrs"
      @complete="onComplete"
    >
      <PinInputInput
        v-for="(ids, index) in 5"
        :key="ids"
        :index="index"
        :class="ui.base({ class: props.ui?.base })"
      />
    </PinInputRoot>
    <slot />
  </div>
</template>
