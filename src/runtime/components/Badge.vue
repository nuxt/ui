<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/badge'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'

const appConfig = _appConfig as AppConfig & { ui: { badge: Partial<typeof theme> } }

const badge = tv({ extend: tv(theme), ...(appConfig.ui?.badge || {}) })

type BadgeVariants = VariantProps<typeof badge>

export interface BadgeProps extends Omit<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: any
  label?: string | number
  color?: BadgeVariants['color']
  variant?: BadgeVariants['variant']
  size?: BadgeVariants['size']
  class?: any
  ui?: Partial<typeof badge.slots>
}

export interface BadgeSlots {
  leading(props?: {}): any
  default(props?: {}): any
  trailing(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useComponentIcons } from '../composables/useComponentIcons'
import UIcon from './Icon.vue'

const props = withDefaults(defineProps<BadgeProps>(), {
  as: 'span'
})
defineSlots<BadgeSlots>()

const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const ui = computed(() => badge({
  color: props.color,
  variant: props.variant,
  size: props.size
}))

extendDevtoolsMeta({ defaultProps: { label: 'Badge' } })
</script>

<template>
  <Primitive :as="as" :class="ui.base({ class: [props.class, props.ui?.base] })">
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
  </Primitive>
</template>
