<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-aside'
import type { ComponentConfig } from '../types/tv'

type PageAside = ComponentConfig<typeof theme, AppConfig, 'pageAside'>

export interface PageAsideProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'aside'
   */
  as?: any
  class?: any
  ui?: PageAside['slots']
}

export interface PageAsideSlots {
  top(props?: {}): any
  default(props?: {}): any
  bottom(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<PageAsideProps>(), {
  as: 'aside'
})
const slots = defineSlots<PageAsideSlots>()

const appConfig = useAppConfig() as PageAside['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageAside || {}) })())
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.top" data-slot="top" :class="ui.top({ class: props.ui?.top })">
        <div data-slot="topHeader" :class="ui.topHeader({ class: props.ui?.topHeader })" />
        <div data-slot="topBody" :class="ui.topBody({ class: props.ui?.topBody })">
          <slot name="top" />
        </div>
        <div data-slot="topFooter" :class="ui.topFooter({ class: props.ui?.topFooter })" />
      </div>

      <slot />

      <slot name="bottom" />
    </div>
  </Primitive>
</template>
