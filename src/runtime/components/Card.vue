<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/card'
import type { ComponentConfig } from '../types/tv'

type Card = ComponentConfig<typeof theme, AppConfig, 'card'>

export interface CardProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'outline'
   */
  variant?: Card['variants']['variant']
  class?: any
  ui?: Card['slots']
}

export interface CardSlots {
  header(props?: {}): any
  default(props?: {}): any
  footer(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig, useComponentUiTheme } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<CardProps>()
const slots = defineSlots<CardSlots>()

const appConfig = useAppConfig() as Card['AppConfig']
const uiTheme = useComponentUiTheme('card', () => ({ slots: props.ui }))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.card || {}) })({
  variant: props.variant
}))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [uiTheme?.slots?.root, props.class] })">
    <div v-if="!!slots.header" :class="ui.header({ class: uiTheme?.slots?.header })">
      <slot name="header" />
    </div>

    <div v-if="!!slots.default" :class="ui.body({ class: uiTheme?.slots?.body })">
      <slot />
    </div>

    <div v-if="!!slots.footer" :class="ui.footer({ class: uiTheme?.slots?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
