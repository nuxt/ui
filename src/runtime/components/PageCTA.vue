<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-cta'
import type { ButtonProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageCTA = ComponentConfig<typeof theme, AppConfig, 'pageCTA'>

export interface PageCTAProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  title?: string
  description?: string
  /**
   * The orientation of the page cta.
   * @defaultValue 'vertical'
   */
  orientation?: PageCTA['variants']['orientation']
  /**
   * Reverse the order of the default slot.
   * @defaultValue false
   */
  reverse?: boolean
  /**
   * @defaultValue 'outline'
   */
  variant?: PageCTA['variants']['variant']
  /**
   * Display a list of Button under the description.
   * `{ size: 'lg' }`{lang="ts-type"}
   */
  links?: ButtonProps[]
  ui?: PageCTA['slots']
}

export interface PageCTASlots {
  top?(props?: {}): VNode[]
  header?(props?: {}): VNode[]
  title?(props?: {}): VNode[]
  description?(props?: {}): VNode[]
  body?(props?: {}): VNode[]
  footer?(props?: {}): VNode[]
  links?(props?: {}): VNode[]
  default?(props?: {}): VNode[]
  bottom?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { usePrefix } from '../composables/usePrefix'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import UContainer from './Container.vue'

const _props = withDefaults(defineProps<PageCTAProps>(), {
  orientation: 'vertical',
  reverse: false
})
const slots = defineSlots<PageCTASlots>()

const props = useComponentProps('pageCTA', _props)

const appConfig = useAppConfig() as PageCTA['AppConfig']
const prefix = usePrefix()

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageCTA || {}) })({
  variant: props.variant,
  orientation: props.orientation,
  reverse: props.reverse,
  title: !!props.title || !!slots.title
}))
</script>

<template>
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <UContainer data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.header || (props.title || !!slots.title) || (props.description || !!slots.description) || !!slots.body || !!slots.footer || (props.links?.length || !!slots.links)" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <div v-if="!!slots.header || (props.title || !!slots.title) || (props.description || !!slots.description)" data-slot="header" :class="ui.header({ class: props.ui?.header })">
          <slot name="header">
            <h2 v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
              <slot name="title">
                {{ props.title }}
              </slot>
            </h2>

            <div v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
              <slot name="description">
                {{ props.description }}
              </slot>
            </div>
          </slot>
        </div>

        <div v-if="!!slots.body" data-slot="body" :class="ui.body({ class: props.ui?.body })">
          <slot name="body" />
        </div>

        <div v-if="!!slots.footer || (props.links?.length || !!slots.links)" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
          <slot name="footer">
            <div v-if="props.links?.length || !!slots.links" data-slot="links" :class="ui.links({ class: props.ui?.links })">
              <slot name="links">
                <UButton v-for="(link, index) in props.links" :key="index" size="lg" v-bind="link" />
              </slot>
            </div>
          </slot>
        </div>
      </div>

      <slot v-if="!!slots.default" />
      <div v-else-if="props.orientation === 'horizontal'" :class="prefix('hidden lg:block')" />
    </UContainer>

    <slot name="bottom" />
  </Primitive>
</template>
