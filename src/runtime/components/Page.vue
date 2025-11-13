<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page'
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
  left(props?: {}): any
  default(props?: {}): any
  right(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<PageProps>()
const slots = defineSlots<PageSlots>()

const appConfig = useAppConfig() as Page['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.page || {}) })({
  left: !!slots.left,
  right: !!slots.right
}))
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <Slot v-if="!!slots.left" data-slot="left" :class="ui.left({ class: props.ui?.left })">
      <slot name="left" />
    </Slot>

    <div data-slot="center" :class="ui.center({ class: props.ui?.center })">
      <slot />
    </div>

    <Slot v-if="!!slots.right" data-slot="right" :class="ui.right({ class: props.ui?.right })">
      <slot name="right" />
    </Slot>
  </Primitive>
</template>
