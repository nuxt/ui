<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/button'
import type { LinkProps } from './Link.vue'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps } from '../types'
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
  /** Set loading state automatically based on the `@click` promise state */
  loadingAuto?: boolean
  onClick?: ((event: MouseEvent) => void | Promise<void>) | Array<((event: MouseEvent) => void | Promise<void>)>
  class?: any
  ui?: PartialString<typeof button.slots>
}

// Injects props to use as default in the devtools playground.
extendDevtoolsMeta<ButtonProps>({ defaultProps: { label: 'Click me!' } })

export interface ButtonSlots {
  leading(props?: {}): any
  default(props?: {}): any
  trailing(props?: {}): any
}
</script>

<script setup lang="ts">
import { type Ref, computed, ref, inject } from 'vue'
import { useForwardProps } from 'reka-ui'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useButtonGroup } from '../composables/useButtonGroup'
import { formLoadingInjectionKey } from '../composables/useFormField'
import { omit } from '../utils'
import { pickLinkProps } from '../utils/link'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import ULink from './Link.vue'

const props = defineProps<ButtonProps>()
const slots = defineSlots<ButtonSlots>()

const linkProps = useForwardProps(pickLinkProps(props))

const { orientation, size: buttonSize } = useButtonGroup<ButtonProps>(props)

const loadingAutoState = ref(false)
const formLoading = inject<Ref<boolean> | undefined>(formLoadingInjectionKey, undefined)

async function onClickWrapper(event: MouseEvent) {
  loadingAutoState.value = true
  const callbacks = Array.isArray(props.onClick) ? props.onClick : [props.onClick]
  try {
    await Promise.all(callbacks.map(fn => fn?.(event)))
  } finally {
    loadingAutoState.value = false
  }
}

const isLoading = computed(() => {
  return props.loading || (props.loadingAuto && (loadingAutoState.value || (formLoading?.value && props.type === 'submit')))
})

const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(
  computed(() => ({ ...props, loading: isLoading.value }))
)

const ui = computed(() => button({
  color: props.color,
  variant: props.variant,
  size: buttonSize.value,
  loading: isLoading.value,
  block: props.block,
  square: props.square || (!slots.default && !props.label),
  leading: isLeading.value,
  trailing: isTrailing.value,
  buttonGroup: orientation.value
}))
</script>

<template>
  <ULink
    :type="type"
    :disabled="disabled || isLoading"
    :class="ui.base({ class: [props.class, props.ui?.base] })"
    v-bind="omit(linkProps, ['type', 'disabled'])"
    raw
    @click="onClickWrapper"
  >
    <slot name="leading">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      <UAvatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
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
