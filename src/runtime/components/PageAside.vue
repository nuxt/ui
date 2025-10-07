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
import { useAppConfig, useComponentUiTheme } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<PageAsideProps>(), {
  as: 'aside'
})
const slots = defineSlots<PageAsideSlots>()

const appConfig = useAppConfig() as PageAside['AppConfig']
const uiTheme = useComponentUiTheme('pageAside', () => ({ slots: props.ui }))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageAside || {}) })())
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [uiTheme?.slots?.root, props.class] })">
    <div :class="ui.container({ class: uiTheme?.slots?.container })">
      <div v-if="!!slots.top" :class="ui.top({ class: uiTheme?.slots?.top })">
        <div :class="ui.topHeader({ class: uiTheme?.slots?.topHeader })" />
        <div :class="ui.topBody({ class: uiTheme?.slots?.topBody })">
          <slot name="top" />
        </div>
        <div :class="ui.topFooter({ class: uiTheme?.slots?.topFooter })" />
      </div>

      <slot />

      <slot name="bottom" />
    </div>
  </Primitive>
</template>
