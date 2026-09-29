<script lang="ts">
import type { VNode } from 'vue'
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
  top?(props?: {}): VNode[]
  default?(props?: {}): VNode[]
  bottom?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<PageAsideProps>(), {
  as: 'aside'
})
const slots = defineSlots<PageAsideSlots>()

const props = useComponentProps('pageAside', _props, theme)

const appConfig = useAppConfig() as PageAside['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.pageAside)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <Primitive :as="props.as" data-slot="page-aside" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="page-aside-container" :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.top" data-slot="page-aside-top" :class="ui.top({ class: props.ui?.top })">
        <div data-slot="page-aside-topHeader" :class="ui.topHeader({ class: props.ui?.topHeader })" />
        <div data-slot="page-aside-topBody" :class="ui.topBody({ class: props.ui?.topBody })">
          <slot name="top" />
        </div>
        <div data-slot="page-aside-topFooter" :class="ui.topFooter({ class: props.ui?.topFooter })" />
      </div>

      <slot />

      <slot name="bottom" />
    </div>
  </Primitive>
</template>
