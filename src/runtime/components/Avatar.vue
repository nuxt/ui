<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AvatarFallbackProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/avatar'

const appConfig = _appConfig as AppConfig & { ui: { avatar: Partial<typeof theme> } }

const avatar = tv({ extend: tv(theme), ...(appConfig.ui?.avatar || {}) })

type AvatarVariants = VariantProps<typeof avatar>

export interface AvatarProps extends Pick<AvatarFallbackProps, 'delayMs'> {
  as?: string | object
  src?: string
  alt?: string
  icon?: string
  text?: string
  size?: AvatarVariants['size']
  class?: any
  ui?: Partial<typeof avatar.slots>
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { AvatarRoot, AvatarImage, AvatarFallback, useForwardProps } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UIcon } from '#components'
import { useAvatarGroup } from '#imports'

const props = defineProps<AvatarProps>()

const fallbackProps = useForwardProps(reactivePick(props, 'delayMs'))

const fallback = computed(() => props.text || (props.alt || '').split(' ').map(word => word.charAt(0)).join('').substring(0, 2))

const { size } = useAvatarGroup(props)

const ui = computed(() => tv({ extend: avatar, slots: props.ui })({ size: size.value }))
</script>

<template>
  <AvatarRoot :class="ui.root({ class: props.class })">
    <AvatarImage v-if="src" :as="as" :src="src" :alt="alt" :class="ui.image()" />

    <AvatarFallback as-child v-bind="fallbackProps">
      <UIcon v-if="icon" :name="icon" :class="ui.icon()" />
      <span v-else :class="ui.fallback()">{{ fallback }}</span>
    </AvatarFallback>
  </AvatarRoot>
</template>
