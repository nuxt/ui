<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types/tv'
import theme from '#build/ui/footer'

type Footer = ComponentConfig<typeof theme, AppConfig, 'footer'>

export interface FooterProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'footer'
   */
  as?: any
  class?: any
  ui?: Footer['slots']
}

export interface FooterSlots {
  left(props?: {}): any
  default(props?: {}): any
  right(props?: {}): any
  top(props?: {}): any
  bottom(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UContainer from './Container.vue'

const props = withDefaults(defineProps<FooterProps>(), {
  as: 'footer'
})
const slots = defineSlots<FooterSlots>()

const appConfig = useAppConfig() as Footer['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.footer || {}) })())
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.top" data-slot="top" :class="ui.top({ class: props.ui?.top })">
      <slot name="top" />
    </div>

    <UContainer data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div data-slot="right" :class="ui.right({ class: props.ui?.right })">
        <slot name="right" />
      </div>

      <div data-slot="center" :class="ui.center({ class: props.ui?.center })">
        <slot />
      </div>

      <div data-slot="left" :class="ui.left({ class: props.ui?.left })">
        <slot name="left" />
      </div>
    </UContainer>

    <div v-if="!!slots.bottom" data-slot="bottom" :class="ui.bottom({ class: props.ui?.bottom })">
      <slot name="bottom" />
    </div>
  </Primitive>
</template>
