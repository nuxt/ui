<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-hero'
import type { ButtonProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageHero = ComponentConfig<typeof theme, AppConfig, 'pageHero'>

export interface PageHeroProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  headline?: string
  title?: string
  description?: string
  /**
   * Display a list of Button under the description.
   * `{ size: 'xl' }`{lang="ts-type"}
   */
  links?: ButtonProps[]
  /**
   * The orientation of the page hero.
   * @defaultValue 'vertical'
   */
  orientation?: PageHero['variants']['orientation']
  /**
   * Reverse the order of the default slot.
   * @defaultValue false
   */
  reverse?: boolean
  class?: any
  ui?: PageHero['slots']
}

export interface PageHeroSlots {
  top(props?: {}): any
  header(props?: {}): any
  headline(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  body(props?: {}): any
  footer(props?: {}): any
  links(props?: {}): any
  default(props?: {}): any
  bottom(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import UContainer from './Container.vue'

const props = withDefaults(defineProps<PageHeroProps>(), {
  orientation: 'vertical'
})
const slots = defineSlots<PageHeroSlots>()

const appConfig = useAppConfig() as PageHero['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageHero || {}) })({
  orientation: props.orientation,
  reverse: props.reverse,
  title: !!props.title || !!slots.title
}))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <UContainer data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.header || (headline || !!slots.headline) || (title || !!slots.title) || (description || !!slots.description) || !!slots.body || !!slots.footer || (links?.length || !!slots.links)" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <div v-if="!!slots.header || (headline || !!slots.headline) || (title || !!slots.title) || (description || !!slots.description)" data-slot="header" :class="ui.header({ class: props.ui?.header })">
          <slot name="header">
            <div v-if="headline || !!slots.headline" data-slot="headline" :class="ui.headline({ class: props.ui?.headline, headline: !slots.headline })">
              <slot name="headline">
                {{ headline }}
              </slot>
            </div>

            <h1 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
              <slot name="title">
                {{ title }}
              </slot>
            </h1>

            <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
              <slot name="description">
                {{ description }}
              </slot>
            </div>
          </slot>
        </div>

        <div v-if="!!slots.body" data-slot="body" :class="ui.body({ class: props.ui?.body })">
          <slot name="body" />
        </div>

        <div v-if="!!slots.footer || (links?.length || !!slots.links)" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
          <slot name="footer">
            <div v-if="links?.length || !!slots.links" data-slot="links" :class="ui.links({ class: props.ui?.links })">
              <slot name="links">
                <UButton v-for="(link, index) in links" :key="index" size="xl" v-bind="link" />
              </slot>
            </div>
          </slot>
        </div>
      </div>

      <slot v-if="!!slots.default" />
      <div v-else-if="orientation === 'horizontal'" class="hidden lg:block" />
    </UContainer>

    <slot name="bottom" />
  </Primitive>
</template>
