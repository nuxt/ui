<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/card'

const appConfig = _appConfig as AppConfig & { ui: { card: Partial<typeof theme> } }

const card = tv({ extend: tv(theme), ...(appConfig.ui?.card || {}) })

export interface CardProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: Partial<typeof card.slots>
}

export interface CardSlots {
  header(props?: {}): any
  default(props?: {}): any
  footer(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'radix-vue'

const props = defineProps<CardProps>()
const slots = defineSlots<CardSlots>()

const ui = computed(() => tv({ extend: card, slots: props.ui })())
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: props.class })">
    <div v-if="!!slots.header" :class="ui.header()">
      <slot name="header" />
    </div>

    <div v-if="!!slots.default" :class="ui.body()">
      <slot />
    </div>

    <div v-if="!!slots.footer" :class="ui.footer()">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
