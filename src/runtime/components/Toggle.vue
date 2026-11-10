<script lang="ts">
import type { ToggleProps as RekaToggleProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/toggle'
import type { ButtonProps, ButtonSlots } from './Button.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { ComponentConfig } from '../types/tv'

type Toggle = ComponentConfig<typeof theme, AppConfig, 'toggle'>

export interface ToggleProps extends Omit<ButtonProps, Exclude<LinkPropsKeys, 'activeClass' | 'inactiveClass'> | 'type' | 'loadingAuto' | 'color' | 'variant' | 'activeColor' | 'activeVariant'>, Pick<RekaToggleProps, 'defaultValue' | 'modelValue' | 'name' | 'required'> {
  id?: string
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  /**
   * The color of the toggle when pressed.
   * @defaultValue 'primary'
   */
  activeColor?: ButtonProps['color']
  /**
   * The variant of the toggle when pressed.
   * @defaultValue 'soft'
   */
  activeVariant?: ButtonProps['variant']
}

export interface ToggleEmits {
  'update:modelValue': [value: boolean]
  'change': [event: Event]
}

export interface ToggleSlots extends ButtonSlots {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Toggle } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useFormField } from '../composables/useFormField'
import { useFieldGroup } from '../composables/useFieldGroup'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import { omit } from '../utils'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ToggleProps>(), {
  variant: 'ghost',
  activeColor: 'primary',
  activeVariant: 'soft',
  modelValue: undefined
})
const emits = defineEmits<ToggleEmits>()
const slots = defineSlots<ToggleSlots>()

const props = useComponentProps('toggle', _props)

const appConfig = useAppConfig() as Toggle['AppConfig']

const rootProps = useForwardProps(props, ['modelValue', 'defaultValue', 'required'], emits)
const buttonProps = useForwardProps(computed(() => omit(props, ['id', 'modelValue', 'defaultValue', 'disabled', 'name', 'required', 'color', 'size', 'class'])))

const { id, name, size: formFieldSize, color: formFieldColor, disabled: formFieldDisabled, ariaAttrs, emitFormChange, emitFormInput } = useFormField<ToggleProps>(_props)

// The `neutral` default lives here rather than in `withDefaults`, so `useFormField` doesn't return it over `<UTheme :props>`
// eslint-disable-next-line vue/no-dupe-keys
const color = computed(() => formFieldColor.value ?? props.color ?? 'neutral')

const { size: fieldGroupSize } = useFieldGroup<ToggleProps>(_props)

const size = computed(() => fieldGroupSize.value ?? formFieldSize.value ?? props.size)

const disabled = computed(() => formFieldDisabled.value ?? props.disabled)

const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.toggle || {}) }))

function onUpdate(value: boolean) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <Toggle
    v-slot="{ pressed }"
    v-bind="rootProps"
    :name="disabled ? undefined : name"
    :disabled="disabled"
    as-child
    @update:model-value="onUpdate"
  >
    <UButton
      :id="id"
      v-bind="{ ...buttonProps, ...ariaAttrs, ...$attrs }"
      :color="color"
      :size="size"
      :active="pressed"
      :class="ui({ class: props.class })"
    >
      <template v-for="(_, slotName) in slots" #[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData" />
      </template>
    </UButton>
  </Toggle>
</template>
