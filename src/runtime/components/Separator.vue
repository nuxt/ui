<script lang="ts">
import type { SeparatorProps as _SeparatorProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/separator'
import type { AvatarProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

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
  icon?: IconProps['name']
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
import { useAppConfig, useComponentUiTheme } from '#imports'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal'
})
const slots = defineSlots<SeparatorSlots>()

const appConfig = useAppConfig() as Separator['AppConfig']
const uiTheme = useComponentUiTheme('separator', () => ({ slots: props.ui }))

const rootProps = useForwardProps(reactivePick(props, 'as', 'decorative', 'orientation'))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.separator || {}) })({
  color: props.color,
  orientation: props.orientation,
  size: props.size,
  type: props.type
}))
</script>

<template>
  <Separator v-bind="rootProps" :class="ui.root({ class: [uiTheme?.slots?.root, props.class] })">
    <div :class="ui.border({ class: uiTheme?.slots?.border })" />

    <template v-if="label || icon || avatar || !!slots.default">
      <div :class="ui.container({ class: uiTheme?.slots?.container })">
        <slot>
          <span v-if="label" :class="ui.label({ class: uiTheme?.slots?.label })">{{ label }}</span>
          <UIcon v-else-if="icon" :name="icon" :class="ui.icon({ class: uiTheme?.slots?.icon })" />
          <UAvatar v-else-if="avatar" :size="((uiTheme?.slots?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.avatar({ class: uiTheme?.slots?.avatar })" />
        </slot>
      </div>

      <div :class="ui.border({ class: uiTheme?.slots?.border })" />
    </template>
  </Separator>
</template>
