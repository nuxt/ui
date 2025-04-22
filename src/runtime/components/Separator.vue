<script lang="ts">
import type { SeparatorProps as _SeparatorProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/separator'
import type { AvatarProps } from '../types'
import type { ComponentConfig } from '../types/utils'

type Separator = ComponentConfig<typeof theme, AppConfig, 'separator'>

export interface SeparatorProps extends Pick<_SeparatorProps, 'decorative'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** Display a label in the middle. */
  label?: string
  /**
   * Display an icon in the middle.
   * @IconifyIcon
   */
  icon?: string
  /** Display an avatar in the middle. */
  avatar?: AvatarProps
  /**
   * @defaultValue 'neutral'
   */
  color?: Separator['variants']['color']
  /**
   * @defaultValue 'xs'
   */
  size?: Separator['variants']['size']
  /**
   * @defaultValue 'solid'
   */
  type?: Separator['variants']['type']
  /**
   * The orientation of the separator.
   * @defaultValue 'horizontal'
   */
  orientation?: _SeparatorProps['orientation']
  class?: any
  ui?: Separator['slots']
}

export interface SeparatorSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Separator, useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal'
})
const slots = defineSlots<SeparatorSlots>()

const appConfig = useAppConfig() as Separator['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'decorative', 'orientation'))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.separator || {}) })({
  color: props.color,
  orientation: props.orientation,
  size: props.size,
  type: props.type
}))
</script>

<template>
  <Separator v-bind="rootProps" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div :class="ui.border({ class: props.ui?.border })" />

    <template v-if="label || icon || avatar || !!slots.default">
      <div :class="ui.container({ class: props.ui?.container })">
        <slot>
          <span v-if="label" :class="ui.label({ class: props.ui?.label })">{{ label }}</span>
          <UIcon v-else-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
          <UAvatar v-else-if="avatar" :size="((props.ui?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
        </slot>
      </div>

      <div :class="ui.border({ class: props.ui?.border })" />
    </template>
  </Separator>
</template>
