<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AvatarFallbackProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import _appConfig from '#build/app.config'
import theme from '#build/ui/avatar'

const appConfig = _appConfig as AppConfig & { ui: { avatar: Partial<typeof theme> } }

const avatar = tv({ extend: tv(theme), ...(appConfig.ui?.avatar || {}) })

type AvatarVariants = VariantProps<typeof avatar>

export interface AvatarProps extends Pick<AvatarFallbackProps, 'delayMs'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'img'
   */
  as?: string | object
  src?: string
  alt?: string
  icon?: string
  text?: string
  size?: AvatarVariants['size']
  class?: any
  ui?: Partial<typeof avatar.slots>
}

extendDevtoolsMeta<AvatarProps>({ defaultProps: { src: 'https://avatars.githubusercontent.com/u/739984?v=4', alt: 'Benjamin Canac' } })
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { AvatarRoot, AvatarImage, AvatarFallback, useForwardProps } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useAvatarGroup } from '../composables/useAvatarGroup'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<AvatarProps>()

const fallbackProps = useForwardProps(reactivePick(props, 'delayMs'))

const fallback = computed(() => props.text || (props.alt || '').split(' ').map(word => word.charAt(0)).join('').substring(0, 2))

const { size } = useAvatarGroup(props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => avatar({
  size: size.value
}))
</script>

<template>
  <AvatarRoot :class="ui.root({ class: [props.class, props.ui?.root] })">
    <AvatarImage
      v-if="src"
      :as="as"
      :src="src"
      :alt="alt"
      v-bind="$attrs"
      :class="ui.image({ class: props.ui?.image })"
    />

    <AvatarFallback as-child v-bind="fallbackProps">
      <UIcon v-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
      <span v-else :class="ui.fallback({ class: props.ui?.fallback })">{{ fallback }}</span>
    </AvatarFallback>
  </AvatarRoot>
</template>
