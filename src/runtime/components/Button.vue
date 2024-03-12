<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/button'
import type { LinkProps } from '#ui/components/Link.vue'

const appConfig = _appConfig as AppConfig & { ui: { button: Partial<typeof theme> } }

const button = tv({ extend: tv(theme), ...(appConfig.ui?.button || {}) })

type ButtonVariants = VariantProps<typeof button>

export interface ButtonProps extends LinkProps {
  type?: string
  label?: string
  color?: ButtonVariants['color']
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  icon?: string
  leading?: boolean
  leadingIcon?: string
  trailing?: boolean
  trailingIcon?: string
  loading?: boolean
  loadingIcon?: string
  square?: boolean
  block?: boolean
  disabled?: boolean
  truncate?: boolean
  class?: any
  ui?: Partial<typeof button.slots>
}

export interface ButtonSlots {
  leading(props: { disabled?: boolean; loading?: boolean, icon?: string, class: string }): any
  default(): any
  trailing(props: { disabled?: boolean; loading?: boolean, icon?: string, class: string }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#app'
import UIcon from './Icon.vue'

const props = defineProps<ButtonProps>()
const slots = defineSlots<ButtonSlots>()

const appConfig = useAppConfig()
const linkProps = useForwardProps(reactiveOmit(props, 'type', 'label', 'color', 'variant', 'size', 'icon', 'leading', 'leadingIcon', 'trailing', 'trailingIcon', 'loading', 'loadingIcon', 'square', 'block', 'disabled', 'truncate', 'class', 'ui'))

const isLeading = computed(() => (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing && !props.trailingIcon) || !!props.leadingIcon)
const isTrailing = computed(() => (props.icon && props.trailing) || (props.loading && props.trailing) || !!props.trailingIcon)

// FIXME: Cannot extend multiple times
// const ui = computed(() => tv({ extend: button, slots: props.ui })({
const ui = computed(() => button({
  color: props.color,
  variant: props.variant,
  size: props.size,
  loading: props.loading,
  truncate: props.truncate,
  block: props.block,
  square: props.square || (!slots.default && !props.label),
  leading: isLeading.value,
  trailing: isTrailing.value
}))

const leadingIconName = computed(() => {
  if (props.loading) {
    return props.loadingIcon || appConfig.ui.icons.loading
  }

  return props.leadingIcon || props.icon
})
const leadingIconClass = computed(() => ui.value.leadingIcon())

const trailingIconName = computed(() => {
  if (props.loading && !isLeading.value) {
    return props.loadingIcon || appConfig.ui.icons.loading
  }

  return props.trailingIcon || props.icon
})
const trailingIconClass = computed(() => ui.value.trailingIcon())
</script>

<template>
  <ULink
    :type="type"
    :disabled="disabled"
    :class="ui.base({ class: props.class })"
    v-bind="linkProps"
  >
    <slot name="leading" :disabled="disabled" :loading="loading" :icon="leadingIconName" :class="leadingIconClass">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="leadingIconClass" aria-hidden="true" />
    </slot>

    <span v-if="label || $slots.default" :class="ui.label()">
      <slot>
        {{ label }}
      </slot>
    </span>

    <slot name="trailing" :disabled="disabled" :loading="loading" :icon="leadingIconName" :class="trailingIconClass">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="trailingIconClass" aria-hidden="true" />
    </slot>
  </ULink>
</template>