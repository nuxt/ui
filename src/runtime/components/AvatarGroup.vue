<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/avatar-group'
import type { ComponentConfig } from '../types/tv'

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
   * @defaultValue 'neutral'
   */
  color?: AvatarGroup['variants']['color']
  /**
   * The maximum number of avatars to display.
   */
  max?: number | string
  class?: any
  ui?: AvatarGroup['slots']
}

export interface AvatarGroupSlots {
  default?(props?: {}): VNode[]
  overflow?(props: { hiddenCount: number }): VNode[]
}
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { avatarGroupInjectionKey } from '../composables/useAvatarGroup'
import { tv } from '../utils/tv'
import UAvatar from './Avatar.vue'

const _props = defineProps<AvatarGroupProps>()
const slots = defineSlots<AvatarGroupSlots>()

const props = useComponentProps('avatarGroup', _props)

const appConfig = useAppConfig() as AvatarGroup['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.avatarGroup || {}) })({
  size: props.size,
  color: props.color
}))

// eslint-disable-next-line vue/no-dupe-keys
const max = computed(() => typeof props.max === 'string' ? Number.parseInt(props.max, 10) : props.max)

function flattenNodes(nodes?: VNode[]): VNode[] {
  if (!nodes?.length) {
    return []
  }

  return nodes.flatMap((node: any) => {
    if (typeof node.type === 'symbol') {
      // `v-if="false"` or commented node
      if (typeof node.children === 'string') {
        return
      }

      return node.children
    }

    return node
  }).filter(Boolean)
}

const children = computed(() => flattenNodes(slots.default?.()))

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

const overflow = computed(() => hiddenCount.value > 0 ? flattenNodes(slots.overflow?.({ hiddenCount: hiddenCount.value })) : [])

provide(avatarGroupInjectionKey, computed(() => ({
  size: props.size,
  color: props.color
})))
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <component :is="node" v-for="(node, index) in overflow" :key="`overflow-${index}`" data-slot="base" :class="ui.base({ class: props.ui?.base })" />
    <UAvatar v-if="hiddenCount > 0 && !overflow.length" :text="`+${hiddenCount}`" data-slot="base" :class="ui.base({ class: props.ui?.base })" />
    <component :is="avatar" v-for="(avatar, count) in visibleAvatars" :key="count" data-slot="base" :class="ui.base({ class: props.ui?.base })" />
  </Primitive>
</template>
