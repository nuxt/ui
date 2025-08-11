<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/user'
import type { AvatarProps, ChipProps, LinkProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type User = ComponentConfig<typeof theme, AppConfig, 'user'>

export interface UserProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  name?: string
  description?: string
  avatar?: Omit<AvatarProps, 'size'> & { [key: string]: any }
  chip?: boolean | Omit<ChipProps, 'size' | 'inset'>
  /**
   * @defaultValue 'md'
   */
  size?: User['variants']['size']
  /**
   * The orientation of the user.
   * @defaultValue 'horizontal'
   */
  orientation?: User['variants']['orientation']
  to?: LinkProps['to']
  target?: LinkProps['target']
  onClick?: (event: MouseEvent) => void | Promise<void>
  class?: any
  ui?: User['slots']
}

export interface UserSlots {
  avatar(props?: {}): any
  name(props?: {}): any
  description(props?: {}): any
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UChip from './Chip.vue'
import UAvatar from './Avatar.vue'
import ULink from './Link.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<UserProps>(), {
  orientation: 'horizontal'
})
const slots = defineSlots<UserSlots>()

const appConfig = useAppConfig() as User['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.user || {}) })({
  size: props.size,
  orientation: props.orientation,
  to: !!props.to || !!props.onClick
}))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui.root({ class: [props.ui?.root, props.class] })" @click="onClick">
    <slot name="avatar">
      <UChip v-if="chip && avatar" inset v-bind="typeof chip === 'object' ? chip : {}" :size="size">
        <UAvatar :alt="name" v-bind="avatar" :size="size" :class="ui.avatar({ class: props.ui?.avatar })" />
      </UChip>
      <UAvatar v-else-if="avatar" :alt="name" v-bind="avatar" :size="size" :class="ui.avatar({ class: props.ui?.avatar })" />
    </slot>

    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <ULink
        v-if="to"
        :aria-label="name"
        v-bind="{ to, target, ...$attrs }"
        class="focus:outline-none peer"
        tabindex="-1"
        raw
      >
        <span class="absolute inset-0" aria-hidden="true" />
      </ULink>

      <slot>
        <p v-if="name || !!slots.name" :class="ui.name({ class: props.ui?.name })">
          <slot name="name">
            {{ name }}
          </slot>
        </p>
        <p v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </p>
      </slot>
    </div>
  </Primitive>
</template>
