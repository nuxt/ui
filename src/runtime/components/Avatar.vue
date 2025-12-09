<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/avatar'
import type { ChipProps, IconProps } from '../types'
import type { ImgHTMLAttributes } from '../types/html'
import type { ComponentConfig } from '../types/tv'

type Avatar = ComponentConfig<typeof theme, AppConfig, 'avatar'>

export interface AvatarProps extends /** @vue-ignore */ Omit<ImgHTMLAttributes, 'src' | 'alt'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: any | { root?: any, img?: any }
  src?: string
  alt?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  text?: string
  /**
   * @defaultValue 'md'
   */
  size?: Avatar['variants']['size']
  chip?: boolean | ChipProps
  class?: any
  style?: any
  ui?: Avatar['slots']
}

export interface AvatarSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
import ImageComponent from '#build/ui-image-component'
import { useAvatarGroup } from '../composables/useAvatarGroup'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UChip from './Chip.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<AvatarProps>()

const as = computed(() => {
  if (typeof props.as === 'string' || typeof props.as?.render === 'function') {
    return { root: props.as }
  }

  return defu(props.as, { root: 'span' })
})

const fallback = computed(() => props.text || (props.alt || '').split(' ').map(word => word.charAt(0)).join('').substring(0, 2))

const appConfig = useAppConfig() as Avatar['AppConfig']
const { size } = useAvatarGroup(props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.avatar || {}) })({
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

const error = ref(false)

watch(() => props.src, () => {
  if (error.value) {
    error.value = false
  }
})

function onError() {
  error.value = true
}
</script>

<template>
  <component
    :is="props.chip ? UChip : Primitive"
    :as="as.root"
    v-bind="props.chip ? (typeof props.chip === 'object' ? { inset: true, ...props.chip } : { inset: true }) : {}"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="props.style"
  >
    <component
      :is="as.img || ImageComponent"
      v-if="src && !error"
      :src="src"
      :alt="alt"
      :width="sizePx"
      :height="sizePx"
      v-bind="$attrs"
      data-slot="image"
      :class="ui.image({ class: props.ui?.image })"
      @error="onError"
    />

    <Slot v-else v-bind="$attrs">
      <slot>
        <UIcon v-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
        <span v-else data-slot="fallback" :class="ui.fallback({ class: props.ui?.fallback })">{{ fallback || '&nbsp;' }}</span>
      </slot>
    </Slot>
  </component>
</template>
