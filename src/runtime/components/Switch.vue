<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { SwitchRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/switch'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { switch: Partial<typeof theme> } }

const switchTv = tv({ extend: tv(theme), ...(appConfig.ui?.switch || {}) })

type SwitchVariants = VariantProps<typeof switchTv>

export interface SwitchProps extends Pick<SwitchRootProps, 'disabled' | 'id' | 'name' | 'required' | 'value' | 'defaultValue'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
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
  class?: any
  ui?: PartialString<typeof switchTv.slots>
}

export type SwitchEmits = {
  change: [payload: Event]
}

export interface SwitchSlots {
  label(props: { label?: string }): any
  description(props: { description?: string }): any
}

extendDevtoolsMeta({ defaultProps: { label: 'Switch me!' } })
</script>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { Primitive, SwitchRoot, SwitchThumb, useForwardProps, Label } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import UIcon from './Icon.vue'

const props = defineProps<SwitchProps>()
const slots = defineSlots<SwitchSlots>()
const emits = defineEmits<SwitchEmits>()

const modelValue = defineModel<boolean>({ default: undefined })

const appConfig = useAppConfig()
const rootProps = useForwardProps(reactivePick(props, 'required', 'value', 'defaultValue'))

const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled } = useFormField<SwitchProps>(props)
const id = _id.value ?? useId()

const ui = computed(() => switchTv({
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
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div :class="ui.container({ class: props.ui?.container })">
      <SwitchRoot
        :id="id"
        v-bind="rootProps"
        v-model="modelValue"
        :name="name"
        :disabled="disabled || loading"
        :class="ui.base({ class: props.ui?.base })"
        @update:model-value="onUpdate"
      >
        <SwitchThumb :class="ui.thumb({ class: props.ui?.thumb })">
          <UIcon v-if="loading" :name="loadingIcon || appConfig.ui.icons.loading" :class="ui.icon({ class: props.ui?.icon, checked: true, unchecked: true })" />
          <template v-else>
            <UIcon v-if="checkedIcon" :name="checkedIcon" :class="ui.icon({ class: props.ui?.icon, checked: true })" />
            <UIcon v-if="uncheckedIcon" :name="uncheckedIcon" :class="ui.icon({ class: props.ui?.icon, unchecked: true })" />
          </template>
        </SwitchThumb>
      </SwitchRoot>
    </div>
    <div v-if="(label || !!slots.label) || (description || !!slots.description)" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <Label v-if="label || !!slots.label" :for="id" :class="ui.label({ class: props.ui?.label })">
        <slot name="label" :label="label">
          {{ label }}
        </slot>
      </Label>
      <p v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>
  </Primitive>
</template>
