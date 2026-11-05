<script lang="ts">
import type { ToggleProps as RekaToggleProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/toggle'
import type { ButtonProps, ButtonSlots } from './Button.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { ComponentConfig } from '../types/tv'

type Toggle = ComponentConfig<typeof theme, AppConfig, 'toggle'>

export interface ToggleProps extends Omit<ButtonProps, Exclude<LinkPropsKeys, 'activeClass' | 'inactiveClass'> | 'type' | 'color' | 'variant' | 'activeColor' | 'activeVariant'>, Pick<RekaToggleProps, 'defaultValue' | 'modelValue' | 'name' | 'required'> {
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
}

export interface ToggleSlots extends ButtonSlots {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Toggle } from 'reka-ui'
import { reactiveOmit, reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ToggleProps>(), {
  color: 'neutral',
  variant: 'ghost',
  activeColor: 'primary',
  activeVariant: 'soft',
  modelValue: undefined
})
const emits = defineEmits<ToggleEmits>()
const slots = defineSlots<ToggleSlots>()

const props = useComponentProps('toggle', _props)

const appConfig = useAppConfig() as Toggle['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'modelValue', 'defaultValue', 'disabled', 'name', 'required'), emits)
const buttonProps = useForwardProps(reactiveOmit(props, 'modelValue', 'defaultValue', 'disabled', 'name', 'required', 'class'))

const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.toggle || {}) }))
</script>

<template>
  <Toggle v-slot="{ pressed }" v-bind="rootProps" as-child>
    <UButton v-bind="{ ...buttonProps, ...$attrs }" :active="pressed" :class="ui({ class: props.class })">
      <template v-for="(_, name) in slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UButton>
  </Toggle>
</template>
