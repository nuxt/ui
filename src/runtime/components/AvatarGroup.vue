<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/avatar-group'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'

const appConfig = _appConfig as AppConfig & { ui: { avatarGroup: Partial<typeof theme> } }

const avatarGroup = tv({ extend: tv(theme), ...(appConfig.ui?.avatarGroup || {}) })

type AvatarGroupVariants = VariantProps<typeof avatarGroup>

export interface AvatarGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  size?: AvatarGroupVariants['size']
  /**
   * The maximum number of avatars to display.
   */
  max?: number | string
  class?: any
  ui?: Partial<typeof avatarGroup.slots>
}

export interface AvatarGroupSlots {
  default(props?: {}): any
}

extendDevtoolsMeta({ example: 'AvatarGroupExample' })
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { Primitive } from 'reka-ui'
import { avatarGroupInjectionKey } from '../composables/useAvatarGroup'
import UAvatar from './Avatar.vue'

const props = defineProps<AvatarGroupProps>()
const slots = defineSlots<AvatarGroupSlots>()

const ui = computed(() => avatarGroup({
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
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <UAvatar v-if="hiddenCount > 0" :text="`+${hiddenCount}`" :class="ui.base({ class: props.ui?.base })" />
    <component :is="avatar" v-for="(avatar, count) in visibleAvatars" :key="count" :class="ui.base({ class: props.ui?.base })" />
  </Primitive>
</template>
