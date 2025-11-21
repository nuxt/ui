<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-section'
import type { ButtonProps, IconProps, PageFeatureProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageSection = ComponentConfig<typeof theme, AppConfig, 'pageSection'>

export interface PageSectionProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'section'
   */
  as?: any
  /**
   * The headline displayed above the title.
   */
  headline?: string
  /**
   * The icon displayed above the title.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  title?: string
  description?: string
  /**
   * Display a list of Button under the description.
   * `{ size: 'lg' }`{lang="ts-type"}
   */
  links?: ButtonProps[]
  /**
   * Display a list of PageFeature under the description.
   */
  features?: PageFeatureProps[]
  /**
   * The orientation of the section.
   * @defaultValue 'vertical'
   */
  orientation?: PageSection['variants']['orientation']
  /**
   * Reverse the order of the default slot.
   * @defaultValue false
   */
  reverse?: boolean
  class?: any
  ui?: PageSection['slots']
}

export interface PageSectionSlots {
  top(props?: {}): any
  header(props?: {}): any
  leading(props: { ui: PageSection['ui'] }): any
  headline(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  body(props?: {}): any
  features(props?: {}): any
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
import UPageFeature from './PageFeature.vue'
import UContainer from './Container.vue'
import UIcon from './Icon.vue'
import UButton from './Button.vue'

const props = withDefaults(defineProps<PageSectionProps>(), {
  as: 'section',
  orientation: 'vertical'
})
const slots = defineSlots<PageSectionSlots>()

const appConfig = useAppConfig() as PageSection['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageSection || {}) })({
  orientation: props.orientation,
  reverse: props.reverse,
  title: !!props.title || !!slots.title,
  description: !!props.description || !!slots.description,
  body: !!slots.body || (!!props.features?.length || !!slots.features)
}))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <UContainer data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.header || (icon || !!slots.leading) || (headline || !!slots.headline) || (title || !!slots.title) || (description || !!slots.description) || !!slots.body || (features?.length || !!slots.features) || !!slots.footer || (links?.length || !!slots.links)" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <div v-if="!!slots.header || (icon || !!slots.leading) || (headline || !!slots.headline) || (title || !!slots.title) || (description || !!slots.description)" data-slot="header" :class="ui.header({ class: props.ui?.header })">
          <slot name="header">
            <div v-if="icon || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
              <slot name="leading" :ui="ui">
                <UIcon v-if="icon" :name="icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
              </slot>
            </div>

            <div v-if="headline || !!slots.headline" data-slot="headline" :class="ui.headline({ class: props.ui?.headline, headline: !slots.headline })">
              <slot name="headline">
                {{ headline }}
              </slot>
            </div>

            <h2 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
              <slot name="title">
                {{ title }}
              </slot>
            </h2>

            <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
              <slot name="description">
                {{ description }}
              </slot>
            </div>
          </slot>
        </div>

        <div v-if="!!slots.body || (features?.length || !!slots.features)" data-slot="body" :class="ui.body({ class: props.ui?.body })">
          <slot name="body">
            <ul v-if="features?.length || !!slots.features" data-slot="features" :class="ui.features({ class: props.ui?.features })">
              <slot name="features">
                <UPageFeature
                  v-for="(feature, index) in features"
                  :key="index"
                  as="li"
                  v-bind="feature"
                />
              </slot>
            </ul>
          </slot>
        </div>

        <div v-if="!!slots.footer || (links?.length || !!slots.links)" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
          <slot name="footer">
            <div v-if="links?.length || !!slots.links" data-slot="links" :class="ui.links({ class: props.ui?.links })">
              <slot name="links">
                <UButton v-for="(link, index) in links" :key="index" size="lg" v-bind="link" />
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
