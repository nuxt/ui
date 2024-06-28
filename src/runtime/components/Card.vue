<script lang="ts">
import { tv } from 'tailwind-variants'
import type { PrimitiveProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/card'

const appConfig = _appConfig as AppConfig & { ui: { card: Partial<typeof theme> } }

const card = tv({ extend: tv(theme), ...(appConfig.ui?.card || {}) })

export interface CardProps extends Omit<PrimitiveProps, 'asChild'> {
  class?: any
  ui?: Partial<typeof card.slots>
}

export interface CardSlots {
  header(props?: any): any
  default(props?: any): any
  footer(props?: any): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'radix-vue'

const props = withDefaults(defineProps<CardProps>(), { as: 'div' })
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
