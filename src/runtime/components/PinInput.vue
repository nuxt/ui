<script lang="ts">
import _appConfig from '#build/app.config'
import theme from '#build/ui/pin-input'
import type { AppConfig } from '@nuxt/schema'
import type { PinInputRootEmits, PinInputRootProps } from 'radix-vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { pinInput: Partial<typeof theme> } }

const pinInput = tv({ extend: tv(theme), ...(appConfig.ui?.pinInput || {}) })

type PinInputVariants = VariantProps<typeof pinInput>

export interface PinInputProps extends Pick<PinInputRootProps, 'as' | 'asChild' | 'defaultValue' | 'dir' | 'disabled' | 'id' | 'mask' | 'modelValue' | 'name' | 'otp' | 'placeholder' | 'required' | 'type'> {
  color?: PinInputVariants['color']
  variant?: PinInputVariants['variant']
  size?: PinInputVariants['size']
  length?: number | string
  highlight?: boolean
  class?: any
  ui?: PartialString<typeof pinInput.slots>
}

export interface PinInputEmits extends PinInputRootEmits {}
export interface PinInputSlots {}
</script>

<script setup lang="ts">
import { PinInputInput, PinInputRoot, useForwardPropsEmits } from 'radix-vue'
import { computed } from 'vue'
import { reactivePick } from '@vueuse/core'
import { looseToNumber } from '../utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PinInputProps>(), {
  type: 'text',
  length: 5
})
// const slots = defineSlots<PinInputSlots>()
const emits = defineEmits<PinInputEmits>()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'asChild', 'defaultValue', 'dir', 'disabled', 'id', 'mask', 'modelValue', 'name', 'otp', 'placeholder', 'required', 'type'), emits)

const ui = computed(() => pinInput({
  color: props.color,
  variant: props.variant,
  size: props.size,
  highlight: props.highlight
}))
</script>

<template>
  <PinInputRoot
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    v-bind="rootProps"
  >
    <PinInputInput
      v-for="(ids, index) in looseToNumber(props.length)"
      :key="ids"
      :index="index"
      :class="ui.base({ class: props.ui?.base })"
    />
  </PinInputRoot>
</template>
