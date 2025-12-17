<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-header'
import type { ButtonProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageHeader = ComponentConfig<typeof theme, AppConfig, 'pageHeader'>

export interface PageHeaderProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  headline?: string
  title?: string
  description?: string
  /**
   * Display a list of Button next to the title.
   * `{ color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  links?: ButtonProps[]
  class?: any
  ui?: PageHeader['slots']
}

export interface PageHeaderSlots {
  headline(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  links(props?: {}): any
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const props = defineProps<PageHeaderProps>()
const slots = defineSlots<PageHeaderSlots>()

const appConfig = useAppConfig() as PageHeader['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageHeader || {}) })({
  title: !!props.title || !!slots.title
}))
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="headline || !!slots.headline" data-slot="headline" :class="ui.headline({ class: props.ui?.headline })">
      <slot name="headline">
        {{ headline }}
      </slot>
    </div>

    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <h1 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h1>

        <div v-if="links?.length || !!slots.links" data-slot="links" :class="ui.links({ class: props.ui?.links })">
          <slot name="links">
            <UButton v-for="(link, index) in links" :key="index" color="neutral" variant="outline" v-bind="link" />
          </slot>
        </div>
      </div>

      <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description">
          {{ description }}
        </slot>
      </div>

      <slot />
    </div>
  </Primitive>
</template>
