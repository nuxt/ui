<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/kbd'
import type { KbdKey, KbdKeySpecific } from '../composables/useKbd'
import type { ComponentConfig } from '../types/tv'

type Kbd = ComponentConfig<typeof theme, AppConfig, 'kbd'>

export interface KbdProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'kbd'
   */
  as?: any
  value?: KbdKey | string
  /**
   * @defaultValue 'neutral'
   */
  color?: Kbd['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: Kbd['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Kbd['variants']['size']
  class?: any
  ui?: Kbd['slots']
}

export interface KbdSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useHead } from '#imports'
import { useKbd, kbdKeysPlatformMap } from '../composables/useKbd'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'
import { usePrefix } from '../composables/usePrefix'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<KbdProps>(), {
  as: 'kbd'
})
defineSlots<KbdSlots>()

const props = useComponentProps('kbd', _props, theme)

const { getKbdKey } = useKbd()
const overrides = useComponentOverrides((ui: Kbd['AppConfig']['ui']) => ui.kbd)
const prefix = usePrefix()

const platformKey = computed(() => props.value && Object.hasOwn(kbdKeysPlatformMap, props.value) ? kbdKeysPlatformMap[props.value as KbdKeySpecific] : undefined)

if (!import.meta.client && platformKey.value) {
  useHead({
    script: [{
      key: 'ui-kbd-macos',
      innerHTML: `/Macintosh;/.test(navigator.userAgent)&&document.documentElement.classList.add('ui-macos')`,
      tagPosition: 'head'
    }]
  })
}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  color: props.color,
  variant: props.variant,
  size: props.size
}))
</script>

<template>
  <Primitive :as="props.as" data-slot="kbd" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot>
      <template v-if="platformKey">
        <span :class="prefix('hidden in-[.ui-macos]:inline')">{{ platformKey.macos }}</span>
        <span :class="prefix('in-[.ui-macos]:hidden')">{{ platformKey.other }}</span>
      </template>
      <template v-else>
        {{ getKbdKey(props.value) }}
      </template>
    </slot>
  </Primitive>
</template>
