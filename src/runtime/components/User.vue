<script lang="ts">
import type { VNode } from 'vue'
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
  avatar?(props: { ui: User['ui'] }): VNode[]
  name?(props?: {}): VNode[]
  description?(props?: {}): VNode[]
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { usePrefix } from '../composables/usePrefix'
import { tv } from '../utils/tv'
import UChip from './Chip.vue'
import UAvatar from './Avatar.vue'
import ULink from './Link.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<UserProps>(), {
  orientation: 'horizontal'
})
const slots = defineSlots<UserSlots>()

const props = useComponentProps('user', _props)

const appConfig = useAppConfig() as User['AppConfig']
const prefix = usePrefix()

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.user || {}) })({
  size: props.size,
  orientation: props.orientation,
  to: !!props.to || !!props.onClick
}))
</script>

<template>
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" @click="props.onClick">
    <slot name="avatar" :ui="ui">
      <UChip v-if="props.chip && props.avatar" inset v-bind="typeof props.chip === 'object' ? props.chip : {}" :size="props.size">
        <UAvatar :alt="props.name" v-bind="props.avatar" :size="props.size" data-slot="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      </UChip>
      <UAvatar
        v-else-if="props.avatar"
        :alt="props.name"
        v-bind="props.avatar"
        :size="props.size"
        data-slot="avatar"
        :class="ui.avatar({ class: props.ui?.avatar })"
      />
    </slot>

    <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <ULink
        v-if="props.to"
        :aria-label="props.name"
        v-bind="{ to: props.to, target: props.target, ...$attrs }"
        :class="prefix('focus:outline-none peer')"
        raw
      >
        <span :class="prefix('absolute inset-0')" aria-hidden="true" />
      </ULink>

      <slot>
        <p v-if="props.name || !!slots.name" data-slot="name" :class="ui.name({ class: props.ui?.name })">
          <slot name="name">
            {{ props.name }}
          </slot>
        </p>
        <p v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ props.description }}
          </slot>
        </p>
      </slot>
    </div>
  </Primitive>
</template>
