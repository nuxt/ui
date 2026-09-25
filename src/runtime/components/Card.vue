<script lang="ts">
import type { VNode } from 'vue'
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
  title?: string
  description?: string
  /**
   * @defaultValue 'outline'
   */
  variant?: Card['variants']['variant']
  class?: any
  ui?: Card['slots']
}

export interface CardSlots {
  header?(props?: {}): VNode[]
  title?(props?: {}): VNode[]
  description?(props?: {}): VNode[]
  default?(props?: {}): VNode[]
  footer?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'
import { tv } from '../utils/tv'

const _props = defineProps<CardProps>()
const slots = defineSlots<CardSlots>()

const props = useComponentProps('card', _props, theme)

const appConfig = useAppConfig() as Card['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.card)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  variant: props.variant
}))
</script>

<template>
  <Primitive :as="props.as" data-slot="card" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.header || (props.title || !!slots.title) || (props.description || !!slots.description)" data-slot="card-header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header">
        <div v-if="props.title || !!slots.title" data-slot="card-title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ props.title }}
          </slot>
        </div>

        <div v-if="props.description || !!slots.description" data-slot="card-description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ props.description }}
          </slot>
        </div>
      </slot>
    </div>

    <div v-if="!!slots.default" data-slot="card-body" :class="ui.body({ class: props.ui?.body })">
      <slot />
    </div>

    <div v-if="!!slots.footer" data-slot="card-footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
