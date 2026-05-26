<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-card'
import type { IconProps, LinkProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageCard = ComponentConfig<typeof theme, AppConfig, 'pageCard'>

export interface PageCardProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed above the title.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  title?: string
  description?: string
  /**
   * The orientation of the page card.
   * @defaultValue 'vertical'
   */
  orientation?: PageCard['variants']['orientation']
  /**
   * Reverse the order of the default slot.
   * @defaultValue false
   */
  reverse?: boolean
  /**
   * Display a line around the page card.
   */
  highlight?: boolean
  /**
   * @defaultValue 'primary'
   */
  highlightColor?: PageCard['variants']['highlightColor']
  /**
   * Display a spotlight effect that follows your mouse cursor and highlights borders on hover.
   */
  spotlight?: boolean
  /**
   * @defaultValue 'primary'
   */
  spotlightColor?: PageCard['variants']['spotlightColor']
  /**
   * @defaultValue 'outline'
   */
  variant?: PageCard['variants']['variant']
  to?: LinkProps['to']
  target?: LinkProps['target']
  onClick?: (event: MouseEvent) => void | Promise<void>
  class?: any
  ui?: PageCard['slots']
}

export interface PageCardSlots {
  header?(props?: {}): VNode[]
  body?(props?: {}): VNode[]
  leading?(props: { ui: PageCard['ui'] }): VNode[]
  title?(props?: {}): VNode[]
  description?(props?: {}): VNode[]
  footer?(props?: {}): VNode[]
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { useMouseInElement, pausableFilter } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { usePrefix } from '../composables/usePrefix'
import { getSlotChildrenText } from '../utils'
import { tv } from '../utils/tv'
import ULink from './Link.vue'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<PageCardProps>(), {
  orientation: 'vertical'
})
const slots = defineSlots<PageCardSlots>()

const props = useComponentProps('pageCard', _props)

const cardRef = ref<HTMLElement>()
const motionControl = pausableFilter()

const appConfig = useAppConfig() as PageCard['AppConfig']
const { elementX, elementY } = useMouseInElement(cardRef, {
  eventFilter: motionControl.eventFilter
})
const prefix = usePrefix()

// eslint-disable-next-line vue/no-dupe-keys
const spotlight = computed(() => props.spotlight && (elementX.value !== 0 || elementY.value !== 0))

watch(() => props.spotlight, (value) => {
  if (value) {
    motionControl.resume()
  } else {
    motionControl.pause()
  }
}, { immediate: true })

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageCard || {}) })({
  orientation: props.orientation,
  reverse: props.reverse,
  variant: props.variant,
  to: !!props.to || !!props.onClick,
  title: !!props.title || !!slots.title,
  highlight: props.highlight,
  highlightColor: props.highlightColor,
  spotlight: spotlight.value,
  spotlightColor: props.spotlightColor
}))

const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title())
  return (slotText || props.title || 'Card link').trim()
})
</script>

<template>
  <Primitive
    ref="cardRef"
    :as="props.as"
    :data-orientation="props.orientation"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="spotlight && { '--spotlight-x': `${elementX}px`, '--spotlight-y': `${elementY}px` }"
    @click="props.onClick"
  >
    <div v-if="props.spotlight" data-slot="spotlight" :class="ui.spotlight({ class: props.ui?.spotlight })" />

    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.header || (props.icon || !!slots.leading) || !!slots.body || (props.title || !!slots.title) || (props.description || !!slots.description) || !!slots.footer" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <div v-if="!!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
          <slot name="header" />
        </div>

        <div v-if="props.icon || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading" :ui="ui">
            <UIcon v-if="props.icon" :name="props.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          </slot>
        </div>

        <div v-if="!!slots.body || (props.title || !!slots.title) || (props.description || !!slots.description)" data-slot="body" :class="ui.body({ class: props.ui?.body })">
          <slot name="body">
            <div v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
              <slot name="title">
                {{ props.title }}
              </slot>
            </div>

            <div v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
              <slot name="description">
                {{ props.description }}
              </slot>
            </div>
          </slot>
        </div>

        <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
          <slot name="footer" />
        </div>
      </div>

      <slot />
    </div>

    <ULink
      v-if="props.to"
      :aria-label="ariaLabel"
      v-bind="{ to: props.to, target: props.target, ...$attrs }"
      :class="prefix('focus:outline-none peer')"
      raw
    >
      <span :class="prefix('absolute inset-0')" aria-hidden="true" />
    </ULink>
  </Primitive>
</template>
