<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/avatar-group'
import type { ComponentConfig } from '../types/utils'

type AvatarGroup = ComponentConfig<typeof theme, AppConfig, 'avatarGroup'>

export interface AvatarGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: AvatarGroup['variants']['size']
  /**
   * The maximum number of avatars to display.
   */
  max?: number | string
  class?: any
  ui?: AvatarGroup['slots']
}

export interface AvatarGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { avatarGroupInjectionKey } from '../composables/useAvatarGroup'
import { tv } from '../utils/tv'
import UAvatar from './Avatar.vue'

const props = defineProps<AvatarGroupProps>()
const slots = defineSlots<AvatarGroupSlots>()

const appConfig = useAppConfig() as AvatarGroup['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.avatarGroup || {}) })({
  size: props.size
}))

const max = computed(() => typeof props.max === 'string' ? Number.parseInt(props.max, 10) : props.max)

const children = computed(() => {
  let children = slots.default?.()
  if (children?.length) {
    children = children.flatMap((child: any) => {
      if (typeof child.type === 'symbol') {
        // `v-if="false"` or commented node
        if (typeof child.children === 'string') {
          return
        }

        return child.children
      }

      return child
    }).filter(Boolean)
  }

  return children || []
})

const visibleAvatars = computed(() => {
  if (!children.value.length) {
    return []
  }

  if (!max.value || max.value <= 0) {
    return [...children.value].reverse()
  }

  return [...children.value].slice(0, max.value).reverse()
})

const hiddenCount = computed(() => {
  if (!children.value.length) {
    return 0
  }

  return children.value.length - visibleAvatars.value.length
})

provide(avatarGroupInjectionKey, computed(() => ({
  size: props.size
})))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <UAvatar v-if="hiddenCount > 0" :text="`+${hiddenCount}`" :class="ui.base({ class: props.ui?.base })" />
    <component :is="avatar" v-for="(avatar, count) in visibleAvatars" :key="count" :class="ui.base({ class: props.ui?.base })" />
  </Primitive>
</template>
