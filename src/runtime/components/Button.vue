<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/button'
import type { LinkProps } from './Link.vue'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { button: Partial<typeof theme> } }

const button = tv({ extend: tv(theme), ...(appConfig.ui?.button || {}) })

type ButtonVariants = VariantProps<typeof button>

export interface ButtonProps extends UseComponentIconsProps, Omit<LinkProps, 'raw' | 'custom'> {
  label?: string
  color?: ButtonVariants['color']
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  /** Render the button with equal padding on all sides. */
  square?: boolean
  /** Render the button full width. */
  block?: boolean
  class?: any
  ui?: PartialString<typeof button.slots>
}

export interface ButtonSlots {
  leading(props?: {}): any
  default(props?: {}): any
  trailing(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'radix-vue'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useButtonGroup } from '../composables/useButtonGroup'
import UIcon from './Icon.vue'
import ULink from './Link.vue'
import { pickLinkProps } from '../utils/link'

const props = defineProps<ButtonProps>()
const slots = defineSlots<ButtonSlots>()

const linkProps = useForwardProps(pickLinkProps(props))

const { orientation, size: buttonSize } = useButtonGroup<ButtonProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const ui = computed(() => button({
  color: props.color,
  variant: props.variant,
  size: buttonSize.value,
  loading: props.loading,
  block: props.block,
  square: props.square || (!slots.default && !props.label),
  leading: isLeading.value,
  trailing: isTrailing.value,
  buttonGroup: orientation.value
}))
</script>

<template>
  <ULink :type="type" :disabled="disabled || loading" :class="ui.base({ class: props.class })" v-bind="linkProps" raw>
    <slot name="leading">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
    </slot>

    <slot>
      <span v-if="label" :class="ui.label({ class: props.ui?.label })">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
    </slot>
  </ULink>
</template>
