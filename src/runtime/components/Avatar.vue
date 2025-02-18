<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { AvatarFallbackProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/avatar'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import { tv } from '../utils/tv'

const appConfigAvatar = _appConfig as AppConfig & { ui: { avatar: Partial<typeof theme> } }

const avatar = tv({ extend: tv(theme), ...(appConfigAvatar.ui?.avatar || {}) })

type AvatarVariants = VariantProps<typeof avatar>

export interface AvatarProps extends Pick<AvatarFallbackProps, 'delayMs'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: any
  src?: string
  alt?: string
  icon?: string
  text?: string
  size?: AvatarVariants['size']
  class?: any
  ui?: Partial<typeof avatar.slots>
}

export interface AvatarSlots {
  default(props?: {}): any
}

extendDevtoolsMeta<AvatarProps>({ defaultProps: { src: 'https://avatars.githubusercontent.com/u/739984?v=4', alt: 'Benjamin Canac' } })
</script>

<script setup lang="ts">
import { ref, computed, useAttrs, onMounted } from 'vue'
import { AvatarRoot, AvatarFallback, useForwardProps } from 'reka-ui'
import { reactivePick, useImage } from '@vueuse/core'
import ImageComponent from '#build/ui-image-component'
import { useAvatarGroup } from '../composables/useAvatarGroup'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AvatarProps>(), { as: 'span' })
const attrs = useAttrs() as any

const fallbackProps = useForwardProps(reactivePick(props, 'delayMs'))

const fallback = computed(() => props.text || (props.alt || '').split(' ').map(word => word.charAt(0)).join('').substring(0, 2))

const imageLoaded = ref(false)

const { size } = useAvatarGroup(props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => avatar({
  size: size.value
}))

const sizePx = computed(() => ({
  '3xs': 16,
  '2xs': 20,
  'xs': 24,
  'sm': 28,
  'md': 32,
  'lg': 36,
  'xl': 40,
  '2xl': 44,
  '3xl': 48
})[props.size || 'md'])

// Reproduces Reka UI's [AvatarImage](https://reka-ui.com/docs/components/avatar#image) component behavior which cannot be used with NuxtImg component
onMounted(() => {
  if (!props.src || (ImageComponent as unknown as string) !== 'img') {
    return
  }

  const { then } = useImage({ ...props, ...attrs, src: props.src! })

  then((img) => {
    if (img.isReady.value) {
      imageLoaded.value = true
    }
  })
})
</script>

<template>
  <AvatarRoot :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <component
      :is="ImageComponent"
      v-if="src"
      v-show="imageLoaded"
      role="img"
      :src="src"
      :alt="alt"
      :width="sizePx"
      :height="sizePx"
      v-bind="attrs"
      :class="ui.image({ class: props.ui?.image })"
      @load="imageLoaded = true"
    />

    <AvatarFallback v-if="!imageLoaded" as-child v-bind="{ ...fallbackProps, ...$attrs }">
      <slot>
        <UIcon v-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
        <span v-else :class="ui.fallback({ class: props.ui?.fallback })">{{ fallback || '&nbsp;' }}</span>
      </slot>
    </AvatarFallback>
  </AvatarRoot>
</template>
