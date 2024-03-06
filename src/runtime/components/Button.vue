<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
// import appConfig from '#build/app.config'
import { getLinkProps, type LinkProps } from '#ui/components/Link.vue'
import theme from '#ui/theme/button'

const appButton = tv(theme)
// const appButton = tv({ extend: button, ...(appConfig.ui?.button || {}) })

export interface ButtonProps extends VariantProps<typeof appButton>, LinkProps {
  label?: string
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
  padded?: boolean
  truncate?: boolean
  class?: any
  ui?: Partial<typeof appButton>
}
</script>

<script setup lang="ts">
import { useSlots, computed, type PropType } from 'vue'
import { linkProps } from './Link.vue'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  ...linkProps,
  label: {
    type: String as PropType<ButtonProps['label']>,
    default: undefined
  },
  icon: {
    type: String as PropType<ButtonProps['icon']>,
    default: undefined
  },
  leading: {
    type: Boolean as PropType<ButtonProps['leading']>,
    default: false
  },
  leadingIcon: {
    type: String as PropType<ButtonProps['leadingIcon']>,
    default: undefined
  },
  trailing: {
    type: Boolean as PropType<ButtonProps['trailing']>,
    default: false
  },
  trailingIcon: {
    type: String as PropType<ButtonProps['trailingIcon']>,
    default: undefined
  },
  loading: {
    type: Boolean as PropType<ButtonProps['loading']>,
    default: false
  },
  loadingIcon: {
    type: String as PropType<ButtonProps['loadingIcon']>,
    default: undefined
  },
  square: {
    type: Boolean as PropType<ButtonProps['square']>,
    default: false
  },
  block: {
    type: Boolean as PropType<ButtonProps['block']>,
    default: false
  },
  disabled: {
    type: Boolean as PropType<ButtonProps['disabled']>,
    default: false
  },
  padded: {
    type: Boolean as PropType<ButtonProps['padded']>,
    default: false
  },
  truncate: {
    type: Boolean as PropType<ButtonProps['truncate']>,
    default: false
  },
  color: {
    type: String as PropType<ButtonProps['color']>,
    default: undefined
  },
  size: {
    type: String as PropType<ButtonProps['size']>,
    default: undefined
  },
  class: {
    type: String as PropType<ButtonProps['class']>,
    default: undefined
  },
  ui: {
    type: Object as PropType<ButtonProps['ui']>,
    default: undefined
  }
})

const slots = useSlots()
const appConfig = useAppConfig()

// Computed

const ui = computed(() => tv({ extend: appButton, ...props.ui })({
  color: props.color,
  size: props.size,
  loading: props.loading,
  truncate: props.truncate,
  block: props.block,
  padded: props.padded,
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
  <ULink :type="type" :disabled="disabled || loading" :class="ui.base({ class: $props.class })" v-bind="{ ...getLinkProps($props), ...$attrs }">
    <slot name="leading" :disabled="disabled" :loading="loading">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.icon()" aria-hidden="true" />
    </slot>

    <span v-if="label || $slots.default" :class="ui.label()">
      <slot>
        {{ label }}
      </slot>
    </span>

    <slot name="trailing" :disabled="disabled" :loading="loading">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="ui.icon()" aria-hidden="true" />
    </slot>
  </ULink>
</template>