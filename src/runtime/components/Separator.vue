<script lang="ts">
import type { SeparatorProps as _SeparatorProps } from 'reka-ui'
import type { VNode } from 'vue'
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
  /**
   * The position of the content.
   * @defaultValue 'center'
   */
  position?: Separator['variants']['position']
  class?: any
  ui?: Separator['slots']
}

export interface SeparatorSlots {
  default?(props: { ui: Separator['ui'] }): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Separator, useForwardProps } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { useResolvedVariants } from '../composables/useResolvedVariants'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
  position: 'center'
})
const slots = defineSlots<SeparatorSlots>()

const appConfig = useAppConfig() as Separator['AppConfig']
const uiProp = useComponentUI('separator', props)

const rootProps = useForwardProps(reactivePick(props, 'as', 'decorative', 'orientation'))

const { position } = useResolvedVariants('separator', props, theme, ['position'])

const [DefineContainer, ReuseContainer] = createReusableTemplate()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.separator || {}) })({
  color: props.color,
  orientation: props.orientation,
  size: props.size,
  position: position.value,
  type: props.type
}))
</script>

<template>
  <DefineContainer>
    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <slot :ui="ui">
        <span v-if="label" data-slot="label" :class="ui.label({ class: uiProp?.label })">{{ label }}</span>
        <UIcon v-else-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: uiProp?.icon })" />
        <UAvatar v-else-if="avatar" :size="((uiProp?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="avatar" :class="ui.avatar({ class: uiProp?.avatar })" />
      </slot>
    </div>
  </DefineContainer>
  <Separator v-bind="rootProps" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <ReuseContainer v-if="(label || icon || avatar || !!slots.default) && position === 'start'" />

    <div data-slot="border" :class="ui.border({ class: uiProp?.border })" />

    <template v-if="(label || icon || avatar || !!slots.default) && position === 'center'">
      <ReuseContainer />

      <div data-slot="border" :class="ui.border({ class: uiProp?.border })" />
    </template>

    <ReuseContainer v-if="(label || icon || avatar || !!slots.default) && position === 'end'" />
  </Separator>
</template>
