<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
// import appConfig from '#build/app.config'
import type { LinkProps } from '#ui/components/Link.vue'
import theme from '#ui/theme/button'

const button = tv(theme)
// const appButton = tv({ extend: button, ...(appConfig.ui?.button || {}) })

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
  leading(props?: { disabled?: boolean; loading?: boolean, ui?: string }): any
  default(): any
  trailing(props?: { disabled?: boolean; loading?: boolean, ui?: string }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<ButtonProps>()
const slots = defineSlots<ButtonSlots>()

const appConfig = useAppConfig()
const forward = useForwardProps(reactiveOmit(props, 'type', 'label', 'color', 'variant', 'size', 'icon', 'leading', 'leadingIcon', 'trailing', 'trailingIcon', 'loading', 'loadingIcon', 'square', 'block', 'disabled', 'truncate', 'class', 'ui'))

// Computed

const ui = computed(() => tv({ extend: button, slots: props.ui })({
  color: props.color,
  variant: props.variant,
  size: props.size,
  loading: props.loading,
  truncate: props.truncate,
  block: props.block,
  square: props.square || (!slots.default && !props.label)
}))

const isLeading = computed(() => (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing) || props.leadingIcon)

const isTrailing = computed(() => (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon)

const leadingIconName = computed(() => {
  if (props.loading) {
    return props.loadingIcon || appConfig.ui.icons.loading
  }

  return props.leadingIcon || props.icon
})

const trailingIconName = computed(() => {
  if (props.loading && !isLeading.value) {
    return props.loadingIcon || appConfig.ui.icons.loading
  }

  return props.trailingIcon || props.icon
})
</script>

<template>
  <ULink
    :type="type"
    :disabled="disabled || loading"
    :class="ui.base({ class: props.class })"
    v-bind="{ ...forward, ...$attrs }"
    :style="color && {
      '--color-current-50': `var(--color-${color}-50)`,
      '--color-current-100': `var(--color-${color}-100)`,
      '--color-current-200': `var(--color-${color}-200)`,
      '--color-current-300': `var(--color-${color}-300)`,
      '--color-current-400': `var(--color-${color}-400)`,
      '--color-current-500': `var(--color-${color}-500)`,
      '--color-current-600': `var(--color-${color}-600)`,
      '--color-current-700': `var(--color-${color}-700)`,
      '--color-current-800': `var(--color-${color}-800)`,
      '--color-current-900': `var(--color-${color}-900)`,
      '--color-current-950': `var(--color-${color}-950)`
    }"
  >
    <slot name="leading" :disabled="disabled" :loading="loading" :ui="ui.icon()">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.icon()" aria-hidden="true" />
    </slot>

    <span v-if="label || $slots.default" :class="ui.label()">
      <slot>
        {{ label }}
      </slot>
    </span>

    <slot name="trailing" :disabled="disabled" :loading="loading" :ui="ui.icon()">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="ui.icon()" aria-hidden="true" />
    </slot>
  </ULink>
</template>