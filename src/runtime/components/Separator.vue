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
  /** Display a label on the separator. */
  label?: string
  /**
   * Display an icon on the separator.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /** Display an avatar on the separator. */
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
import { Separator } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const _props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
  position: 'center'
})
const slots = defineSlots<SeparatorSlots>()

const props = useComponentProps('separator', _props)

const appConfig = useAppConfig() as Separator['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'decorative', 'orientation'))

const [DefineContainer, ReuseContainer] = createReusableTemplate()

const hasContent = computed(() => !!(props.label || props.icon || props.avatar || slots.default))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.separator || {}) })({
  color: props.color,
  orientation: props.orientation,
  size: props.size,
  position: props.position,
  type: props.type
}))
</script>

<template>
  <DefineContainer>
    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <slot :ui="ui">
        <span v-if="props.label" data-slot="label" :class="ui.label({ class: props.ui?.label })">{{ props.label }}</span>
        <UIcon v-else-if="props.icon" :name="props.icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
        <UAvatar v-else-if="props.avatar" :size="((props.ui?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="props.avatar" data-slot="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      </slot>
    </div>
  </DefineContainer>

  <Separator v-bind="rootProps" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ReuseContainer v-if="hasContent && props.position === 'start'" />

    <div data-slot="border" :class="ui.border({ class: props.ui?.border })" />

    <template v-if="hasContent && props.position === 'center'">
      <ReuseContainer />

      <div data-slot="border" :class="ui.border({ class: props.ui?.border })" />
    </template>

    <ReuseContainer v-if="hasContent && props.position === 'end'" />
  </Separator>
</template>
