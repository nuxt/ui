<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/badge'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type Badge = ComponentConfig<typeof theme, AppConfig, 'badge'>

export interface BadgeProps extends Omit<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: any
  label?: string | number
  /**
   * @defaultValue 'primary'
   */
  color?: Badge['variants']['color']
  /**
   * @defaultValue 'solid'
   */
  variant?: Badge['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Badge['variants']['size']
  /** Render the badge with equal padding on all sides. */
  square?: boolean
  class?: any
  ui?: Badge['slots']
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
import { useAppConfig, useComponentUiTheme } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<BadgeProps>(), {
  as: 'span'
})
const slots = defineSlots<BadgeSlots>()

const appConfig = useAppConfig() as Badge['AppConfig']
const uiTheme = useComponentUiTheme('badge', () => ({ slots: props.ui }))
const { orientation, size: fieldGroupSize } = useFieldGroup<BadgeProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.badge || {}) })({
  color: props.color,
  variant: props.variant,
  size: fieldGroupSize.value || props.size,
  square: props.square || (!slots.default && !props.label),
  fieldGroup: orientation.value
}))
</script>

<template>
  <Primitive :as="as" :class="ui.base({ class: [uiTheme?.slots?.base, props.class] })">
    <slot name="leading">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: uiTheme?.slots?.leadingIcon })" />
      <UAvatar v-else-if="!!avatar" :size="((uiTheme?.slots?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.leadingAvatar({ class: uiTheme?.slots?.leadingAvatar })" />
    </slot>

    <slot>
      <span v-if="label !== undefined && label !== null" :class="ui.label({ class: uiTheme?.slots?.label })">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: uiTheme?.slots?.trailingIcon })" />
    </slot>
  </Primitive>
</template>
