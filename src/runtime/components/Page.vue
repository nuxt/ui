<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/page'
import type { ComponentConfig } from '../types/tv'

type Page = ComponentConfig<typeof theme, AppConfig, 'page'>

export interface PageProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: Page['slots']
}

export interface PageSlots {
  left?(props?: {}): VNode[]
  default?(props?: {}): VNode[]
  right?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed, onBeforeUpdate, shallowRef } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { tv } from '../utils/tv'

const _props = defineProps<PageProps>()
const slots = defineSlots<PageSlots>()

const props = useComponentProps('page', _props, theme)

const appConfig = useThemeConfig() as Page['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.page)

const hasLeft = shallowRef(!!slots.left)
const hasRight = shallowRef(!!slots.right)

onBeforeUpdate(() => {
  hasLeft.value = !!slots.left
  hasRight.value = !!slots.right
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  left: hasLeft.value,
  right: hasRight.value
}))
</script>

<template>
  <Primitive :as="props.as" data-slot="page" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <Slot v-if="!!slots.left" data-slot="page-left" :class="ui.left({ class: props.ui?.left })">
      <slot name="left" />
    </Slot>

    <div data-slot="page-center" :class="ui.center({ class: props.ui?.center })">
      <slot />
    </div>

    <Slot v-if="!!slots.right" data-slot="page-right" :class="ui.right({ class: props.ui?.right })">
      <slot name="right" />
    </Slot>
  </Primitive>
</template>
