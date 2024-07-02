<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { SwitchRootProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/switch'
import type { PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { switch: Partial<typeof theme> } }

const switchTv = tv({ extend: tv(theme), ...(appConfig.ui?.switch || {}) })

type SwitchVariants = VariantProps<typeof switchTv>

export interface SwitchProps extends Pick<SwitchRootProps, 'disabled' | 'id' | 'name' | 'required' | 'value'> {
  /**
   * The element or component this component should render as.
   * @defaultValue `div`
   */
  as?: any
  color?: SwitchVariants['color']
  size?: SwitchVariants['size']
  /** When `true`, the loading icon will be displayed. */
  loading?: boolean
  /**
   * The icon when the `loading` prop is `true`.
   * @defaultValue appConfig.ui.icons.loading
   */
  loadingIcon?: string
  /** Display an icon when the switch is checked. */
  checkedIcon?: string
  /** Display an icon when the switch is unchecked. */
  uncheckedIcon?: string
  label?: string
  description?: string
  /** The state of the switch when it is initially rendered. Use when you do not need to control its state. */
  defaultValue?: boolean
  class?: any
  ui?: PartialString<typeof switchTv.slots>
}

export interface SwitchEmits {
  (e: 'update:modelValue', payload: boolean): void
  (e: 'change', payload: Event): void
}

export interface SwitchSlots {
  label(props: { label?: string }): any
  description(props: { description?: string }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SwitchRoot, SwitchThumb, useForwardProps, Label } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useId, useAppConfig, useFormField } from '#imports'

const props = defineProps<SwitchProps>()
const slots = defineSlots<SwitchSlots>()
const emits = defineEmits<SwitchEmits>()

const modelValue = defineModel<boolean | undefined>({ default: undefined })

const appConfig = useAppConfig()
const rootProps = useForwardProps(reactivePick(props, 'as', 'required', 'value'))

const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled } = useFormField<SwitchProps>(props)
const id = _id.value ?? useId()

const ui = computed(() => tv({ extend: switchTv, slots: props.ui })({
  size: size.value,
  color: color.value,
  required: props.required,
  loading: props.loading,
  disabled: disabled.value || props.loading
}))

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <div :class="ui.root({ class: props.class })">
    <div :class="ui.container()">
      <SwitchRoot
        :id="id"
        v-model:checked="modelValue"
        :default-checked="defaultValue"
        v-bind="rootProps"
        :name="name"
        :disabled="disabled || loading"
        :class="ui.base()"
        @update:checked="onUpdate"
      >
        <SwitchThumb :class="ui.thumb()">
          <UIcon v-if="loading" :name="loadingIcon || appConfig.ui.icons.loading" :class="ui.icon({ checked: true, unchecked: true })" />
          <template v-else>
            <UIcon v-if="checkedIcon" :name="checkedIcon" :class="ui.icon({ checked: true })" />
            <UIcon v-if="uncheckedIcon" :name="uncheckedIcon" :class="ui.icon({ unchecked: true })" />
          </template>
        </SwitchThumb>
      </SwitchRoot>
    </div>
    <div v-if="(label || !!slots.label) || (description || !!slots.description)" :class="ui.wrapper()">
      <Label v-if="label || !!slots.label" :for="id" :class="ui.label()">
        <slot name="label" :label="label">
          {{ label }}
        </slot>
      </Label>
      <p v-if="description || !!slots.description" :class="ui.description()">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>
  </div>
</template>
