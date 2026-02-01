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
  orientation?: Separator['variants']['orientation']
  class?: any
  ui?: Separator['slots']
}

export interface SeparatorSlots {
  default(props: { ui: Separator['ui'] }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Separator, useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal'
})
const slots = defineSlots<SeparatorSlots>()

const appConfig = useAppConfig() as Separator['AppConfig']
const uiProp = useComponentUI('separator', props)

const rootProps = useForwardProps(reactivePick(props, 'as', 'decorative', 'orientation'))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.separator || {}) })({
  color: props.color,
  orientation: props.orientation,
  size: props.size,
  type: props.type
}))
</script>

<template>
  <Separator v-bind="rootProps" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="border" :class="ui.border({ class: uiProp?.border })" />

    <template v-if="label || icon || avatar || !!slots.default">
      <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
        <slot :ui="ui">
          <span v-if="label" data-slot="label" :class="ui.label({ class: uiProp?.label })">{{ label }}</span>
          <UIcon v-else-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: uiProp?.icon })" />
          <UAvatar v-else-if="avatar" :size="((uiProp?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="avatar" :class="ui.avatar({ class: uiProp?.avatar })" />
        </slot>
      </div>

      <div data-slot="border" :class="ui.border({ class: uiProp?.border })" />
    </template>
  </Separator>
</template>
