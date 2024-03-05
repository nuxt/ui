<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { LinkProps } from './Link.vue'
// import appConfig from '#build/app.config'

export const theme = {
  slots: {
    base: 'focus:outline-none rounded-md font-medium',
    label: '',
    icon: 'flex-shrink-0'
  },
  variants: {
    color: {
      blue: 'bg-blue-500 hover:bg-blue-700',
      red: 'bg-red-500 hover:bg-red-700',
      green: 'bg-green-500 hover:bg-green-700'
    },
    size: {
      '2xs': 'px-2 py-1 text-xs gap-x-1',
      xs: 'px-2.5 py-1.5 text-xs gap-x-1.5',
      sm: 'px-2.5 py-1.5 text-sm gap-x-1.5',
      md: 'px-3 py-2 text-sm gap-x-2',
      lg: 'px-3.5 py-2.5 text-sm gap-x-2.5',
      xl: 'px-3.5 py-2.5 text-base gap-x-2.5'
    },
    truncate: {
      true: {
        label: 'text-left break-all line-clamp-1'
      }
    }
  },
  defaultVariants: {
    color: 'blue',
    size: 'md'
  }
} as const

// export const button = tv({ extend: tv(theme), ...appConfig.ui.button })
export const button = tv(theme)

type ButtonVariants = VariantProps<typeof button>

export interface ButtonProps extends ButtonVariants, LinkProps {
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
  ui?: Partial<typeof button>
}
</script>

<script setup lang="ts">
import type { PropType } from 'vue'
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

// Computed

const isLeading = computed(() => (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing) || props.leadingIcon)

const isTrailing = computed(() => (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon)

const ui = computed(() => tv({ extend: button, ...props.ui })({
  color: props.color,
  size: props.size,
  square: props.square || (!slots.default && !props.label),
  class: props.class
}))

const leadingIconName = computed(() => {
  if (props.loading) {
    return props.loadingIcon
  }

  return props.leadingIcon || props.icon
})

const trailingIconName = computed(() => {
  if (props.loading && !isLeading.value) {
    return props.loadingIcon
  }

  return props.trailingIcon || props.icon
})
</script>

<template>
  <ULink :type="type" :disabled="disabled || loading" :class="ui.base()" v-bind="$attrs">
    <!-- <slot name="leading" :disabled="disabled" :loading="loading">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.icon({ isLeading })" aria-hidden="true" />
    </slot> -->

    <span v-if="label || $slots.default" :class="ui.label({ truncate })">
      <slot>
        {{ label }}
      </slot>
    </span>

    <!-- <slot name="trailing" :disabled="disabled" :loading="loading">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="trailingIconClass" aria-hidden="true" />
    </slot> -->
  </ULink>
</template>