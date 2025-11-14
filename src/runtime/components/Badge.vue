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
  leading(props: { ui: Badge['ui'] }): any
  default(props: { ui: Badge['ui'] }): any
  trailing(props: { ui: Badge['ui'] }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
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
  <Primitive :as="as" data-slot="base" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot name="leading" :ui="ui">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      <UAvatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
    </slot>

    <slot :ui="ui">
      <span v-if="label !== undefined && label !== null" data-slot="label" :class="ui.label({ class: props.ui?.label })">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing" :ui="ui">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
    </slot>
  </Primitive>
</template>
