<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-feature'
import type { IconProps, LinkProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageFeature = ComponentConfig<typeof theme, AppConfig, 'pageFeature'>

export interface PageFeatureProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed next to the title when `orientation` is `horizontal` and above the title when `orientation` is `vertical`.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  title?: string
  description?: string
  /**
   * The orientation of the page feature.
   * @defaultValue 'horizontal'
   */
  orientation?: PageFeature['variants']['orientation']
  to?: LinkProps['to']
  target?: LinkProps['target']
  onClick?: (event: MouseEvent) => void | Promise<void>
  class?: any
  ui?: PageFeature['slots']
}

export interface PageFeatureSlots {
  leading(props: { ui: PageFeature['ui'] }): any
  title(props?: {}): any
  description(props?: {}): any
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { getSlotChildrenText } from '../utils'
import { tv } from '../utils/tv'
import ULink from './Link.vue'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PageFeatureProps>(), {
  orientation: 'horizontal'
})
const slots = defineSlots<PageFeatureSlots>()

const appConfig = useAppConfig() as PageFeature['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageFeature || {}) })({
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}))

const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title())
  return (slotText || props.title || 'Feature link').trim()
})
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" @click="onClick">
    <div v-if="icon || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="icon" :name="icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      </slot>
    </div>

    <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <ULink
        v-if="to"
        :aria-label="ariaLabel"
        v-bind="{ to, target, ...$attrs }"
        class="focus:outline-none peer"
        tabindex="-1"
        raw
      >
        <span class="absolute inset-0" aria-hidden="true" />
      </ULink>

      <slot>
        <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </slot>
    </div>
  </Primitive>
</template>
