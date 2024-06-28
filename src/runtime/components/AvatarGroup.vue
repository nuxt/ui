<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/avatar-group'

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
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { Primitive } from 'radix-vue'
import { UAvatar } from '#components'
import { avatarGroupInjectionKey } from '#imports'

const props = defineProps<AvatarGroupProps>()
const slots = defineSlots<AvatarGroupSlots>()

const ui = computed(() => tv({ extend: avatarGroup, slots: props.ui })({
  size: props.size
}))

const max = computed(() => typeof props.max === 'string' ? Number.parseInt(props.max, 10) : props.max)

const visibleAvatars = computed(() => {
  const children = slots.default?.()
  if (!children?.length) {
    return []
  }

  if (!max.value || max.value <= 0) {
    return children.reverse()
  }

  return children.slice(0, max.value).reverse()
})

const hiddenCount = computed(() => {
  const children = slots.default?.()
  if (!children?.length) {
    return 0
  }

  return children?.length - visibleAvatars.value.length
})

provide(avatarGroupInjectionKey, computed(() => ({
  size: props.size
})))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: props.class })">
    <UAvatar v-if="hiddenCount > 0" :text="`+${hiddenCount}`" :class="ui.base()" />
    <component :is="avatar" v-for="(avatar, count) in visibleAvatars" :key="count" :class="ui.base()" />
  </Primitive>
</template>
