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
import { useAppConfig, useComponentUiTheme } from '#imports'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const props = defineProps<PageHeaderProps>()
const slots = defineSlots<PageHeaderSlots>()

const appConfig = useAppConfig() as PageHeader['AppConfig']
const uiTheme = useComponentUiTheme('pageHeader', () => ({ slots: props.ui }))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageHeader || {}) })({
  title: !!props.title || !!slots.title
}))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [uiTheme?.slots?.root, props.class] })">
    <div v-if="headline || !!slots.headline" :class="ui.headline({ class: uiTheme?.slots?.headline })">
      <slot name="headline">
        {{ headline }}
      </slot>
    </div>

    <div :class="ui.container({ class: uiTheme?.slots?.container })">
      <div :class="ui.wrapper({ class: uiTheme?.slots?.wrapper })">
        <h1 v-if="title || !!slots.title" :class="ui.title({ class: uiTheme?.slots?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h1>

        <div v-if="links?.length || !!slots.links" :class="ui.links({ class: uiTheme?.slots?.links })">
          <slot name="links">
            <UButton v-for="(link, index) in links" :key="index" color="neutral" variant="outline" v-bind="link" />
          </slot>
        </div>
      </div>

      <div v-if="description || !!slots.description" :class="ui.description({ class: uiTheme?.slots?.description })">
        <slot name="description">
          {{ description }}
        </slot>
      </div>

      <slot />
    </div>
  </Primitive>
</template>
